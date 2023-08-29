modelUIDs =  [
        "cea950a5-cdea-43e9-850c-0cd85c8e8d42", //01-2_block_v
        "e2fd6c82-ae3d-4af4-89ad-f426a5427567" //EnginePoints 
]

async function startViewer(modelName) {
        const conversionServiceURI = "https://csapi.techsoft3d.com";

        var viewer;

        let res = await fetch(conversionServiceURI + '/api/streamingSession');
        var data = await res.json();
        var endpointUriBeginning = 'ws://';

        if(conversionServiceURI.substring(0, 5).includes("https")){
                endpointUriBeginning = 'wss://'
        }

        await fetch(conversionServiceURI + '/api/enableStreamAccess/' + data.sessionid, { method: 'put', headers: { 'items': JSON.stringify(modelUIDs) } });

        viewer = new Communicator.WebViewer({
                containerId: "viewerContainer",
                endpointUri: endpointUriBeginning + data.serverurl + ":" + data.port + '?token=' + data.sessionid,
                model: modelName,
                boundingPreviewMode: "none",
                enginePath: "https://cdn.jsdelivr.net/gh/techsoft3d/hoops-web-viewer",
                rendererType: 0
        });

        viewer.start();

        return viewer;

}

async function fetchVersionNumber() {
        const conversionServiceURI = "https://csapi.techsoft3d.com";

        let res = await fetch(conversionServiceURI + '/api/hcVersion');
        var data = await res.json();
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