const { PDFDocument, rgb ,StandardFonts} = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const generateCertificate = async (donatorName, schoolName, certificateID) => {
    const templatePath = path.join(__dirname, '../certificate_english.pdf');
    const existingPdfBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Add Donator's name and School name to the PDF
    firstPage.drawText(donatorName, {
        x: 440,
        y: 345,
        size: 15,
        color: rgb(0, 0, 0),
        font: boldFont
    });

    firstPage.drawText(schoolName, {
        x: 100,
        y: 258,
        size: 15,
        color: rgb(0, 0, 0),
        font: boldFont
    });

    const certificatePath = path.join('/usr/src/app/certificates', `${certificateID}.pdf`);
    const relativePath = `/certificates/${certificateID}.pdf`;
    
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(certificatePath, pdfBytes);  
    
    return relativePath; 
};

module.exports = generateCertificate;
