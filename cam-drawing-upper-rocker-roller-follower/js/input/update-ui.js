
// update or refresh the UI with the program state
function updateUi() {

    // update valve elevation profile UI
    document.getElementById('profile-input-name'                      ).innerHTML = inputDefinitions.name;
    document.getElementById('profile-input-max-elevation'             ).innerHTML = inputDefinitions.valveMaxLift        + 'mm';
    document.getElementById('profile-input-half-open-elevation'       ).innerHTML = inputDefinitions.valveHalfOpenLift   + 'mm';
    document.getElementById('profile-input-half-open-degree'          ).innerHTML = inputDefinitions.valveHalfOpenDegree + '°';
    document.getElementById('profile-input-resolution-degree'         ).innerHTML = inputDefinitions.resolutionDegree    + '°';
    document.getElementById('profile-input-amount-of-points'          ).innerHTML = inputDefinitions.amountOfDefinedPoints;
    document.getElementById('profile-input-amount-of-elevation-points').innerHTML = inputDefinitions.amountOfElevationPoints;
    document.getElementById('profile-input-amount-of-zero-points'     ).innerHTML = inputDefinitions.amountOfZeroPoints;

    // update rocker geometry profile UI
    document.getElementById('rocker-length-left-input' ).value = Math.round((inputDefinitions.rockerLengthLeft  / inputDefinitions.simulationScaleBy) * 100) / 100;
    document.getElementById('rocker-length-right-input').value = Math.round((inputDefinitions.rockerLengthRight / inputDefinitions.simulationScaleBy) * 100) / 100;
    document.getElementById('follow-radius-input'      ).value = Math.round((inputDefinitions.followRadius      / inputDefinitions.simulationScaleBy) * 100) / 100;
    document.getElementById('cam-base-radius-input'    ).value = Math.round((inputDefinitions.camBaseRadius     / inputDefinitions.simulationScaleBy) * 100) / 100;
    document.getElementById('cam-hypotenuse-input'     ).value = Math.round((inputDefinitions.camHypotenuse     / inputDefinitions.simulationScaleBy) * 100) / 100;
}