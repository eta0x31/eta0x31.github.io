
// draw a line from pointA to pointB
function drawLine(context, pointA, pointB, color = 'black') {
    
    // draw the line
    context.beginPath();
    context.moveTo(pointA.x, pointA.y);
    context.lineTo(pointB.x, pointB.y);
    context.strokeStyle = color;
    context.lineWidth = 1;
    context.stroke();

    // calculate the length of the line
    const dx     = pointB.x - pointA.x;
    const dy     = pointB.y - pointA.y;
    const length = Math.sqrt(dx ** 2 + dy ** 2) / inputDefinitions.simulationScaleBy;

    // calculate the middle position of the text
    const midX = (pointA.x + pointB.x) / 2;
    const midY = (pointA.y + pointB.y) / 2;

    // calculate the angel of the line
    const angle = Math.atan2(dy, dx);

    // draw the text
    context.save();
    context.translate(midX, midY);
    context.rotate(angle);
    context.fillStyle    = color;
    context.textAlign    = 'center';
    context.textBaseline = 'bottom';
    context.font         = '12px Arial';
    context.fillText(length.toFixed(2), 0, -2);
    context.restore(); 
}