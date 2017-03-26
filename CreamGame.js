/**
 * Constructor for the cream and injection game
 * @constructor
 */
function CreamGame() {  
    /**
     * Initialises all necessary variables for the cream and injection game.
     * @function
     */
	this.init = function() {			
		this.creamMonkey = new CreamMonkey();
		this.creamMonkey.init(this, 0, 0, 301.5, 332);
		gameCanvas.style.backgroundImage = "url('" + image_doctorRoomBg.src + " ')";		
		this.bkgXPosition = -600;
		this.bkgYPosition = -450;
		this.bkgSize = 1600;
		
        //Adding event listeners for the cream and injection game
		bindItNow = this.onButtonClickHandler.bind(this);
		bindItDown = this.injectionMouseDown.bind(this);
		bindItUp = this.injectionMouseUp.bind(this);
		
		// Create buttons
		this.creamButtons = [
			new Button("cream",     image_creamButton, 		16, 16, 128, 128),
			new Button("injection", image_injectionButton, 	16, 161, 128, 128),
			// new Button("milk",      image_milkButton, 		16, 306, 128, 128)
		];
        this.whichButton = 0;
        this.buttonBar = new SideBar();
        this.cream1 = new Cream(this.creamMonkey);
        this.cream1.setValues(200, 200, 4);  
        this.injection1 = new Injection(this.creamMonkey);
		this.helperHand1 = new HelperHand();
		this.helperArrows = [];
		for (var i = 0; i < 4; ++i) {
			this.helperArrows[i] = new HelperArrow();
		}
		// Set helper arrows initial positions
		this.helperArrows[0].setShow(true, this.creamMonkey.x - 50, this.creamMonkey.y + 260, false, 39, 40);
		this.helperArrows[1].setShow(true, this.creamMonkey.x + 30, this.creamMonkey.y + 340, false, 39, 40);
		this.helperArrows[2].setShow(true, this.creamMonkey.x + 310, this.creamMonkey.y + 260, true, 39, 40);
		this.helperArrows[3].setShow(true, this.creamMonkey.x + 230, this.creamMonkey.y + 340, true, 39, 40);
    }
	
    /**
     * Updates variables which are subject to change within the game 
     * such as cursor position and the state of the monkey.
     * @function
     */
	this.update = function() {
        this.creamMonkey.update();	
		
		gameCanvas.style.backgroundSize = convertSize(this.bkgSize/MOBILE_MULTIPLIER) + "px";
		gameCanvas.style.backgroundPosition = "" + convertSize(this.bkgXPosition/MOBILE_MULTIPLIER) + "px " + convertSize(this.bkgYPosition/MOBILE_MULTIPLIER) + "px";
		for (var i = 0; i < this.creamButtons.length; ++i) {
			this.creamButtons[i].update();
		}
		
		// Update cursor position
		this.oldCursorX = this.cursorX;
		this.oldCursorY = this.cursorY;
		this.cursorX = globalCursorManager.cursorX;
		this.cursorY = globalCursorManager.cursorY;	
		if (this.cursorX != this.oldCursorX && this.cursorY != this.oldCursorY)
			this.cursorHasMoved = true;
        		
		// Update cream
		if (this.cursorHasMoved && this.creamMonkey.applyCream) {
			this.cream1.hasMoved = true;
			this.cream1.cursorX = this.cursorX;
			this.cream1.cursorY = this.cursorY;
		}
		this.cursorHasMoved = false;
        
		if (this.creamMonkey.monkeyState === "INJECTIONREADY") {
			if (this.injection1.isSyringeEmpty && !this.hidHelpersAfterInjection) {
				this.hideAllHelpers();
				this.hidHelpersAfterInjection = true;
			}
			this.injection1.cursorX = this.cursorX;
			this.injection1.cursorY = this.cursorY;
			this.injection1.update();
			if (this.injection1.goToNextState) {
				this.creamMonkey.setState("HAPPY");
			}
		}
		
		for (var i = 0; i < this.helperArrows.length; ++i) {
			if (this.helperArrows[i].show)
				this.helperArrows[i].update();
		}
		if (this.helperHand1.show) {
				this.helperHand1.update();
			if (this.cream1.r > 30 + this.cream1.increment * 100) {
				this.helperHand1.setShow(false);
			}
		}
	}
	
    /**
     * Draws all required images onto the canvas - monkey, buttons, etc.
     * @function
     */
	this.draw = function() {
		this.creamMonkey.draw();
		
        //while the user is playing
		if (this.creamMonkey.monkeyState === "CREAMREADY" || this.creamMonkey.monkeyState === "INJECTIONREADY") {
            this.buttonBar.draw();
            if(this.buttonBar.isFinished){
                for (var i = 0; i < this.creamButtons.length; ++i) {
				    this.creamButtons[i].draw();
                }
            }
		}
		
		// Draw limbs position to help debugging
		var limbs = this.creamMonkey.injectionPoints;
		gameContext.fillStyle="red";
		gameContext.globalAlpha = 0.4;
		for (i = 0; i < limbs.length; i++) { 
			var l = limbs[i];
			//fillRectAdjusted(l.x, l.y, l.width, l.height);			
        }
		gameContext.globalAlpha = 1;
		
        //drawing helper arrows
		for (var i = 0; i < this.helperArrows.length; ++i) {
			if (this.helperArrows[i].show)
				this.helperArrows[i].draw();
		}
        
        //drawing cream when appropriate
        if (this.creamMonkey.applyCream) {
            this.cream1.draw();
            if(this.cream1.fadeOut <= 0){
                this.creamMonkey.applyCream = false;
                if(this.creamMonkey.monkeyState != "INJECTIONREADY"){
                    this.creamMonkey.setState("INJECTIONREADY");
                }
            }     
        }
        
        //drawing syringe when appropriate
        if(this.creamMonkey.isInjecting) {
            this.injection1.draw();
            if(this.injection1.fadeOut <= 0){
                this.creamMonkey.isInjecting = false;
            }
        }
		
        //drawing helper hand when necessary
		if (this.helperHand1.show) {
			this.helperHand1.draw();
		}
		
        //drawing game end screen
		if (this.creamMonkey.monkeyState === "HAPPY") {
			gameContext.font = "30px Arial";
			gameContext.fillText("Well Done,",convertSize(150), convertSize(100));
			goToNextState();
		}
			
    }
    
    /**
     * Resets global variables to default values and removes eventlisteners
     * in preparation for the next state.
     * @function
     */
    this.destroy = function() {
		gameCanvas.style.backgroundImage = "none";
		gameCanvas.style.backgroundSize = "initial";
		gameCanvas.style.backgroundPosition = "initial";
		gameCanvas.removeEventListener('click', bindItNow, false);
		gameCanvas.removeEventListener('mousedown', bindItDown, false);
		gameCanvas.removeEventListener('touchstart', bindItDown, false);
		gameCanvas.removeEventListener('mouseup', bindItUp, false);
		gameCanvas.removeEventListener('touchend', bindItUp, false);
    };
	
    /**
     * Called whenever the state of the monkey hs changed
     * (i.e.) when the user completed a task in the game.
     * It prepares the for the next task - adding event listeners
     * and updating positions where necessary.
     * @function
     */
	this.monkeyChangedState = function() {
		if (this.creamMonkey.monkeyState === "CREAMREADY") {
			gameCanvas.addEventListener('click', bindItNow, false);
			var limbPicked = this.creamMonkey.currentLimb;
			switch (limbPicked) {
				case 0: case 2:
					// Left limbs
					positionButtons(this.creamButtons, "left", 72, 16, 48);
                    this.buttonBar.position = "left";
					break;
				case 1: case 3:
					// Right limbs
					positionButtons(this.creamButtons, "right", 72, 16, 48);
					break;
			}

			this.bkgSize = 2500;
			if (limbPicked === 2) {
				this.bkgXPosition = -1060;	
				this.bkgYPosition = -1000;
			} else if (limbPicked === 3)  {
				this.bkgXPosition = -1200;	
				this.bkgYPosition = -1000;
			} else if (limbPicked === 0) {
				this.bkgXPosition = -900;	
				this.bkgYPosition = -850;
			} else if (limbPicked === 1) {
				this.bkgXPosition = -1200;	
				this.bkgYPosition = -850;
			}
			// Tell buttons to fade in
			for (var i = 0; i < this.creamButtons.length; ++i)
				this.creamButtons[i].startFadingIn();
			this.creamButtons[0].setPulsating(true);
		} else if(this.creamMonkey.monkeyState === "INJECTIONREADY"){
            globalCursorManager.setCustomCursor(true, image_arrowCursor, "default", 0,0, 42, 42);
			this.hideAllHelpers();
            this.creamButtons[1].setPulsating(true);
			gameCanvas.addEventListener('mousedown', bindItDown, false);
            gameCanvas.addEventListener('touchstart', bindItDown, false);
            gameCanvas.addEventListener('mouseup', bindItUp, false);
            gameCanvas.addEventListener('touchend', bindItUp, false);
        } else if (this.creamMonkey.monkeyState === "HAPPY") {
			/*gameCanvas.removeEventListener('click', bindItNow, false);
			gameCanvas.removeEventListener('mousedown', bindItDown, false);
            gameCanvas.removeEventListener('touchstart', bindItDown, false);
			gameCanvas.removeEventListener('mouseup', bindItUp, false);
            gameCanvas.removeEventListener('touchend', bindItUp, false);*/
			globalCursorManager.setCustomCursor(true, image_arrowCursor, "default", 0,0, 42, 42);
		}
	}
    
    /**
     * Checks whether the cursor is over a button when clicked
     * and sets it as the current button if it was.
     * @function
     * @param {Number} xpos - x position of the cursor.
     * @param {Number} ypos - y position of the cursor.
     */
    this.buttonCollisionDetection = function(xpos, ypos){
        for (var i = 0; i < this.creamButtons.length; ++i){
            if(xpos >= convertSize(this.creamButtons[i].x) && xpos <= convertSize(this.creamButtons[i].x) + convertSize(this.creamButtons[i].width) &&
				ypos >= convertSize(this.creamButtons[i].y) && ypos <= convertSize(this.creamButtons[i].y) + convertSize(this.creamButtons[i].height)){
				this.whichButton = this.creamButtons[i];
				this.buttonActions(this.whichButton);
                audio_limbSelectionSound.play();
			}
        }
	}
    
    /**
     * Calls {@link buttonCollisionDetection} when the user
     * clicks on the screen which performs the appropriate actions
     * @function
     * @param {Event} event - The click event.
     */
    this.onButtonClickHandler = function(event) { 
		var rect = gameCanvas.getBoundingClientRect();
		this.buttonCollisionDetection(
                                Math.round((event.clientX-rect.left)/(rect.right-rect.left)*gameCanvas.width),
                                Math.round((event.clientY-rect.top)/(rect.bottom-rect.top)*gameCanvas.height));
    }
	
    /**
     * Checks which state the monkey is in and sets the correct
     * actions for each of the buttons such as making sure
     * wrong buttons shake when clicked.
     * @function
     * @param {Button} button - Button that was just clicked.
     */
	this.buttonActions = function(button) {
		// This should be moved at some point
		switch (button.id) {
			case "cream":
				if (this.creamMonkey.monkeyState === "CREAMREADY") {
					// Set cursor to cream
                    if(!this.creamMonkey.applyCream && button.isPulsating) {
						button.setPulsating(false);
					   globalCursorManager.setCustomCursor(true, image_creamTube,"creamtube", -5,-5, 175, 180);
						var m = this.creamMonkey.currentLimb;
						if (m===0 || m===2)
							this.helperArrows[0].setShow(true, 450, 290, true);
						else
							this.helperArrows[0].setShow(true, 230, 290, false);
					} else
						button.startShake();
				} else {
					button.startShake();
				}
				break;
            case "injection":
                if (this.creamMonkey.monkeyState === "INJECTIONREADY") {
					// Draw arrow in the same place as it was
					if (button.isPulsating) {
						button.setPulsating(false);
						this.helperArrows[0].setShow(true);
						globalCursorManager.setCustomCursor(true, image_syringe0, "syringe", 0,-100, 160, 108);
					} else
						button.startShake();
				} else {
					button.startShake();
				}
				break;
			default:
				button.startShake();
				break;
		}
		
	}
    
    /**
     * Tells the game that the mouse is held down for the
     * injection part of the game
     * @function
     * @param {Event} event - The mouse down event.
     */
    this.injectionMouseDown = function(event){
        if(this.injection1.isSyringeThere){
            this.injection1.isMouseHeldDown = true;
        }     
    }
    
    /**
     * Tells the game that the mouse is no longer held down
     * for the injection part of the game
     * @function
     * @param {Event} event - The mouse up event.
     */
    this.injectionMouseUp = function(event){
        if(this.injection1.isSyringeThere)
            this.injection1.isMouseHeldDown = false;   
    }
	
    /**
     * Hides all helper arrow objects
     */
	this.hideAllHelpers = function() {
		for (var i = 0; i < this.helperArrows.length; ++i)
			this.helperArrows[i].setShow(false);
	}
}
	
	/*function getPosition(event){
		gameCanvas.innerHTML = cursor;
		//console.log(event.clientX + " " + event.clientY);
		return [event.clientX, event.clientY];
	}
	function stopGettingPosition(){
		gameCanvas.innerHTML = "";
	}*/


//we can only change the cursor to an image that's 32 x 32 max
/*
function setCursorByID(id, cursorStyle){
    var elem;
    if(document.getElementById && (elem = document.getElementById(id))){
        if(elem.style)
            elem.style.cursor = "url('" + cursorStyle +"'), auto";
    }
}
*/

/**
 * Constructor for the helper arrow that guides the user
 * @constructor
 */
function HelperArrow() {
	this.speed = 0.075;
	this.show = false;
	this.sineCounter = 0;
	this.width = 93.5;
	this.height = 94.5;
	this.fadeOut = false;
	this.alpha = 0;
	
	this.setShow = function(show, x=-1, y=-1, pointingLeft=0, width=93.5, height=94.5) {
		if (x != -1)
			this.x = x;
		if (y != -1)
			this.y = y;
		if (!show) {
			this.fadeOut = true;
			return;
		} else
			this.show = true;
		this.width = width;
		this.height = height;
		this.xOffset = 0;
		this.yOffset = 0;
		this.fadeIn = true;
		this.fadeOut = false;
		this.alpha = 0;
		if (pointingLeft === 0)
			return;
		this.pointLeft = pointingLeft;
		if (pointingLeft)
			this.myImage = image_helperArrowLeft;
		else
			this.myImage = image_helperArrowRight;
	}
	
	this.update = function() {
		if (this.show) {
			this.sineCounter += this.speed;
			if (this.pointLeft) {
				this.xOffset = Math.sin(this.sineCounter) * 8;
				this.yOffset = this.xOffset;
			} else {
				this.xOffset = -Math.sin(this.sineCounter) * 8;
				this.yOffset = -this.xOffset;
			}
			
			if (this.fadeOut) {
				if (this.alpha > 0)
					this.alpha -= 0.05;
				if (this.alpha <= 0) {
					this.fadeOut = false;
					if (!this.fadeIn)
						this.show = false;
				}
			} else if (this.fadeIn) {
				this.show = true;
				if (this.alpha < 1)
					this.alpha += 0.05;
				if (this.alpha >= 1)
					this.fadeIn = false;
			}
		}
	}
	
	this.draw = function() {
		// Helper arrow
		if (this.show) {
			gameContext.globalAlpha = this.alpha;
			drawImageAdjusted(this.myImage, this.x+this.xOffset, this.y+this.yOffset, this.width, this.height);
			gameContext.globalAlpha = 1;
		}
	}
}

/**
 * Constructor for the helper hand that guides the user
 * when applying the cream
 * @constructor
 */
function HelperHand() {
	this.speed = 0.1;
	this.show = false;
	this.width = 60;
	this.height = 60;
	this.myImage = image_monkeyHand;
	this.radius = 30;
	this.fadeOut = false;
	
	this.setShow = function(show, x=-1, y=-1) {
		if (x != -1)
			this.x = x;
		if (y != -1)
			this.y = y;
		if (!show) {
			this.fadeOut = true;
			return;
		} else
			this.show = show;
		this.xOffset = 0;
		this.yOffset = 0;
		this.angle = 0;
		this.alpha = 0;
		this.fadeIn = true;
	}
	
	this.update = function() {
		if (this.show) {
			this.xOffset = Math.cos(this.angle)*this.radius;
			this.yOffset = Math.sin(this.angle)*this.radius;
			this.angle += 0.1;
			
			if (this.fadeOut) {
				if (this.alpha > 0)
					this.alpha -= 0.05;
				if (this.alpha <= 0)
					this.show = false;
			} else if (this.fadeIn) {
				this.show = true;
				if (this.alpha < 0.4)
					this.alpha += 0.05;
				if (this.alpha >= 1)
					this.fadeIn = false;
			}
		}
	}
	
	this.draw = function() {
		// Helper arrow
		if (this.show) {
			gameContext.globalAlpha = this.alpha;
			drawImageAdjusted(this.myImage, this.x+this.xOffset, this.y+this.yOffset, this.width, this.height);
			gameContext.globalAlpha = 1;
		}
	}
}

/**
 * Constructor for the bounding boxes used in collision detection
 * @constructor
 * @param {string} id - Used to id the bounding box.
 * @param {Number} xScaled - x position of bounding box.
 * @param {Number} yScaled - y position of bounding box.
 * @param {Number} widthScaled - width of bounding box.
 * @param {Number} heightScaled - height of bounding box.
 */
function BoundingBox(id, xScaled, yScaled, widthScaled, heightScaled){
    this.id = id;
    this.xScaled = xScaled;
	this.yScaled = yScaled;
	this.widthScaled = widthScaled;
	this.heightScaled = heightScaled;
}

/**
 * Constructor for the sidebar where the buttons are placed
 * @constructor
 */
function SideBar() {
    this.position = "right"
    this.barWidth = 0;
    this.isFinished = false;
    this.flash = false;
    this.dontFlash = true;
    this.counter = 10;
    this.color = "rgba(0,200,0,1)"
    
    this.draw = function(){
        if(this.position === "right"){
            //sidebar on the right side
            //gameContext.fillRect(gameCanvas.width - convertSize(this.barWidth), 0, convertSize(this.barWidth), gameCanvas.height);
			gameContext.drawImage(image_sideBar, gameCanvas.width - convertSize(this.barWidth), 0, convertSize(this.barWidth), gameCanvas.height);
        } else {
            //sidebar on the left side
            //gameContext.fillRect(0, 0, convertSize(this.barWidth), gameCanvas.height);  
			gameContext.drawImage(image_sideBar, 0, 0, convertSize(this.barWidth), gameCanvas.height);
        }
        
        if(convertSize(this.barWidth) < gameCanvas.width / 4.9){
            this.barWidth += 5;
        } else {
            this.isFinished = true;
        }
    }
}

/**
 * Checks whether a point is inside a bounding box
 * @function
 * @param {BoundingBox} box - Bounding box.
 * @param {Number} inX - x value of point.
 * @param {Number} inY - y value of point.
 */
function inBoundingBox(box, inX, inY) {
	return inX >= convertSize(box.x)
	&& inX <= convertSize(box.x) + convertSize(box.width)
	&& inY >= convertSize(box.y)
	&& inY <= convertSize(box.y) + convertSize(box.height);
}

/**
 * Constructor for the cream which is applied on the monkey
 * @constructor
 * @param {CreamMonkey} myMonkey - The monkey who the user is applying cream on.
 */
function Cream(myMonkey) {
    this.duration = 200;//how many times it expands
    this.fadeOut = 1;//alpha for when we need to fade it out
    this.hasMoved = false;//if the user moves the cursor then the cream is applied
    this.isFinished = false;//when we have finished applying all the cream
    this.increment = 1;
    this.r = 30;
	this.cursorX;
	this.cursorY;
	this.limbBoundingBox;
	this.myMonkey = myMonkey;
    
    //for drawing the image - (x, y) is the center of the image
    this.setValues = function(x, y, r, i){
        this.xPos = x;
        this.yPos = y;
        this.r = r;
        this.increment = i;
    }
    
    this.setLimbValues = function(whichLimb){
        switch(whichLimb){
            case "LeftHand":
                this.setValues(410, 200, 30, 0.35);
                break;
            case "RightHand":
                this.setValues(370, 205, 30, 0.35);
                break;
            case "LeftFoot":
                this.setValues(392, 240, 30, 0.20);
                break;
            case "RightFoot":
                this.setValues(385, 240, 30, 0.20);
                break;
            default:
                break;
        }
    }
    
    this.update = function(){
        if(this.duration === 0){//i.e. finished
        //if(true){//i.e. finished
            this.isFinished = true;
            if(this.fadeOut > 0){//start the fade out once finished
                this.fadeOut -= 0.02;  
            }
        }
        
        if(this.hasMoved && this.duration > 0
				&& inBoundingBox(this.myMonkey.getBoundingBox(this.myMonkey.currentLimb), this.cursorX, this.cursorY)) {
            this.duration -= 1;
			this.fadeOut -= 0.004;
            this.r += this.increment;//increase size of image
            this.hasMoved = false;
        }   
    }
    
    this.draw = function(){
        this.update();
        
        //if(this.isFinished){
            //start fading out
            gameContext.globalAlpha = this.fadeOut;
        //}
        //console.log(this.r);
        if(this.fadeOut > 0)
            drawImageAdjusted(image_creamSpread, this.xPos - (this.r / 2), this.yPos - (this.r / 2), this.r, this.r);
        gameContext.globalAlpha = 1;
		
    }
}

/**
 * Constructor for the syringe which is used on the monkey
 * @constructor
 * @param {CreamMonkey} griffMonkey - The monkey who the user injects.
 */
function Injection(griffMonkey){
    this.x;
    this.y;
    this.volumeX;
    this.volumeY;
    this.syringeVolume = 30;
    this.isMouseHeldDown = false;
    this.limbBoundingBox;
    this.cursorX;
	this.cursorY;
    this.fadeOut = 1;
    this.isSyringeEmpty = false;
    this.myMonkey = griffMonkey;
    this.isSyringeThere = true;
	this.boundingBox = new BoundingBox("Syringe", 1.1, 0.8, 1.1, 1.2); 
    
    //the x and y values for the syringe and the injection liquid
    this.setValues = function(x, y, volX, volY){
        this.x = x;
        this.y = y;
		
        this.volumeX = volX;
        this.volumeY = volY;
		this.nextStateDelay = 2;
		this.width = 160;
		this.height = 108;
    }
    
    this.setLimbValues = function(whichLimb){
        switch(whichLimb){
            case "LeftHand":
                this.setValues(410, 100, 495, 175);
                break;
            case "RightHand":
                this.setValues(370, 100, 455, 175);
                break;
            case "LeftFoot":
                this.setValues(392, 130, 477, 205);
                break;
            case "RightFoot":
                this.setValues(385, 130, 470, 205);
                break;
            default:
                break;
        }
    }
    
    this.update = function(){
        if(this.syringeVolume <= 0 && !this.isSyringeEmpty) {
            this.isSyringeEmpty = true;
		}
        
        if(this.isSyringeEmpty){//i.e. finished
            if(this.fadeOut > 0){//start the fade out once finished
                this.fadeOut -= 0.02;  
            } else {
                this.isSyringeThere = false;
            }
        }
        
		this.syringePressed = false;
        if(this.isMouseHeldDown && !this.isSyringeEmpty
				&& inBoundingBox(this.boundingBox, this.cursorX, this.cursorY)) {
            //reduce the amount in syringe
			this.syringePressed = true;
            this.syringeVolume -= 0.15;
            //this.isMouseHeldDown = false;
        }   
		
		// Go to next state after injection
		if (!this.isSyringeThere) {
			if (this.nextStateDelay > 0) {
				this.nextStateDelay -= 0.05;
			} else {
				this.goToNextState = true;
			}
		}
		
		// Update bounding box
		var l = this.boundingBox;
		l.x = this.x * l.xScaled;
		l.y = this.y * l.yScaled;
		l.width = this.width * l.widthScaled;
		l.height = this.height * l.heightScaled;
    }
    
    this.draw = function(){
        if(this.isSyringeEmpty){
            //start fading out
            gameContext.globalAlpha = this.fadeOut;
        }
        if(this.fadeOut > 0){
            gameContext.fillStyle = "rgba(219,112,147, 0.8)"
            drawRotatedRect(this.volumeX, this.volumeY, 30, this.syringeVolume, 60);
			if (this.syringePressed && !this.isSyringeEmpty)
				var im = image_syringe1;
			else
				var im = image_syringe0;
			
            drawImageAdjusted(im, this.x, this.y, this.width, this.height);
            this.isSyringeThere = true;
        }
          
		// Draw syringe bounding box for debugging
		/*gameContext.fillStyle="green";
		gameContext.globalAlpha = 0.4;
		var l = this.boundingBox;
		fillRectAdjusted(l.x, l.y, l.width, l.height);			
		gameContext.globalAlpha = 1;*/
		  
        gameContext.globalAlpha = 1;
    }
    
}