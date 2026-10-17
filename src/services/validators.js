// services/validators.js

export const ValidationSeverity = {
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

export const ValidationStatus = {
    COMPLETE: 'complete',
    PARTIAL: 'partial',
    INCOMPLETE: 'incomplete'
};

const isInvalidNumber = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    const num = Number(value);
    return isNaN(num) || !isFinite(num);
};

const isEmptyString = (value) => {
    return value === null || value === undefined || value.trim() === '';
};

export const validateIRCT = (fileData) => {
    const errors = [], warnings = [], info = [];
    const firstPage = fileData.FirstPage || {};
    const secondPage = fileData.SecondPage || {};
    const thirdPage = fileData.ThirdPage || {};
    const fourthPage = fileData.FourthPage || {};

    if (isEmptyString(firstPage.Project)) errors.push({ field: 'FirstPage.Project', message: 'Project name is required', severity: ValidationSeverity.ERROR });
    if (isEmptyString(firstPage.clientName)) errors.push({ field: 'FirstPage.clientName', message: 'Client name is required', severity: ValidationSeverity.ERROR });
    if (isEmptyString(firstPage.consultantName)) errors.push({ field: 'FirstPage.consultantName', message: 'Consultant name is required', severity: ValidationSeverity.ERROR });
    if (isEmptyString(firstPage.contractorName)) errors.push({ field: 'FirstPage.contractorName', message: 'Contractor name is required', severity: ValidationSeverity.ERROR });

    const calAccToVA = secondPage.Cal_Acc_ToVA;
    if (isInvalidNumber(calAccToVA)) errors.push({ field: 'SecondPage.Cal_Acc_ToVA', message: 'Calculation accuracy value is missing or invalid', severity: ValidationSeverity.ERROR });
    if (isEmptyString(secondPage.RelayType)) warnings.push({ field: 'SecondPage.RelayType', message: 'Relay type is recommended', severity: ValidationSeverity.WARNING });

    if (isEmptyString(thirdPage.SelectedCtClass)) errors.push({ field: 'ThirdPage.SelectedCtClass', message: 'CT Class is required', severity: ValidationSeverity.ERROR });
    if (isInvalidNumber(thirdPage.CTPrimary) || Number(thirdPage.CTPrimary) <= 0) errors.push({ field: 'ThirdPage.CTPrimary', message: 'CT Primary must be a positive number', severity: ValidationSeverity.ERROR });
    if (isInvalidNumber(thirdPage.CTSecondary) || Number(thirdPage.CTSecondary) <= 0) errors.push({ field: 'ThirdPage.CTSecondary', message: 'CT Secondary must be a positive number', severity: ValidationSeverity.ERROR });

    if (isInvalidNumber(fourthPage.SystemVoltage) || Number(fourthPage.SystemVoltage) <= 0) errors.push({ field: 'FourthPage.SystemVoltage', message: 'System Voltage is required and must be positive', severity: ValidationSeverity.ERROR });
    if (isInvalidNumber(fourthPage.SystemFrequency) || Number(fourthPage.SystemFrequency) <= 0) errors.push({ field: 'FourthPage.SystemFrequency', message: 'System Frequency is required and must be positive', severity: ValidationSeverity.ERROR });

    const hasErrors = errors.length > 0;
    const hasWarnings = warnings.length > 0;
    const status = hasErrors ? ValidationStatus.INCOMPLETE : (hasWarnings ? ValidationStatus.PARTIAL : ValidationStatus.COMPLETE);

    return { status, errors, warnings, info, fileType: 'IRCT', fileName: fileData.fileName || 'unknown.irct', isComplete: !hasErrors, hasErrors, hasWarnings };
};

export const validateIRM = (fileData) => {
    const errors = [], warnings = [], info = [];
    const meteringDevice = fileData.MeteringDevice || {};
    const ct = fileData.CurrentTransformer || {};
    const conductor = fileData.Conductor || {};
    const additionalEquipment = fileData.AdditionalEquipment || [];

    if (isInvalidNumber(meteringDevice.DeviceMaxCurrent) || Number(meteringDevice.DeviceMaxCurrent) <= 0) errors.push({ field: 'MeteringDevice.DeviceMaxCurrent', message: 'Device max current must be positive', severity: ValidationSeverity.ERROR });
    if (isInvalidNumber(meteringDevice.BurdenPhase_VA) || Number(meteringDevice.BurdenPhase_VA) < 0) errors.push({ field: 'MeteringDevice.BurdenPhase_VA', message: 'Burden (VA) must be non-negative', severity: ValidationSeverity.ERROR });

    if (isEmptyString(ct.selectedCTClass)) errors.push({ field: 'CurrentTransformer.selectedCTClass', message: 'CT Class is required', severity: ValidationSeverity.ERROR });
    if (isInvalidNumber(ct.CTPrimary) || Number(ct.CTPrimary) <= 0) errors.push({ field: 'CurrentTransformer.CTPrimary', message: 'CT Primary must be positive', severity: ValidationSeverity.ERROR });
    if (isInvalidNumber(ct.CTSecondry) || Number(ct.CTSecondry) <= 0) errors.push({ field: 'CurrentTransformer.CTSecondry', message: 'CT Secondary must be positive', severity: ValidationSeverity.ERROR });

    if (isInvalidNumber(conductor.Length) || Number(conductor.Length) <= 0) errors.push({ field: 'Conductor.Length', message: 'Conductor length must be positive', severity: ValidationSeverity.ERROR });
    if (isInvalidNumber(conductor.CrossSection) || Number(conductor.CrossSection) <= 0) errors.push({ field: 'Conductor.CrossSection', message: 'Conductor cross-section must be positive', severity: ValidationSeverity.ERROR });
    if (isEmptyString(conductor.Material)) errors.push({ field: 'Conductor.Material', message: 'Conductor material is required', severity: ValidationSeverity.ERROR });

    additionalEquipment.forEach((equip, index) => {
        if (equip.name && equip.name.trim() !== '') {
            if (isInvalidNumber(equip.ratedCurrent)) errors.push({ field: `AdditionalEquipment[${index}].ratedCurrent`, message: `Rated current for "${equip.name}" is required`, severity: ValidationSeverity.ERROR });
            if (isInvalidNumber(equip.ratedBurden)) errors.push({ field: `AdditionalEquipment[${index}].ratedBurden`, message: `Rated burden for "${equip.name}" is required`, severity: ValidationSeverity.ERROR });
        }
    });

    const hasErrors = errors.length > 0;
    const hasWarnings = warnings.length > 0;
    const status = hasErrors ? ValidationStatus.INCOMPLETE : (hasWarnings ? ValidationStatus.PARTIAL : ValidationStatus.COMPLETE);

    return { status, errors, warnings, info, fileType: 'IRM', fileName: fileData.fileName || 'unknown.irm', isComplete: !hasErrors, hasErrors, hasWarnings };
};

export const validateIRVT = (fileData) => {
    const errors = [], warnings = [], info = [];
    const lSection = fileData.L || {};
    const oSection = fileData.O || {};
    const mSection = fileData.M || {};
    const l1 = lSection.L1 || {};
    const l2 = lSection.L2 || {};

    if (isEmptyString(l1.SelectedVTClass) || l1.SelectedVTClass === 'Unset') errors.push({ field: 'L.L1.SelectedVTClass', message: 'VT Class (L1) is required', severity: ValidationSeverity.ERROR });
    if (isInvalidNumber(l1.VTPrimary) || Number(l1.VTPrimary) <= 0) errors.push({ field: 'L.L1.VTPrimary', message: 'VT Primary (L1) must be positive', severity: ValidationSeverity.ERROR });
    if (isInvalidNumber(l1.VTSecondary) || Number(l1.VTSecondary) <= 0) errors.push({ field: 'L.L1.VTSecondary', message: 'VT Secondary (L1) must be positive', severity: ValidationSeverity.ERROR });

    if (l2.L0 && l2.L0 === 'Used') {
        if (isEmptyString(l2.SelectedVTClass) || l2.SelectedVTClass === 'Unset') errors.push({ field: 'L.L2.SelectedVTClass', message: 'VT Class (L2) is required when enabled', severity: ValidationSeverity.ERROR });
        if (isInvalidNumber(l2.VTPrimary)) errors.push({ field: 'L.L2.VTPrimary', message: 'VT Primary (L2) is required when enabled', severity: ValidationSeverity.ERROR });
        if (isInvalidNumber(l2.VTSecondary)) errors.push({ field: 'L.L2.VTSecondary', message: 'VT Secondary (L2) is required when enabled', severity: ValidationSeverity.ERROR });
    }

    ['O1', 'O2', 'O3', 'O4'].forEach(key => {
        const section = oSection[key] || {};
        if (section.SelectedCondition === 'Used') {
            if (isEmptyString(section.MBCName) || section.MBCName === 'Uuset') errors.push({ field: `O.${key}.MBCName`, message: `MBC Name (${key}) is required when enabled`, severity: ValidationSeverity.ERROR });
            if (isInvalidNumber(section.Length) || Number(section.Length) < 0) errors.push({ field: `O.${key}.Length`, message: `Length (${key}) must be non-negative`, severity: ValidationSeverity.ERROR });
            if (isInvalidNumber(section.CrossSection) || Number(section.CrossSection) <= 0) errors.push({ field: `O.${key}.CrossSection`, message: `Cross-section (${key}) must be positive`, severity: ValidationSeverity.ERROR });
        }
    });

    ['M1', 'M2', 'M3', 'M4'].forEach(key => {
        const section = mSection[key] || {};
        if (section.SelectedCondition === 'Used') {
            if (isEmptyString(section.MBCName) || section.MBCName === 'Uuset') errors.push({ field: `M.${key}.MBCName`, message: `MBC Name (${key}) is required when enabled`, severity: ValidationSeverity.ERROR });
            if (isInvalidNumber(section.Length) || Number(section.Length) < 0) errors.push({ field: `M.${key}.Length`, message: `Length (${key}) must be non-negative`, severity: ValidationSeverity.ERROR });
            if (isInvalidNumber(section.CrossSection) || Number(section.CrossSection) <= 0) errors.push({ field: `M.${key}.CrossSection`, message: `Cross-section (${key}) must be positive`, severity: ValidationSeverity.ERROR });
        }
    });

    const hasErrors = errors.length > 0;
    const hasWarnings = warnings.length > 0;
    const status = hasErrors ? ValidationStatus.INCOMPLETE : (hasWarnings ? ValidationStatus.PARTIAL : ValidationStatus.COMPLETE);

    return { status, errors, warnings, info, fileType: 'IRVT', fileName: fileData.fileName || 'unknown.irvt', isComplete: !hasErrors, hasErrors, hasWarnings };
};

export const validateFile = (fileData) => {
    if (!fileData) {
        return { status: ValidationStatus.INCOMPLETE, errors: [{ field: 'fileData', message: 'File data is null', severity: ValidationSeverity.ERROR }], warnings: [], info: [], fileType: 'UNKNOWN', fileName: 'unknown', isComplete: false, hasErrors: true, hasWarnings: false };
    }
    if (fileData.FirstPage) return validateIRCT(fileData);
    if (fileData.MeteringDevice) return validateIRM(fileData);
    if (fileData.L) return validateIRVT(fileData);
    
    return { status: ValidationStatus.INCOMPLETE, errors: [{ field: 'fileType', message: 'Unknown file type', severity: ValidationSeverity.ERROR }], warnings: [], info: [], fileType: 'UNKNOWN', fileName: fileData.fileName || 'unknown', isComplete: false, hasErrors: true, hasWarnings: false };
};

export const validateAllFiles = (filesList) => {
    const results = {
        completeFiles: [],
        partialFiles: [],
        incompleteFiles: [],
        allValidations: [],
        hasIncompleteFiles: false,
        hasPartialFiles: false,
        summary: { total: filesList.length, complete: 0, partial: 0, incomplete: 0 }
    };

    filesList.forEach((file, index) => {
        const validation = validateFile(file);
        results.allValidations.push(validation);

        if (validation.status === ValidationStatus.COMPLETE) {
            results.completeFiles.push({ index, data: file, validation });
            results.summary.complete++;
        } else if (validation.status === ValidationStatus.PARTIAL) {
            results.partialFiles.push({ index, data: file, validation });
            results.summary.partial++;
            results.hasPartialFiles = true;
        } else {
            results.incompleteFiles.push({ index, data: file, validation });
            results.summary.incomplete++;
            results.hasIncompleteFiles = true;
        }
    });

    return results;
};

export default { validateIRCT, validateIRM, validateIRVT, validateFile, validateAllFiles, ValidationStatus, ValidationSeverity };