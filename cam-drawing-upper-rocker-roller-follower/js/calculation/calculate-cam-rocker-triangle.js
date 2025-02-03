
// calculates the cam rocker triangle
function calculateCamRockerTriangle(xA, yA, xB, yB, a, b) {

    // calculate the missing length an angel
    const c       = calculateDistance(xA, yA, xB, yB);
    const angleAB = Math.atan2(yB - yA, xB - xA);

    // flag for invalid input
    let forceDisabled = false;

    // check if the input is valid
    if (c > a + b || c < Math.abs(a - b)) {
        forceDisabled = true;
    }

    // when the rocker hypotenuse is disabled or the input is not valid calculate a state line
    if(inputDefinitions.rockerHypotenuseEnabled === false || forceDisabled === true){
        return {
            x: xB + a * Math.cos(angleAB),
            y: yB + a * Math.sin(angleAB),
        };
    }

    // when the rocker hypotenuse enabled calculate the triangle
    if(inputDefinitions.rockerHypotenuseEnabled === true){
        const angleB = Math.acos((a ** 2 + c ** 2 - b ** 2) / (2 * a * c));
        return {
            x: xB + a * Math.cos((180 * Math.PI / 180) + angleAB + angleB),
            y: yB + a * Math.sin((180 * Math.PI / 180) + angleAB + angleB),
        };
    }
}