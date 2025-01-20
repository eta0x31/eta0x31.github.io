
// calculates the valve triangle sideA is the rockerLengthLeft and sideB is valveLift 
function calculateValveRockerTriangle(sideA, sideB) {
    
    // use always 90 degree for angleB
    const angleBDegrees = 90;
    const angleBRadians = Math.PI / 2;

    // calculate angleA
    const angleARadians = Math.asin(sideA / sideB);
    const angleADegrees = (angleARadians * 180) / Math.PI;

    // calculate angleC
    const angleCDegrees = angleBDegrees - angleADegrees;
    const angleCRadians = (angleCDegrees * Math.PI) / 180;

    // calculate sideC
    const sideC = sideB * Math.sin(angleCRadians);

    return {
        angleA: {
            radians: angleARadians,
            degrees: angleADegrees,
        },
        angleB: {
            radians: angleBRadians,
            degrees: angleBDegrees,
        },
        angleC: {
            radians: angleCRadians,
            degrees: angleCDegrees,
        },
        sideA: sideA,
        sideB: sideB,
        sideC: sideC,
    };
}