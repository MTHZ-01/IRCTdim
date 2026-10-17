// WorkSpaceTree.jsx
import React, { Component } from "react";
import { connect } from "react-redux";
import { AURL } from "./App.jsx";
import { CSSTransition } from 'react-transition-group';
import FileView from './FileView.jsx';

// Simple in-memory cache for directory contents
const directoryCache = new Map();

class WorkSpaceTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: props.defaultExpanded || false,
            children: props.node.children || null,
            loading: false,
        };
        this.debounceTimeout = null;
        this._scannedChildren = false; // prevent double scanning
    }

    componentDidMount() {
        const fileName = this.props.node.name;

        // Set expanded state for non-special files
        if (!this.isIRCT(fileName) && !this.isIRM(fileName) && !this.isIRVT(fileName) && !this.isCFG(fileName)) {
            this.setState({ expanded: true });
        }

        // If children pre-exist in props, scan them immediately for special files
        if (this.state.children && !this._scannedChildren) {
            this._scannedChildren = true;
            this.scanAndAutoOpenChildren(this.state.children);
        }

        // Load children only if directory, expanded, and no children provided
        if (this.props.node.isDirectory && this.state.expanded && this.state.children === null) {
            this.loadChildren();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // If we just expanded and children are absent, fetch them
        if (
            this.props.node.isDirectory &&
            !prevState.expanded &&
            this.state.expanded &&
            this.state.children === null
        ) {
            this.loadChildren();
        }

        // If directory path changed -> reload children
        if (
            this.props.node.isDirectory &&
            this.props.node.path !== prevProps.node.path
        ) {
            this.reloadChildren();
        }

        // If children were previously null and now we have children (for any reason), scan them
        if (!prevState.children && this.state.children && !this._scannedChildren) {
            this._scannedChildren = true;
            this.scanAndAutoOpenChildren(this.state.children);
        }

        // If props.node.children changed (parent updated the tree), update state and scan
        if (prevProps.node.children !== this.props.node.children) {
            const incoming = this.props.node.children || null;
            // reset scanning flag to allow fresh scan for new children
            this._scannedChildren = false;
            this.setState({ children: incoming }, () => {
                if (this.state.children && !this._scannedChildren) {
                    this._scannedChildren = true;
                    this.scanAndAutoOpenChildren(this.state.children);
                }
            });
        }
    }

    componentWillUnmount() {
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }
    }

    toggleExpand = () => {
        this.setState((prevState) => ({ expanded: !prevState.expanded }));
    };

    // ---------- Helpers ----------
    isIRCT = (name) => name && name.toLowerCase().endsWith(".irct");
    isCFG = (name) => name && name.toLowerCase().endsWith(".cfg");
    isIRM = (name) => name && name.toLowerCase().endsWith(".irm");
    isIRVT = (name) => name && name.toLowerCase().endsWith(".irvt");
    isSpecialFile = (name) => this.isIRCT(name) || this.isIRM(name) || this.isIRVT(name);

    // Scan an array of child nodes and auto-open any special files sequentially
    scanAndAutoOpenChildren = async (children = []) => {
        if (!Array.isArray(children) || children.length === 0) return;

        // Collect files to open
        const filesToOpen = [];
        children.forEach(child => {
            if (!child) return;
            const name = child.name || "";
            const lower = name.toLowerCase();
            if (lower.endsWith('.irct') || lower.endsWith('.irm') || lower.endsWith('.irvt')) {
                filesToOpen.push(child.path);
            }
        });

        // Open files sequentially to prevent race conditions
        for (const filePath of filesToOpen) {
            await this.autoOpenFile(filePath);
            // Small delay to ensure state updates complete
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    };

    // Add to AllFileData if missing (keeps JSON-string format like before)
    addToAllFileDataIfMissing = (filePath, parsedContent, fileName) => {
        try {
            const existing = this.props.AllFileData || [];
            const normalizedPath = filePath.replace(/\\/g, '/').toLowerCase();

            const exists = existing.some(item => {
                try {
                    const parsed = JSON.parse(item);
                    if (!parsed) return false;
                    const itemPath = parsed.filePath ? parsed.filePath.replace(/\\/g, '/').toLowerCase() : '';
                    return normalizedPath && itemPath === normalizedPath;
                } catch (err) {
                    return false;
                }
            });

            if (!exists) {
                const normalizedFileName = fileName.toLowerCase();
                const fileData = JSON.stringify({ ...parsedContent, filePath, fileName: normalizedFileName });
                const newAll = [...existing, fileData];
                this.props.SET_ALLFILEDATA(newAll);
                console.log('✅ Added to AllFileData:', fileName);
            }
        } catch (err) {
            console.error("addToAllFileDataIfMissing error:", err);
        }
    };
    // Read file and dispatch ready-set actions automatically
    // Read file and dispatch ready-set actions automatically
    autoOpenFile = async (filePath) => {
        const normalized = filePath.replace(/\\/g, '/');
        const fileName = normalized.substring(normalized.lastIndexOf('/') + 1);

        try {
            const response = await fetch(AURL + "ReadFile/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ path: normalized }),
            });

            if (!response.ok) throw new Error(`Error reading file: ${response.statusText}`);
            const data = await response.json();
            const content = data.Content;
            let parsedContent = {};
            try {
                parsedContent = content && content.trim() !== '' ? JSON.parse(content) : {};
            } catch (error) {
                console.error('Error parsing file content in autoOpenFile:', error, content);
                parsedContent = {};
            }

            // Add to AllFileData
            const normalizedFileName = fileName.toLowerCase();
            this.addToAllFileDataIfMissing(normalized, parsedContent, normalizedFileName);

            // Put into ready sets depending on extension
            const lower = normalizedFileName;
            if (lower.endsWith('.irct')) {
                // For .irct files, create complete project structure with defaults
                const projectStructure = {
                    FirstPage: parsedContent.ProjectData?.FirstPage || {
                        Project: "",
                        RefrenceNo: "",
                        Revision: "",
                        RemarkA: "",
                        Date: "",
                        imgUrlClient: null,
                        imgUrlConsultant: null,
                        imgUrlContractor: null,
                        clientName: "",
                        consultantName: "",
                        contractorName: "",
                        DocumentNumber: "",
                    },
                    SecondPage: parsedContent.ProjectData?.SecondPage || null,
                    ThirdPage: parsedContent.ProjectData?.ThirdPage || null,
                    FourthPage: parsedContent.ProjectData?.FourthPage || null,
                    activeStep: parsedContent.ProjectData?.activeStep || 0,
                    Path: normalized,
                    fileName: normalizedFileName
                };
                this.props.addToReadySet(projectStructure);
            } else if (lower.endsWith('.irm')) {
                // Create complete data object with all defaults for IRM
                const Data = {
                    activeStepMETERCT: parsedContent?.activeStepMETERCT ?? 0,
                    MeteringDevice: parsedContent?.MeteringDevice || {
                        ShouldShowForm: false,
                        Manufacture: "",
                        DeviceName: "",
                        Irn_A_list: [1, 5],
                        selectedIrn_A: 0,
                        BurdenPhase_VA: 0,
                        DeviceMaxCurrent: 0,
                        MaxFaultCurrent: 0,
                        standard: ''
                    },
                    CurrentTransformer: parsedContent?.CurrentTransformer || {
                        ShouldShowForm: false,
                        CTName: '',
                        standard: '',
                        CtClassList: ["0.1", "0.2", "1", "3", "5", "0.2S", "0.5S"],
                        selectedCTClass: '',
                        CTPrimary: 0,
                        CTSecondry: 0,
                        SecurityFactor: 0,
                        RatedBurden: 0,
                        CTResistance: 0,
                        ExtendedBurdenRangeList: ['Yes', 'No'],
                        SelectedExtendedBurdenRangeList: 'Yes'
                    },
                    Conductor: parsedContent?.Conductor || {
                        ShouldShowForm: false,
                        Length: 0,
                        CrossSection: 0,
                        Material_List: ["Al", "Cu"],
                        Material: ''
                    },
                    AdditionalEquipment: parsedContent?.AdditionalEquipment || [
                        { name: '', ratedCurrent: '', ratedBurden: '' },
                        { name: '', ratedCurrent: '', ratedBurden: '' },
                        { name: '', ratedCurrent: '', ratedBurden: '' },
                        { name: '', ratedCurrent: '', ratedBurden: '' },
                        { name: '', ratedCurrent: '', ratedBurden: '' }
                    ],
                    fileName: normalizedFileName,
                    Path: normalized
                };
                this.props.addToReadySetMCT(Data);
                this.props.SET_NEW_METERCT_PATH(normalized);
                this.props.METERCT_OPEN_FILE(Data);
            } else if (lower.endsWith('.irvt')) {
                // Create complete data object with all defaults for VT
                const Data = {
                    activeStepVT: parsedContent?.activeStepVT ?? 0,
                    L: parsedContent?.L || {
                        ShouldShowForm: false,
                        L1: {
                            VTName: "Unset",
                            Standard: "Unset",
                            VTClassList: ["0.1", "0.2", "0.5", "1", "3", "3P", "6P", "0.2 + 3P", "0.5 + 3P"],
                            SelectedVTClass: "Unset",
                            VTPrimary: 0,
                            VTSecondary: 0,
                            RatedPower: 0,
                            ValidVoltageDropList: [0.1, 0.2, 0.5, 2.5],
                            SelectedValidVoltageDrop: 0,
                        },
                        L2: {
                            L0: "Unused",
                            VTName: "Unset",
                            Standard: "Unset",
                            VTClassList: ["0.1", "0.2", "0.5", "1", "3", "3P", "6P", "0.2 + 3P", "0.5 + 3P"],
                            SelectedVTClass: "Unset",
                            VTPrimary: 0,
                            VTSecondary: 0,
                            RatedPower: 0,
                            ValidVoltageDropList: [0.1, 0.2, 0.5, 2.5],
                            SelectedValidVoltageDrop: 0,
                        }
                    },
                    O: parsedContent?.O || {
                        ShouldShowForm: false,
                        ContidionList: ["Used", "Unused"],
                        MaterialList: ["Cu", "Al"],
                        O1: {
                            SelectedCondition: "Unused",
                            MBCName: "Uuset",
                            Length: 0,
                            CrossSection: 0,
                            SelectedMaterial: "Cu",
                            ConnectedDevice: "Uuset",
                            TotalConnectedBurden: 0
                        },
                        O2: {
                            SelectedCondition: "Unused",
                            MBCName: "Uuset",
                            Length: 0,
                            CrossSection: 0,
                            SelectedMaterial: "Cu",
                            ConnectedDevice: "Uuset",
                            TotalConnectedBurden: 0
                        },
                        O3: {
                            SelectedCondition: "Unused",
                            MBCName: "Uuset",
                            Length: 0,
                            CrossSection: 0,
                            SelectedMaterial: "Cu",
                            ConnectedDevice: "Uuset",
                            TotalConnectedBurden: 0
                        },
                        O4: {
                            SelectedCondition: "Unused",
                            MBCName: "Uuset",
                            Length: 0,
                            CrossSection: 0,
                            SelectedMaterial: "Cu",
                            ConnectedDevice: "Uuset",
                            TotalConnectedBurden: 0
                        },
                    },
                    M: parsedContent?.M || {
                        ShouldShowForm: false,
                        ContidionList: ["Used", "Unused"],
                        MaterialList: ["Cu", "Al"],
                        M1: {
                            SelectedCondition: "Unused",
                            MBCName: "Uuset",
                            Length: 0,
                            CrossSection: 0,
                            SelectedMaterial: "Cu",
                            ConnectedDevice: "Uuset",
                            TotalConnectedBurden: 0
                        },
                        M2: {
                            SelectedCondition: "Unused",
                            MBCName: "Uuset",
                            Length: 0,
                            CrossSection: 0,
                            SelectedMaterial: "Cu",
                            ConnectedDevice: "Uuset",
                            TotalConnectedBurden: 0
                        },
                        M3: {
                            SelectedCondition: "Unused",
                            MBCName: "Uuset",
                            Length: 0,
                            CrossSection: 0,
                            SelectedMaterial: "Cu",
                            ConnectedDevice: "Uuset",
                            TotalConnectedBurden: 0
                        },
                        M4: {
                            SelectedCondition: "Unused",
                            MBCName: "Uuset",
                            Length: 0,
                            CrossSection: 0,
                            SelectedMaterial: "Cu",
                            ConnectedDevice: "Uuset",
                            TotalConnectedBurden: 0
                        },
                    },
                    fileName: normalizedFileName,
                    Path: normalized
                };
                this.props.addToReadySetVT(Data);
                this.props.SET_NEW_VT_PATH(normalized);
                this.props.VT_OPEN_FILE(Data);
            }
        } catch (error) {
            console.error("autoOpenFile error:", error);
        }
    };

    // ---------- Load / reload directory contents ----------
    loadChildren = () => {
        const { path } = this.props.node;
        // Use cache if present
        if (directoryCache.has(path)) {
            const cached = directoryCache.get(path);
            this.setState({ children: cached, loading: false }, () => {
                // Scan cached children immediately
                if (!this._scannedChildren) {
                    this._scannedChildren = true;
                    this.scanAndAutoOpenChildren(cached);
                }
            });
            return;
        }

        if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
        this.setState({ loading: true });
        this.debounceTimeout = setTimeout(() => {
            fetch(AURL + "filetree", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dir: path }),
            })
                .then((response) => {
                    if (!response.ok) throw new Error(`Error fetching directory contents: ${response.statusText}`);
                    return response.json();
                })
                .then((data) => {
                    const filteredChildren = data.children ? data.children.filter(child => !child.name.endsWith('.cfg')) : [];
                    directoryCache.set(path, filteredChildren);
                    this.setState({ children: filteredChildren, loading: false }, () => {
                        if (!this._scannedChildren) {
                            this._scannedChildren = true;
                            this.scanAndAutoOpenChildren(filteredChildren);
                        }
                    });
                })
                .catch((error) => {
                    console.error("Error fetching directory contents:", error);
                    this.setState({ loading: false });
                    this.props.openPopUp("Error", `Failed to load directory contents: ${error.message}`, "dialog", "OK");
                });
        }, 300);
    };

    reloadChildren = () => {
        const { path } = this.props.node;
        directoryCache.delete(path);
        // reset scan flag so we can scan again after reload
        this._scannedChildren = false;
        this.setState({ children: null, loading: true });

        if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
            fetch(AURL + "filetree", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dir: path }),
            })
                .then((response) => {
                    if (!response.ok) throw new Error(`Error fetching directory contents: ${response.statusText}`);
                    return response.json();
                })
                .then((data) => {
                    const filteredChildren = data.children ? data.children.filter(child => !child.name.endsWith('.cfg')) : [];
                    directoryCache.set(path, filteredChildren);
                    this.setState({ children: filteredChildren, loading: false }, () => {
                        if (!this._scannedChildren) {
                            this._scannedChildren = true;
                            this.scanAndAutoOpenChildren(filteredChildren);
                        }
                    });
                })
                .catch((error) => {
                    console.error("Error fetching directory contents:", error);
                    this.setState({ loading: false });
                    this.props.openPopUp("Error", `Failed to load directory contents: ${error.message}`, "dialog", "OK");
                });
        }, 300);
    };

    // Delete file and remove from AllFileData
    deleteFile = (e) => {
        e.stopPropagation();
        const filePath = this.props.node.path;
        fetch(AURL + "delete_file/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: filePath }),
        })
            .then(response => {
                if (!response.ok) throw new Error(`Error deleting file: ${response.statusText}`);
                return response.json();
            })
            .then(data => {
                const parentPath = filePath.substring(0, filePath.lastIndexOf('/'));
                directoryCache.delete(parentPath);
                if (this.props.reloadParent) this.props.reloadParent();

                // Remove file from AllFileData
                try {
                    const existing = this.props.AllFileData || [];
                    const newAll = existing.filter(item => {
                        try {
                            const parsed = JSON.parse(item);
                            return parsed && parsed.filePath !== filePath;
                        } catch (err) {
                            return true;
                        }
                    });
                    this.props.SET_ALLFILEDATA(newAll);
                } catch (err) {
                    console.error("Error removing deleted file from AllFileData:", err);
                }
            })
            .catch(error => {
                console.error("Error deleting file:", error);
                this.props.openPopUp("Error", `Failed to delete file: ${error.message}`, "dialog", "OK");
            });
    };

    // Replace existing OpenProject() in WorkSpaceTree.jsx with this:
    OpenProject = () => {
        const filePath = this.props.node.path.replace(/\\/g, '/');
        const fileName = this.props.node.name.toLowerCase();

        fetch(AURL + "ReadFile/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: filePath }),
        })
            .then((response) => {
                if (!response.ok) throw new Error(`Error reading file: ${response.statusText}`);
                return response.json();
            })
            .then((data) => {
                const content = data.Content;
                let parsedContent;
                try {
                    parsedContent = content && content.trim() !== '' ? JSON.parse(content) : {};
                } catch (error) {
                    console.error('Error parsing file content:', error, content);
                    throw new Error(`Invalid JSON in file: ${fileName}`);
                }

                const normalizedFileName = fileName.toLowerCase();
                this.addToAllFileDataIfMissing(filePath, parsedContent, normalizedFileName);

                // Dispatch to ready sets with complete data
                if (fileName.endsWith('.irct')) {
                    const projectStructure = {
                        FirstPage: parsedContent.ProjectData?.FirstPage || {
                            Project: "",
                            RefrenceNo: "",
                            Revision: "",
                            RemarkA: "",
                            Date: "",
                            imgUrlClient: null,
                            imgUrlConsultant: null,
                            imgUrlContractor: null,
                            clientName: "",
                            consultantName: "",
                            contractorName: "",
                            DocumentNumber: "",
                        },
                        SecondPage: parsedContent.ProjectData?.SecondPage || null,
                        ThirdPage: parsedContent.ProjectData?.ThirdPage || null,
                        FourthPage: parsedContent.ProjectData?.FourthPage || null,
                        activeStep: parsedContent.ProjectData?.activeStep || 0,
                        Path: filePath,
                        fileName: normalizedFileName
                    };
                    this.props.addToReadySet(projectStructure);
                } else if (fileName.endsWith('.irm')) {
                    const Data = {
                        activeStepMETERCT: parsedContent?.activeStepMETERCT ?? 0,
                        MeteringDevice: parsedContent?.MeteringDevice || {
                            ShouldShowForm: false,
                            Manufacture: "",
                            DeviceName: "",
                            Irn_A_list: [1, 5],
                            selectedIrn_A: 0,
                            BurdenPhase_VA: 0,
                            DeviceMaxCurrent: 0,
                            MaxFaultCurrent: 0,
                            standard: ''
                        },
                        CurrentTransformer: parsedContent?.CurrentTransformer || {
                            ShouldShowForm: false,
                            CTName: '',
                            standard: '',
                            CtClassList: ["0.1", "0.2", "1", "3", "5", "0.2S", "0.5S"],
                            selectedCTClass: '',
                            CTPrimary: 0,
                            CTSecondry: 0,
                            SecurityFactor: 0,
                            RatedBurden: 0,
                            CTResistance: 0,
                            ExtendedBurdenRangeList: ['Yes', 'No'],
                            SelectedExtendedBurdenRangeList: 'Yes'
                        },
                        Conductor: parsedContent?.Conductor || {
                            ShouldShowForm: false,
                            Length: 0,
                            CrossSection: 0,
                            Material_List: ["Al", "Cu"],
                            Material: ''
                        },
                        AdditionalEquipment: parsedContent?.AdditionalEquipment || [
                            { name: '', ratedCurrent: '', ratedBurden: '' },
                            { name: '', ratedCurrent: '', ratedBurden: '' },
                            { name: '', ratedCurrent: '', ratedBurden: '' },
                            { name: '', ratedCurrent: '', ratedBurden: '' },
                            { name: '', ratedCurrent: '', ratedBurden: '' }
                        ],
                        fileName: normalizedFileName,
                        Path: filePath
                    };
                    this.props.addToReadySetMCT(Data);
                    this.props.SET_NEW_METERCT_PATH(filePath);
                    this.props.METERCT_OPEN_FILE(Data);
                } else if (fileName.endsWith('.irvt')) {
                    const Data = {
                        activeStepVT: parsedContent?.activeStepVT ?? 0,
                        L: parsedContent?.L || {
                            ShouldShowForm: false,
                            L1: {
                                VTName: "Unset",
                                Standard: "Unset",
                                VTClassList: ["0.1", "0.2", "0.5", "1", "3", "3P", "6P", "0.2 + 3P", "0.5 + 3P"],
                                SelectedVTClass: "Unset",
                                VTPrimary: 0,
                                VTSecondary: 0,
                                RatedPower: 0,
                                ValidVoltageDropList: [0.1, 0.2, 0.5, 2.5],
                                SelectedValidVoltageDrop: 0,
                            },
                            L2: {
                                L0: "Unused",
                                VTName: "Unset",
                                Standard: "Unset",
                                VTClassList: ["0.1", "0.2", "0.5", "1", "3", "3P", "6P", "0.2 + 3P", "0.5 + 3P"],
                                SelectedVTClass: "Unset",
                                VTPrimary: 0,
                                VTSecondary: 0,
                                RatedPower: 0,
                                ValidVoltageDropList: [0.1, 0.2, 0.5, 2.5],
                                SelectedValidVoltageDrop: 0,
                            }
                        },
                        O: parsedContent?.O || {
                            ShouldShowForm: false,
                            ContidionList: ["Used", "Unused"],
                            MaterialList: ["Cu", "Al"],
                            O1: {
                                SelectedCondition: "Unused",
                                MBCName: "Uuset",
                                Length: 0,
                                CrossSection: 0,
                                SelectedMaterial: "Cu",
                                ConnectedDevice: "Uuset",
                                TotalConnectedBurden: 0
                            },
                            O2: {
                                SelectedCondition: "Unused",
                                MBCName: "Uuset",
                                Length: 0,
                                CrossSection: 0,
                                SelectedMaterial: "Cu",
                                ConnectedDevice: "Uuset",
                                TotalConnectedBurden: 0
                            },
                            O3: {
                                SelectedCondition: "Unused",
                                MBCName: "Uuset",
                                Length: 0,
                                CrossSection: 0,
                                SelectedMaterial: "Cu",
                                ConnectedDevice: "Uuset",
                                TotalConnectedBurden: 0
                            },
                            O4: {
                                SelectedCondition: "Unused",
                                MBCName: "Uuset",
                                Length: 0,
                                CrossSection: 0,
                                SelectedMaterial: "Cu",
                                ConnectedDevice: "Uuset",
                                TotalConnectedBurden: 0
                            },
                        },
                        M: parsedContent?.M || {
                            ShouldShowForm: false,
                            ContidionList: ["Used", "Unused"],
                            MaterialList: ["Cu", "Al"],
                            M1: {
                                SelectedCondition: "Unused",
                                MBCName: "Uuset",
                                Length: 0,
                                CrossSection: 0,
                                SelectedMaterial: "Cu",
                                ConnectedDevice: "Uuset",
                                TotalConnectedBurden: 0
                            },
                            M2: {
                                SelectedCondition: "Unused",
                                MBCName: "Uuset",
                                Length: 0,
                                CrossSection: 0,
                                SelectedMaterial: "Cu",
                                ConnectedDevice: "Uuset",
                                TotalConnectedBurden: 0
                            },
                            M3: {
                                SelectedCondition: "Unused",
                                MBCName: "Uuset",
                                Length: 0,
                                CrossSection: 0,
                                SelectedMaterial: "Cu",
                                ConnectedDevice: "Uuset",
                                TotalConnectedBurden: 0
                            },
                            M4: {
                                SelectedCondition: "Unused",
                                MBCName: "Uuset",
                                Length: 0,
                                CrossSection: 0,
                                SelectedMaterial: "Cu",
                                ConnectedDevice: "Uuset",
                                TotalConnectedBurden: 0
                            },
                        },
                        fileName: normalizedFileName,
                        Path: filePath
                    };
                    this.props.addToReadySetVT(Data);
                    this.props.SET_NEW_VT_PATH(filePath);
                    this.props.VT_OPEN_FILE(Data);
                }
            })
            .catch((error) => {
                console.error("Error in OpenProject:", error);
                this.props.openPopUp("Error", `Failed to open file ${fileName}: ${error.message}`, "dialog", "OK");
                if (fileName.endsWith('.irct')) {
                    const normalizedFileName = fileName.toLowerCase();
                    const fallbackProject = {
                        FirstPage: { Project: normalizedFileName.replace(/\.irct$/, "") },
                        SecondPage: null,
                        ThirdPage: null,
                        FourthPage: null,
                        activeStep: 0,
                        Path: filePath,
                        fileName: normalizedFileName
                    };
                    this.props.addToReadySet(fallbackProject);
                }
            });
    };


    render() {
        const { node } = this.props;
        const { expanded, children, loading } = this.state;
        const isDirectory = node.isDirectory;

        return (
            <div className="tree-node" style={{ marginTop: "10px", paddingLeft: "0px" }}>
                <FileView
                    node={node}
                    expanded={expanded}
                    toggleExpand={this.toggleExpand}
                    deleteFile={this.deleteFile}
                    OpenProject={this.OpenProject}
                    isSpecialFile={this.isSpecialFile}
                />

                {isDirectory && (
                    <CSSTransition
                        in={expanded}
                        timeout={100}
                        classNames="node-children"
                        unmountOnExit
                    >
                        <div className="node-children">
                            {loading ? (
                                <div className="loading">Loading...</div>
                            ) : (
                                children &&
                                children.map((child) => (
                                    <WorkSpaceTree
                                        key={child.path}
                                        node={child}
                                        defaultExpanded={false}
                                        toggleMenu={this.props.toggleMenu}
                                        closePopUp={this.props.closePopUp}
                                        reOpenMenu={this.props.reOpenMenu}
                                        openPopUp={this.props.openPopUp}
                                        activeIndex={this.props.activeIndex}
                                        addToReadySet={this.props.addToReadySet}
                                        addToReadySetWS={this.props.addToReadySetWS}
                                        addToReadySetMCT={this.props.addToReadySetMCT}
                                        addToReadySetVT={this.props.addToReadySetVT}
                                        newProject={this.props.newProject}
                                        SET_ALLFILEDATA={this.props.SET_ALLFILEDATA}
                                        AllFileData={this.props.AllFileData}
                                        METERCT_OPEN_FILE={this.props.METERCT_OPEN_FILE}
                                        SET_NEW_METERCT_PATH={this.props.SET_NEW_METERCT_PATH}
                                        SET_NEW_VT_PATH={this.props.SET_NEW_VT_PATH}
                                        VT_OPEN_FILE={this.props.VT_OPEN_FILE}
                                        reloadParent={this.reloadChildren}
                                    />
                                ))
                            )}
                        </div>
                    </CSSTransition>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    AllFileData: state.example.AllFileData
});

const mapDispatchToProps = (dispatch) => ({
    VT_OPEN_FILE: (d) => dispatch({ type: 'VT_OPEN_FILE', data: d }),
    SET_NEW_VT_PATH: (data) => dispatch({ type: 'SET_NEW_VT_PATH', data: data }),
    METERCT_OPEN_FILE: (d) => dispatch({ type: 'METERCT_OPEN_FILE', data: d }),
    newProject: d => dispatch({ type: 'SETUP_NEW_PROJECT', data: d }),
    SET_ALLFILEDATA: d => dispatch({ type: 'SET_ALLFILEDATA', data: d }),

    toggleMenu: () => dispatch({ type: "TOGGLE_MENU" }),
    openPopUp: (title, message) => dispatch({ type: "OPEN_POPUP", Title: title, Message: message }),
    updateProjectState: (p) => dispatch({ type: "UPDATE_ALL_PAGES", Project: p }),
    closePopUp: () => dispatch({ type: "CLOSE_POPUP" }),
    reOpenMenu: (d) => dispatch({ type: "REOPEN_MENU", newData: d }),
    addToReadySet: (data) => dispatch({ type: "ADD_TO_READY_SET", data: data }),
    addToReadySetWS: (data) => dispatch({ type: "ADD_NEW_WORKSPACE", data: data }),
    addToReadySetMCT: (data) => dispatch({ type: "ADD_NEW_METER_CT", data: data }),
    addToReadySetVT: (data) => dispatch({ type: "ADD_NEW_VT", data: data }),
    activeIndex: (index) => dispatch({ type: "SET_ACTIVE_INDEX", ActiveIndex: index }),
    SET_NEW_METERCT_PATH: path => dispatch({ type: "SET_NEW_METERCT_PATH", data: path }),
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkSpaceTree);
