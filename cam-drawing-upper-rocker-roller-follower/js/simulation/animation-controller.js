
// global animation settings
let animationInterval  = null;
let animationDegree    = 0;
let animationClockwise = false;
let animationRunning   = false;

// start the animation
function startAnimation() {

    // set the animation to the running state
    animationRunning = true;

    // get the simulation slider element
    const simulationSlider = document.getElementById('simulation-slider');

    // set the step size and the max value
    simulationSlider.step = inputDefinitions.resolutionDegree;
    simulationSlider.max  = 360 - inputDefinitions.resolutionDegree;

    // calculate the animation speed
    const speed = 100 * inputDefinitions.resolutionDegree;

    // set the animation interval
    animationInterval = setInterval(
        () => {

            // when the animation is running hide the loading modal
            $('#loadingModal').modal('hide');

            // set the input definitions animation degree 
            inputDefinitions.camRotationDegree = animationDegree;
            simulationSlider.value             = animationDegree;
            
            // draw the new animation image
            draw();
            
            // increase the cam rotation for anticlockwise rotation
            if(animationClockwise === false){
                animationDegree += inputDefinitions.resolutionDegree;
                animationDegree  = Math.round(animationDegree * 10) / 10;
                if(animationDegree >= 360)animationDegree = 0;
            }

            // decrease the cam rotation for clockwise rotation
            if(animationClockwise === true){
                animationDegree -= inputDefinitions.resolutionDegree;
                animationDegree  = Math.round(animationDegree * 10) / 10;
                if(animationDegree <= 0)animationDegree = 360 - inputDefinitions.resolutionDegree;
            }

            // get the current valve elevation
            const valveElevation = Math.round(inputDefinitions.elevationList[Math.round(animationDegree / inputDefinitions.resolutionDegree)] * 100) / 100;

            // update the simulation text
            document.getElementById('simulationDegreeText'        ).innerHTML = `Degree: ${animationDegree}°`;
            document.getElementById('simulationValveElevationText').innerHTML = `Valve elevation: ${valveElevation}mm`;
        },
        speed
    );

    // add an event listener when the range / slider is changed by the user
    simulationSlider.addEventListener('input', (value) => {

        // parse the animation degree from the slider
        animationDegree = parseFloat( value.target.value );

        // set the input definitions animation degree 
        inputDefinitions.camRotationDegree = animationDegree;
        simulationSlider.value             = animationDegree;

        // get the current valve elevation
        const valveElevation = Math.round(inputDefinitions.elevationList[Math.round(animationDegree / inputDefinitions.resolutionDegree)] * 100) / 100;

        // update the simulation text
        document.getElementById('simulationDegreeText'        ).innerHTML = `Degree: ${animationDegree}°`;
        document.getElementById('simulationValveElevationText').innerHTML = `Valve elevation: ${valveElevation}mm`;
        
        // draw the new animation image
        draw();
    });
}

// stop the animation
function stopAnimation() {

    // set the animation state to the stop state
    animationRunning = false;

    // when the animation interval is not set aboard
    if(animationInterval === null)return;

    // clear the animation interval
    clearInterval(animationInterval);
    animationInterval = null;
    animationDegree   = 0;
}

// for the UI events that are controlling the animation
function onAnimationControl() {

    // get the selected animation direction
    const animationDirection = parseInt( document.querySelector('input[name="directionRadio"]:checked').value );

    // change to clockwise direction
    if(animationClockwise === false && animationDirection !== 0){
        animationClockwise = true;
    }

    // change to anticlockwise direction
    if(animationClockwise === true && animationDirection !== 1){
        animationClockwise = false;
    }

    // get the simulation control manuel or animated
    const animationControl = document.getElementById('manualCheckbox').checked;

    // on animation manuel
    if(animationControl === true && animationRunning === true){

        // stop the animation
        if(animationInterval !== null)clearInterval(animationInterval);
        animationRunning  = false;
        animationInterval = null;

        // enable the slider
        document.getElementById('simulation-slider').disabled = false;
    }

    // on animation automatic
    if(animationControl === false && animationRunning === false){
        startAnimation();
        document.getElementById('simulation-slider').disabled = true;
    }
}