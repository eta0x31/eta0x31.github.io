
importScripts('calculate-cam-contact-position.js');
importScripts('calculate-cam-rocker-triangle.js');
importScripts('calculate-cam-rotation-point.js');
importScripts('calculate-points.js');
importScripts('calculate-valve-triangle.js');
importScripts('calculates-distance.js');

let inputDefinitions = {};

self.onmessage = async (event) => {

    // copy to global scope
    inputDefinitions = event.data.inputDefinitions;

    // copy the elevation list from the input to a working var
    const workingElevationList = [...inputDefinitions.elevationList];
    
    // reverse the list when the mirroring is enabled
    if(inputDefinitions.mirrorElevationList === true){
        workingElevationList.reverse();
    }

    async function calculateCamProfile(inputDefinitions) {

        let maxProcess     = workingElevationList.length;
        let currentProcess = 0;

        // store the cam profile
        const camProfile = {}

        // calculate the cam rotation point
        calculateCamRotationPoint(inputDefinitions);

        // loop over every lift point
        for(let i = 0;i < workingElevationList.length;i++){

            // calculate the degree and the corresponding valve elevation
            const degree    = Math.round(i * inputDefinitions.resolutionDegree * 10) / 10;
            const elevation = workingElevationList[i];

            // copy by value to save the global inputDefinitions
            const privateInputDefinitions = {...inputDefinitions};

            // update the private inputDefinitions
            privateInputDefinitions.valveLift = elevation * inputDefinitions.simulationScaleBy;

            // calculate all points for the simulation
            const calculatedPoints = calculatePoints(privateInputDefinitions);

            // calculate the necessary cam lift profile
            const camLift = calculateDistance(
                inputDefinitions.camRotationPoint.x,
                inputDefinitions.camRotationPoint.y,
                calculatedPoints.camFollowContact.x,
                calculatedPoints.camFollowContact.y,
            );

            // calculate the arc compensation distance SideA
            const arcCompensationSideA = calculateDistance(
                inputDefinitions.camRotationPoint.x,
                inputDefinitions.camRotationPoint.y + camLift,
                calculatedPoints.camFollowContact.x,
                calculatedPoints.camFollowContact.y,
            );

            // check if the arc compensation needs to be positive or negative
            let   arcCompensationDirection = 1;
            const arcCompensationDeltaX    = calculatedPoints.camFollowContact.x - inputDefinitions.camRotationPoint.x;
            if(arcCompensationDeltaX < 0)arcCompensationDirection = -1;

            // calculate the arc compensation
            const arcCompensationRad = Math.acos(((camLift ** 2) + (camLift ** 2) - (arcCompensationSideA ** 2)) / (2 * camLift * camLift));
            const arcCompensationDeg = arcCompensationRad * (180 / Math.PI) * arcCompensationDirection;

            // save the cam lift profile
            camProfile[degree] = {
                lift           : camLift,
                arcCompensation: arcCompensationDeg,
            };
        }

        // loop over every calculated degree
        for(let i = 0;i < workingElevationList.length;i++){

            // calculate the degree and the corresponding valve elevation
            const indexDegree = Math.round(i * inputDefinitions.resolutionDegree * 10) / 10;

            // best candidate
            const camContactPoint = {
                contactSideC: 0,
                camLift     : 0,
                contactPoint: {
                    x : 0,
                    y : 0,
                },
                helperPoint: {
                    x : 0,
                    y : 0,
                }
            }

            // loop over every calculated cam profile via key value
            for(const [degree, value] of Object.entries(camProfile)){

                // copy by value to save the global inputDefinitions
                const privateInputDefinitions = {...inputDefinitions};

                // update the private inputDefinitions
                privateInputDefinitions.valveLift = workingElevationList[i] * inputDefinitions.simulationScaleBy;

                // calculate all points for the simulation
                const calculatedPoints = calculatePoints(privateInputDefinitions);

                // calculate the new cam profile point
                const newPoint = {
                    x : inputDefinitions.camRotationPoint.x + ((value.lift + inputDefinitions.followRadius) * Math.sin( ((360-degree) * Math.PI / 180) + (indexDegree * Math.PI / 180) + (value.arcCompensation * Math.PI / 180) )),
                    y : inputDefinitions.camRotationPoint.y + ((value.lift + inputDefinitions.followRadius) * Math.cos( ((360-degree) * Math.PI / 180) + (indexDegree * Math.PI / 180) + (value.arcCompensation * Math.PI / 180) )),
                }

                // calculate the side A from the probe triangle
                const probeSideA = calculateDistance(
                    newPoint.x,
                    newPoint.y,
                    calculatedPoints.camRocker.x,
                    calculatedPoints.camRocker.y
                );

                // calculate the side B from the probe triangle
                const probeSideB = calculateDistance(
                    newPoint.x,
                    newPoint.y,
                    calculatedPoints.camFollowContact.x,
                    calculatedPoints.camFollowContact.y
                );

                // calculate the arcs from the probe triangle
                const probeArcBRad = Math.acos(((probeSideA ** 2) + (inputDefinitions.followRadius ** 2) - (probeSideB ** 2)) / (2 * probeSideA * inputDefinitions.followRadius));
                const probeArcBDeg = probeArcBRad * (180 / Math.PI);

                // calculate the arcs from the contact triangle
                const contactArcARad = Math.asin((probeSideA * Math.sin(probeArcBRad)) / inputDefinitions.followRadius);
                const contactArcADeg = contactArcARad * (180 / Math.PI);
                const contactArcCDeg = 180 - probeArcBDeg - contactArcADeg;
                const contactArcCRad = (contactArcCDeg * Math.PI) / 180;

                // calculate the sideC from the contact triangle this is the distance from the camRocker to cam contact
                const contactSideC = (inputDefinitions.followRadius * Math.sin(contactArcCRad)) / Math.sin(probeArcBRad);

                // calculate maximum side from C
                const maxSideC = value.lift + inputDefinitions.followRadius;

                // when the contactSideC is larger and smaller then the maximum side from C take this as best candidate
                if( contactSideC <= maxSideC                     &&
                    contactSideC >  camContactPoint.contactSideC ){

                    // calculate the contact point
                    const deltaX   = inputDefinitions.camRotationPoint.x - calculatedPoints.camRocker.x;
                    const deltaY   = inputDefinitions.camRotationPoint.y - calculatedPoints.camRocker.y;
                    const norm     = Math.sqrt(deltaX ** 2 + deltaY ** 2);
                    const unitX    = deltaX / norm;
                    const unitY    = deltaY / norm;
                    const shiftX   = contactSideC * unitX;
                    const shiftY   = contactSideC * unitY;
                    const contactX = calculatedPoints.camRocker.x + shiftX;
                    const contactY = calculatedPoints.camRocker.y + shiftY;
                    
                    // fill in the values
                    camContactPoint.contactSideC   = contactSideC;
                    camContactPoint.camLift        = (value.lift + contactSideC) - inputDefinitions.followRadius;
                    camContactPoint.contactPoint.x = contactX;
                    camContactPoint.contactPoint.y = contactY;
                    camContactPoint.helperPoint    = newPoint;
                    camContactPoint.camLift        = calculateDistance(
                        inputDefinitions.camRotationPoint.x,
                        inputDefinitions.camRotationPoint.y,
                        contactX,
                        contactY,
                    );
                }
            }

            // fill in the values
            camProfile[indexDegree].contactSideC = camContactPoint.contactSideC;
            camProfile[indexDegree].camLift      = camContactPoint.camLift;
            camProfile[indexDegree].contactPoint = camContactPoint.contactPoint;
            camProfile[indexDegree].helperPoint  = camContactPoint.helperPoint;

            currentProcess++;

            self.postMessage(
                { 
                    type: 'progress', 
                    data: {
                        currentStep: currentProcess,
                        maxSteps   : maxProcess,
                        percent    : Math.floor((currentProcess / maxProcess) * 100),
                    }
                }
            );
        }

        inputDefinitions.calculatedCamProfile = camProfile;

        return inputDefinitions;
    }


    self.postMessage(
        { 
            type: 'result', 
            data: await calculateCamProfile(inputDefinitions)
        }
    );
};