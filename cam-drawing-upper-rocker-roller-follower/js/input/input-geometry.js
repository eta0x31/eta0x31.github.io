
async function applyGeometry() {

    // read and parse the rocker geometry
    const rockerGeometry = {
        rockerLengthLeft : parseFloat( document.getElementById('rocker-length-left-input' ).value.replace(',','.') ) || 0,
        rockerLengthRight: parseFloat( document.getElementById('rocker-length-right-input').value.replace(',','.') ) || 0,
        followRadius     : parseFloat( document.getElementById('follow-radius-input'      ).value.replace(',','.') ) || 0,
        camBaseRadius    : parseFloat( document.getElementById('cam-base-radius-input'    ).value.replace(',','.') ) || 0,
        camHypotenuse    : parseFloat( document.getElementById('cam-hypotenuse-input'     ).value.replace(',','.') ) || 0,
    }

    // write the parsed values back to the UI
    document.getElementById('rocker-length-left-input' ).value = rockerGeometry.rockerLengthLeft;
    document.getElementById('rocker-length-right-input').value = rockerGeometry.rockerLengthRight;
    document.getElementById('follow-radius-input'      ).value = rockerGeometry.followRadius;
    document.getElementById('cam-base-radius-input'    ).value = rockerGeometry.camBaseRadius;
    document.getElementById('cam-hypotenuse-input'     ).value = rockerGeometry.camHypotenuse;

    // before we update the inputDefinitions stop the animation
    stopAnimation();

    // save the new rocker geometry to local storage
    saveGeometryProfile(rockerGeometry);

    // apply the new values to the simulation
    inputDefinitions.rockerLengthLeft  = rockerGeometry.rockerLengthLeft  * inputDefinitions.simulationScaleBy;
    inputDefinitions.rockerLengthRight = rockerGeometry.rockerLengthRight * inputDefinitions.simulationScaleBy;
    inputDefinitions.followRadius      = rockerGeometry.followRadius      * inputDefinitions.simulationScaleBy;
    inputDefinitions.camBaseRadius     = rockerGeometry.camBaseRadius     * inputDefinitions.simulationScaleBy;
    inputDefinitions.camHypotenuse     = rockerGeometry.camHypotenuse     * inputDefinitions.simulationScaleBy;

    // calculate the cam profile
    await calculateCamProfile();

    // prepare the export
    initExport();

    // update the UI
    // updateUi();

    // draw the simulation
    startAnimation();
}