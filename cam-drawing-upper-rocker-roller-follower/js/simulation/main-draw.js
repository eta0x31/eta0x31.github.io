
// main draw function
function draw() {

    // get the canvas context
    const canvas = document.getElementById('canvas');
    const ctx    = canvas.getContext('2d');

    // clear the canvas and reset transformations
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // apply zoom and pan transformations
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);

    // calculate the elevation index
    const elevationIndex = Math.round((inputDefinitions.camRotationDegree / inputDefinitions.resolutionDegree) * 10) / 10;

    // calculate the valve lift
    inputDefinitions.valveLift = inputDefinitions.elevationList[ elevationIndex ] * inputDefinitions.simulationScaleBy;

    // calculate all points for this drawing
    const calculatedPoints = calculatePoints(inputDefinitions);

    // best candidate to make contact with the cam follower
    const camFollowContact = {
        degree  : 0,
        distance: Infinity,
        point   : {
            x: 0,
            y: 0,
        }
    };

    // loop over every degree
    for(let i = 0;i < inputDefinitions.elevationList.length;i++){

        // calculate the rotation degree
        const rotationDegree = Math.round(i * inputDefinitions.resolutionDegree * 10) / 10;

        // calculate the new profile point
        const newPoint = {
            x : inputDefinitions.camRotationPoint.x + ((inputDefinitions.calculatedCamProfile[ rotationDegree ].lift + inputDefinitions.followRadius) * Math.sin( ((360-rotationDegree) * Math.PI / 180) + (inputDefinitions.camRotationDegree * Math.PI / 180) + (inputDefinitions.calculatedCamProfile[ rotationDegree ].arcCompensation * Math.PI / 180) )),
            y : inputDefinitions.camRotationPoint.y + ((inputDefinitions.calculatedCamProfile[ rotationDegree ].lift + inputDefinitions.followRadius) * Math.cos( ((360-rotationDegree) * Math.PI / 180) + (inputDefinitions.camRotationDegree * Math.PI / 180) + (inputDefinitions.calculatedCamProfile[ rotationDegree ].arcCompensation * Math.PI / 180) )),
        }

        // draw the new profile point
        drawPoint(ctx, newPoint, 'blue');

        // take the current cam lift from the calculated cam profile
        const newCamLift = inputDefinitions.calculatedCamProfile[ rotationDegree ].camLift;

        // when the value was not calculated skip this degree
        if(newCamLift === undefined)continue;

        // calculate the new cam point
        const newCamPoint = {
            x : inputDefinitions.camRotationPoint.x + (newCamLift * Math.cos( (rotationDegree * Math.PI / 180) - (inputDefinitions.camRotationDegree * Math.PI / 180) - (inputDefinitions.calculatedCamProfile[ rotationDegree ].arcCompensation * Math.PI / 180) + (90 * Math.PI / 180) )),
            y : inputDefinitions.camRotationPoint.y + (newCamLift * Math.sin( (rotationDegree * Math.PI / 180) - (inputDefinitions.camRotationDegree * Math.PI / 180) - (inputDefinitions.calculatedCamProfile[ rotationDegree ].arcCompensation * Math.PI / 180) + (90 * Math.PI / 180) )),
        }
        
        // calculate the distance from the new cam point to the cam rocker
        const camFollowContactDistance = calculateDistance(
            newCamPoint.x,
            newCamPoint.y,
            calculatedPoints.camRocker.x,
            calculatedPoints.camRocker.y
        );

        // the smallest distance has contact with the follower save this as the best candidate
        if(camFollowContact.distance >= camFollowContactDistance){
            camFollowContact.degree   = rotationDegree;
            camFollowContact.distance = camFollowContactDistance;
            camFollowContact.point    = newCamPoint;
        }

        // draw the new cam point
        drawPoint(ctx, newCamPoint, 'orange');
    }

    // show error distance from the camRocker to the helperPoint
    drawLine(
        ctx,
        inputDefinitions.calculatedCamProfile[ inputDefinitions.camRotationDegree ].helperPoint,
        calculatedPoints.camRocker,
        'red'
    );

    // show helperPoint radius
    drawLine(
        ctx,
        inputDefinitions.calculatedCamProfile[ inputDefinitions.camRotationDegree ].contactPoint,
        inputDefinitions.calculatedCamProfile[ inputDefinitions.camRotationDegree ].helperPoint,
        'red'
    );

    // show helperPoint as the "cutting" circle
    drawCircle(
        ctx,
        inputDefinitions.calculatedCamProfile[ inputDefinitions.camRotationDegree ].helperPoint,
        inputDefinitions.followRadius,
        'red'
    );

    // show distance between the camRotationPoint amd the contactPoint
    drawLine(
        ctx,
        inputDefinitions.camRotationPoint,
        inputDefinitions.calculatedCamProfile[ inputDefinitions.camRotationDegree ].contactPoint,
        'red'
    );

    // show distance between the calculation contactPoint and the camRocker
    drawLine(
        ctx,
        inputDefinitions.calculatedCamProfile[ inputDefinitions.camRotationDegree ].contactPoint,
        calculatedPoints.camRocker,
        'red'
    );

    // show distance between the camRotationPoint and the real camFollowContact
    drawLine(
        ctx,
        inputDefinitions.camRotationPoint,
        camFollowContact.point,
        'black'
    );

    // show the cam follower radius
    drawLine(
        ctx,
        camFollowContact.point,
        calculatedPoints.camRocker,
        'black'
    );

    // show distance between the calculated contactPoint and the real cam contactPoint
    drawLine(
        ctx,
        inputDefinitions.calculatedCamProfile[ inputDefinitions.camRotationDegree ].contactPoint,
        camFollowContact.point,
        'red'
    );

    // show the cam follower
    drawCircle(
        ctx,
        calculatedPoints.camRocker,
        inputDefinitions.followRadius,
        'black'
    );

    // draw line for the linear valve lift
    drawLine(
        ctx,
        calculatedPoints.valveLiftEnd,
        calculatedPoints.valveLiftStart,
        'blue'
    );

    // draw line for the valve lift arc error
    drawLine(
        ctx,
        calculatedPoints.valveLiftEnd,
        calculatedPoints.valveRocker,
        'red'
    );

    // draw line for the valve rocker
    drawLine(
        ctx,
        calculatedPoints.valveRocker,
        inputDefinitions.centerPoint,
        'black'
    );

    // draw line for the cam rocker
    drawLine(
        ctx,
        inputDefinitions.centerPoint,
        calculatedPoints.camRocker,
        'black'
    );

    // when the rocker hypotenuse is enabled show it
    if(inputDefinitions.rockerHypotenuseEnabled === true){
        drawLine(
            ctx,
            calculatedPoints.valveRocker,
            calculatedPoints.camRocker,
            'black'
        );
    }

    // draw line for the cam hypotenuse
    drawLine(
        ctx,
        inputDefinitions.centerPoint,
        inputDefinitions.camRotationPoint,
        'black'
    );

    // draw all points
    drawPoint(ctx, inputDefinitions.calculatedCamProfile[ inputDefinitions.camRotationDegree ].helperPoint , 'red');
    drawPoint(ctx, inputDefinitions.calculatedCamProfile[ inputDefinitions.camRotationDegree ].contactPoint, 'red');

    drawPoint(ctx, camFollowContact.point           , 'black');
    drawPoint(ctx, inputDefinitions.centerPoint     , 'black');
    drawPoint(ctx, inputDefinitions.camRotationPoint, 'black');
    drawPoint(ctx, calculatedPoints.valveLiftStart  , 'blue' );
    drawPoint(ctx, calculatedPoints.valveLiftEnd    , 'red'  );
    drawPoint(ctx, calculatedPoints.valveRocker     , 'red'  );
    drawPoint(ctx, calculatedPoints.camRocker       , 'black');
}