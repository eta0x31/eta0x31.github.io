
// parses the elevation profile file
function parseElevationProfileFile(file) {

    // store the parsed data
    const parsedData = {
        profileName            : '',
        elevationList          : [],
        maxLift                : 0,
        valveHalfOpenLift      : 0,
        valveHalfOpenDegree    : 0,
        profileResolutionDegree: 0,
        amountOfDefinedPoints  : 0,
        amountOfElevationPoints: 0,
        amountOfZeroPoints     : 0,
    }

    // use the file name as profile name
    parsedData.profileName = file.name.replace('.txt', '');

    // create a file reader and start reading the file
    const reader = new FileReader();
    reader.readAsText(file);

    // when the file is ready handel the read
    reader.onload = async (event) => {

        // convert from text to number list and remove all zero elevations
        const elevationProfileText        = event.target.result;
        const elevationProfileTextArray   = elevationProfileText.split('\n');
        const elevationProfileNumberArray = elevationProfileTextArray
            .map   (elevationText => parseFloat(elevationText.replace(',', '.')) || 0)
            .filter(elevation     => elevation !== 0);
        
        // get the selected resolution
        const selectedResolution = parseInt( document.querySelector('input[name="resolutionRadio"]:checked').value );

        // check if the file fits in the selected resolution
        if(elevationProfileNumberArray.length > selectedResolution){
            alert(`Your selected resolution dose not match your file!\n With your selected resolution you only should have at max ${selectedResolution} points.\n But your file has ${elevationProfileNumberArray.length} points.`);
            return;
        }

        // set the profile resolution degree and amount of points
        parsedData.profileResolutionDegree = 360 / selectedResolution;
        parsedData.amountOfDefinedPoints   = selectedResolution;
        parsedData.amountOfElevationPoints = elevationProfileNumberArray.length;
        parsedData.amountOfZeroPoints      = selectedResolution - elevationProfileNumberArray.length;

        // calculate the amount of zeros before the elevation and after
        const amountOfZerosBefore = Math.floor(parsedData.amountOfZeroPoints / 2);
        const amountOfZerosAfter  = Math.ceil (parsedData.amountOfZeroPoints / 2);

        // add the zeros to the beginning
        for(const _ of Array(amountOfZerosBefore)){
            elevationProfileNumberArray.unshift(0);
        }

        // add the zeros to the end
        for(const _ of Array(amountOfZerosAfter)){
            elevationProfileNumberArray.push(0);
        }

        // find the max valve lift and add the elevationList
        parsedData.maxLift       = Math.max(...elevationProfileNumberArray);
        parsedData.elevationList = elevationProfileNumberArray;

        // calculate the half list
        const calculatedHalfLift = parsedData.maxLift / 2;

        // save the best half lift candidate
        const bestHalfLiftCandidate = {
            lift  : 0,
            degree: 0,
        }

        // try to find the best half lift candidate in the first half of the profile
        for(let i = 0;i < elevationProfileNumberArray.length / 2;i++){

            // calculate the delta or the diff to the calculated half lift
            const newDeltaToHalfLift  = Math.abs( calculatedHalfLift - elevationProfileNumberArray[i] );
            const bestDeltaToHalfLift = Math.abs( calculatedHalfLift - bestHalfLiftCandidate.lift     );

            // when this candidate is closer take this one
            if(newDeltaToHalfLift < bestDeltaToHalfLift){
                bestHalfLiftCandidate.lift   = elevationProfileNumberArray[i];
                bestHalfLiftCandidate.degree = i;
            }
        }

        // add the best candidate to the parsedData
        parsedData.valveHalfOpenLift   = bestHalfLiftCandidate.lift;
        parsedData.valveHalfOpenDegree = bestHalfLiftCandidate.degree * parsedData.profileResolutionDegree;

        // save the elevation profile to local storage
        saveElevationProfile(parsedData);

        // before we update the inputDefinitions stop the animation
        stopAnimation();

        // update the input definitions
        inputDefinitions.name                    = parsedData.profileName;
        inputDefinitions.elevationList           = parsedData.elevationList;
        inputDefinitions.valveMaxLift            = parsedData.maxLift;
        inputDefinitions.valveHalfOpenLift       = parsedData.valveHalfOpenLift;
        inputDefinitions.valveHalfOpenDegree     = parsedData.valveHalfOpenDegree;
        inputDefinitions.resolutionDegree        = parsedData.profileResolutionDegree;
        inputDefinitions.amountOfDefinedPoints   = parsedData.amountOfDefinedPoints;
        inputDefinitions.amountOfElevationPoints = parsedData.amountOfElevationPoints;
        inputDefinitions.amountOfZeroPoints      = parsedData.amountOfZeroPoints;

        // calculate the cam profile
        await calculateCamProfile();

        // prepare the export
        initExport();

        // update the UI
        updateUi();

        // draw the simulation
        startAnimation();
    };
}