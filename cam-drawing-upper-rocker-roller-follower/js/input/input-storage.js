
// load the program state from local storage
function loadProgramState(){
    try {

        // load the program state from local storage
        inputDefinitions.name                    =            localStorage.getItem('name');
        inputDefinitions.elevationList           = JSON.parse(localStorage.getItem('elevation-elevation-list'            ));
        inputDefinitions.mirrorElevationList     = JSON.parse(localStorage.getItem('elevation-mirror-elevation-list'     ));
        inputDefinitions.valveMaxLift            = JSON.parse(localStorage.getItem('elevation-max-lift'                  ));
        inputDefinitions.valveHalfOpenLift       = JSON.parse(localStorage.getItem('elevation-valve-half-open-lift'      ));
        inputDefinitions.valveHalfOpenDegree     = JSON.parse(localStorage.getItem('elevation-valve-half-open-degree'    ));
        inputDefinitions.resolutionDegree        = JSON.parse(localStorage.getItem('elevation-resolution-degree'         ));
        inputDefinitions.amountOfDefinedPoints   = JSON.parse(localStorage.getItem('elevation-amount-of-points'          ));
        inputDefinitions.amountOfElevationPoints = JSON.parse(localStorage.getItem('elevation-amount-of-elevation-points'));
        inputDefinitions.amountOfZeroPoints      = JSON.parse(localStorage.getItem('elevation-amount-of-zero-points'     ));

        inputDefinitions.rockerLengthLeft        = JSON.parse(localStorage.getItem('rocker-length-left'       ));
        inputDefinitions.rockerLengthRight       = JSON.parse(localStorage.getItem('rocker-length-right'      ));
        inputDefinitions.rockerLengthHypotenuse  = JSON.parse(localStorage.getItem('rocker-length-hypotenuse' ));
        inputDefinitions.rockerHypotenuseEnabled = JSON.parse(localStorage.getItem('rocker-hypotenuse-enabled'));
        inputDefinitions.followRadius            = JSON.parse(localStorage.getItem('follow-radius'            ));
        inputDefinitions.camBaseRadius           = JSON.parse(localStorage.getItem('cam-base-radius'          ));
        inputDefinitions.camHypotenuse           = JSON.parse(localStorage.getItem('cam-hypotenuse'           ));

        // when one inputDefinitionValue is not defined load the default
        for(const inputDefinitionValue of Object.values(inputDefinitions)){
            if(inputDefinitionValue === undefined || inputDefinitionValue === null){
                throw Error();
            }
        }
    } catch (error) {
        
        console.warn('Invalid program state in local storage! Load default example data!');

        // when there is an error while loading from local storage load the exampleData
        loadProgramStateFromSaveFile(exampleData[0]);
    }
}

// load the program state from a save file object
function loadProgramStateFromSaveFile(saveFileObject){

    // elevation profile values to inputDefinitions
    inputDefinitions.name                    = saveFileObject.name;
    inputDefinitions.elevationList           = saveFileObject.elevationList;
    inputDefinitions.mirrorElevationList     = saveFileObject.mirrorElevationList;
    inputDefinitions.valveMaxLift            = saveFileObject.valveMaxLift;
    inputDefinitions.valveHalfOpenLift       = saveFileObject.valveHalfOpenLift;
    inputDefinitions.valveHalfOpenDegree     = saveFileObject.valveHalfOpenDegree;
    inputDefinitions.resolutionDegree        = saveFileObject.resolutionDegree;
    inputDefinitions.amountOfDefinedPoints   = saveFileObject.amountOfDefinedPoints;
    inputDefinitions.amountOfElevationPoints = saveFileObject.amountOfElevationPoints;
    inputDefinitions.amountOfZeroPoints      = saveFileObject.amountOfZeroPoints;

    // geometry profile values to inputDefinitions
    inputDefinitions.rockerLengthLeft        = saveFileObject.rockerLengthLeft;
    inputDefinitions.rockerLengthRight       = saveFileObject.rockerLengthRight;
    inputDefinitions.rockerLengthHypotenuse  = saveFileObject.rockerLengthHypotenuse;
    inputDefinitions.rockerHypotenuseEnabled = saveFileObject.rockerHypotenuseEnabled;
    inputDefinitions.followRadius            = saveFileObject.followRadius;
    inputDefinitions.camBaseRadius           = saveFileObject.camBaseRadius;
    inputDefinitions.camHypotenuse           = saveFileObject.camHypotenuse;

    // save the elevation profile to local storage
    localStorage.setItem('name'                                ,                saveFileObject.name                    );
    localStorage.setItem('elevation-elevation-list'            , JSON.stringify(saveFileObject.elevationList          ));
    localStorage.setItem('elevation-mirror-elevation-list'     , JSON.stringify(saveFileObject.mirrorElevationList    ));
    localStorage.setItem('elevation-max-lift'                  , JSON.stringify(saveFileObject.valveMaxLift           ));
    localStorage.setItem('elevation-valve-half-open-lift'      , JSON.stringify(saveFileObject.valveHalfOpenLift      ));
    localStorage.setItem('elevation-valve-half-open-degree'    , JSON.stringify(saveFileObject.valveHalfOpenDegree    ));
    localStorage.setItem('elevation-resolution-degree'         , JSON.stringify(saveFileObject.resolutionDegree       ));
    localStorage.setItem('elevation-amount-of-points'          , JSON.stringify(saveFileObject.amountOfDefinedPoints  ));
    localStorage.setItem('elevation-amount-of-elevation-points', JSON.stringify(saveFileObject.amountOfElevationPoints));
    localStorage.setItem('elevation-amount-of-zero-points'     , JSON.stringify(saveFileObject.amountOfZeroPoints     ));

    // save the geometry profile to local storage
    localStorage.setItem('rocker-length-left'       , JSON.stringify(saveFileObject.rockerLengthLeft ));
    localStorage.setItem('rocker-length-right'      , JSON.stringify(saveFileObject.rockerLengthRight));
    localStorage.setItem('rocker-length-hypotenuse' , JSON.stringify(saveFileObject.rockerLengthHypotenuse ));
    localStorage.setItem('rocker-hypotenuse-enabled', JSON.stringify(saveFileObject.rockerHypotenuseEnabled));
    localStorage.setItem('follow-radius'            , JSON.stringify(saveFileObject.followRadius     ));
    localStorage.setItem('cam-base-radius'          , JSON.stringify(saveFileObject.camBaseRadius    ));
    localStorage.setItem('cam-hypotenuse'           , JSON.stringify(saveFileObject.camHypotenuse    ));
}

// save the elevation profile to local storage
function saveElevationProfile(elevationProfile) {
    localStorage.setItem('name'                                ,                elevationProfile.profileName             );
    localStorage.setItem('elevation-elevation-list'            , JSON.stringify(elevationProfile.elevationList          ));
    localStorage.setItem('elevation-max-lift'                  , JSON.stringify(elevationProfile.maxLift                ));
    localStorage.setItem('elevation-valve-half-open-lift'      , JSON.stringify(elevationProfile.valveHalfOpenLift      ));
    localStorage.setItem('elevation-valve-half-open-degree'    , JSON.stringify(elevationProfile.valveHalfOpenDegree    ));
    localStorage.setItem('elevation-resolution-degree'         , JSON.stringify(elevationProfile.profileResolutionDegree));
    localStorage.setItem('elevation-amount-of-points'          , JSON.stringify(elevationProfile.amountOfDefinedPoints  ));
    localStorage.setItem('elevation-amount-of-elevation-points', JSON.stringify(elevationProfile.amountOfElevationPoints));
    localStorage.setItem('elevation-amount-of-zero-points'     , JSON.stringify(elevationProfile.amountOfZeroPoints     ));
}

// save the geometry profile to local storage
function saveGeometryProfile(geometryProfile) {
    localStorage.setItem('elevation-mirror-elevation-list', JSON.stringify(geometryProfile.mirrorElevationList    ));
    localStorage.setItem('rocker-length-left'             , JSON.stringify(geometryProfile.rockerLengthLeft       ));
    localStorage.setItem('rocker-length-right'            , JSON.stringify(geometryProfile.rockerLengthRight      ));
    localStorage.setItem('rocker-length-hypotenuse'       , JSON.stringify(geometryProfile.rockerLengthHypotenuse ));
    localStorage.setItem('rocker-hypotenuse-enabled'      , JSON.stringify(geometryProfile.rockerHypotenuseEnabled));
    localStorage.setItem('follow-radius'                  , JSON.stringify(geometryProfile.followRadius           ));
    localStorage.setItem('cam-base-radius'                , JSON.stringify(geometryProfile.camBaseRadius          ));
    localStorage.setItem('cam-hypotenuse'                 , JSON.stringify(geometryProfile.camHypotenuse          ));
}