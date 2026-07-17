const fs = require('fs');
const pdfParseModule = require('pdf-parse');

const extractTextFromPDF = async (filePath) => {
  try {
    console.log('📄 Extracting text from PDF:', filePath);

    if (!fs.existsSync(filePath)) {
      throw new Error('PDF file not found');
    }

    const dataBuffer = fs.readFileSync(filePath);
    console.log('📊 File size:', dataBuffer.length, 'bytes');

    let text = '';

    if (typeof pdfParseModule === 'function') {
      // pdf-parse v1.x style: module itself is a callable function
      const data = await pdfParseModule(dataBuffer);
      text = data.text || '';
    } else if (pdfParseModule && typeof pdfParseModule.PDFParse === 'function') {
      // pdf-parse v2.x style: class-based API
      const parser = new pdfParseModule.PDFParse({ data: dataBuffer });
      try {
        const result = await parser.getText();
        text = result.text || '';
      } finally {
        await parser.destroy();
      }
    } else {
      throw new Error('Unrecognized pdf-parse module shape — check installed version');
    }

    console.log('✅ pdf-parse extracted text length:', text.length);

    if (text && text.trim().length > 50) {
      return text;
    }

    throw new Error('Could not extract readable text from PDF');
  } catch (error) {
    console.error('❌ PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF: ' + error.message);
  }
};

module.exports = { extractTextFromPDF };