// src/main/latexService.js
const katex = require('katex');
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * LaTeX Service for Main Process
 * Handles LaTeX rendering with Node.js modules
 */
class LatexService {
    /**
     * Render LaTeX to image buffer
     */
    static renderLatexToImage(latex, options = {}) {
        const {
            fontSize = 20,
            fontColor = '#1976D2',
            backgroundColor = '#FFFFFF',
            padding = 10,
            displayMode = false
        } = options;

        try {
            // Create canvas with text rendering
            const canvas = createCanvas(400, 60);
            const ctx = canvas.getContext('2d');
            
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = fontColor;
            ctx.font = `${fontSize}px Arial`;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            
            // Clean up LaTeX for display
            const displayText = latex
                .replace(/\\/g, '')
                .replace(/[{}]/g, '')
                .replace(/\^(\d+)/g, (match, num) => {
                    const superscripts = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
                    return num.split('').map(d => superscripts[parseInt(d)] || d).join('');
                })
                .replace(/_(\d+)/g, (match, num) => {
                    const subscripts = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
                    return num.split('').map(d => subscripts[parseInt(d)] || d).join('');
                });
            
            ctx.fillText(displayText || 'Formula', canvas.width / 2, canvas.height / 2);
            
            return canvas.toBuffer('image/png');
        } catch (error) {
            console.error('Error rendering LaTeX:', error);
            // Return a simple text image
            const canvas = createCanvas(400, 60);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = fontColor;
            ctx.font = `${fontSize}px Arial`;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            const cleanText = latex.replace(/[\\{}]/g, '');
            ctx.fillText('Formula: ' + cleanText, canvas.width / 2, canvas.height / 2);
            return canvas.toBuffer('image/png');
        }
    }

    /**
     * Get temporary file path
     */
    static getTempFilePath(extension = 'png') {
        const tempDir = os.tmpdir();
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        return path.join(tempDir, `latex_formula_${timestamp}_${random}.${extension}`);
    }

    /**
     * Render LaTeX and save to temporary file
     */
    static renderLatexToFile(latex, options = {}) {
        const imageBuffer = this.renderLatexToImage(latex, options);
        const tempFilePath = this.getTempFilePath('png');
        fs.writeFileSync(tempFilePath, imageBuffer);
        return tempFilePath;
    }

    /**
     * Clean up temporary files older than 1 hour
     */
    static cleanupTempFiles() {
        const tempDir = os.tmpdir();
        let cleaned = 0;
        
        try {
            const files = fs.readdirSync(tempDir);
            const matchingFiles = files.filter(file => file.match(/latex_formula_.*\.png/));
            
            for (const file of matchingFiles) {
                const filePath = path.join(tempDir, file);
                try {
                    const stats = fs.statSync(filePath);
                    const age = Date.now() - stats.mtimeMs;
                    if (age > 3600000) { // 1 hour
                        fs.unlinkSync(filePath);
                        cleaned++;
                    }
                } catch (error) {
                    console.warn('Failed to cleanup temp file:', filePath, error);
                }
            }
        } catch (error) {
            console.warn('Failed to read temp directory:', error);
        }
        
        if (cleaned > 0) {
            console.log(`🧹 Cleaned up ${cleaned} temporary image files`);
        }
        return cleaned;
    }
}

module.exports = LatexService;