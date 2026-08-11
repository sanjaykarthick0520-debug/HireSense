import { put } from "@vercel/blob";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

import prisma from "../config/prisma.js";
import { analyzeResume } from "../services/geminiService.js";

// =========================================================
// EXTRACT TEXT FROM PDF BUFFER
// =========================================================

async function extractPdfText(buffer) {
  const data = new Uint8Array(buffer);

  const loadingTask = pdfjsLib.getDocument({
    data,
    useWorkerFetch: false,
    isEvalSupported: false,
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
      .map((item) => item.str)
      .join(" ");

    text += pageText + "\n";
  }

  return text.trim();
}

// =========================================================
// UPLOAD + ANALYZE RESUME
// =========================================================

export const uploadResume = async (req, res) => {
  let createdResume = null;

  try {
    // ---------------------------------------
    // 1. Validate uploaded PDF
    // ---------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume.",
      });
    }

    // ---------------------------------------
    // 2. Get target job role
    // ---------------------------------------

    const targetRole = req.body.targetRole?.trim();

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter the job role you are targeting.",
      });
    }

    console.log(`Target role: ${targetRole}`);

    // ---------------------------------------
    // 3. Extract text from PDF
    // ---------------------------------------

    const resumeText = await extractPdfText(
      req.file.buffer
    );

    if (!resumeText) {
      throw new Error(
        "Could not extract text from the PDF."
      );
    }

    console.log(
      "PDF text extracted successfully."
    );

    // ---------------------------------------
    // 4. Upload PDF to Vercel Blob
    // ---------------------------------------

    const safeFileName = req.file.originalname
      .replace(/[^a-zA-Z0-9.-]/g, "_");

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

    // ---------------------------------------
    // 5. Save resume in database
    // ---------------------------------------

    createdResume = await prisma.resume.create({
      data: {
        title: req.file.originalname,
        originalName: req.file.originalname,
        fileUrl: blob.url,
        targetRole: targetRole,
        aiStatus: "Analyzing",
      },
    });

    // ---------------------------------------
    // 6. Send resume + target role to Gemini
    // ---------------------------------------

    const aiResult = await analyzeResume(
      resumeText,
      targetRole
    );

    console.log(
      "Gemini analysis completed."
    );

    // ---------------------------------------
    // 7. Save complete AI analysis
    // ---------------------------------------

    const analysis = await prisma.analysis.create({
      data: {
        targetRole:
          aiResult.targetRole || targetRole,

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

    // ---------------------------------------
    // 8. Update resume with final AI status
    // ---------------------------------------

    const updatedResume =
      await prisma.resume.update({
        where: {
          id: createdResume.id,
        },

        data: {
          targetRole:
            aiResult.targetRole || targetRole,

          atsScore:
            aiResult.overallScore,

          aiStatus:
            "Analyzed",
        },
      });

    console.log(
      `Resume analyzed successfully. ATS Score: ${aiResult.overallScore}`
    );

    // ---------------------------------------
    // 9. Return result
    // ---------------------------------------

    return res.status(201).json({
      success: true,

      message:
        "Resume analyzed successfully.",

      resume:
        updatedResume,

      analysis,
    });

  } catch (error) {
    console.error(
      "Resume analysis error:",
      error
    );

    // ---------------------------------------
    // 10. Cleanup incomplete database record
    // ---------------------------------------

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

    // ---------------------------------------
    // 11. Return error
    // ---------------------------------------

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Resume analysis failed.",
    });
  }
};