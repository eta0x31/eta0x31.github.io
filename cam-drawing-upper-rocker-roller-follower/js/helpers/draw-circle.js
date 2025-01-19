
// draw a circle
function drawCircle(context,point,radius,color='black') {
    context.beginPath();    
    context.arc(point.x, point.y, radius, 0, 2 * Math.PI);
    context.strokeStyle = color;
    context.lineWidth   = 1;
    context.stroke();
}