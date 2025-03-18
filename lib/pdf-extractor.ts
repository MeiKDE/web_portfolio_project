import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

/**
 * Extracts text content from a PDF buffer
 * @param pdfBuffer The PDF file as a Buffer
 * @returns A promise that resolves to the extracted text
 */
export async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  try {
    console.log("Creating PDF loader");
    // Create a blob from the buffer for the PDFLoader
    const blob = new Blob([pdfBuffer]);
    const loader = new PDFLoader(blob);

    console.log("Loading PDF documents");
    const documents = await loader.load();
    console.log(`PDF loaded with ${documents.length} pages/documents`);

    // Combine all document page contents
    const fullText = documents.map((doc) => doc.pageContent).join("\n");

    console.log("Text extraction complete");
    return fullText;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
}
