
// calculates distance between tow points
function calculateDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1; 
    return Math.sqrt(dx ** 2 + dy ** 2);
}