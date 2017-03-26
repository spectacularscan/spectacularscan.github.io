// GLOBALS
var gameCanvas = document.getElementById('gameCanvas');
var gameContext = gameCanvas.getContext("2d");
var currentState = 0;
// GLOBAL CONSTANTS
var GAME_ACTUAL_WIDTH = 800;
var GAME_ACTUAL_HEIGHT = 450;
var current_state_id = "mainmenu"
var state_order;
var state_index = -1;
var clearCanvas = true;
var transitioning = false;
var changedState = false;
var transX = 0;
var isGameMuted = false;

var globalCursorManager = new CursorManager();
var mainAudioManager;
var oneTime = true;
var goingToMazeGame = false;

var isLandscape = false;
var MOBILE_MULTIPLIER = 1;

/** Starts the main game loop. Call once when assets are ready. */
function mainInitialization() {	
	globalCursorManager.init();
	gameLoop();
    mainAudioManager = new AudioManager(audio_mainBGM, audio_spaceshipGameBGM);
}

/**
 * Resizes the canvas so that it always takes up the same proportion of space in
 * the browser window. Call at the start of the program and whenever the window is resized.
 */
function resizeGame() {
    "use strict";
    //For resizing the game 
    var gameArea = document.getElementById('gameArea'),
    //The ratio of the screen, 16:9 is landscape
        widthtoHeight = 16 / 9,

    //getting the current window's width and height
        newWidth = (window.outerWidth > 0) ? window.outerWidth : screen.width,
        newHeight = (window.outerHeight > 0) ? window.outerHeight : screen.height,

        newWidthToHeight = newWidth / newHeight;
    
    //everything else in the gameArea(div)
    //console.log(onMobileDevice());
    
	if (isLandscape && screen.height > screen.width) {
		var temp = newWidth;
		newWidth = newHeight;
		newHeight = temp;
	}
	
    var moz_multiplier = 1;
    
    if(typeof InstallTrigger !== 'undefined' && window.devicePixelRatio * 100 * 0.5 != 100 && !onMobileDevice()){
        var zoom_values = [30, 50, 67, 80, 90, 100, 110, 120, 133, 150, 170, 200, 240, 300];
    
		
        function closest (num, arr) {
            var curr = arr[0];
            var diff = Math.abs (num - curr);
            for (var val = 0; val < arr.length; val++) {
                var newdiff = Math.abs (num - arr[val]);
                if (newdiff < diff) {
                    diff = newdiff;
                    curr = arr[val];
                }
            }
            return curr;
        }

        moz_multiplier = closest(window.devicePixelRatio * 100 * 0.5 , zoom_values) / 100;
    }

    var sizeModifier;
	if (onMobileDevice()) {
		sizeModifier = 1;
	} else {
		sizeModifier = 0.85;
	}
   
    //rescaling the size of the game area according to size of the current window
	var scaledDown = false;
    if (newWidthToHeight > widthtoHeight) {
        //window width is too wide relative to what we want
        newWidth = newHeight * widthtoHeight;
        gameArea.style.height = (newHeight * sizeModifier * moz_multiplier) + 'px';
        gameArea.style.width = (newWidth * sizeModifier * moz_multiplier) + 'px';

        scaledDown = true;
    } else {
        //window height is too high relative to what we want
        newHeight = newWidth / widthtoHeight;
        gameArea.style.width = (newWidth * sizeModifier * moz_multiplier) + 'px';
        gameArea.style.height = (newHeight * sizeModifier * moz_multiplier) + 'px';

    }
    
	//adjusting the margins to center the gameArea		
	
    //for any text we have within the gameArea
    gameArea.style.fontSize = (newWidth / 400) + 'em';
	MOBILE_MULTIPLIER = onMobileDevice() ? 3 : 1;
	
    gameCanvas.width = newWidth * moz_multiplier * MOBILE_MULTIPLIER;
    gameCanvas.height = newHeight * moz_multiplier * MOBILE_MULTIPLIER;
    document.getElementById("body").style.margin = "0px";
}

function orientationCheck() {
	isLandscape = (window.orientation === 90 || window.orientation === -90);
	resizeGame();
}

/**
 * The main game loop. Call once and it will continue to run by itself using requestAnimationFrame.
 * Every time it runs, it calls update() and then draw() on whatever state it's in, in that order.
 */
function gameLoop() {
    //required so that the loop works with various browsers
    var reqAnimFrame =  window.requestAnimationFrame || 
                        window.mozRequestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.msRequestAnimationFrame;
    
	if (!currentState) {
		currentState = new MainMenu();
		current_state_id = "mainmenu";
		currentState.init();
	}
	
	draw();
	if (transitioning) {
		stateTransition();
	}
	
	reqAnimFrame(gameLoop);
}

/**
 * Draws the current state and updates/draws the custom cursor.
 * Should be called from the game loop every frame.
 */
function draw() {
	if (!transitioning || changedState)
		currentState.update();
	//if (current_state_id !== "scangame" && clearCanvas)
		gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
	currentState.draw();
    
    if(current_state_id != "mainmenu"){
        gameContext.globalAlpha = 0.5;
        if(!isGameMuted)
            drawImageAdjusted(image_muteButtonSoundOn, GAME_ACTUAL_WIDTH * 0.923, 0, GAME_ACTUAL_WIDTH * 0.08, GAME_ACTUAL_WIDTH * 0.08);
        else
            drawImageAdjusted(image_muteButtonSoundOff, GAME_ACTUAL_WIDTH * 0.923, 0, GAME_ACTUAL_WIDTH * 0.08, GAME_ACTUAL_WIDTH * 0.08);
        gameContext.globalAlpha = 1;
    }
        
	globalCursorManager.update();
	globalCursorManager.draw();
    unloadScrollBars();
    
    //change this to doctorroom5 when the order is correct
    if(current_state_id === "doctorroom5"){
        if(oneTime){
            mainAudioManager.audioFadeInit();
            oneTime = false;
        }
        mainAudioManager.audioFadeUpdate();
    }
        
}

/**
 * Sets the game route to either the Milk game or not the milk game.
 * @param {boolean} milkRoute - Whether to use the milk route or not.
 */
function setRoute(milkRoute) {
	if (milkRoute) {
		// Milk route
		state_order = ["doctorroom6", "milkgame", "doctorroom3", "scangame", /*"doctorroom4",*/ "spaceshipgame", "doctorroom5", "end"];
	} else {
		// Not milk
		state_order = ["doctorroom2", "creamgame", "doctorroom3", "scangame" , /*"doctorroom4",*/ "spaceshipgame", "doctorroom5", "end"];
	}
	state_index = 0;
}

/**
 * Reset the current state.
 * @param {boolean} useTransition - Whether or not to show the screen transition.
 */
function restartThisState(useTransition=false) {
	--state_index;
	if (useTransition)
		startTransition();
	else {
		createAndSetNextState();
	}
}

/**
 * Go to the next state, or start transition to the next state.
 * @param {boolean} useTransition - Whether or not to show the screen transition.
 */
function goToNextState(useTransition=false) {
    
	if (useTransition){
        startTransition();
        audio_transitionWhoosh.pause();
        audio_transitionWhoosh.currentTime = 0;
        audio_transitionWhoosh.play();
    }
	else {
		createAndSetNextState();
	}
    
}

/**
 * Begins the screenwipe transition. Creates the next state object
 * halfway through the transition, when the previous state is fully obscured.
 */
function startTransition() {
	transitioning = true;
	transX = -GAME_ACTUAL_WIDTH;
	changedState = false;
	
	if (current_state_id === "mainmenu")
		gameCanvas.style.zIndex = 1000;
	
	var scale = 1;
	if (state_index >= 0) {
		switch(state_order[state_index]) {
			case "milkgame": case "doctorroom6":
				transitionMonkeyImage = image_milkGameMonkey1;
				scale = 0.55;
				break;
			case "doctorroom3": case "doctorroom4":
				transitionMonkeyImage = image_doctorMonkey;
				scale = 0.3;
				break;
			case "scangame": case "creamgame": case "mazegame":
				transitionMonkeyImage = image_karateMonkey;
				scale = 0.6;
				break;
			default: 
				transitionMonkeyImage = image_flyingMonkey;
				scale = 0.8;
				break;
		}
	} else {
		transitionMonkeyImage = image_waveMonkey;
		scale = 0.4;
	}
	
	transMonkW = transitionMonkeyImage.naturalWidth * scale;
	transMonkH = transitionMonkeyImage.naturalHeight * scale;	
}

/** After the state transition has started, this function handles the rest of it. */
function stateTransition() {
	if (transX >= 0 && !changedState) {
		createAndSetNextState();
		changedState = true;
	} else if (transX >= GAME_ACTUAL_WIDTH) {
		transitioning = false;
        if(current_state_id === "mainmenu")
            gameCanvas.style.zIndex = -1000;
	}
	
	drawImageAdjusted(image_transition, transX, 0, GAME_ACTUAL_WIDTH, GAME_ACTUAL_HEIGHT);
	drawImageAdjusted(transitionMonkeyImage, transX+GAME_ACTUAL_WIDTH/2-transMonkW/2, GAME_ACTUAL_HEIGHT/2-transMonkH/2, transMonkW, transMonkH);
	transX += 12;
}

/**
 * Destroys previous state and creates the new one, and sets the current state
 * to the new one.
 */
function createAndSetNextState() {
	currentState.destroy();
	// Get id for next state
	if (state_index >= 0) {
		current_state_id = state_order[state_index++];
		// Check if it's a doctors room
		if (current_state_id.includes("doctorroom")) {
			currentState = new DoctorRoom(current_state_id.substr(10, 1));
		} else {
			switch (current_state_id) {
				case "milkgame":
                    currentState = new MilkGame();
					break;
				case "creamgame":
					currentState = new CreamGame();
					break;
				case "scangame":
					currentState = new Scan_game();
					break;
				case "spaceshipgame":
					currentState = new SpaceShipGame();
					break;
                case "mazegame":
                    currentState = new IntestineGame();
                    break;
				case "end":
					document.location.reload();
					break;
			}
		}
	} else {
		// First two states are always the same
        if(goingToMazeGame){
            currentState = new IntestineGame();
            current_state_id = "mazegame";
            goingToMazeGame = false;
        } else {
            switch (current_state_id) {
                case "mainmenu":
                    currentState = new DoctorRoom("1");
                    current_state_id = "doctorroom1";
                    break;
                case "doctorroom1":
                    // Next state depends on button pressed            
                    currentState = new SubMenu();
                    current_state_id = "submenu";
                    break;
                case "mazegame":
                    currentState = new MainMenu();
                    current_state_id = "mainmenu";
                    break;
            }
        }

	}
	currentState.init();
	resizeGame();
}

/**
 * For handling the mute button collision detection with the cursor.
 * @function
 * @param {number} xpos - x position of cursor.
 * @param {number} ypos - y position of cursor.
 */
function muteHandler(xpos, ypos){
    if(xpos >= convertSize(GAME_ACTUAL_WIDTH * 0.9) && xpos <= convertSize(GAME_ACTUAL_WIDTH * 0.9) + convertSize(GAME_ACTUAL_WIDTH * 0.08) &&
            ypos >= convertSize(0) && ypos <= convertSize(0) + convertSize(GAME_ACTUAL_WIDTH * 0.08)){
        
        if(isGameMuted){
            isGameMuted = false;
            for(i=0;i<audioArray.length;++i)
                audioArray[i].muted = false;
            if(current_state_id !== "mazegame")
                audio_mazeGameBGM.muted = true;
            if(current_state_id !== "spaceshipgame"){
                audio_spaceshipGameBGM.muted = true;
                audio_rocketSound.muted = true;
                audio_asteroidHit.muted = true;
            }
        }
        else {
            isGameMuted = true;
            for(i=0;i<audioArray.length;++i)
                audioArray[i].muted = true;
        }
            
    }
}

/**
 * Calls @see {@link muteHandler} when user clicks on screen.
 * @function
 * @param {Event} event - The on click event.
 */
function muteButtonClickHandler(event) { 
		var rect = gameCanvas.getBoundingClientRect();
		muteHandler(Math.round((event.clientX-rect.left)/(rect.right-rect.left)*gameCanvas.width),
                    Math.round((event.clientY-rect.top)/(rect.bottom-rect.top)*gameCanvas.height));
}

/**
 * Used to hide scroll bars to prevent scrolling
 */
function unloadScrollBars() {
    document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    document.body.scroll = "no"; // ie only
}

gameCanvas.addEventListener('click', muteButtonClickHandler, false);

function preventBehavior(e) {
    e.preventDefault(); 
};
// To prevent dragging scroll on mobile
window.addEventListener("touchmove", preventBehavior, false);

// Where the game stuff begins
window.addEventListener('resize', resizeGame, false);
window.addEventListener('orientationchange', orientationCheck, false);
loadAssets();
//window.onload = function () {};