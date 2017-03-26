/* Initial Commit for Spaceship Game
 Created by : Renzel and Obi */

/**
 * Constructor for the spaceship game.
 * @constructor
 */
function SpaceShipGame() {
    /**
     * This function draws the buttons when the space ship game is initially made.
     */
    this.init = function () {
        this.audioManager = new AudioManager(audio_spaceshipGameBGM, audio_mainBGM);
        this.audioManager.audioFadeInit();
        upButton.startFadingIn();
        downButton.startFadingIn();
        
        if(onMobileDevice()){
            audio_spaceshipGameBGM.muted = false;
            audio_spaceshipGameBGM.loop = true;
            audio_spaceshipGameBGM.play();
        }
    };

    //rocket sounds
    var rocketSound = audio_rocketSound; // buffers automatically when created
    
    rocketSound.volume = 0.2;
    rocketSound.muted = false;
    rocketSound.pause();
    rocketSound.loop = true;
    rocketSound.play();

    //bloodCell hit
    var asteroidHit = audio_asteroidHit;
    asteroidHit.muted = false;
    asteroidHit.pause();
    


    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");

    canvas.style.backgroundImage = "url('" + image_spaceshipBackground.src + " ')";
    canvas.style.backgroundSize = "cover";

//backgroundMovement
    var moveBg = 0;

//Timer 
    var spaceshipCountdown = 4;

    if (difficulty) {
        var timer = 30;
    } else {
        var timer = 30;
    }


//SpaceShip
    var ssHeight = GAME_ACTUAL_HEIGHT * 0.15; //this is bad, must be invoked after resizeGame
    var ssWidth = GAME_ACTUAL_WIDTH * 0.075; //same thing
    var ssYCoor = GAME_ACTUAL_HEIGHT / 2 - (ssHeight / 2);
    var ssXCoor = 0; //0 initially it is given after resizeGame()
    var ssXOffset = 0;
    var ssYOffset = 0;
    var ssMoveX = -2;
    var ssMoveUp = false;
    var ssMoveDown = false;
    var ssLives = 3;
    var vulnerability = true;
    var frameNumber = 1;
    var bumpBack = false;
    var bumpBackSineCounter = 0;

    var invulnerabilityTimer = 0;
    var spaceshipResetButton;
    var spaceshipSkipButton;

//spaceship image
    var ssImg = new Image();
    ssImg = image_spaceship;

// Blood Cells 
    var radius = GAME_ACTUAL_HEIGHT * 0.075; //this isnt good, its before resizeGame()
    var diameter = radius + radius;
    var color = "red";

    if (difficulty) {
        var moveX = 8;
    } else {
        var moveX = 5;
    }


    var asteroids = [];

//patterns
    var pattern1 = [];
    var pattern2 = [];
    var pattern3 = [];
    var pattern4 = [];
    var pattern5 = [];
    var previousPattern = [];

//intial pattern
    var initialPattern = [radius, radius + diameter, radius + diameter * 2, radius + diameter * 3, radius + diameter * 4];

    for (var i = 0; i < 5; i++) {

        asteroids[i] = {
            //x: ((i * ((Math.random() * 10) + radius)) + Math.random() * 10) - GAME_ACTUAL_WIDTH,
            x: -40,
            y: initialPattern[i]
        };
    }
    ;

    //Asteroid image
    var asImg = image_asteroid1;
    var asFrameNumber = 1;

    canvas.addEventListener('mousedown', checkButtonPressed, false);
    canvas.addEventListener('mouseup', checkButtonNotPressed, false);
    canvas.addEventListener('touchstart', checkButtonTouched, false);
    canvas.addEventListener('touchend', checkButtonNotTouched, false);
    canvas.addEventListener('keyup', checkKeyNotPressed, false);
    canvas.addEventListener('keydown', checkKeyPressed, false);


    (function () {
        var requestAnimationFrame = window.requestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.msRequestAnimationFrame;

        window.requestAnimationFrame = requestAnimationFrame;
    })();

// <Up Button & Down Button>  
    var imageOfUpButton = new Image();
    imageOfUpButton = image_upButton;
    var upButton = new Button('up', imageOfUpButton, 10, GAME_ACTUAL_HEIGHT - 200, 90, 90);

    var imageOfDownButton = new Image();
    imageOfDownButton = image_downButton;
    var downButton = new Button('down', imageOfDownButton, 10, GAME_ACTUAL_HEIGHT - 90, 90, 90);


// <End of Up & Down Button>


// CALLS BUTTONACTIONS ON THE PRESSED BUTTON
    /**
     *  This function checks if the buttons (up or down button) if pressed or not.
     *  This is done by checking the buttons and mouse's coordinates.
     * @param {Event} - on click event
     */
    function checkButtonPressed(event) {
        var rect = canvas.getBoundingClientRect();
        var xPos = Math.round((event.clientX - rect.left) / (rect.right - rect.left) * GAME_ACTUAL_WIDTH);
        var yPos = Math.round((event.clientY - rect.top) / (rect.bottom - rect.top) * GAME_ACTUAL_HEIGHT);

        var buttons = [upButton, downButton];// PUT UR BUTTON ARRAY

        for (var i = 0; i < buttons.length; ++i) {
            if (xPos >= buttons[i].x && xPos <= buttons[i].x + buttons[i].width &&
                    yPos >= (buttons[i].y) && yPos <= (buttons[i].y) + (buttons[i].height)) {
                whichButton = buttons[i];
                buttonActions(whichButton);

            }
        }
    }

    /**
     *  This function checks if the button is touched.
     *  This method is made to see if the buttons are touched on any mobile devices
     * @param {Event} - event
     */
    function checkButtonTouched(event) {
        var rect = canvas.getBoundingClientRect();
        var xPos = Math.round((event.touches[0].clientX - rect.left) / (rect.right - rect.left) * GAME_ACTUAL_WIDTH);
        var yPos = Math.round((event.touches[0].clientY - rect.top) / (rect.bottom - rect.top) * GAME_ACTUAL_HEIGHT);

        var buttons = [upButton, downButton];// PUT UR BUTTON ARRAY

        for (var i = 0; i < buttons.length; ++i) {
            if (xPos >= buttons[i].x && xPos <= buttons[i].x + buttons[i].width &&
                    yPos >= (buttons[i].y) && yPos <= (buttons[i].y) + (buttons[i].height)) {
                whichButton = buttons[i];
                buttonActionTouch(whichButton);

            }
        }
    }

    /**
     * This is a pre-made function to see if the button is pressed or not.
     * This function is made to see if the button is let go it will change its image.
     * Giving an illusion of change for the user to see the difference between pressing the button or not.
     * @param {Event} - event
     */
    function checkButtonNotPressed(event) {
        ssMoveUp = false;
        ssMoveDown = false;
        imageOfUpButton = image_upButton;
        imageOfDownButton = image_downButton;
        ssImg = image_spaceship;
    }

    /**
     * This is a pre-made function to see if the button is touched or not.
     * This function is made to see if the button is let go it will change its image.
     * Giving an illusion of change for the user to see the difference between touching the button or not.
     * @param {Event} - event
     */
    function checkButtonNotTouched(event) {
        ssMoveUp = false;
        ssMoveDown = false;
        imageOfUpButton = image_upButton;
        imageOfDownButton = image_downButton;
        ssImg = image_spaceship;

    }

    /**
     * This function takes cares of the response to when the buttons are pressed or touched
     * @param {Button} buttonClicked - checks which buttons is pressed (this the button object)
     */
    function buttonActionTouch(buttonClicked) {
        if (buttonClicked.id === "up") {
            // up up
            console.log("The up button is pressed");
            ssMoveUp = true;
            imageOfUpButton = image_upButtonHover;
            ssImg = image_spaceshipUp;

        } else if (buttonClicked.id === "down") {
            // down down
            console.log("down button is pressed");
            ssMoveDown = true;

            imageOfDownButton = image_downButtonHover
            ssImg = image_spaceshipDown;

        }
    }

    /***
     * This checks if the button up or down is pressed using the event
     * @param {Event} - event
     */
    function checkKeyPressed(e) {
        if (e.keyCode === 38) {
            // up
            buttonActions(upButton);
            ssMoveDown = false;
            e.preventDefault();
        } else if (e.keyCode === 40) {
            // down
            buttonActions(downButton);
            ssMoveUp = false;
            e.preventDefault();
        }
    }

    /**
     * This checks if the button up or down isn't pressed
     * @param {Event} - event
     */
    function checkKeyNotPressed(e) {
        if (e.keyCode === 38) {
            ssMoveUp = false;
            ssImg = image_spaceship;
            imageOfUpButton = image_upButton;
        } else if (e.keyCode === 40) {
            ssMoveDown = false;
            ssImg = image_spaceship;
            imageOfDownButton = image_downButton;
        }
    }

    /**
     * This function if the game is finished or not and if so it will go to the next state.
     */
    function checkGameOverButtons() {
        var xPos = globalCursorManager.cursorX;
        var yPos = globalCursorManager.cursorY;

        var buttons = [spaceshipResetButton, spaceshipSkipButton];// PUT UR BUTTON ARRAY
        var whichButton = 0;
        for (var i = 0; i < buttons.length; ++i) {
            if (xPos >= convertSize(buttons[i].x) && xPos <= convertSize(buttons[i].x) + convertSize(buttons[i].width) &&
                    yPos >= (convertSize(buttons[i].y)) && yPos <= (convertSize(buttons[i].y)) + (convertSize(buttons[i].height))) {
                whichButton = buttons[i];
                break;
            }
        }

        if (!whichButton)
            return;

        var clicked = false;
        if (whichButton.id === "reset") {
            restartThisState(true);
            clicked = true;
        } else if (whichButton.id === "skip") {
            clicked = true;
            goToNextState(true);
        }

        if (clicked) {
            gameCanvas.removeEventListener('mouseup', checkGameOverButtons, false);
            gameCanvas.removeEventListener('touchend', checkGameOverButtons, false);
        }
    }

// BUTTON RESPONSE
    /**
     * This is the response of the button when the button is pressed,
     * and changes the button image.
     * @param {Button} buttonClicked - button clicked
     */
    function buttonActions(buttonClicked) {
        if (!buttonClicked)
            return;
        if (buttonClicked.id === "up") {
            // up up
            ssMoveUp = true;
            imageOfUpButton = image_upButtonHover;
            ssImg = image_spaceshipUp;


        } else if (buttonClicked.id === "down") {
            // down down
            ssMoveDown = true;
            imageOfDownButton = image_downButtonHover;
            ssImg = image_spaceshipDown;
        }
    }

//Function for generating numbers from ranges
    /**
     * This generates a random number according to the parameters entered.
     * @param {number} min - the minimum number
     * @param {number} max - the maximum number
     * @returns {number} - returns the number random number of the according to the min and max parameters
     */
    function randomIntFromInterval(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

//compare two arrays
    /**
     * This checks if the arrays are the same.
     * @param {Array|Number} arr1 - first array
     * @param {Array|Number} arr2 - second array
     * @returns {boolean} - returns whether if the array parameters are the same or not.
     * @private
     */
    function _isEqual(arr1, arr2) {
        if (arr1.length !== arr2.length)
            return false;
        for (var i = 0, len = arr1.length; i < len; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    }

//given a number from 1 to 5 return the pattern
    /**
     * This creates the pattern for the asteroids
     * @param {number} n - what pattern out of 5 should the function
     * @returns {Array|Number} - return the pattern of the asteroids
     */
    function createPattern(n) {

        switch (n) {
            case 0 :
                return pattern1;
            case 1 :
                return pattern2;
            case 2 :
                return pattern3;
            case 3 :
                return pattern4;
            default :
                return pattern5;
        }

    }

//create a pattern, must not repeat
    /**
     * This generates the y coordinates for the patterns. This is used to continuously make patterns.
     * @returns {Array|Number} - return the pattern
     */
    function generateYPositions() {

        var pattern = createPattern(randomIntFromInterval(0, 4));

        while (_isEqual(pattern, previousPattern) === false) {
            pattern = createPattern(randomIntFromInterval(0, 4));
            previousPattern = pattern;
        }

        return pattern;
    }

//draw moving background
    /**
     * This draws the background and moves it accordingly
     */
    function drawBackground() {

        //moving background
        document.getElementById("gameCanvas").style.backgroundPosition = moveBg + "px";
    }

    /**
     * This would draw the space ship and changes the image according to the time of the frame.
     */
    function drawSpaceShip() {


        //ssXCoor = GAME_ACTUAL_WIDTH - (GAME_ACTUAL_WIDTH * 0.1);

        if (frameNumber >= 1 && frameNumber < 2 && !ssMoveUp && !ssMoveDown) {
            ssImg = image_spaceship2;

        } else if (frameNumber >= 2 && frameNumber < 3 && !ssMoveUp && !ssMoveDown) {
            ssImg = image_spaceship3;

        } else if (frameNumber >= 3 && frameNumber < 4 && !ssMoveUp && !ssMoveDown) {
            ssImg = image_spaceship4;

        } else if (frameNumber >= 4 && !ssMoveUp && !ssMoveDown) {
            ssImg = image_spaceship5;
            frameNumber = 1;
        }

        if (ssLives <= 0)
            ssImg = image_spaceshipDown;

        frameNumber += 0.1;
        drawImageAdjusted(ssImg, ssXCoor + ssXOffset, ssYCoor, ssHeight, ssWidth);

    }

    /***
     * This checks if the timer is finished or not. If it is then it moves to the next stage.
     */
    function checkTime(audioManager) {
        if (spaceshipCountdown <= 0) {
            timer -= 0.015;
            if (timer <= 0) {
                timer = 0;
                //document.getElementById("moveUpButton").style.visibility = "hidden";
                goToNextState(true);
            }
        } else {
            spaceshipCountdown -= 0.02;
        }
    }

    /***
     * This displays the lives for the user.
     */
    function displayLivesAndTime() {
        ctx.font = convertSize(50) + "px Arial";
        ctx.fillStyle = "#fff600";
        ctx.fillText(parseInt(timer, 10), convertSize(GAME_ACTUAL_WIDTH - 130), convertSize(50));
        ctx.fillText("Lives : " + ssLives, convertSize(20), convertSize(50));
    }

    /**
     * This displays the time countdown.
     */
    function displayCountdown() {
        ctx.font = convertSize(50) + "px Arial";
        ctx.fillStyle = "#fff600";
        if (spaceshipCountdown < 1) {
            ctx.fillText("GO!", convertSize(350), convertSize(230));
        } else {
            var roundedCountdown = Math.ceil(spaceshipCountdown);
            ctx.fillText(parseInt(roundedCountdown - 1, 10), convertSize(380), convertSize(230));
        }
    }

//must be put into a function, because resizeGame() has to be invoked first
//to make decrease pattern repetitions, just have to increase the number of patterns, the previousPattern idea doesn't work,
    /**
     * This is where the patterns are initialised.
     */
    function givePatternValues() {
        //patterns
        pattern1 = [radius, radius + diameter, radius + diameter * 2, radius + diameter * 3, radius + diameter * 4];
        pattern2 = [GAME_ACTUAL_HEIGHT - radius, GAME_ACTUAL_HEIGHT - (radius + diameter), GAME_ACTUAL_HEIGHT - (radius + diameter * 2), GAME_ACTUAL_HEIGHT - (radius + diameter * 3), GAME_ACTUAL_HEIGHT - (radius + diameter * 4)];
        pattern3 = [radius, radius + diameter, GAME_ACTUAL_HEIGHT - radius, GAME_ACTUAL_HEIGHT - (radius + diameter), GAME_ACTUAL_HEIGHT - (radius + diameter * 2)];
        pattern4 = [radius, radius + diameter, radius + diameter * 2, GAME_ACTUAL_HEIGHT - radius, GAME_ACTUAL_HEIGHT - (radius + diameter)];
        pattern5 = [radius, radius + diameter, radius + diameter * 2, radius + diameter * 3, GAME_ACTUAL_HEIGHT - radius];
        previousPattern = [];

    }

    /**
     * This draws the asteroids according to the patterns.
     */
    function drawAsteroid() {

        givePatternValues();

        var pattern = generateYPositions();

        for (var i = 0; i < asteroids.length; i++) {

            if (asteroids[i].x < GAME_ACTUAL_WIDTH + diameter) {

                asteroids[i].x += moveX;

            } else {

                asteroids[i].x = -40;
                asteroids[i].y = pattern[i];
            }

            if (asFrameNumber >= 1 && asFrameNumber < 2) {
                asImg = image_asteroid1;

            } else if (asFrameNumber >= 2 && asFrameNumber < 3) {
                asImg = image_asteroid2;

            } else if (asFrameNumber >= 3 && asFrameNumber < 4) {
                asImg = image_asteroid3;

            } else if (asFrameNumber >= 4 && asFrameNumber < 5) {

                asImg = image_asteroid4;
                asFrameNumber = 1;

            }
            asFrameNumber += 0.02;
            drawImageAdjusted(asImg, asteroids[i].x - radius, asteroids[i].y - radius, diameter, diameter);
        }
    }


    /**
     * This checks of the asteroid and spaceship collide.
     */
    function collisionDetection() {

        var ssYUp = ssYCoor + 16;
        var ssYBot = ssYCoor + ssHeight - 16;
        var ssXRight = ssXCoor + ssWidth - 32;
        var ssXLeft = ssXCoor + 16;
        for (var i = 0; i < asteroids.length; i++) {

            var ballYUp = asteroids[i].y - radius;
            var ballYDown = asteroids[i].y + radius;
            var ballXRight = asteroids[i].x + radius;
            var ballXLeft = asteroids[i].x - radius;
            //the same Y
            if (!(ssYBot < ballYUp || ssYUp > ballYDown)) {

                //the same X
                if (!(ssXRight < ballXLeft || ssXLeft > ballXRight)) {
                    //put the bloodCell temporarily outside
                    asteroids[i].y = -GAME_ACTUAL_HEIGHT;
                    if (vulnerability) {

                        vulnerability = false;
                        invulnerabilityTimer = timer - 1.5;

                        asteroidHit.play();

                        if (ssLives > 0) {
                            ssLives -= 1;
                            if (ssLives > 0)
                                bumpBack = true;
                        }

                        //this keeps the bloodCells straight
                        asteroids[i].x = asteroids[1].x;



                    }
                }
            }

            if (timer <= invulnerabilityTimer) {
                vulnerability = true;
            }
        }
    }

    /**
     * This is an generic update function which updates the every object on the canvas.
     * Also detects if there are any collision.
     */
    this.update = function () {
        
        this.audioManager.audioFadeUpdate();
        upButton.update();
        downButton.update();
        upButton.image = imageOfUpButton;
        downButton.image = imageOfDownButton;
        collisionDetection();

        // Move background
        moveBg += 2;

        if (ssLives <= 0) {
            ssMoveDown = true;
            ssMoveUp = false;

            if (ssYCoor > GAME_ACTUAL_HEIGHT + 300) {
                this.gameOver = true;
            }

        } else {
            checkTime(this.audioManager);
        }

        // Position spaceship
        ssXCoor = GAME_ACTUAL_WIDTH - ssWidth * 1.5;
        if (ssMoveUp && ssYCoor > 0 + 5) {
            ssYCoor -= 5;
        } else if (ssMoveDown && (ssYCoor < GAME_ACTUAL_HEIGHT - ssHeight - 5 || ssLives <= 0)) {
            ssYCoor += 5;
        }

        if (bumpBack) {
            ssXOffset = Math.sin(bumpBackSineCounter) * 60;
            bumpBackSineCounter += 0.075;
            if (ssXOffset < 0) {
                bumpBack = 0;
                bumpBackSineCounter = 0;
                ssXOffset = 0;
                //asteroidHit.muted = true;
            }
        }

        if (this.gameOver) {
            this.setGameOverMenu();
        }
    };
    /**
     * this is the function which is shown when the player loses the game.
     * The player is given a reset and skip option during that time.
     */
    this.setGameOverMenu = function () {
        this.gameOverWidth = 420;
        this.gameOverHeight = 300;
        this.gameOverX = GAME_ACTUAL_WIDTH / 2 - this.gameOverWidth / 2;
        this.gameOverY = GAME_ACTUAL_HEIGHT / 2 - this.gameOverHeight / 2;

        if (!this.initialisedGameOverMenu) {
            this.initialisedGameOverMenu = true;
            spaceshipResetButton = new Button("reset", image_resetButton, this.gameOverX + this.gameOverWidth * 0.15, this.gameOverY + this.gameOverHeight * 0.4, 128, 128);
            spaceshipSkipButton = new Button("skip", image_skipButton, this.gameOverX + this.gameOverWidth * 0.55, this.gameOverY + this.gameOverHeight * 0.4, 128, 128);
            gameCanvas.addEventListener('mouseup', checkGameOverButtons, false);
            gameCanvas.addEventListener('touchend', checkGameOverButtons, false);
        }
    }
    /**
     * This will reset the background and remove any event listeners
     */
    this.destroy = function () {
        // Reset background
        canvas.style.backgroundImage = "none";
        canvas.style.backgroundSize = "initial";
        canvas.style.backgroundPosition = "initial";
        rocketSound.pause();

        canvas.removeEventListener('mousedown', checkButtonPressed, false);
        canvas.removeEventListener('mouseup', checkButtonNotPressed, false);
        canvas.removeEventListener('touchstart', checkButtonTouched, false);
        canvas.removeEventListener('touchend', checkButtonNotTouched, false);
        canvas.removeEventListener('keyup', checkKeyNotPressed, false);
        canvas.removeEventListener('keydown', checkKeyPressed, false);
    };

    /**
     * This will draw the canvas and update the space ship accordingly to the buttons pressed or not.
     * This will also check if the game is finished or not.
     */
    this.draw = function () {

        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        if (spaceshipCountdown <= 0) {
            drawAsteroid();
        }
        upButton.draw();
        downButton.draw();
        drawBackground();
        drawSpaceShip();
        displayLivesAndTime();

        if (spaceshipCountdown > 0)
            displayCountdown();

        if (this.gameOver) {
            //gameContext.fillStyle = "blue";
            //fillRectAdjusted(this.gameOverX, this.gameOverY, this.gameOverWidth, this.gameOverHeight);
            drawImageAdjusted(image_restBackground, this.gameOverX, this.gameOverY, this.gameOverWidth, this.gameOverHeight);
            drawImageAdjusted(image_resetButton, spaceshipResetButton.x, spaceshipResetButton.y, spaceshipResetButton.width, spaceshipResetButton.height);
            drawImageAdjusted(image_skipButton, spaceshipSkipButton.x, spaceshipSkipButton.y, spaceshipSkipButton.width, spaceshipSkipButton.height);

            gameContext.fillStyle = "yellow";
            gameContext.font = convertSize(20) + "pt 'Comic Sans MS'";
            gameContext.fillText("Whoops, you crashed. Try again!", convertSize(this.gameOverX + 8), convertSize(this.gameOverY + 32));
        }
    };
}
