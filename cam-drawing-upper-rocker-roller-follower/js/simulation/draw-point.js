
// draw a point
function drawPoint(context,point,color='black') {
    context.beginPath();    
    context.arc(point.x, point.y, 3, 0, 2 * Math.PI);
    context.fillStyle   = color;
    context.strokeStyle = color;
    context.fill();
}