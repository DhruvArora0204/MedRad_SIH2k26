import express from "express";
import { GoogleGenAI } from "@google/genai";
import { configDotenv } from "dotenv";
import { upload } from "../../middlewares/multer.middleware.js";
// import { inngest } from "../inngestPipeline/inngest.config.js";
configDotenv();

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const validateEcoCertController = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "ECOCERT PDF is required." });
    }

    const base64Pdf = req.file.buffer.toString("base64");

    const contents = [
      {
        text: `
You are an expert in sustainability certifications. Review this certificate and determine:

1. Is it issued by ECOCERT?
2. What certification does it represent? (e.g., COSMOS Organic, ECOCERT Fair Trade, Textile Organic)
3. Extract:
   - License number
   - Valid from & to dates
   - Certified entity name
   - Issuing body (should mention ECOCERT)
4. Check if official seal/signature or QR is present.
5. Detect any tampering or missing info.

Respond in structured JSON:
{
  cert_type: string,
  license_no: string,
  issued_to: string,
  valid_from: string,
  valid_to: string,
  issuing_body: string,
  seal_or_signature_found: boolean,
  qr_code_present: boolean,
  issues_found: string[],
  verdict: "Valid" | "Possibly Fake" | "Incomplete"
}
        `,
      },
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64Pdf,
        },
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
    });

    res.json({ result: response.text });
  } catch (err) {
    console.error("EcoCert Validation Error:", err);
    res.status(500).json({ error: "Failed to validate ECOCERT PDF." });
  }
};

router.post(
  "/validateEcoCertificate",
  upload.single("pdf"),
  validateEcoCertController
);

router.post(
  "/validateSourcingCertificate",
  upload.single("pdf"),
  async (req, res) => {
    try {
      if (!req.file || !req.file.buffer) {
        return res
          .status(400)
          .json({ error: "Supplier sourcing document is required." });
      }

      const base64Pdf = req.file.buffer.toString("base64");

      const contents = [
        {
          text: `
You are an AI sourcing auditor. Analyze this supplier document for ethical sourcing transparency.

Extract the following:
- Supplier name and address
- Country of origin of raw material
- Source type (e.g., plant-based, chemical, mineral)
- Any sustainability mentions (organic, fair trade, chemical-free, biodegradable)
- Does it mention audits like GOTS, ECOCERT, SEDEX, BSCI?
- Are there signs of forgery or missing data?

Respond in JSON:
{
  supplier_name: string,
  country_of_origin: string,
  source_type: string,
  sustainability_keywords_found: string[],
  audit_mentions: string[],
  issues_found: string[],
  transparency_score: number, // 0 to 1
  verdict: "Transparent" | "Needs Clarification" | "Incomplete" | "Possibly Fake"
}
        `,
        },
        {
          inlineData: {
            mimeType: "application/pdf",
            data: base64Pdf,
          },
        },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents,
      });

      res.json({ result: response.text });
    } catch (err) {
      console.error("Sourcing Transparency Validation Error:", err);
      res
        .status(500)
        .json({ error: "Failed to validate sourcing transparency document." });
    }
  }
);

// Multer will already populate req.file
router.post(
  "/validateLaborCertificate",
  upload.single("pdf"),
  async (req, res) => {
    try {
      if (!req.file || !req.file.buffer) {
        return res
          .status(400)
          .json({ error: "Missing 'pdf' file in form-data." });
      }

      const base64Pdf = req.file.buffer.toString("base64");

      const contents = [
        {
          text: `
You are an expert in labor compliance for Indian pharmaceutical manufacturers. Review the uploaded PDF certificate and check for the following:

1. Certificate Type (e.g., Factory License, EPF Registration)
2. License or Registration Number
3. Organization/Factory Name
4. Valid From and Valid To dates
5. Issuing Authority (e.g., Labour Dept, EPFO, ESIC)
6. Official Seals, Signatures, QR Codes
7. Any inconsistencies or missing information

Respond in structured JSON format:
{
  certificate_type: string,
  license_number: string,
  organization_name: string,
  validity: { from: string, to: string },
  issuing_authority: string,
  seals_or_signatures_found: boolean,
  qr_code_mentioned: boolean,
  issues_found: string[],
  validity_score: number,
  verdict: "Valid" | "Likely Fake" | "Incomplete"
}
Analyze the following document:
        `,
        },
        {
          inlineData: {
            mimeType: "application/pdf",
            data: base64Pdf,
          },
        },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents,
      });

      res.json({ result: response.text });
    } catch (err) {
      console.error("Error:", err);
      res
        .status(500)
        .json({ error: "Something went wrong during validation." });
    }
  }
);



export default router;
