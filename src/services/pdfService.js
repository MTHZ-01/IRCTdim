// services/pdfService.js

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * PDF Service Module
 * Handles PDF generation with page management and progress tracking
 */

export const PDFConfig = {
    PAGE_WIDTH: 210, // mm
    PAGE_HEIGHT: 297, // mm
    MARGIN: 0,
    HEADER_HEIGHT: 20,
    FOOTER_HEIGHT: 0,
    ORIENTATION: 'portrait',
    UNIT: 'mm',
    FORMAT: 'a4'
};

export const PDFGenerationStatus = {
    IDLE: 'idle',
    GENERATING: 'generating',
    COMPLETE: 'complete',
    ERROR: 'error',
    CANCELLED: 'cancelled'
};

/**
 * Generate PDF from React component ref
 */
export const generatePDF = async (options) => {
    const {
        pdfRef,
        onProgress = () => {},
        onPageUpdate = () => {},
        openPopUp,
        closePopUp,
        fileName = 'report.pdf'
    } = options;

    const container = pdfRef.current;
    if (!container) {
        throw new Error('PDF content element not found');
    }

    const pdf = new jsPDF({
        orientation: PDFConfig.ORIENTATION,
        unit: PDFConfig.UNIT,
        format: PDFConfig.FORMAT
    });

    const pageWidth = PDFConfig.PAGE_WIDTH;
    const pageHeight = PDFConfig.PAGE_HEIGHT;
    const headerHeight = PDFConfig.HEADER_HEIGHT;
    const contentHeight = pageHeight - headerHeight - PDFConfig.FOOTER_HEIGHT;
    const safeContentHeight = contentHeight - 5;

    let pageNumber = 1;

    // ─── Header Generator ──────────────────────────────────────────
    const addHeader = (pdfInstance, pageNum) => {
        pdfInstance.setFillColor('#1976d2');
        pdfInstance.setDrawColor('#1976d2');
        pdfInstance.setLineWidth(0);

        const p1 = { x: 0, y: 0 };
        const p2 = { x: pageWidth, y: 0 };
        const p3 = { x: pageWidth - 10, y: headerHeight };
        const p4 = { x: 10, y: headerHeight };

        pdfInstance.lines(
            [
                [p2.x - p1.x, p2.y - p1.y],
                [p3.x - p2.x, p3.y - p2.y],
                [p4.x - p3.x, p4.y - p3.y],
                [p1.x - p4.x, p1.y - p4.y]
            ],
            p1.x,
            p1.y,
            [1, 1],
            'F'
        );

        pdfInstance.setFontSize(14);
        pdfInstance.setTextColor('#ffffff');
        pdfInstance.text('Power Calculation Suite', 12, headerHeight - 6);
        pdfInstance.text(`${pageNum}`, pageWidth - 12, headerHeight - 6, { align: 'right' });
    };

    try {
        const containerWidth = container.getBoundingClientRect().width;
        if (containerWidth === 0) {
            throw new Error('Container has zero width');
        }

        const sections = Array.from(container.children);
        if (sections.length === 0) {
            throw new Error('No content sections found');
        }

        onProgress(10);

        // ─── Calculate Section Metrics ────────────────────────────
        const pxToMm = pageWidth / containerWidth;
        const sectionMetrics = sections.map((sec, index) => {
            const rect = sec.getBoundingClientRect();
            const style = window.getComputedStyle(sec);
            const marginTop = parseFloat(style.marginTop) || 0;
            const marginBottom = parseFloat(style.marginBottom) || 0;

            return {
                element: sec,
                heightMm: (rect.height * pageWidth) / rect.width,
                marginTop,
                marginBottom,
                totalHeightMm: (rect.height + marginTop + marginBottom) * pxToMm,
                index
            };
        });

        onProgress(30);

        // ─── Group Sections into Pages ────────────────────────────
        const pageGroups = [];
        let currentGroup = [];
        let currentHeight = 0;

        for (const metric of sectionMetrics) {
            if (currentHeight + metric.totalHeightMm > safeContentHeight) {
                if (currentGroup.length > 0) {
                    pageGroups.push(currentGroup);
                    currentGroup = [];
                    currentHeight = 0;
                }
            }
            currentGroup.push(metric);
            currentHeight += metric.totalHeightMm;
        }

        if (currentGroup.length > 0) {
            pageGroups.push(currentGroup);
        }

        const totalPages = pageGroups.length;
        onProgress(50);

        // ─── Render Each Page ──────────────────────────────────────
        for (let i = 0; i < pageGroups.length; i++) {
            if (i > 0) {
                pdf.addPage();
                pageNumber++;
            }

            pdf.setFillColor('#fff4f4');
            pdf.rect(0, 0, pageWidth, pageHeight, 'F');
            addHeader(pdf, pageNumber);

            let y = headerHeight + 5;
            const group = pageGroups[i];

            // Create temporary container for rendering
            const tempDiv = document.createElement('div');
            tempDiv.style.backgroundColor = '#fff4f4';
            tempDiv.style.width = `${containerWidth}px`;
            tempDiv.style.position = 'absolute';
            tempDiv.style.top = '-9999px';
            tempDiv.style.left = '-9999px';

            group.forEach(metric => {
                const clone = metric.element.cloneNode(true);
                clone.style.marginTop = `${metric.marginTop}px`;
                clone.style.marginBottom = `${metric.marginBottom}px`;
                tempDiv.appendChild(clone);
            });

            document.body.appendChild(tempDiv);

            const groupRect = tempDiv.getBoundingClientRect();
            const groupHeightMm = (groupRect.height * pageWidth) / groupRect.width;

            // Render group
            const canvas = await html2canvas(tempDiv, {
                scale: 2,
                backgroundColor: '#fff4f4',
                logging: false,
                useCORS: true
            });

            const img = canvas.toDataURL('image/jpeg', 1.0);
            pdf.addImage(img, 'JPEG', 0, y, pageWidth, groupHeightMm);

            document.body.removeChild(tempDiv);

            // Update progress
            const progress = 50 + ((i + 1) / totalPages) * 45;
            onProgress(progress);
            onPageUpdate(i + 1);
        }

        onProgress(95);

        // ─── Save PDF ─────────────────────────────────────────────
        const isElectron = !!(window.electron && window.electron.dialog && window.electron.fs);

        if (isElectron) {
            const saveResult = await window.electron.dialog.showSaveDialog({
                title: 'Save PDF Report',
                defaultPath: fileName,
                filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
            });

            if (!saveResult.canceled && saveResult.filePath) {
                const pdfData = pdf.output('arraybuffer');
                const uint8Array = new Uint8Array(pdfData);
                await window.electron.fs.writeFile(saveResult.filePath, uint8Array);
                console.log(`PDF saved to: ${saveResult.filePath}`);
            }
        } else {
            pdf.save(fileName);
        }

        onProgress(100);

        return {
            success: true,
            pageCount: totalPages,
            fileName: fileName,
            status: PDFGenerationStatus.COMPLETE
        };

    } catch (error) {
        console.error('PDF generation error:', error);
        throw error;
    }
};

/**
 * Preview PDF (open in new window)
 */
export const previewPDF = async (options) => {
    const result = await generatePDF(options);
    // Open PDF in new window if in web environment
    if (result.success && !window.electron) {
        const blob = new Blob([result.pdfData], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }
    return result;
};

export default {
    generatePDF,
    previewPDF,
    PDFConfig,
    PDFGenerationStatus
};