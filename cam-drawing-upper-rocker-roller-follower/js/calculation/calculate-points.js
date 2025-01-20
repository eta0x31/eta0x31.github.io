
// calculate all the points for the drawing
function calculatePoints(inputDefinitions) {

    // 90 degree lift start position (half of the valve lift)
    const valveLiftStart = {
        x : inputDefinitions.centerPoint.x - inputDefinitions.rockerLengthLeft,
        y : inputDefinitions.centerPoint.y - inputDefinitions.valveHalfOpenLift
    }

    // current valve lift position while ignoring the arc error (linear lift profile)
    const valveLiftEnd = {
        x : inputDefinitions.centerPoint.x - inputDefinitions.rockerLengthLeft,
        y : inputDefinitions.centerPoint.y + (inputDefinitions.valveLift - inputDefinitions.valveHalfOpenLift)
    }

    // calculate the valve triangle
    const valveRockerTriangle = calculateValveRockerTriangle(
        inputDefinitions.valveLift - inputDefinitions.valveHalfOpenLift,
        inputDefinitions.rockerLengthLeft
    );

    // end position of the valve rocker
    const valveRocker = {
        x : inputDefinitions.centerPoint.x - valveRockerTriangle.sideC,
        y : inputDefinitions.centerPoint.y + (inputDefinitions.valveLift - inputDefinitions.valveHalfOpenLift)
    }

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

    // calculate the contact point from the follower and the cam
    const camFollowContact = calculateCamContactPosition(
        camRocker.x,
        camRocker.y,
        inputDefinitions.camRotationPoint.x,
        inputDefinitions.camRotationPoint.y,
        inputDefinitions.followRadius
    );

    return {
        valveLiftStart  : valveLiftStart,
        valveLiftEnd    : valveLiftEnd,
        valveRocker     : valveRocker,
        camRocker       : camRocker,
        camFollowContact: camFollowContact,
    }
}