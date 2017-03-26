/**
 * Constructor for the monkey used in the cream and injection game
 * @constructor
 */
function CreamMonkey() {
    /**
     * Initialises necessary variables for the monkey. 
     * @function
     * @param {CreamGame} creamGame - The game in which the monkey is used.
     * @param {number} x - The x position of the monkey.
     * @param {number} y - The y position of the monkey.
     * @param {number} width - The width of the monkey.
     * @param {number} height - The height of the monkey.
     */
	this.init = function(creamGame, x, y, width, height) {
		// IMPORTANT: The x and y passed are currently not used, 
		// monkey is instead positioned based on its state (see this.setState function)
		this.creamGame = creamGame;
		
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		
		this.fadeIn = 0;
		this.fadeOut = 1;	
		
		this.lastStateX;
		this.lastStateY;
		this.lastStateWidth;
		this.lastStateHeight;
		this.currentLimb = -1;
        this.limbInFocus = "None";//limb currently zoomed in on
        this.applyCream = false;
        this.isInjecting = false;
		
        //Adding event listeners to the canvas
		bindIt = this.onLimbClickHandler.bind(this);
		gameCanvas.addEventListener('click', bindIt, false);
		
		this.injectionPoints = [new BoundingBox("LeftHand", -0.031, 0.602, 0.228, 0.215),
							new BoundingBox("RightHand", 0.802, 0.602, 0.228, 0.215),
                            new BoundingBox("LeftFoot", 0.168, 0.872, 0.273, 0.162), 
							new BoundingBox("RightFoot", 0.541, 0.872, 0.273, 0.162)];
    
		// Set initial state
		this.setState("NORMAL");
		this.blinkMask = new BlinkMask(this.x, this.y, this.width, this.height);
	}
	
    /**
     * Update variables that subject to change. 
     * Also handles the fading effect.
     * @function
     */
	this.update = function() {
		if(this.fadeIn < 1){
			this.fadeIn += 0.02;
			this.fadeOut -= 0.02;
		}		
		if(this.fadeIn === 1){
			this.currentLimb = -1;
		}
		// Move bounding box to where monkey is
		this.updateBoundingBoxesPosition();
		if (this.monkeyState === "NORMAL")
			this.blinkMask.update();
	}
	
    /**
     * Draws monkey in the correct position according to its
     * current state.
     * @function
     */
	this.draw = function() {
		var imgHere;
		if (this.monkeyState === "HAPPY")
			imgHere = image_monkey;
		else
			imgHere = image_monkeySad;
		
		if(this.monkeyState === "NORMAL"){
			//this is the normal state - nothing has been clicked yet
			drawImageAdjusted(imgHere, this.x, this.y, this.width, this.height);
			this.blinkMask.draw();
		} else {
			//a limb has been clicked
			gameContext.globalAlpha = this.fadeOut;
			if(this.fadeOut >= 0)
				drawImageAdjusted(imgHere, this.lastStateX, this.lastStateY, this.lastStateWidth, this.lastStateHeight);
			
			gameContext.globalAlpha = this.fadeIn;			
			// Draw monkey in zoomed position
			drawImageAdjusted(imgHere, this.x, this.y, this.width, this.height);
			gameContext.globalAlpha = 1;
		}
	}
	
    /**
     * Sets the current state of the monkey. Each state represents
     * a different stage in the game.
     * @function
     * @param {string} newState - Name of state to move to.
     */
	this.setState = function(newState) {
		var oldState = this.monkeyState;
		
		if (newState === "NORMAL" || newState === "CREAMREADY" || newState === "INJECTIONREADY" || newState === "HAPPY")
			this.monkeyState = newState;
		else
			this.monkeyState = "NORMAL";
		
		if (oldState != this.monkeyState) {
			// State changed
			this.lastStateX = this.x;
			this.lastStateY = this.y;
			this.lastStateWidth = this.width;
			this.lastStateHeight = this.height;
			this.setPositionForState();
			this.creamGame.monkeyChangedState();
		}
		
		if (newState === "CREAMREADY" || newState === "HAPPY") {
			this.fadeIn = 0;
			this.fadeOut = 1;
		}
	}
	
    /**
     * When @see {@link setState} is called, it calls this function
     * which updates the monkey's position according to
     * the current state.
     * @function
     */
	this.setPositionForState = function() {
		if (this.monkeyState === "NORMAL" || this.monkeyState === "HAPPY") {			
			this.width = 301.5;
			this.height = 332;
			this.x = GAME_ACTUAL_WIDTH/2 - this.width/2;
			this.y = GAME_ACTUAL_HEIGHT/2 - this.height/2;
		} else if (this.monkeyState === "CREAMREADY" || this.monkeyState === "INJECTIONREADY") {
			this.width = 1168;
			this.height = 1318.67;
			switch (this.currentLimb) {
				// Set position based on which limb is selected
				case 0:
					// Left hand
					this.x = 290;
					this.y = -700;
					break;
				case 1:
					// Right hand
					this.x = -680;
					this.y = -700;
					break;
				case 2:
					// Left foot
					this.x = 40;
					this.y = -1020;
					break;
				case 3:
					// Right foot
					this.x = -420;
					this.y = -1020;
					break;
			}
		}
	}
	
    /**
     * Gets the bounding box with id boundingBoxID.
     * @function
     * @param {string} boundingBoxID - id of the bounding box to get.
     * @returns {BoundingBox} boundingBox with id boundingBoxID
     */
	this.getBoundingBox = function(boundingBoxID) {
		if (boundingBoxID >= this.injectionPoints.length || boundingBoxID < 0)
			return this.injectionPoints[0];
		return this.injectionPoints[boundingBoxID];
	}
	
    /**
     * Updates the positions of the monkey's bounding boxes.
     * @function
     */
	this.updateBoundingBoxesPosition = function() {
		var limbs = this.injectionPoints;
		for (var i = 0; i < limbs.length; ++i) {
			var l = limbs[i];
			l.x = this.x + this.width * l.xScaled;
			l.y = this.y + this.height * l.yScaled;
			l.width = this.width * l.widthScaled;
			l.height = this.height * l.heightScaled;
		}
	}
	
    /**
     * Handles collision detection between the cursor and the monkey.
     * @function
     * @param {number} xpos - x position of cursor.
     * @param {number} ypos - y position of cursor.
     */
	this.collisionDetection = function(xpos, ypos){
		var limbs = this.injectionPoints;
		var limbClicked = "Invalid";
		for (var i = 0; i < limbs.length; i++) { 
			if(xpos >= convertSize(limbs[i].x) && xpos <= convertSize(limbs[i].x) + convertSize(limbs[i].width) &&
				ypos >= convertSize(limbs[i].y) && ypos <= convertSize(limbs[i].y) + convertSize(limbs[i].height)){
				limbClicked = limbs[i].id;
			}
		}
		return limbClicked;
	}
	
    /**
     * Calls @see {@link collisionDetection} when the user clicks on screen
     * and performs the appropriate action depending on the current state of
     * the monkey.
     * @param {Event} event - The click event.
     */
	this.onLimbClickHandler = function(event) { 
        var rect = gameCanvas.getBoundingClientRect();
		
		var result = this.collisionDetection(
										Math.round((event.clientX-rect.left)/(rect.right-rect.left)*gameCanvas.width),
										Math.round((event.clientY-rect.top)/(rect.bottom-rect.top)*gameCanvas.height));
										
		if (this.monkeyState === "NORMAL") {
            
			switch(result){
				case "LeftHand":
                    audio_buttonPress.play();
					//zoom in to left hand, do something
					this.currentLimb = 0;
					break;
				case "RightHand":
                    audio_buttonPress.play();
					//zoom in to right hand, do something
					this.currentLimb = 1;
					break;
				case "LeftFoot":
                    audio_buttonPress.play();
					//zoom in to left foot, do something
					this.currentLimb = 2;
					break;
				case "RightFoot":
                    audio_buttonPress.play();
					//zoom in to right foot, do something
					this.currentLimb = 3;
					break;
				case "Invalid":
					//do nothing
				default: 
					//do nothing
					break;
			}
            this.limbInFocus = result;
			if(this.currentLimb >= 0){
				//gameCanvas.removeEventListener('click', bindIt, false);
				this.setState("CREAMREADY");
				this.creamGame.hideAllHelpers();
			}
		} else if (this.monkeyState === "CREAMREADY") {
            //apply cream
            
			switch(result){
				case "LeftHand":
                    audio_creamSquish.play();
                    this.canApplyCream(result);
					break;
				case "RightHand":
                    audio_creamSquish.play();
                    this.canApplyCream(result);
					break;
				case "LeftFoot":
                    audio_creamSquish.play();
                    this.canApplyCream(result);
					break;
				case "RightFoot":
                    audio_creamSquish.play();
                    this.canApplyCream(result);
					break;
				case "Invalid":
					//do nothing
				default: 
					//do nothing
					break;
			}
		} else if (this.monkeyState === "INJECTIONREADY") {
            //inject monkey
            
			if(globalCursorManager.getCurrentCursorID() === "syringe"
				&& this.limbInFocus === result
				&& !this.isInjecting) {
                audio_syringeOnSkin.play();
				this.creamGame.injection1.setLimbValues(result);
				this.isInjecting = true;
				var im = image_monkeyHand;
				globalCursorManager.setCustomCursor(true, im, "hand", -16,-16, 72.25, 73.25, 0.75);	
				// Move arrow to injection 
				this.creamGame.helperArrows[0].setShow(false);
				this.creamGame.helperArrows[1].setShow(true, this.creamGame.injection1.x+160, this.creamGame.injection1.y+80, true);
			}
        }
	}
	
    /**
     * Gets the limb with name limbName.
     * @function
     * @param {string} limbName - Name of limb to get.
     * @returns {BoundingBox} boundingBox with id limbName.
     */
	this.getLimbObject = function(limbName) {
		switch(limbName){
				case "LeftHand":
					return this.injectionPoints[0];
				case "RightHand":
					return this.injectionPoints[1];
				case "LeftFoot":
					return this.injectionPoints[2];
				case "RightFoot":
					return this.injectionPoints[3];
				default: 
					return;
			}
	}
    
	/**
     * Called in @see {@link onLimbClickHandler} to check whether
     * the limb clicked is the correct one and starts the applying cream
     * stage of the game
     * @function
     * @param {string} res - name of limb clicked.
     */
    this.canApplyCream = function(res){
		if (this.applyCream)
			return;
		
        if(this.limbInFocus === res){
            if(globalCursorManager.getCurrentCursorID() === "creamtube"){
                //apply cream
                this.creamGame.cream1.setLimbValues(res);
                this.applyCream = true;
				var im = image_monkeyHand;
				globalCursorManager.setCustomCursor(true, im, "hand", -16,-16, 72.25, 73.25, 0.75);
				var lim = this.getLimbObject(res);
				this.creamGame.helperHand1.setShow(true, lim.x+lim.width/2-this.creamGame.helperHand1.width/2, lim.y+lim.height/2-this.creamGame.helperHand1.height);
            }
        }
    }
}

/**
 * Used to create the effect of the monkey blinking.
 * @constructor
 */
function BlinkMask(monkeyX, monkeyY, monkeyWidth, monkeyHeight) {
	/*if (milkVersion) {
		this.xSizeRatio = 0.33276;
		this.ySizeRatio = 0.13226;
		this.xRatio = 0.15868;
		this.yRatio = 0.10161;
	} else {
	}*/
	this.xSizeRatio = 0.38927;
	this.ySizeRatio = 0.13246;
	this.xRatio = 0.28653;
	this.yRatio = 0.10111;
	
	this.x = monkeyX + monkeyWidth * this.xRatio;
	this.y = monkeyY + monkeyHeight * this.yRatio;
	this.width = monkeyWidth * this.xSizeRatio;
	this.height = monkeyHeight * this.ySizeRatio;
	this.delay = -1;
	
	this.recalculatePosition = function(monkeyX, monkeyY) {
		this.x = monkeyX + this.width * this.xRatio;
		this.y = monkeyY + this.height * this.yRatio;
	}
	
	this.recalculateSize = function(monkeyWidth, monkeyHeight) {
		this.width = monkeyWidth * this.xSizeRatio;
		this.height = monkeyHeight * this.ySizeRatio;
	}
	
	this.update = function() {
		if (this.delay < -0.025) {
			this.delay = (Math.random() * 3) + 1
		}
		
		this.delay -= 0.01;
	}
	
	this.draw = function() {
		if (this.delay <= 0)
			drawImageAdjusted(image_blinkMask, this.x, this.y, this.width, this.height);
	}
}