//IntestineGame by Renzel, Obi and Okan
var canvas = document.getElementById('gameCanvas');
var context = canvas.getContext('2d');
/**
 * This function sets everything up in the game.
 * @constructor
 */
function IntestineGame() {
    var mcWhite;
    var clickDelay = 0;
    
    var upButton = new MazeButton('up', image_ButtonUpU, 65, 110, 72, 72);
    var downButton = new MazeButton('down', image_ButtonDownD, 65, 260, 72, 72);
    var leftButton = new MazeButton('left', image_ButtonLeft, 0, 185, 72, 72);
    var rightButton = new MazeButton('right', image_ButtonRight, 125, 185, 72, 72);
    
    var downButtonPressed = new MazeButton ('downPressed', image_downButtonHover, 65, 260, 72, 72);
    var upButtonPressed = new MazeButton('upPressed', image_upButtonHover, 65, 110, 72, 72);
    var leftButtonPressed = new MazeButton('leftPressed', image_ButtonLeftPressed, 0, 185, 72, 72);
    var rightButtonPressed = new MazeButton('rightPressed', image_ButtonRightPressed, 125, 185, 72, 72);
    
    var arrayofButtons = [upButton, leftButton, rightButton, downButton];
    var arrayOfButtonsPressed = [upButtonPressed, leftButtonPressed, rightButtonPressed, downButtonPressed];
    var ButtonPressed = [false, false, false, false];
    
    var winImage = new MazeButton('win', image_YouWin, 200, 0, 450, 450);
    var winImage2 = new MazeButton('win2', image_YouWin2, 200, 0, 450, 450);
    var imageToDraw = winImage;
    var scaleInc = 1.25;
    var sizeOfSquare = 40 * scaleInc;
    var tileMaze;
    var keyPressed;
    var sleepTimer = 0;
    var haveWon = false;
    var stateChangeDelay = 195;
    
    var audioManager = new AudioManager(audio_mazeGameBGM, audio_mainBGM);
    /**
     * The onclick function is used only for the mobile devices such as tablets, phones etc.
     * It checks to see if the place touched, is on the id of any button and if so it calls
     * the corressponding functions. If it isn't it simply returns out the method.
     * The left and right have special conditions it checks to see if the user is on the edge and
     * if so it doesn't allow the user to move.
     * @param {Event} event - The click event.
     */
    document.onclick = function (event) {
        
        if (onMobileDevice()) {
            var temp = checkButtonPressedMaze(event);
            if (!temp) {
                return;
            }
            
            audio_ballRolling.pause();
            audio_ballRolling.currentTime = 0;
            audio_ballRolling.play();
            clickDelay = 1;
            if (temp.id === "up") {
                ButtonPressed[0] = true;
                mcWhite.moveUp();
            } else if (temp.id === "left") {
                if (mcWhite.counter == 12 || mcWhite.counter == 24 || mcWhite.counter == 36 || mcWhite.counter == 48 ||
                    mcWhite.counter == 60 || mcWhite.counter == 72 || mcWhite.counter == 84 || mcWhite.counter == 96) {
                }
                else {
                    ButtonPressed[1] = true;
                    mcWhite.moveLeft();
                }
            } else if (temp.id === "right") {
                if (mcWhite.counter == 11 || mcWhite.counter == 23 || mcWhite.counter == 35 || mcWhite.counter == 47 ||
                    mcWhite.counter == 59 || mcWhite.counter == 71 || mcWhite.counter == 83 || mcWhite.counter == 95) {
                }
                else {
                    ButtonPressed[2] = true;
                    mcWhite.moveRight();
                }

            } else if (temp.id === "down") {
                ButtonPressed[3] = true;
                mcWhite.moveDown();
            }
        }
        //console.log("clicked");
    };
    /**
     * The onmousedown function is used only for the computers, laptops etc.
     * It checks to see if the canvas is clicked on and for how long,  and if it is on
     * the id of any button and if so it calls the corressponding functions.
     * If it isn't it simply returns out the method.
     * The left and right have special conditions it checks to see if the user is on the edge and
     * if so it doesn't allow the user to move.
     * @param {Event} event - The mouse doen event.
     */
    document.onmousedown = function (event) {
        var temp = checkButtonPressedMaze(event);
        if (!temp) {
            return;
        }
        
        audio_ballRolling.pause();
        audio_ballRolling.currentTime = 0;
        if(!onMobileDevice)
            audio_ballRolling.loop = true;
        audio_ballRolling.play();
        if (temp.id === "up") {
            ButtonPressed[0] = true;
            keyPressed[mcWhite.up] = true;
            //mcWhite.moveUp();
        } else if (temp.id === "left") {
            if (mcWhite.counter == 12 || mcWhite.counter == 24 || mcWhite.counter == 36 || mcWhite.counter == 48 ||
                mcWhite.counter == 60 || mcWhite.counter == 72 || mcWhite.counter == 84 || mcWhite.counter == 96) {

            } else {
                ButtonPressed[1] = true;
                keyPressed[mcWhite.left] = true;
            }
            //mcWhite.moveLeft();
        } else if (temp.id === "right") {
            if (mcWhite.counter == 11 || mcWhite.counter == 23 || mcWhite.counter == 35 || mcWhite.counter == 47 ||
                mcWhite.counter == 59 || mcWhite.counter == 71 || mcWhite.counter == 83 || mcWhite.counter == 95) {
            }
            else {
                ButtonPressed[2] = true;
                keyPressed[mcWhite.right] = true;
            }
            //mcWhite.moveRight();
        } else if (temp.id === "down") {
            ButtonPressed[3] = true;
            keyPressed[mcWhite.down] = true;
            //mcWhite.moveDown();
        }
    };
     /**
     * The touchstart function is used only for the devices with touch screen.
     * It checks to see if the screen is touched on and for how long,  and if it is on
     * the id of any button and if so it calls the corressponding functions.
     * If it isn't it simply returns out the method.
     * The left and right have special conditions it checks to see if the user is on the edge and
     * if so it doesn't allow the user to move.
     * @param {Event} event - The touch start event for mobile devices.
     */
    document.addEventListener("touchstart", function (event) {
        var temp = checkButtonPressedMaze(event);
        if (!temp) {
            return;
        }
        
        audio_ballRolling.pause();
        audio_ballRolling.currentTime = 0;
        if(!onMobileDevice)
            audio_ballRolling.loop = true;
        audio_ballRolling.play();
        if (temp.id === "up") {
            ButtonPressed[0] = true;
            keyPressed[mcWhite.up] = true;
            //mcWhite.moveUp();
        } else if (temp.id === "left") {
            if (mcWhite.counter == 12 || mcWhite.counter == 24 || mcWhite.counter == 36 || mcWhite.counter == 48 ||
                mcWhite.counter == 60 || mcWhite.counter == 72 || mcWhite.counter == 84 || mcWhite.counter == 96) {
            } else {
                ButtonPressed[1] = true;
                keyPressed[mcWhite.left] = true;
            }
            //mcWhite.moveLeft();
        } else if (temp.id === "right") {
            if (mcWhite.counter == 11 || mcWhite.counter == 23 || mcWhite.counter == 35 || mcWhite.counter == 47 ||
                mcWhite.counter == 59 || mcWhite.counter == 71 || mcWhite.counter == 83 || mcWhite.counter == 95) {
            }
            else {
                ButtonPressed[2] = true;
                keyPressed[mcWhite.right] = true;
            }
            //mcWhite.moveRight();
        } else if (temp.id === "down") {
            ButtonPressed[3] = true;
            keyPressed[mcWhite.down] = true;
            //mcWhite.moveDown();
        }
    });
    /**
     * When the mouse click is released it sets all the movements to false.
     * @param {Event} event - The mouse up event.
     */
    document.onmouseup = function (event) {
        var temp = checkButtonPressedMaze(event);
        audio_ballRolling.pause();
        keyPressed[mcWhite.up] = false;
        //mcWhite.moveUp();
        keyPressed[mcWhite.left] = false;
        //mcWhite.moveLeft();
        keyPressed[mcWhite.right] = false;
        //mcWhite.moveRight();
        keyPressed[mcWhite.down] = false;
        //mcWhite.moveDown();
        
        for (i = 0; i < arrayOfButtonsPressed.length; ++i) {
            ButtonPressed[i] = false;
        }
    };
    /**
     * When the touch is released it sets all the movements to false.
     * @param {Event} event - The touch end event for mobile devices.
     */
    document.addEventListener("touchend", function (event) {
        var temp = checkButtonPressedMaze(event);
        audio_ballRolling.pause();
        keyPressed[mcWhite.up] = false;
        //mcWhite.moveUp();
        keyPressed[mcWhite.left] = false;
        //mcWhite.moveLeft();
        keyPressed[mcWhite.right] = false;
        //mcWhite.moveRight();
        keyPressed[mcWhite.down] = false;
        //mcWhite.moveDown();
        for (i = 0; i < arrayOfButtonsPressed.length; ++i) {
            ButtonPressed[i] = false;
        }
    });
    /**
     * This function creates action listeners for keydown and keyup.
     * Creates the mazes and sets it up.
     * @param {Event} event - The key down event.
     */
    this.keyDownFunction = function(e) {
        e = e || window.event;
        keyPressed[e.which || e.keyCode] = true;
        
        audio_ballRolling.pause();
        audio_ballRolling.currentTime = 0;
        //audio_ballRolling.loop = true;
        audio_ballRolling.play();
    }
    this.keyUpFunction = function(e) {
        e = e || window.event;
        keyPressed[e.which || e.keyCode] = false;
        
        audio_ballRolling.pause();
        audio_ballRolling.currentTime = 0;
    }
    
    bindIt1 = this.keyDownFunction.bind(this);
    document.addEventListener("keydown", bindIt1, false);
    bindIt2 = this.keyUpFunction.bind(this);
    document.addEventListener("keyup", bindIt2, false); 
    
    /**
     * Initialises maze patterns.
     */
    this.init = function () {
        audioManager.audioFadeInit();
//        audio_mainBGM.pause();
//        audio_mazeGameBGM.loop = true;
//        audio_mazeGameBGM.play();
        keyPressed = {};
             
        tileMaze = [
            2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1,
            0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1,
            0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0,
            0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1,
            0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1,
            0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1,
            0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1,
            0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1,
            0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 3
       ];
       tileMaze2 = [
            2, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1,
            0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1,
            0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0,
            0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1,
            1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0,
            0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1,
            1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1,
            1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1,
            1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 3
        ];
        
        tileMaze3 = [
            2, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1,
            1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
            1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 3  
        ];
        tileMaze4 = [
            2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
            0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0,
            1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0,
            1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1,
            0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0,
            1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1,
            0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0,
            1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 3
        ];
        //tileMaze = tileMaze5;
        
        var randomValue = Math.floor(getRandomArbitrary(0, 4));
        if (randomValue === 0) {
            tileMaze = tileMaze3;
        }
        else if (randomValue === 1){
            tileMaze = tileMaze4;
        }
        else if (randomValue === 2) {
            tileMaze = tileMaze;
        }
        else if (randomValue === 3){
            tileMaze = tileMaze2;
        }
        mcWhite = new mcTile(38, 40, 37, 39, tileMaze, 12);
    }
    /**
     * This function clears the canvas then fills it with red colour. It then
     * proceeds to draw the maze using the makeTiles function and then it draws
     * the left, right, up, down buttons.
     */
    this.draw = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        fillRectAdjusted(0, 0, GAME_ACTUAL_WIDTH, GAME_ACTUAL_HEIGHT);
        context.fillStyle = "#B22222";
        makeTiles(12, 9);
        for (i = 0; i < ButtonPressed.length; ++i) {
            if (ButtonPressed[i]) {
                arrayOfButtonsPressed[i].draw();
            }
            else {
                arrayofButtons[i].draw();
            }
        }
         
        if(haveWon) {
            if (stateChangeDelay % 10 == 0) {
                if(imageToDraw === winImage)
                    imageToDraw = winImage2;
                else
                    imageToDraw = winImage
            }
            imageToDraw.draw();
            audio_ballRolling.pause();
            stateChangeDelay -= 1;
            audioManager.reverseAudio();
            
        }
            
    }
    
    
    /**
     * This function first checks if the sleepTimer is greater than 0 and if it is,
     * it reduces the value by 0.1 seconds. This is done to make sure the game movement
     * mechanics feel smoother.
     * Then it checks which key was pressed and based on which one it calls another
     * method that corresponds to it. Thus, allowing the user to move left, right, up or down.
     */
    this.update = function () {
        if(onMobileDevice()){
            if(audio_mazeGameBGM.currentTime <= 0){
                audio_mazeGameBGM.loop = true;
                audio_mazeGameBGM.currentTime = 2;
                audio_mazeGameBGM.muted = false; 
                audio_mazeGameBGM.play();
            } else {
                if(!isGameMuted)
                    audio_mazeGameBGM.muted = false;
            }
        }
        
        
        if(audioManager.isFadeFinished && stateChangeDelay <= 0){
                goToNextState(true);
        }
        audioManager.audioFadeUpdate();
        
        if (mcWhite.counter === 107) {
            //console.log("What up")
            haveWon = true;
            //this.destroy();
        }
        if (sleepTimer > 0) {
            sleepTimer -= 0.1;
            return;
        }
        if (clickDelay > 0) {
            clickDelay -= 0.1;
            if (clickDelay <= 0) {
                for (i = 0; i < ButtonPressed.length; ++i) { 
                    ButtonPressed[i] = false;
                }
            }
        }
        if (keyPressed[mcWhite.up]) {
            mcWhite.moveUp();
            sleep(1);
            //console.log("Counter:" + mcWhite.counter);
        }
        if (keyPressed[mcWhite.down]) {
            mcWhite.moveDown();
            sleep(1);
            //console.log("Counter:" + mcWhite.counter);
        }
        if (keyPressed[mcWhite.right]) {
            if (mcWhite.counter == 11 || mcWhite.counter == 23 || mcWhite.counter == 35 || mcWhite.counter == 47 ||
                mcWhite.counter == 59 || mcWhite.counter == 71 || mcWhite.counter == 83 || mcWhite.counter == 95) {
            }
            else {
               mcWhite.moveRight();
            }
            sleep(1);
            //console.log("Counter:" + mcWhite.counter);
        }
        if (keyPressed[mcWhite.left]) {
            if (mcWhite.counter == 12 || mcWhite.counter == 24 || mcWhite.counter == 36 || mcWhite.counter == 48 ||
                mcWhite.counter == 60 || mcWhite.counter == 72 || mcWhite.counter == 84 || mcWhite.counter == 96) {

            } else {
                mcWhite.moveLeft();
            }
            sleep(1);
            //console.log("Counter:" + mcWhite.counter);
        }
//        if (ButtonPressed[0] == true) {
//            buttonDelayUp -= 1;
//            if (buttonDelayUp = 0) {
//                ButtonPressed[0] = false;
//                buttonDelayUp = 5;
//            }
//        } else if (ButtonPressed[1] == true) {
//            buttonDelayLeft -= 1;
//            if (buttonDelayLeft = 0) {
//                ButtonPressed[1] = false;
//                buttonDelayLeft = 5;
//            }
//        } else if (ButtonPressed[2] == true) {
//            buttonDelayRight -= 1;
//            if (buttonDelayRight = 0) {
//                ButtonPressed[2] = false;
//                buttonDelayRight = 5;
//            }
//        } else if (ButtonPressed[3] == true) {
//            buttonDelayDown -= 1;
//            if (buttonDelayDown = 0) {
//                ButtonPressed[3] = false;
//                buttonDelayDown = 5;
//            }
//        }
    }

    /**
     * This function sets the duration of the sleepTimer to the duration given when it's called.
     * @param {Number} duration - how long to sleep.
     */
    function sleep(duration) {
        sleepTimer = duration;
    }
    /**
     * This function removes all the action listeners for the mouse and touch.
     */
    this.destroy = function () {
        document.removeEventListener("touchstart", function (event) {
        });
        document.removeEventListener("touchend", function (event) {
        });
        document.removeEventListener("keydown", bindIt1);
        document.removeEventListener("keyup", bindIt2);
        document.onclick = null;
        document.onmousedown = null;
        document.onmouseup = null;
        //keyPressed = null; 
        
//        audio_mazeGameBGM.pause();
//        audio_mainBGM.play();
        audio_ballRolling.pause();
        audio_ballRolling.currentTime = 0;
    }
    /**
     * This method will make tiles according to the values provided.
     * By looking at the pre defined array called tile maze array.
     * It will generate the maze looking at the array.
     * @param {Number} width - width of the maze
     * @param {Number} height - height of the maze
     */
    function makeTiles(width, height) {
        var counter = 0;
        var y1 = 0 * scaleInc;
        for (var y = 0; y < height; ++y) {
            var x1 = 159 * scaleInc;
            for (var x = 0; x < width; ++x) {
                if (tileMaze[counter] === 0) {
                    drawImageAdjusted(image_blocksRedR, x1, y1, sizeOfSquare, sizeOfSquare);

                } else if (tileMaze[counter] === 2) {
                    drawImageAdjusted(image_blocksWhiteW, x1, y1, sizeOfSquare, sizeOfSquare);

                } else if (tileMaze[counter] === 3) {
                    drawImageAdjusted(image_EndTile, x1, y1, sizeOfSquare, sizeOfSquare);
                } 
                else {
                    drawImageAdjusted(image_blocksPurpleP, x1, y1, sizeOfSquare, sizeOfSquare);
                }
                x1 += sizeOfSquare;
                counter++;
            }
            y1 += sizeOfSquare;

        }
    }
    /**
     * This function checks to see which button was pressed/touched and returns the id of that button.
     * @param {Event} event - The event variable is used to check where on the canvas the user clicks/touches. 
     */
    function checkButtonPressedMaze(event) {
        var rect = canvas.getBoundingClientRect();
        var xPos = Math.round((event.clientX - rect.left) / (rect.right - rect.left) * GAME_ACTUAL_WIDTH);
        var yPos = Math.round((event.clientY - rect.top) / (rect.bottom - rect.top) * GAME_ACTUAL_HEIGHT);

        var buttons = [upButton, downButton, leftButton, rightButton];

        for (var i = 0; i < buttons.length; ++i) {
            if (xPos >= buttons[i].x && xPos <= buttons[i].x + buttons[i].width &&
                yPos >= (buttons[i].y) && yPos <= (buttons[i].y) + (buttons[i].height)) {
                return buttons[i];
            }
        }
    }
}
/**
 * This function is responsible for making the button.
 * Keeps the reference of the buttons if clicked using the coordinates.
 * @constructor
 * @param {string} id - id for button to identify it.
 * @param {Image} image - image to use for button.
 * @param {Number} x - x position of button.
 * @param {Number} y - y position of button.
 * @param {Number} width - width of button.
 * @param {Number} height - height of button.
 */
function MazeButton(id, image, x, y, width, height) {
    this.id = id;
    this.image = image;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.draw = function () {
        drawImageAdjusted(this.image, this.x, this.y, this.width, this.height);
    };
}
/**
 * This function generates a random number from the range given by the minumum and maximum number in the parameter.
 * @param {Number} min - the minumum number.
 * @param {Number} max - the maximum number.
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
/**
 * This represents the user in the game.
 * This function has the responsibility of of moving the tile when the user presses buttons.
 * @constructor
 * @param {Button} up - the up button
 * @param {Button} down - the down button
 * @param {Button} left - the left button
 * @param {Button} right - the right button
 * @param {Array|Number}tileMaze - the tile maze array
 * @param {Number} mazeWidth the width of the maze
 */
function mcTile(up, down, left, right, tileMaze, mazeWidth) {
    this.counter = 0;
    this.previousCounter = 0;
    this.up = up;
    this.down = down;
    this.left = left;
    this.right = right;
    this.tileMaze = tileMaze;
    this.mazeWidth = mazeWidth;
    this.changeCounter = function (newCounter) {
        this.previousCounter = this.counter;
        this.counter = newCounter;
    };
    this.moveUp = function () {
        if ((this.counter - this.mazeWidth) >= 0) {
            if (this.tileMaze[this.counter - this.mazeWidth] !== 0) {
                this.tileMaze[this.counter] = 1;
                this.counter -= this.mazeWidth;
                this.tileMaze[this.counter] = 2;
            }
        }
    };
    this.moveDown = function () {
        if ((this.counter + this.mazeWidth) < tileMaze.length) {
            if (this.tileMaze[this.counter + this.mazeWidth] !== 0) {
                this.tileMaze[this.counter] = 1;
                this.counter += this.mazeWidth;
                this.tileMaze[this.counter] = 2;
            }
        }
    };
    this.moveLeft = function () {
        if (this.counter === 1) {
            this.tileMaze[this.counter] = 1;
            this.counter -= 1;
            this.tileMaze[this.counter] = 2;
        } else {
            if ((((this.counter - 1) / this.mazeWidth !== 0)) && ((this.counter - 1) !== -1)) {
                if (this.tileMaze[this.counter - 1] !== 0) {
                    this.tileMaze[this.counter] = 1;
                    this.counter -= 1;
                    this.tileMaze[this.counter] = 2;
                }
            }
        }
    };
    this.moveRight = function () {
        if ((((this.counter + 1) + 1) / this.mazeWidth !== 0) && ((this.counter + 1) < tileMaze.length)) {
            if (this.tileMaze[this.counter + 1] !== 0) {
                this.tileMaze[this.counter] = 1;
                this.counter += 1;
                this.tileMaze[this.counter] = 2;
            }
        }
    };
}