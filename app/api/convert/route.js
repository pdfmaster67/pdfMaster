import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import puppeteer from 'puppeteer';

export async function POST(req) {
  try {
    // 1. Receive File
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file) return NextResponse.json({ error: "No file uploaded." }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Read Excel
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];

    // --- KEY FIX: Use 'raw: false' to keep Excel Formatting ---
    // This ensures "0.42%" stays "0.42%" and Dates look like "16-Sep-25"
    let rawRows = XLSX.utils.sheet_to_json(sheet, { 
      header: 1, 
      raw: false, 
      defval: "" // Fill empty cells with empty string
    });

    // --- STEP 1: REMOVE COMPLETELY EMPTY ROWS ---
    let activeRows = rawRows.filter(row => {
      if (!row || row.length === 0) return false;
      return row.some(cell => cell !== null && cell !== "");
    });

    if (activeRows.length === 0) {
      return NextResponse.json({ error: "Sheet is empty" }, { status: 400 });
    }

    // --- STEP 2: DETECT MAX COLUMNS ---
    let maxCols = 0;
    activeRows.forEach(row => {
      if (row.length > maxCols) maxCols = row.length;
    });

    // --- CONFIGURATION ---
    const ROWS_PER_PAGE = 20; 
    let htmlPages = "";

    // --- STEP 3: GENERATE HTML PAGES ---
    for (let i = 0; i < activeRows.length; i += ROWS_PER_PAGE) {
      const pageRows = activeRows.slice(i, i + ROWS_PER_PAGE);
      
      let pageContent = `<div class="page">`;
      let isInTable = false; 

      pageRows.forEach((row, rowIndex) => {
        // Normalize row
        const normalizedRow = [];
        for (let k = 0; k < maxCols; k++) {
            normalizedRow.push(row[k] !== undefined ? row[k] : "");
        }

        // --- SMART DETECTION ---
        const filledCells = normalizedRow.filter(c => c !== "");
        const firstCellData = String(normalizedRow[0]).trim();
        
        // It is a "Paragraph/Interpretation" if:
        // 1. Only ONE cell has data
        // 2. That data is long (> 25 chars)
        const isParagraph = filledCells.length === 1 && firstCellData.length > 25;

        // Special handling for the very first row (Header)
        const isHeader = (i === 0 && rowIndex === 0);

        if (isParagraph) {
          if (isInTable) {
            pageContent += `</tbody></table>`;
            isInTable = false;
          }
          pageContent += `<div class="interpretation-text">${firstCellData}</div>`;
        } else {
          if (!isInTable) {
            pageContent += `<table class="custom-table"><tbody>`;
            isInTable = true;
          }
          
          pageContent += `<tr>`;
          normalizedRow.forEach(cellData => {
             // Check if data looks like a number for right-alignment
             // (Simple check: contains digits, maybe %, maybe E for scientific)
             const isNumber = /^[0-9.,%E-]+$/.test(String(cellData).trim());
             const alignClass = isNumber ? "text-right" : "text-left";
             const headerClass = isHeader ? "header-cell" : "";
             
             pageContent += `<td class="${alignClass} ${headerClass}">${cellData}</td>`;
          });
          pageContent += `</tr>`;
        }
      });

      if (isInTable) {
        pageContent += `</tbody></table>`;
      }

      pageContent += `</div>`; // End Page
      
      // Add Page Break
      if (i + ROWS_PER_PAGE < activeRows.length) {
         pageContent += `<div class="page-break"></div>`;
      }
      
      htmlPages += pageContent;
    }

    // --- STEP 4: STYLING (MATCHING YOUR SAMPLE PDF) ---
    const finalHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          @page { size: A4 landscape; margin: 10mm; } 
          body { 
            font-family: 'Calibri', 'Arial', sans-serif; 
            -webkit-print-color-adjust: exact;
            font-size: 11px;
            color: #000;
          }
          
          /* Page Break */
          .page-break { page-break-after: always; height: 0; display: block; clear: both; }

          /* Table Styles */
          .custom-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 15px; 
            table-layout: auto;
            border: 1px solid #000; /* Outer border */
          }
          
          .custom-table td { 
            border: 1px solid #bfbfbf; /* Grid lines like Excel */
            padding: 4px 6px; 
            overflow: hidden; 
            white-space: nowrap; /* Prevent wrapping for clean numbers */
          }

          /* Header Styling */
          .header-cell {
            font-weight: bold;
            background-color: #f0f0f0; /* Light grey header background */
            text-align: center !important;
            border-bottom: 2px solid #000;
          }

          /* Alignment Classes */
          .text-right { text-align: right; }
          .text-left { text-align: left; }
          
          /* Paragraph / Interpretation Styles */
          .interpretation-text { 
            font-size: 12px;
            line-height: 1.4;
            background-color: #ffffff; 
            padding: 10px 0; 
            margin: 10px 0; 
            text-align: justify;
            white-space: pre-wrap;
            font-style: italic;
          }
        </style>
      </head>
      <body>
        ${htmlPages}
      </body>
      </html>
    `;

    // --- STEP 5: PDF GENERATION ---
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(finalHtml, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({ 
        format: 'A4', 
        landscape: true, 
        printBackground: true 
    });
    
    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="formatted_report.pdf"`,
      },
    });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Processing failed", details: error.message }, { status: 500 });
  }
}