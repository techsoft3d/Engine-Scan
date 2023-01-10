modelUIDs =  [
        "cea950a5-cdea-43e9-850c-0cd85c8e8d42", //01-2_block_v
        "e2fd6c82-ae3d-4af4-89ad-f426a5427567" //EnginePoints 
]

async function startViewer(modelName) {
        const conversionServiceURI = "https://csapi.techsoft3d.com";

        var viewer;

        let res = await fetch(conversionServiceURI + '/api/streamingSession');
        var data = await res.json();

        await fetch(conversionServiceURI + '/api/enableStreamAccess/' + data.sessionid, { method: 'put', headers: { 'items': JSON.stringify(modelUIDs) } });

        viewer = new Communicator.WebViewer({
                containerId: "viewerContainer",
                endpointUri: 'wss://' + data.serverurl + ":" + data.port + '?token=' + data.sessionid,
                model: modelName,
                boundingPreviewMode: "none",
                enginePath: "https://cdn.jsdelivr.net/gh/techsoft3d/hoops-web-viewer@latest",
                rendererType: 0
        });

        viewer.start();

        return viewer;

}
