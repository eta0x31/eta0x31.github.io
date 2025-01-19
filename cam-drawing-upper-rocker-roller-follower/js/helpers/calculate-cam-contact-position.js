
// calculates the cam contact position with the follower
function calculateCamContactPosition(xB, yB, xC, yC, distance) {

    // vector from point B to C
    const dx = xC - xB;
    const dy = yC - yB;

    // calculate the vector length
    const vectorLength = Math.sqrt(dx ** 2 + dy ** 2);

    // normalized vector (unit vector)
    const unitVectorX = dx / vectorLength;
    const unitVectorY = dy / vectorLength;

    // calculate the contact point
    const xP = xB + distance * unitVectorX;
    const yP = yB + distance * unitVectorY;

    return { 
        x: xP, 
        y: yP 
    };
}