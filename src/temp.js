// WorkSpaceTree:
OpenProject = () => {
    const filePath = this.props.node.path;
    const fileName = this.props.node.name;

    fetch(AURL + "ReadFile/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: filePath }),
    })
        .then((response) => {
            if (!response.ok) throw new Error("Error reading file");
            return response.json();
        })
        .then((data) => {
            const content = data.Content;

            if (fileName.includes(".IRCT")) {
                // Existing IRCT logic
                if (content) {
                    const ProjectData = JSON.parse(content).ProjectData;
                    this.props.addToReadySet(ProjectData);
                } else {
                    this.props.addToReadySet(ProjectData);
                }
            } else if (fileName.includes(".IRM")) {
                // IRM-specific behavior
                ("IRM file content:", content);
                if (content && content.trim() !== '') {
                    this.props.SET_NEW_METERCT_PATH(filePath)
                    this.props.METERCT_OPEN_FILE(JSON.parse(content));
                } else {
                    this.props.SET_NEW_METERCT_PATH(filePath)
                    this.props.METERCT_OPEN_FILE(''); // Handle empty .IRM file
                }
            } else if (fileName.includes(".IRVT")) {
                // IRVT-specific behavior
                ("IRVT file content:", content);
                if (content && content.trim() !== '') {

                    this.props.SET_NEW_VT_PATH(filePath)
                    this.props.VT_OPEN_FILE(JSON.parse(content))

                } else {
                    this.props.SET_NEW_VT_PATH(filePath)
                    this.props.VT_OPEN_FILE('')

                }
            }
        })
        .catch((error) => {
            console.error("Error in OpenProject:", error);
            // For IRCT, fallback to creating a new project if file cannot be read
            if (fileName.includes(".IRCT")) {
                this.props.newProject({
                    FirstPage: { Project: this.props.node.name.replace(/.IRCT/, "") },
                    SecondPage: null,
                    ThirdPage: null,
                    FourthPage: null,
                    activeStep: 0,
                });
            }
        });
};
