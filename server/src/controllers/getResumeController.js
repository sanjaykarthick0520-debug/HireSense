import { presignUrl } from "@vercel/blob";
import prisma from "../config/prisma.js";

// =========================================================
// GET ALL RESUMES
// =========================================================

export const getResumes = async (req, res) => {
  try {
    const resumes = await prisma.resume.findMany({
      orderBy: {
        uploadedAt: "desc",
      },
      include: {
        analyses: true,
      },
    });

    res.json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    console.error(
      "Failed to fetch resumes:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch resumes",
    });
  }
};

// =========================================================
// GET PRIVATE RESUME FILE
// =========================================================

export const getResumeFile = async (req, res) => {
  try {
    const { id } = req.params;

    // ---------------------------------------
    // Find resume
    // ---------------------------------------

    const resume = await prisma.resume.findUnique({
      where: {
        id,
      },
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    if (!resume.fileUrl) {
      return res.status(404).json({
        success: false,
        message: "Resume file is not available.",
      });
    }

    // ---------------------------------------
    // Extract Blob pathname from stored URL
    // ---------------------------------------

    const blobUrl = new URL(resume.fileUrl);

    const pathname =
      blobUrl.pathname.replace(/^\/+/, "");

    // ---------------------------------------
    // Generate temporary signed GET URL
    // ---------------------------------------

    const { presignedUrl } =
      await presignUrl({
        pathname,
        operation: "get",
        validUntil:
          Date.now() + 5 * 60 * 1000,
      });

    // ---------------------------------------
    // Return signed URL
    // ---------------------------------------

    return res.json({
      success: true,
      url: presignedUrl,
    });

  } catch (error) {
    console.error(
      "Failed to generate resume file URL:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to generate resume file URL.",
    });
  }
};