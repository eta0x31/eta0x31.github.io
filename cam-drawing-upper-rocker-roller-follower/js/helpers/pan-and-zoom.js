let zoom      = 1;      // zoom level
let panX      = 0;      // pan offset for X-axis
let panY      = 0;      // pan offset for Y-axis
let isPanning = false;
let startX    = 0;
let startY    = 0;

// handle the zoom event
function handleZoom(event) {

    // prevent site zooming
    event.preventDefault();

    const scaleFactor = 1.1;

    // get the mouse position
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    // calculate zoom direction
    const zoomIn  = event.deltaY < 0;
    const newZoom = zoomIn ? zoom * scaleFactor : zoom / scaleFactor;

    // adjust pan to keep zoom centered around mouse position
    panX += (mouseX - panX) * (1 - newZoom / zoom);
    panY += (mouseY - panY) * (1 - newZoom / zoom);
    zoom  = newZoom;

    // redraw the simulation
    draw();
}

// handle the start of an pan event mouse down
function startPan(event) {
    isPanning = true;
    startX    = event.clientX;
    startY    = event.clientY;
}

// handle the end of an pan event mouse up
function endPan() {
    isPanning = false;
}

// handel the mouse drag event of the pan
function pan(event) {

    // when the mouse is up ignore the pan
    if(!isPanning)return;

    // calculate pan delta 
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    // save start position
    startX = event.clientX;
    startY = event.clientY;

    // apply pan translation
    panX += deltaX;
    panY += deltaY;

    // redraw the simulation
    draw();
}