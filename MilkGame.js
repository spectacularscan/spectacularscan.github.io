/**
 * Constructor for the Milk Game.
 * @constructor
 */
function MilkGame() {

    //Cursor changes
    var cursorChangeImage = false;
    var startAnimation1 = false;

    // Update cursor position
    this.oldCursorX = this.cursorX;
    this.oldCursorY = this.cursorY;
    this.cursorX = globalCursorManager.cursorX;
    this.cursorY = globalCursorManager.cursorY;
    this.cursorHasMoved = false;
    this.goingToNextState = false;
    this.nextStateDelay = 0;
    if (this.cursorX != this.oldCursorX && this.cursorY != this.oldCursorY)
        this.cursorHasMoved = true;

    //canvas
    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");
    canvas.style.backgroundImage = "url('" + image_doctorRoomBg.src + " ')";
    canvas.addEventListener('mousedown', checkButtonPressed);

    var bkgXPosition = -600;
    var bkgYPosition = -440;
    var bkgSize = 1600;
	var milkBlinkMask;

    //gulping sound effect
    var gulping = new Audio("Assets/sounds/gulp.mp3");

    //indicates stage of the game
    var stage = 0;

    //Bottle
    var bottleHeight = GAME_ACTUAL_HEIGHT * 0.43;
    var bottleWidth = GAME_ACTUAL_WIDTH * 0.1;
    var bottleXpos = GAME_ACTUAL_WIDTH / 2;
    var bottleYpos = GAME_ACTUAL_HEIGHT / 2;

    //Milk
    var milkHeight = 0;
    var milkWidth = bottleWidth - 4;
    var milkXpos = bottleXpos + 2;
    var milkYpos = bottleYpos + 2 + bottleHeight - 4;

    //Monkey
    var milkCartonCounter = 0;
    var monkeyHeight = 200;
    var monkeyWidth = 200;
    var monkeyXpos = 300;
    var monkeyYpos = 230;
    var monkeyImg = new Image();
    monkeyImg = image_milkGameMonkey1;

    //Milk Bottle
    var milkBottle = new Image();
    milkBottle = image_milkBottle15;
    var milkBottleHeight = 200;
    var milkBottleWidth = 100;
    var milkBottleXPos = 300;
    var milkBottleYPos = 230;

    //Milk Jar 
    var milkJarHeight = 200;
    var milkJarWidth = 200;
    var milkJarXPos = 165;
    var milkJarYPos = 35;
    var milkJar = new Image();
    milkJar = image_milkCarton10;
    var img_Stage1HelperArrowClickMe = image_clickMeArrowHelper;

    //Milk Carton
    var milkCartonHeight = 200;
    var milkCartonWidth = 150;
    var milkCartonXPos = 300;
    var milkCartonYPos = 230;
    var bool_startAnimationForRadioActiveCarton = false;
    var bool_CursorAnimationCrystal = false;
    var counterRAC = 0;
    var img_ArrowHelper = image_quadArrowHelp;


    // Image Arrow Helper = Showing keep on clicking
    var img_ArrowKeepOnClicking = image_arrowHelpClicker;



    this.milkCartonBox = [
        new BoundingBox("radioActiveCarton", 300, 230, 150, 200), // Stage 0
        new BoundingBox("milkCarton", (260), (140), (130), (130)), // Stage 1
        new BoundingBox("milkGivenToMonkey", monkeyXpos, monkeyYpos, monkeyWidth - 30, monkeyHeight) // Stage 2

    ];

    //Radioactive Crystal
    var imgRadioActiveCrystal = new Image();
    imgRadioActiveCrystal = image_RadioActiveCrystal;
    var radioActiveCrystalHeight = 200;
    var radioActiveCrystalWidth = 200;
    var radioActiveCrystalXPos = 0;
    var radioActiveCrystalYPos = 0;

    //Radioactive Carton
    var image_MilkCartonRad = new Image();
    image_MilkCartonRad = image_milkGameCartonRad1;

    //cursor
    var int_GrowCounter = 1;
    var isDecreasing = false;

    //buttons
    var imageOfMilkButton = new Image();
    imageOfMilkButton = image_milkButton;
    var drinkButton = new Button("drink", image_milkdrinkButton, GAME_ACTUAL_WIDTH - 100, GAME_ACTUAL_HEIGHT - 100, 90, 90);
    var cartonButton = new Button("carton", image_cartonButton, GAME_ACTUAL_WIDTH - 100, GAME_ACTUAL_HEIGHT - 200, 90, 90);
    var crystalButton = new Button("crystal", image_crystalButton, GAME_ACTUAL_WIDTH - 100, GAME_ACTUAL_HEIGHT - 300, 90, 90);
    crystalButton.setPulsating(true);
    var milkButton = new Button("milkbutton", image_milkButton, GAME_ACTUAL_WIDTH - 100, GAME_ACTUAL_HEIGHT - 400, 90, 90);
    this.milkyButtons = [milkButton, cartonButton, crystalButton, drinkButton];

    /** 
     * Creates the SideBar 
     */
    this.init = function () {
        this.buttonBar = new SideBar();
        positionButtons(this.milkyButtons, "right", 16, 36);
        for (var i = 0; i < this.milkyButtons.length; ++i)
            this.milkyButtons[i].startFadingIn();
    };

    /** 
     * Updates the canvas 
     */
    this.update = function () {
        if (stage <= 1) {
            canvas.style.backgroundSize = convertSize(bkgSize/MOBILE_MULTIPLIER) + "px";
            canvas.style.backgroundPosition = "" + convertSize(bkgXPosition/MOBILE_MULTIPLIER) + "px " + convertSize(bkgYPosition/MOBILE_MULTIPLIER) + "px";
        } else {
            canvas.style.backgroundSize = "cover";
            canvas.style.backgroundPosition = "0px 0px";
        }

        //update buttons
        for (var i = 0; i < this.milkyButtons.length; ++i)
            this.milkyButtons[i].update();
		
		if (milkBlinkMask)
			milkBlinkMask.update();
    };

    /** 
     * Destroys the current canvas, removes buttons, assets and reverts to initial "empty" canvas 
     */
    this.destroy = function () {
        canvas.style.backgroundImage = "none";
        canvas.style.backgroundSize = "initial";
        canvas.style.backgroundPosition = "initial";
    };

    /** 
     * Draws the Milk Carton on the canvas with sprites 
     */
    function drawMilkCarton() {
        if (counterRAC == 0) {
            image_MilkCartonRad = image_milkGameCartonRad1;
        } else if (counterRAC == 1) {
            image_MilkCartonRad = image_milkGameCartonRad2;
        } else if (counterRAC == 2) {
            image_MilkCartonRad = image_milkGameCartonRad3;
        } else if (counterRAC == 3) {
            image_MilkCartonRad = image_milkGameCartonRad4;
        } else if (counterRAC == 4) {
            image_MilkCartonRad = image_milkGameCartonRad5;
        } else if (counterRAC == 5) {
            image_MilkCartonRad = image_milkGameCartonRad6;
        } else if (counterRAC == 6) {
            image_MilkCartonRad = image_milkGameCartonRad7;
        } else if (counterRAC == 7) {
            image_MilkCartonRad = image_milkGameCartonRad8;
        } else if (counterRAC == 8) {
            image_MilkCartonRad = image_milkGameCartonRad9;
            this.nextStageDelay = 1;
        } else if (counterRAC >= 9) {
            image_MilkCartonRad = image_milkGameCartonRad10;
            if (this.nextStageDelay <= 0) {
                stage++;
                cartonButton.setPulsating(true);
            } else
                this.nextStageDelay -= 0.01;
        }

        drawImageAdjusted(image_MilkCartonRad, milkCartonXPos, milkCartonYPos, milkCartonWidth, milkCartonHeight);

    }

    /** 
     * Draws the Milk Bottle 
     */
    function drawBottle() {

        ctx.beginPath();
        ctx.fillStyle = "gray";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

    }

    /** 
     * Draws the Milk inside the bottle 
     */
    function drawMilk() {

        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

    }

    /** 
     * Checks if the Milk Game objectives has been met 
     */
    function checkEndGame() {
        if (milkYpos <= bottleYpos + 1) {
            drinkButton.setPulsating(false);
            return true;
        }
        return false;
    }

    /**
     *  Draws the Milk Carton with sprites 
     */
    function drawBottleCarton() {
        if (milkCartonCounter == 1) {
            milkJar = image_milkCarton10;
        } else if (milkCartonCounter == 2) {
            milkJar = image_milkCarton9;
        } else if (milkCartonCounter == 3) {
            milkJar = image_milkCarton8;
        } else if (milkCartonCounter == 4) {
            milkJar = image_milkCarton7;
        } else if (milkCartonCounter == 5) {
            milkJar = image_milkCarton6;
        } else if (milkCartonCounter == 6) {
            milkJar = image_milkCarton5;
        } else if (milkCartonCounter == 7) {
            milkJar = image_milkCarton4;
        } else if (milkCartonCounter == 8) {
            milkJar = image_milkCarton3;
        } else if (milkCartonCounter == 9) {
            milkJar = image_milkCarton2;
        } else if (milkCartonCounter == 10) {
            milkJar = image_milkCarton1;
        } else if (milkCartonCounter == 11) {
            milkBottle = image_milkBottle14;
        } else if (milkCartonCounter == 12) {
            milkBottle = image_milkBottle13;
        } else if (milkCartonCounter == 13) {
            milkBottle = image_milkBottle12;
        } else if (milkCartonCounter == 14) {
            milkBottle = image_milkBottle11;
        } else if (milkCartonCounter == 15) {
            milkBottle = image_milkBottle10;
        } else if (milkCartonCounter == 16) {
            milkBottle = image_milkBottle10;
        } else if (milkCartonCounter == 17) {
            milkBottle = image_milkBottle10;
        } else if (milkCartonCounter == 18) {
            milkBottle = image_milkBottle10;
        } else if (milkCartonCounter == 19) {
            milkBottle = image_milkBottle10;
        } else if (milkCartonCounter == 20) {
            milkBottle = image_milkBottle10;
        } else if (milkCartonCounter == 21) {
            milkBottle = image_milkBottle9;
        } else if (milkCartonCounter == 22) {
            milkBottle = image_milkBottle8;
        } else if (milkCartonCounter == 23) {
            milkBottle = image_milkBottle7;
        } else if (milkCartonCounter == 24) {
            milkBottle = image_milkBottle6;
        } else if (milkCartonCounter == 25) {
            milkBottle = image_milkBottle5;
        } else if (milkCartonCounter == 26) {
            milkBottle = image_milkBottle4;
        } else if (milkCartonCounter == 27) {
            milkBottle = image_milkBottle3;
        } else if (milkCartonCounter == 28) {
            milkBottle = image_milkBottle2;
            this.nextStageDelay = 1;
        } else if (milkCartonCounter >= 29) {
            milkBottle = image_milkBottle1;
            milkJar = image_milkCarton10;
            if (this.nextStageDelay <= 0) {
                stage++;
                milkButton.setPulsating(true);
				milkBlinkMask = new BlinkMask(monkeyXpos, monkeyYpos, monkeyWidth - 30, monkeyHeight);
            } else
                this.nextStageDelay -= 0.01;
        }
        if (startAnimation1 === true) {
            drawImageAdjusted(milkJar, milkJarXPos, milkJarYPos, milkJarWidth, milkJarHeight);
        }
        drawImageAdjusted(milkBottle, milkBottleXPos, milkBottleYPos, milkBottleWidth, milkBottleHeight);

    }


    /** 
     * Declares bounding boxes areas used by buttons 
     * @param {string} boundingBoxID - identifier of the bounding box
     */
    this.getBoundingBox = function (boundingBoxID) {
        if (boundingBoxID >= this.milkCartonBox.length || boundingBoxID < 0) {
            return this.milkCartonBox;
        }
    };

    /**
     *  When the canvas is resized, it updates the bounding boxes areas  
     */
    this.updateBoundingBoxesPositionMilkCarton = function () {
        for (var i = 0; i < this.milkCartonBox.length; ++i) {
            var limbs = this.milkCartonBox[i];
            limbs.x = this.x + this.width * limbs.xScaled;
            limbs.y = this.y + this.height * limbs.yScaled;
            limbs.width = this.width * limbs.widthScaled;
            limbs.height = this.height * limbs.heightScaled;
        }
    };

    /**
     * Checks if the MilkCarton is clicked
     * @param {Number} xpos - x position of the carton
     * @param {Number} ypos - y position of the carton
     * @returns {string} - id of the selected array item clicked
     */
    this.collisionDetectionMilkCarton = function (xpos, ypos) {

        var limbClicked = "Invalid";
        var i = 0;
        if (stage === 0) {
            i = 0;
        } else if (stage === 1) {
            i = 1;
        } else if (stage === 2) {
            i = 2;
        }


        var limbs = this.milkCartonBox[i];
        if (xpos >= convertSize(limbs.xScaled) && xpos <= convertSize(limbs.xScaled) + convertSize(limbs.widthScaled) &&
                ypos >= convertSize(limbs.yScaled) && ypos <= convertSize(limbs.yScaled) + convertSize(limbs.heightScaled)) {
            limbClicked = limbs.id;
        }

        return limbClicked;

    };

    /**
     * Specifies the event when the carton is clicked
     * @param {Event} event - on click
     */
    this.onLimbClickHandlerCarton = function (event) {
        var rect = canvas.getBoundingClientRect();
        var result =
                this.collisionDetectionMilkCarton(
                        Math.round((event.clientX - rect.left) / (rect.right - rect.left) * canvas.width),
                        Math.round((event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height)
                        );
        if (result === "milkCarton" && stage === 1) {
            audio_milkPouring.play();
            if (cursorChangeImage === true) {
                cursorChangeImage = false;
                startAnimation1 = true;
                globalCursorManager.setCustomCursor(true, image_arrowCursor, "default", 0, 0, 40, 40);
            }
        } else if (result === "radioActiveCarton" && stage === 0) {
            if (bool_CursorAnimationCrystal) {
                audio_explosion.pause();
                audio_explosion.currentTime = 0;
                audio_explosion.play();
                //console.log("Crystal buttons was pressed");
                bool_startAnimationForRadioActiveCarton = true;
                bool_CursorAnimationCrystal = false;
                globalCursorManager.setCustomCursor(true, image_arrowCursor, "default", 0, 0, 40, 40);

            }
        } else if (result === "milkGivenToMonkey" && stage === 2) {
            stage++;
            globalCursorManager.setCustomCursor(true, image_arrowCursor, "default", 0, 0, 40, 40);
            drinkButton.setPulsating(true);
			// Peepeemovies
        }

    };

    var bindIt = this.onLimbClickHandlerCarton.bind(this);
    canvas.addEventListener('click', bindIt, false);

    /**
     * Draws the monkey
     */
    function drawMonkey() {
        drawImageAdjusted(image_monkey, monkeyXpos, monkeyYpos, monkeyWidth - 30, monkeyHeight);
    }

    /**
     * Draws the monkey holding the bottle
     */
    function drawMonkeyWithBottle() {
        if (milkHeight >= 0 && milkHeight < 5) {
            monkeyImg = image_milkGameMonkey1;
        } else if (milkHeight >= 10 && milkHeight < 20) {
            monkeyImg = image_milkGameMonkey2;
        } else if (milkHeight >= 20 && milkHeight < 30) {
            monkeyImg = image_milkGameMonkey3;
        } else if (milkHeight >= 30 && milkHeight < 40) {
            monkeyImg = image_milkGameMonkey4;
        } else if (milkHeight >= 40 && milkHeight < 50) {
            monkeyImg = image_milkGameMonkey5;
        } else if (milkHeight >= 50 && milkHeight < 60) {
            monkeyImg = image_milkGameMonkey6;
        } else if (milkHeight >= 60 && milkHeight < 70) {
            monkeyImg = image_milkGameMonkey7;
        } else if (milkHeight >= 70 && milkHeight < 80) {
            monkeyImg = image_milkGameMonkey8;
        } else if (milkHeight >= 80 && milkHeight < 90) {
            monkeyImg = image_milkGameMonkey9;
        } else if (milkHeight >= 90 && milkHeight < 100) {
            monkeyImg = image_milkGameMonkey10;
        } else if (milkHeight >= 100 && milkHeight < 110) {
            monkeyImg = image_milkGameMonkey11;
        } else if (milkHeight >= 110 && milkHeight < 120) {
            monkeyImg = image_milkGameMonkey12;
        } else if (milkHeight >= 120 && milkHeight < 130) {
            monkeyImg = image_milkGameMonkey13;
        } else if (milkHeight >= 130 && milkHeight < 140) {
            monkeyImg = image_milkGameMonkey14;
        } else if (milkHeight >= 140 && milkHeight < 150) {
            monkeyImg = image_milkGameMonkey15;
        } else if (milkHeight >= 150 && milkHeight < 160) {
            monkeyImg = image_milkGameMonkey16;
        } else if (milkHeight >= 160 && milkHeight < 170) {
            monkeyImg = image_milkGameMonkey17;
        } else if (milkHeight >= 170 && milkHeight < 180) {
            monkeyImg = image_milkGameMonkey18;
        } else if (milkHeight >= 180 && milkHeight < 190) {
            monkeyImg = image_milkGameMonkey19;
        } else if (milkHeight >= 190) {
            monkeyImg = image_milkGameMonkey20;
        }
        drawImageAdjusted(monkeyImg, monkeyXpos, monkeyYpos, monkeyWidth, monkeyHeight);

    }

    /**
     * Draws the helper arrow
     */
    function growingArrowHelper() {
        if (isDecreasing === false) {
            if (int_GrowCounter === 10) {
                isDecreasing = true;
            }
            int_GrowCounter += 0.125;
        } else {
            if (int_GrowCounter === 0) {
                isDecreasing = false;
            }
            int_GrowCounter -= 0.125;
        }
    }


    /**
     * Draws objects on the canvas
     */
    this.draw = function () {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.updateBoundingBoxesPositionMilkCarton();

        this.buttonBar.draw();

        if (stage === 0) {

            growingArrowHelper();

            if (globalCursorManager.getCurrentCursorID() === "crystal")
                drawImageAdjusted(img_ArrowHelper, 150 - int_GrowCounter / 2, 120 - int_GrowCounter / 2, (440 + int_GrowCounter), (320 + int_GrowCounter));
            drawMilkCarton();
            if (bool_startAnimationForRadioActiveCarton === true) {
                counterRAC += 0.0625;
            }

        } else if (stage === 1) {

            growingArrowHelper();

            if (globalCursorManager.getCurrentCursorID() === "carton")
                drawImageAdjusted(img_Stage1HelperArrowClickMe, 150, 55, 250 + int_GrowCounter, 100 + int_GrowCounter);

            drawBottleCarton();

            ctx.stroke();
            if (startAnimation1 === true) {
                //console.log("Animation 2 starts");
                if (milkCartonCounter <= 29) {
                    milkCartonCounter += 0.25;
                } else {
                    audio_milkPouring.pause();
                }

            }

        } else if (stage === 2) {

            drawMonkey();

            growingArrowHelper();
            if (globalCursorManager.getCurrentCursorID() === "milk")
                drawImageAdjusted(img_Stage1HelperArrowClickMe, 180, 120, 250 + int_GrowCounter, 100 + int_GrowCounter);

        } else if (stage === 3) {
            if (!this.goingToNextState) {
                drawMonkeyWithBottle();
                growingArrowHelper();
                drawImageAdjusted(img_ArrowKeepOnClicking,500,330,125+ int_GrowCounter,75+ int_GrowCounter);
                this.goingToNextState = checkEndGame();
                this.nextStageDelay = 1;
            } else {
                drawMonkey();
                if (this.nextStageDelay <= 0) {
                    audio_drinkingWithStraw.pause();
                    goToNextState(true);
                    stage++;
                } else {
                    this.nextStageDelay -= 0.01;
                }
            }
        } else if (stage === 4)
            drawMonkey();
		
		if (milkBlinkMask) {
			milkBlinkMask.draw();
		}

        // Draw all the buttons
        for (var i = 0; i < this.milkyButtons.length; ++i)
            this.milkyButtons[i].draw();
    };

    /**
     * Checks if buttons is pressed
     * @param {Event} event - on click
     */
    function checkButtonPressed(event) {

        var rect = canvas.getBoundingClientRect();
        var xPos = Math.round((event.clientX - rect.left) / (rect.right - rect.left) * canvas.width);// Math.round((event.clientX - rect.left));
        var yPos = Math.round((event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height); //Math.round((event.clientY - rect.top));

        var buttons = [drinkButton, cartonButton, crystalButton, milkButton];// PUT UR BUTTON ARRAY

        for (var i = 0; i < buttons.length; ++i) {
            if (xPos >= convertSize(buttons[i].x) && xPos <= convertSize(buttons[i].x + buttons[i].width) &&
                    yPos >= (convertSize(buttons[i].y)) &&
                    yPos <= convertSize((buttons[i].y) + (buttons[i].height))) {
                whichButton = buttons[i];
                buttonActions(whichButton);

            }
        }
    }

    /**
     * Specifies actions to take when buttons are clicked
     * @param {Button} buttonClicked - button that was just clicked
     */
    function buttonActions(buttonClicked) {
        if (buttonClicked.id === "crystal" && stage === 0 && !this.setCursorToCrystal) {
            audio_limbSelectionSound.play();
            this.setCursorToCrystal = true;
            bool_CursorAnimationCrystal = true;
            buttonClicked.setPulsating(false);
            globalCursorManager.setCustomCursor(true, imgRadioActiveCrystal, "crystal", -100, -100, 200, 200);
        } else if (buttonClicked.id === "carton" && stage === 1) {
            audio_limbSelectionSound.play();
            cursorChangeImage = true;
            globalCursorManager.setCustomCursor(true, image_cartonCursor, "carton", -180, -140, 200, 200);
            buttonClicked.setPulsating(false);
        } else if (buttonClicked.id === "milkbutton" && stage === 2) {
            audio_limbSelectionSound.play();
            cursorChangeImage = true;
            globalCursorManager.setCustomCursor(true, image_milkBottle1, "milk", -16, -33, 35, 65);
            buttonClicked.setPulsating(false);
        } else if (buttonClicked.id === "drink" && stage === 3) {
            audio_drinkingWithStraw.play();
            milkHeight += 10;
            milkYpos -= 10;
        }
    }
}

