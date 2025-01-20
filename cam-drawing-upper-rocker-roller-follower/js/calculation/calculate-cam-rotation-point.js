
// calculate the cam rotation point
function calculateCamRotationPoint(inputDefinitions) {

    // calculate the valve triangle
    const valveRockerTriangle = calculateValveRockerTriangle(
        inputDefinitions.valveHalfOpenLift * (-1),
        inputDefinitions.rockerLengthLeft
    );

    // calculate the cam rocker triangle
    const camRockerTriangle = calculateCamRockerTriangle(
        valveRockerTriangle.angleA.degrees,
        inputDefinitions.rockerLengthRight
    );

    // end position of the cam rocker
    const camRocker = {
        x : inputDefinitions.centerPoint.x + camRockerTriangle.sideC,
        y : inputDefinitions.centerPoint.y - camRockerTriangle.sideA
    }

    // calculate the missing point B from the triangle
    const trianglePointC = calculateTrianglePointC(
        inputDefinitions.centerPoint.x,
        inputDefinitions.centerPoint.y,
        camRocker.x,
        camRocker.y,
        inputDefinitions.followRadius + inputDefinitions.camBaseRadius,
        inputDefinitions.camHypotenuse,
    );

    // update the input definition
    inputDefinitions.camRotationPoint = {
        x : trianglePointC.C1.x,
        y : trianglePointC.C1.y
    }
}

// calculate the pointB from a triangle
function calculateTrianglePointC(xA, yA, xB, yB, b, c) {

    // calculate the delta
    const dx = xB - xA;
    const dy = yB - yA;
    const a  = Math.sqrt(dx ** 2 + dy ** 2);

    // project C to AB and calculate the hight
    const d = (a ** 2 + c ** 2 - b ** 2) / (2 * a);
    const h = Math.sqrt(c ** 2 - d ** 2);

    // project to point P
    const px = xA + (d / a) * dx;
    const py = yA + (d / a) * dy;

    // normalize the vector
    const normX = -dy / a;
    const normY = dx / a;

    // solve for the tow positions of C
    const c1X = px + h * normX;
    const c1Y = py + h * normY;
    const c2X = px - h * normX;
    const c2Y = py - h * normY;

    return {
        C1: { x: c1X, y: c1Y },
        C2: { x: c2X, y: c2Y },
    };
}