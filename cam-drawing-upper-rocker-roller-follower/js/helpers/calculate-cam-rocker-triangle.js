
// calculates the cam rocker triangle
function calculateCamRockerTriangle(angleA, sideB) {
    
    // calculate angleA
    const angleADegrees = angleA;
    const angleARadians = (angleA * Math.PI) / 180;

    // use always 90 degree for angleB
    const angleBDegrees = 90;
    const angleBRadians = Math.PI / 2;

    // calculate angleC
    const angleCDegrees = 180 - angleADegrees - angleBDegrees;
    const angleCRadians = (angleCDegrees * Math.PI) / 180;

    // calculate sideA and sideC
    const sideA = (sideB * Math.sin(angleARadians)) / Math.sin(angleBRadians);
    const sideC = (sideB * Math.sin(angleCRadians)) / Math.sin(angleBRadians);

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