// exceljs-test.js
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

console.log('📊 Starting ExcelJS environment test...\n');

try {
    // 1. Create a new workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Test Suite';
    workbook.created = new Date();

    // 2. Add a worksheet
    const worksheet = workbook.addWorksheet('Test Sheet');

    // 3. Add some styled headers
    worksheet.columns = [
        { header: 'Parameter', key: 'param', width: 30 },
        { header: 'Value', key: 'value', width: 20 },
        { header: 'Unit', key: 'unit', width: 15 },
    ];

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 14 };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF6A1B9A' }
    };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.height = 25;

    // 4. Add some data rows
    worksheet.addRow({ param: 'Voltage', value: 220, unit: 'V' });
    worksheet.addRow({ param: 'Current', value: 15.5, unit: 'A' });
    worksheet.addRow({ param: 'Power', value: 3410, unit: 'W' });

    // Style data rows
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
            row.getCell(1).font = { bold: true, size: 12 };
            row.getCell(2).font = { color: { argb: 'FF1976D2' }, size: 12 };
            row.getCell(3).alignment = { horizontal: 'center' };
        }
    });

    // 5. Add a simple image (a 1x1 red pixel as base64)
    const redPixelBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    
    const imageId = workbook.addImage({
        base64: redPixelBase64,
        extension: 'png',
    });

    worksheet.addImage(imageId, {
        tl: { col: 3.5, row: 1.5 }, // Position near cell D2
        ext: { width: 50, height: 50 }
    });

    // 6. Write to file
    const outputPath = path.join(__dirname, 'exceljs-test-output.xlsx');
    workbook.xlsx.writeFile(outputPath)
        .then(() => {
            console.log('✅ SUCCESS! ExcelJS is fully functional.');
            console.log(`📁 Excel file saved to: ${outputPath}`);
            console.log('🎉 You are ready to build your professional Excel pipeline!');
            process.exit(0);
        })
        .catch(err => {
            console.error('❌ FAILED during file write:');
            console.error(err.message);
            process.exit(1);
        });

} catch (error) {
    console.error('❌ FAILED! ExcelJS threw an error:');
    console.error('---------------------------------------------------');
    console.error(error.message);
    console.error('---------------------------------------------------');
    process.exit(1);
}