const makerjs = require('makerjs');

// init the output vars
let camPointsCsv   = [];
let camPointsDxf   = [];
let camPointsSvg   = [];
let camModelLinDxf = { paths : {} };
let camModelLinSvg = { paths : {} };

function initExport() {

    // resets the output vars
    camPointsCsv  = [];
    camPointsDxf   = [];
    camPointsSvg   = [];
    camModelLinDxf = { paths : {} };
    camModelLinSvg = { paths : {} };

    // loop over every degree
    for(let i = 0;i < inputDefinitions.elevationList.length;i++){

        // calculate the rotation degree
        const rotationDegree = Math.round(i * inputDefinitions.resolutionDegree * 10) / 10;
        
        // take the current cam lift from the calculated cam profile
        const newCamLift = inputDefinitions.calculatedCamProfile[ rotationDegree ].camLift;

        // when the value was not calculated skip this degree
        if(newCamLift === undefined)continue;

        // calculate the new cam point
        const newCamPoint = {
            x : newCamLift * Math.cos( (rotationDegree * Math.PI / 180) - (inputDefinitions.calculatedCamProfile[ rotationDegree ].arcCompensation * Math.PI / 180) ),
            y : newCamLift * Math.sin( (rotationDegree * Math.PI / 180) - (inputDefinitions.calculatedCamProfile[ rotationDegree ].arcCompensation * Math.PI / 180) ),
        }

        // add the new cam point to the csv profile
        camPointsCsv.push(`${Math.round(newCamPoint.x * 100) / 10000},${Math.round(newCamPoint.y * 100) / 10000},0`);

        // add the new cam point to the cam points dxf
        camPointsDxf.push(
            [
                Math.round(newCamPoint.x * 100) / 1000,
                Math.round(newCamPoint.y * 100) / 1000,
            ]
        );

        // add the new cam point to the cam points svg
        camPointsSvg.push(
            [
                Math.round(newCamPoint.y * 100) / 100,
                Math.round(newCamPoint.x * 100) / 100,
            ]
        );
    }
    
    // close the cam forms
    camPointsCsv.push(camPointsCsv[0]);
    camPointsDxf.push(camPointsDxf[0]);
    camPointsSvg.push(camPointsSvg[0]);

    // create the linear interpolated cam profile for the dxf
    for(let i = 1; i < camPointsDxf.length; i += 1){

        // start and end point of the line
        const start = camPointsDxf[i - 1];
        const end   = camPointsDxf[i    ];

        // draw line to connect the start and end point
        camModelLinDxf.paths[`path_${i}`] = new makerjs.paths.Line(start, end);
    }

    // create the linear interpolated cam profile for the svg
    for(let i = 1; i < camPointsSvg.length; i += 1){

        // start and end point of the line
        const start = camPointsSvg[i - 1];
        const end   = camPointsSvg[i    ];

        // draw line to connect the start and end point
        camModelLinSvg.paths[`path_${i}`] = new makerjs.paths.Line(start, end);
    }

    // add the preview SVG cam profile drawing
    const camProfileSvgElement     = document.getElementById('camProfileSvg');
    camProfileSvgElement.innerHTML = exportSvg();

    // create the file blobs for the download
    const csvBlob = new Blob([exportCsv()], {type: 'application/csv'});
    const svgBlob = new Blob([exportSvg()], {type: 'application/svg'});
    const dxfBlob = new Blob([exportDxf()], {type: 'application/dxf'});

    // add the file blobs to the download buttons
    document.getElementById('csvDownload').href = URL.createObjectURL(csvBlob);
    document.getElementById('dxfDownload').href = URL.createObjectURL(dxfBlob);
    document.getElementById('svgDownload').href = URL.createObjectURL(svgBlob);
}

// export the cam model as CSV
function exportCsv() {
    return camPointsCsv.join('\n');
}

// export the cam model as DXF
function exportDxf() {
    return makerjs.exporter.toDXF(camModelLinDxf);
}

// export the cam model as DXF
function exportSvg() {
    return makerjs.exporter.toSVG(camModelLinSvg);
}