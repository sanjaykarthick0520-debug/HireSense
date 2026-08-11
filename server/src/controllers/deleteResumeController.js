import { del } from "@vercel/blob";
import prisma from "../config/prisma.js";

export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;

    // ---------------------------------------
    // 1. Find resume
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

    // ---------------------------------------
    // 2. Delete associated analyses
    // ---------------------------------------

    await prisma.analysis.deleteMany({
      where: {
        resumeId: resume.id,
      },
    });

    // ---------------------------------------
    // 3. Delete PDF from Vercel Blob
    // ---------------------------------------

    if (resume.fileUrl) {
      try {
        await del(resume.fileUrl);

        console.log(
          "Resume PDF deleted from Vercel Blob."
        );
      } catch (blobError) {
        console.error(
          "Could not delete resume from Vercel Blob:",
          blobError
        );
      }
    }

    // ---------------------------------------
    // 4. Delete database record
    // ---------------------------------------

    await prisma.resume.delete({
      where: {
        id: resume.id,
      },
    });

    // ---------------------------------------
    // 5. Return success
    // ---------------------------------------

    return res.json({
      success: true,
      message: "Resume deleted successfully.",
    });

  } catch (error) {
    console.error(
      "Delete resume error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete resume.",
    });
  }
};