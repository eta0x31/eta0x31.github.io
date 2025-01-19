
// global animation settings
let animationInterval = null;
let animationDegree   = 0;

// start the animation
function startAnimation() {

    // calculate the animation speed
    const speed = 100 * inputDefinitions.resolutionDegree;

    // set the animation interval
    animationInterval = setInterval(
        () => {

            // when the animation is running hide the loading modal
            $('#loadingModal').modal('hide');

            // set the input definitions animation degree 
            inputDefinitions.camRotationDegree = animationDegree;
            
            // draw the new animation image
            draw();
            
            // increase the cam rotation
            animationDegree += inputDefinitions.resolutionDegree;
            animationDegree  = Math.round(animationDegree * 10) / 10;
            if(animationDegree >= 360)animationDegree = 0;
        },
        speed
    );
}

// stop the animation
function stopAnimation() {

    // when the animation interval is not set aboard
    if(animationInterval === null)return;

    // clear the animation interval
    clearInterval(animationInterval);
    animationInterval = null;
    animationDegree   = 0;
}