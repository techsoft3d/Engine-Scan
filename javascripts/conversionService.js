modelUIDs =  [
        "35ba38aa-4453-41ec-958b-5fcdbdf6434b", //01-2_block_v
        "ac8bb390-651a-4658-aff3-10d045542f90" //EnginePoints 
]

async function startViewer(modelName) {
        var viewer;
        let sessioninfo = await caasClient.getStreamingSession();
        await caasClient.enableStreamAccess(sessioninfo.sessionid, modelUIDs);
        
        viewer = new Communicator.WebViewer({
                containerId: "viewerContainer",
                endpointUri: sessioninfo.endpointUri,
                model: modelName,
                boundingPreviewMode: "none",
                enginePath: `https://cdn.jsdelivr.net/gh/techsoft3d/hoops-web-viewer@20${versionNumer}`,
                rendererType: 0
        });

        viewer.start();

        return viewer;

}

async function fetchVersionNumber() {
        let data = await caasClient.getHCVersion();
        versionNumer = data;        
        return data
}



async function initializeViewer() {
        document.querySelector('.toolbar-tools').innerHTML += `
                    <div id="tool_separator_5" class="tool-separator"></div>
                    <div id="toggle-scan-button" title="Toggle Point Cloud Visibility" data-operatorclass="toolbar-toggle-scan" class="hoops-tool">
                        <div class="tool-icon"></div>
                    </div>
                    <div id="toggle-solid-button" title="Toggle Solid Visibility" data-operatorclass="toolbar-toggle-solid" class="hoops-tool active-tool">
                        <div class="tool-icon"></div>
                    </div>   
                `;
       
        hwv = await startViewer("01-2_block_v")
    
        const uiConfig = {
          containerId: "content",
          screenConfiguration: Sample.screenConfiguration,
        }
        ui = new Communicator.Ui.Desktop.DesktopUi(hwv, uiConfig);
    
    
        ui._toolbar._actionsNullary.set('toolbar-toggle-scan', toggleScan);
        ui._toolbar._actionsNullary.set('toolbar-toggle-solid', toggleSolid);
    
        window.onresize = function () { hwv.resizeCanvas(); };
}