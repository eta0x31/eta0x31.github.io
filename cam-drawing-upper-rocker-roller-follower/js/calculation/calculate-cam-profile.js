// import the calculate cam profile worker
const calculateCamProfileWorker = new Worker('./js/calculation/calculate-cam-profile-worker.js');

// calculate the cam profile
async function calculateCamProfile() {

    // only open the loading modal when we need to calculate more then 360 points
    if(inputDefinitions.amountOfDefinedPoints > 360){
        $('#loadingModal').modal('show');
    }
    
    // wait for the result message from the worker
    await new Promise((resolver) => {

        // handel the messages from the worker
        calculateCamProfileWorker.onmessage = (event) => {

            // parse the worker message
            const { type, data } = event.data;

            // when this is a progress message update the loading modal
            if(type === 'progress'){
                $('#progressBar').css('width',`${data.percent}%`).attr('aria-valuenow', data.percent);
                document.getElementById('progressText').innerHTML = `Calculated positions: <b>${data.currentStep}</b><br>Total positions: <b>${data.maxSteps}<b>`;
            }
            
            // when the worker response with the result update the inputDefinitions and close the loading modal
            if(type === 'result'){
                inputDefinitions = data;
                $('#loadingModal').modal('hide');
                resolver();
            }
        };
        
        // start the worker
        calculateCamProfileWorker.postMessage(
            {
                inputDefinitions: inputDefinitions
            }
        );
    });
}