```js
import { put } from "@vercel/blob";
import { DOMMatrix, Path2D, ImageData } from "@napi-rs/canvas";
import { createRequire } from "module";

import prisma from "../config/prisma.js";
import { analyzeResume } from "../services/geminiService.js";

// =========================================================
// PDF.JS NODE COMPATIBILITY
// =========================================================

// Make browser-like APIs available before loading pdfjs-dist
globalThis.DOMMatrix = DOMMatrix;
globalThis.Path2D = Path2D;
globalThis.ImageData = ImageData;

// =========================================================
// LOAD PDF.JS
// =========================================================

const pdfjsLib = await import(
  "pdfjs-dist/legacy/build/pdf.mjs"
);

// =========================================================
// CONFIGURE PDF.JS WORKER
// =========================================================

// Resolve the worker directly from node_modules.
// This prevents PDF.js from guessing the worker location
// and failing on Vercel serverless deployments.

const require = createRequire(import.meta.url);

const pdfWorkerPath = require.resolve(
  "pdfjs-dist/legacy/build/pdf.worker.mjs"
);

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerPath;

// =========================================================
// EXTRACT TEXT FROM PDF BUFFER
// =========================================================

async function extractPdfText(buffer) {
  try {
    const data = new Uint8Array(buffer);

    const loadingTask = pdfjsLib.getDocument({
      data,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    });

    const pdfDocument = await loadingTask.promise;

    let text = "";

    for (
      let pageNumber = 1;
      pageNumber <= pdfDocument.numPages;
      pageNumber++
    ) {
      const page = await pdfDocument.getPage(pageNumber);

      const content = await page.getTextContent();

      const pageText = content.items
        .map((item) => item.str || "")
        .join(" ");

      text += pageText + "\n";
    }

    return text.trim();
  } catch (error) {
    console.error("PDF TEXT EXTRACTION ERROR:", error);

    throw new Error(
      `PDF text extraction failed: ${
        error.message || "Unknown PDF error"
      }`
    );
  }
}

// =========================================================
// UPLOAD + ANALYZE RESUME
// =========================================================

export const uploadResume = async (req, res) => {
  let createdResume = null;

  try {
    // =====================================================
    // 1. VALIDATE FILE
    // =====================================================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume.",
      });
    }

    // =====================================================
    // 2. VALIDATE TARGET ROLE
    // =====================================================

    const targetRole = req.body.targetRole?.trim();

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter the job role you are targeting.",
      });
    }

    console.log(
      `Target role: ${targetRole}`
    );

    console.log(
      `Processing resume: ${req.file.originalname}`
    );

    // =====================================================
    // 3. EXTRACT PDF TEXT
    // =====================================================

    const resumeText = await extractPdfText(
      req.file.buffer
    );

    if (!resumeText) {
      throw new Error(
        "Could not extract text from the PDF."
      );
    }

    console.log(
      `PDF text extracted successfully. Characters: ${resumeText.length}`
    );

    // =====================================================
    // 4. UPLOAD PDF TO VERCEL BLOB
    // =====================================================

    const safeFileName =
      req.file.originalname.replace(
        /[^a-zA-Z0-9.-]/g,
        "_"
      );

    const blobPath =
      `resumes/${Date.now()}-${safeFileName}`;

    const blob = await put(
      blobPath,
      req.file.buffer,
      {
        access: "private",
        contentType: "application/pdf",
      }
    );

    console.log(
      "Resume uploaded to Vercel Blob successfully."
    );

    // =====================================================
    // 5. CREATE RESUME DATABASE RECORD
    // =====================================================

    createdResume =
      await prisma.resume.create({
        data: {
          title: req.file.originalname,

          originalName:
            req.file.originalname,

          fileUrl: blob.url,

          targetRole,

          aiStatus: "Analyzing",
        },
      });

    console.log(
      `Resume database record created: ${createdResume.id}`
    );

    // =====================================================
    // 6. GEMINI AI ANALYSIS
    // =====================================================

    const aiResult = await analyzeResume(
      resumeText,
      targetRole
    );

    console.log(
      "Gemini analysis completed successfully."
    );

    // =====================================================
    // 7. SAVE AI ANALYSIS
    // =====================================================

    const analysis =
      await prisma.analysis.create({
        data: {
          targetRole:
            aiResult.targetRole ||
            targetRole,

          overallScore:
            aiResult.overallScore,

          jobMatch:
            aiResult.jobMatch,

          keywordMatch:
            aiResult.keywordMatch,

          technicalSkills:
            aiResult.technicalSkills,

          experienceRelevance:
            aiResult.experienceRelevance,

          projectRelevance:
            aiResult.projectRelevance,

          resumeStructure:
            aiResult.resumeStructure,

          strengths:
            aiResult.strengths,

          weaknesses:
            aiResult.weaknesses,

          missingKeywords:
            aiResult.missingKeywords,

          suggestions:
            aiResult.suggestions,

          resumeId:
            createdResume.id,
        },
      });

    console.log(
      "AI analysis saved to database."
    );

    // =====================================================
    // 8. UPDATE RESUME
    // =====================================================

    const updatedResume =
      await prisma.resume.update({
        where: {
          id: createdResume.id,
        },

        data: {
          targetRole:
            aiResult.targetRole ||
            targetRole,

          atsScore:
            aiResult.overallScore,

          aiStatus: "Analyzed",
        },
      });

    console.log(
      `Resume analyzed successfully. ATS Score: ${aiResult.overallScore}`
    );

    // =====================================================
    // 9. SUCCESS RESPONSE
    // =====================================================

    return res.status(201).json({
      success: true,

      message:
        "Resume analyzed successfully.",

      resume: updatedResume,

      analysis,
    });

  } catch (error) {
    // =====================================================
    // ERROR LOG
    // =====================================================

    console.error(
      "========================================"
    );

    console.error(
      "RESUME ANALYSIS ERROR"
    );

    console.error(
      error
    );

    console.error(
      "========================================"
    );

    // =====================================================
    // 10. CLEANUP DATABASE RECORD
    // =====================================================

    if (createdResume) {
      try {
        await prisma.resume.delete({
          where: {
            id: createdResume.id,
          },
        });

        console.log(
          "Incomplete resume record cleaned up."
        );

      } catch (cleanupError) {
        console.error(
          "Failed to clean up incomplete resume:",
          cleanupError
        );
      }
    }

    // =====================================================
    // 11. ERROR RESPONSE
    // =====================================================

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Resume analysis failed.",
    });
  }
};
```
