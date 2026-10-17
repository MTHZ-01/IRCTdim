// services/exceljsLoader.js

/**
 * Load ExcelJS in Electron environment
 * Handles Webpack/Vite bundling quirks in the renderer process
 */
export const getExcelJS = async () => {
    try {
        // Dynamic import is the most reliable method in Webpack/Vite renderer
        const exceljsModule = await import('exceljs');
        
        // Bundlers can expose the module in different ways. Check all possibilities:
        if (exceljsModule.default?.Workbook) {
            console.log('✅ ExcelJS loaded via default export');
            return exceljsModule.default;
        }
        
        if (exceljsModule.Workbook) {
            console.log('✅ ExcelJS loaded via named export');
            return exceljsModule;
        }

        // Fallback for CommonJS require (if nodeIntegration is somehow enabled)
        if (typeof require !== 'undefined') {
            try {
                const req = require('exceljs');
                if (req.Workbook) return req;
                if (req.default?.Workbook) return req.default;
            } catch (e) {
                // Ignore require errors, we already tried dynamic import
            }
        }

        console.error('❌ ExcelJS module keys:', Object.keys(exceljsModule));
        throw new Error('Could not find ExcelJS.Workbook constructor in module exports.');
    } catch (error) {
        console.error('❌ Failed to load ExcelJS:', error);
        throw error;
    }
};