
// TODO: Temp input definitions build UI for it!
let inputDefinitions = {

    // static settings & calculated values
    simulationScaleBy   : 10,
    calculatedCamProfile: {},
    camRotationDegree   : 0,
    valveLift           : 0,
    centerPoint         : {
        x: null,
        y: null,
    },
    camRotationPoint : {
        x: null,
        y: null,
    },

    // elevation profile values
    name                   : '',
    elevationList          : [],
    valveMaxLift           : 0,
    valveHalfOpenLift      : 0,
    valveHalfOpenDegree    : 0,
    resolutionDegree       : 0,
    amountOfDefinedPoints  : 0,
    amountOfElevationPoints: 0,
    amountOfZeroPoints     : 0,
    
    // geometry profile values
    rockerLengthLeft : 0,
    rockerLengthRight: 0,
    followRadius     : 0,
    camBaseRadius    : 0,
    camHypotenuse    : 0,
};

// TODO: Add check for:
// camHypotenuse min = rockerLengthRight - (followRadius + camBaseRadius)
// camHypotenuse max = rockerLengthRight + followRadius + camBaseRadius

// when the page is loaded setup the canvas 
window.onload = function () {
    loadProgramState();
    initFileInput();
    setupCanvas();
    updateUi();
}

// setup the canvas element
async function setupCanvas() {

    // get the context
    const canvas = document.getElementById('canvas');
    const ctx    = canvas.getContext('2d');

    // get canvas width and height based on the container and device pixel ratio
    const devicePixelRatio = window.devicePixelRatio || 1;
    const containerWidth   = canvas.offsetWidth;
    const containerHeight  = containerWidth * 0.75;

    // set the canvas width and height
    canvas.width        = containerWidth;
    canvas.height       = containerHeight;
    canvas.style.height = containerHeight + 'px';

    // scale to ensure sharpness
    ctx.scale(devicePixelRatio, devicePixelRatio);

    // add event listeners for zooming and panning
    canvas.addEventListener('wheel'    , handleZoom);
    canvas.addEventListener('mousedown', startPan);
    canvas.addEventListener('mousemove', pan);
    canvas.addEventListener('mouseup'  , endPan);
    canvas.addEventListener('mouseout' , endPan);

    // apply the simulation scale to all inputs
    inputDefinitions.valveHalfOpenLift = inputDefinitions.valveHalfOpenLift * inputDefinitions.simulationScaleBy;
    inputDefinitions.valveLift         = inputDefinitions.valveLift         * inputDefinitions.simulationScaleBy;
    inputDefinitions.rockerLengthLeft  = inputDefinitions.rockerLengthLeft  * inputDefinitions.simulationScaleBy;
    inputDefinitions.rockerLengthRight = inputDefinitions.rockerLengthRight * inputDefinitions.simulationScaleBy;
    inputDefinitions.followRadius      = inputDefinitions.followRadius      * inputDefinitions.simulationScaleBy;
    inputDefinitions.camBaseRadius     = inputDefinitions.camBaseRadius     * inputDefinitions.simulationScaleBy;
    inputDefinitions.camHypotenuse     = inputDefinitions.camHypotenuse     * inputDefinitions.simulationScaleBy;

    // calculate the center start point
    inputDefinitions.centerPoint.x = (containerWidth  / 2);
    inputDefinitions.centerPoint.y = (containerHeight / 2) - 250;

    // calculate the cam profile
    await calculateCamProfile();

    // prepare the export
    initExport();

    // draw the simulation
    startAnimation();
}