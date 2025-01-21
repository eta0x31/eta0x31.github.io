const makerjs    = require('makerjs');
const dxfDrawing = require('Drawing');

// init the output vars
let camPointsCsv      = [];
let camPointsArr      = [];
let camPointsXy       = [];
let camModelLinDxf    = { paths : {} };
let camModelLinSvg    = { paths : {} };
let camModelSplineDxf = null;

function initExport() {

    // resets the output vars
    camPointsCsv      = [];
    camPointsArr      = [];
    camPointsXy       = [];
    camModelLinDxf    = { paths : {} };
    camModelLinSvg    = { paths : {} };
    camModelSplineDxf = null;

    // get the selected export cam rotation
    const selectedRotation = parseInt( document.querySelector('input[name="rotationRadio"]:checked').value );

    // loop over every degree
    for(let i = 0;i < inputDefinitions.elevationList.length;i++){

        // calculate the rotation degree
        const rotationDegree = Math.round(i * inputDefinitions.resolutionDegree * 10) / 10;
        
        // take the current cam lift from the calculated cam profile
        const newCamLift = inputDefinitions.calculatedCamProfile[ rotationDegree ].camLift;

        // when the value was not calculated skip this degree
        if(newCamLift === undefined)continue;

        // calculate the global cam arc compensation
        const globalArcCompensation = (inputDefinitions.calculatedCamProfile[ 0 ].arcCompensation - 180) - selectedRotation;

        // calculate the new cam point
        const newCamPoint = {
            x : newCamLift * Math.sin( (globalArcCompensation * Math.PI / 180) + (rotationDegree * Math.PI / 180) - (inputDefinitions.calculatedCamProfile[ rotationDegree ].arcCompensation * Math.PI / 180)),
            y : newCamLift * Math.cos( (globalArcCompensation * Math.PI / 180) + (rotationDegree * Math.PI / 180) - (inputDefinitions.calculatedCamProfile[ rotationDegree ].arcCompensation * Math.PI / 180)),
        }

        // add the new cam point to the csv profile
        camPointsCsv.push(`${newCamPoint.x / inputDefinitions.simulationScaleBy},${newCamPoint.y / inputDefinitions.simulationScaleBy},0`);

        // add the new cam point as an array to the new cam points camPointsArr
        camPointsArr.push(
            [
                newCamPoint.x / inputDefinitions.simulationScaleBy,
                newCamPoint.y / inputDefinitions.simulationScaleBy,
            ]
        );

        // add the new cam point to the new cam points XY list
        camPointsXy.push(newCamPoint);
    }
    
    // close the cam forms
    camPointsCsv.push(camPointsCsv[0]);
    camPointsArr.push(camPointsArr[0]);
    camPointsXy .push(camPointsXy [0]);

    // create the linear interpolated cam profile for the dxf and the svg
    for(let i = 1; i < camPointsArr.length; i += 1){

        // start and end point of the line
        const start = camPointsArr[i - 1];
        const end   = camPointsArr[i    ];

        // draw line to connect the start and end point
        camModelLinDxf.paths[`path_${i}`] = new makerjs.paths.Line(start, end);
        camModelLinSvg.paths[`path_${i}`] = new makerjs.paths.Line(start, end);
    }

    // create the cam model as a single spline
    camModelSplineDxf = new dxfDrawing();
    camModelSplineDxf.drawSpline( camPointsArr );

    // add the preview SVG cam profile drawing
    const camProfileSvgElement     = document.getElementById('camProfileSvg');
    camProfileSvgElement.innerHTML = exportLinSvg();

    // get the svg element and the svg content
    const svgElement = document.querySelector('#camProfileSvg svg');
    const svgContent = svgElement.querySelector('g');

    // remove the width and height that was added by makerjs
    svgElement.removeAttribute('width');
    svgElement.removeAttribute('height');

    // set the width and height to a dynamic value
    svgElement.style.width     = '100%';
    svgElement.style.height    = 'auto';
    svgElement.style.maxHeight = '500px';

    // preserve the aspect ratio
    svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    // calculate the new bounding box with more space
    const boundingBox = svgContent.getBBox();
    const newViewBox  = `${boundingBox.x - 1} ${boundingBox.y - 1} ${boundingBox.width + 2} ${boundingBox.height + 2}`;
    
    // apply the new bounding box
    svgElement.setAttribute('viewBox', newViewBox);

    // create the file blobs for the download
    const csvBlob       = new Blob([exportCsv()      ], {type: 'application/csv'});
    const dxfSplineBlob = new Blob([exportSplineDxf()], {type: 'application/dxf'});
    const svgLinBlob    = new Blob([exportLinSvg()   ], {type: 'application/svg'});
    const dxfLinBlob    = new Blob([exportLinDxf()   ], {type: 'application/dxf'});

    // add the file blobs to the download buttons
    document.getElementById('csvDownload'      ).href = URL.createObjectURL(csvBlob      );
    document.getElementById('dxfSplineDownload').href = URL.createObjectURL(dxfSplineBlob);
    document.getElementById('svgLinDownload'   ).href = URL.createObjectURL(svgLinBlob   );
    document.getElementById('dxfLinDownload'   ).href = URL.createObjectURL(dxfLinBlob   );
    



    // const test = toCatmullRom( camPointsXy , 1);

    // const camProfileSvgElement = document.getElementById('camProfileSvg');

    // camProfileSvgElement.innerHTML = `<svg width="50%" xmlns="http://www.w3.org/2000/svg"><g><path d="${test}" id="dynamicPath"/></g></svg>`;
    
    // const pathElement = document.getElementById('dynamicPath');

    // if(pathElement) {
    //     const bbox = pathElement.getBBox();
    //     const viewBox = `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`;
    //     const svgElement = camProfileSvgElement.querySelector('svg');
    //     svgElement.setAttribute('viewBox', viewBox);
    //     svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    // }
}

// export the cam model as CSV
function exportCsv() {
    return camPointsCsv.join('\n');
}

// export the cam model as DXF
function exportLinDxf() {
    return makerjs.exporter.toDXF(camModelLinDxf);
}

// export the cam model as DXF
function exportLinSvg() {
    return makerjs.exporter.toSVG(camModelLinSvg);
}

// export the cam model as DXF
function exportSplineDxf() {
    return camModelSplineDxf.toDxfString();
}