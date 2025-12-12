import { NextResponse } from 'next/server';
import mammoth from 'mammoth'; // Converts .docx to HTML
import puppeteer from 'puppeteer';

export async function POST(req) {
  try {
    // 1. Receive the file
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Convert Word (Buffer) -> HTML
    // Mammoth extracts raw text and basic formatting
    const { value: rawHtml, messages } = await mammoth.convertToHtml({ buffer: buffer });

    // Check for warnings (optional logging)
    if (messages.length > 0) {
      console.log("Word Conversion Warnings:", messages);
    }

    // 3. Create a Document Template
    // We wrap the raw HTML in a structured page with CSS to look like a real document
    const finalHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          /* Page Setup (A4) */
          @page { size: A4; margin: 25mm 20mm; }
          
          body {
            font-family: 'Times New Roman', serif; /* Standard Word Font */
            font-size: 12pt;
            line-height: 1.5;
            color: #000;
            background: #fff;
            max-width: 800px;
            margin: 0 auto;
          }

          /* Styling Word Elements */
          p { margin-bottom: 1em; text-align: justify; }
          h1, h2, h3, h4 { color: #2d3748; margin-top: 1.5em; margin-bottom: 0.5em; font-family: 'Arial', sans-serif; }
          h1 { font-size: 24pt; border-bottom: 2px solid #eee; padding-bottom: 10px; }
          h2 { font-size: 18pt; }
          
          /* Table Styling (if Word had tables) */
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f8f9fa; font-weight: bold; }

          /* Image handling */
          img { max-width: 100%; height: auto; display: block; margin: 10px auto; }
        </style>
      </head>
      <body>
        ${rawHtml}
      </body>
      </html>
    `;

    // 4. Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Load content
    await page.setContent(finalHtml, { 
      waitUntil: 'networkidle0' // Wait for any images to load
    });

    // Print to PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '25mm', bottom: '25mm', left: '20mm', right: '20mm' }
    });

    await browser.close();

    // 5. Return the PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="converted.pdf"`,
      },
    });

  } catch (error) {
    console.error("Word Conversion Error:", error);
    return NextResponse.json(
      { error: "Conversion failed", details: error.message },
      { status: 500 }
    );
  }
}