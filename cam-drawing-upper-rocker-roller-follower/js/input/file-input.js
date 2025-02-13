
// setup the file input element
function initFileInput() {

    // get the drag and drop area
    const dragDropArea = document.getElementById('dragDropArea');

    // prevent default behavior for drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dragDropArea.addEventListener(eventName, (e) => e.preventDefault());
        dragDropArea.addEventListener(eventName, (e) => e.stopPropagation());
    });

    // highlight the drop area when a file is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dragDropArea.addEventListener(eventName, () => dragDropArea.classList.add('drag-over'));
    });

    // remove highlight when file is dragged out
    ['dragleave', 'drop'].forEach(eventName => {
        dragDropArea.addEventListener(eventName, () => dragDropArea.classList.remove('drag-over'));
    });

    // handle file drop
    dragDropArea.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'text/plain') {
                parseElevationProfileFile(file);
            } else {
                alert('Only plain text (.txt) files are allowed!');
            }
        }
    });

    // allow click to upload
    dragDropArea.addEventListener('click', () => {

        // get the file input element and configure it
        let fileInput               = document.createElement('input');
            fileInput.type          = 'file';
            fileInput.accept        = '.txt';
            fileInput.style.display = 'none';

        // add the change event listener to the file input element
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type === 'text/plain') {
                parseElevationProfileFile(file);
            } else {
                alert('Only plain text (.txt) files are allowed!');
            }
        });

        // emulate the on click
        fileInput.click();
    });
}