var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

/**
 * Constructor for the sub menu
 * @constructor
 */
function SubMenu(){

    /**
     * Initialises all necessary variables for the sub menu
     */
    this.init = function(){
		this.drawFirst = true;
        this.xPos = 0;
        this.yPos = 0;
        //this.select_Menu = new Image();
        //this.select_Menu = image_button_selectScan;
        //this.glowyThing = true;
        
		this.buttonsHovered = [false, false, false, false];
		this.buttonsPressed = [false, false, false, false];
		this.unpressedImages = [image_milkUnpressed, image_mag3Unpressed, image_dmsaUnpressed, image_meckelUnpressed];
		this.pressedImages = [image_milkPressed, image_mag3Pressed, image_dmsaPressed, image_meckelPressed];
		this.glowImages = [image_milkGlow, image_mag3Glow, image_dmsaGlow, image_meckelGlow];
		this.tvImages = [image_monkey, image_flyingMonkey, image_doctorMonkey, image_karateMonkey];
        
		this.yPositions = [86, 174, 261, 348];
		
        this.bindItTwo = this.mouseClickHandler.bind(this);
        canvas.addEventListener("mousedown", this.bindItTwo, false);
        canvas.addEventListener("touchend", this.bindItTwo, false);
    }
    
    /**
     * Draw subMenu images.
     */
    this.draw = function(){
        drawImageAdjusted(image_doctorRoomBg,0,0,GAME_ACTUAL_WIDTH,GAME_ACTUAL_HEIGHT);

		var hoveredButton = -1;
		// Draw buttons
		for (var i = 0; i < this.buttonsHovered.length; ++i) {
			if (this.buttonsPressed[i]) {
				drawImageAdjusted(this.pressedImages[i], 13, this.yPositions[i]-16, 226, 103);
			}
			else if (this.buttonsHovered[i]) {
				drawImageAdjusted(this.glowImages[i], 13, this.yPositions[i]-16, 226, 103);
				hoveredButton = i;
			}
			else {
				drawImageAdjusted(this.unpressedImages[i], 13, this.yPositions[i]-16, 226, 103);
			}
		}
		
		// Draw header
		drawImageAdjusted(image_selectMinigameHeader, GAME_ACTUAL_WIDTH/2-486/2, 8, 486, 68);
		// Draw the TV
		if (hoveredButton == -1)
			drawImageAdjusted(image_tvScreen, 254, 78, 528, 347);
		else {
            if(hoveredButton===0){
                drawImageAdjusted(image_transition,  254, 78, 528, 347);
                drawImageAdjusted(this.tvImages[hoveredButton], 380, 100, 300, 300);
            }
            else if (hoveredButton===1) {
                drawImageAdjusted(image_transition,  254, 78, 528, 347);
                drawImageAdjusted(this.tvImages[hoveredButton], 380, 100, 300, 300);
            }
            else if (hoveredButton===2) {
                drawImageAdjusted(image_transition,  254, 78, 528, 347);
                drawImageAdjusted(this.tvImages[hoveredButton], 380, 100, 300, 300);
            }
            else if (hoveredButton===3){
                drawImageAdjusted(image_transition,  254, 78, 528, 347);
                drawImageAdjusted(this.tvImages[hoveredButton], 380, 100, 300, 300);
            }
        }
    }
    
    /**
     * Update cursor position for onhover events.
     */
    this.update = function(){
		this.xPos = globalCursorManager.cursorX;
		this.yPos = globalCursorManager.cursorY;
		
		for (var i = 0; i < this.buttonsHovered.length; ++i)
			this.buttonsHovered[i] = false;
		
		if((this.xPos >= convertSize(30) && this.xPos <= convertSize(220)) && (this.yPos >= convertSize(86)  && this.yPos <= convertSize(158))){
			this.buttonsHovered[0] = true;
			
		}
		else if((this.xPos >= convertSize(30) && this.xPos <= convertSize(220)) && (this.yPos >= convertSize(174)  && this.yPos <= convertSize(244))){
			this.buttonsHovered[1] = true;
		}

		else if((this.xPos >= convertSize(30) && this.xPos <= convertSize(220)) && (this.yPos >= convertSize(261)  && this.yPos <= convertSize(331))){
			this.buttonsHovered[2] = true;
		}

		else if((this.xPos >= convertSize(30) && this.xPos <= convertSize(220)) && (this.yPos >= convertSize(348)  && this.yPos <= convertSize(414))){
			this.buttonsHovered[3] = true;
		}
    }
    
    /**
     * Removes listeners added by the sub menu.
     */
    this.destroy = function(){
        ctx.clearRect(0,0, canvas.width, canvas.height);
        canvas.removeEventListener("mousedown", this.bindItTwo, false);
        canvas.removeEventListener("touchend", this.bindIt, false);
    }

    /*this.mouseMoveHandler = function(e){
        var can = canvas.getBoundingClientRect()
        // console.log(e.clientX - can.left);
        //console.log(e.clientY - can.top); 
        this.xPos = convertSize(e.clientX) - can.left;
        this.yPos = convertSize(e.clientY) - can.top;
		//console.log(can.left);
    }*/

    this.mouseClickHandler = function(e){
		if (this.changingState)
			return;
        var can = canvas.getBoundingClientRect()
        if((this.xPos >= convertSize(30) && this.xPos <= convertSize(220)) && (this.yPos >= convertSize(86)  && this.yPos <= convertSize(158))){
			setRoute(true);
            goToNextState(true);
			this.buttonsPressed[0] = true;
			this.changingState = true;
        }
        else if((this.xPos >= convertSize(30) && this.xPos <= convertSize(220)) && (this.yPos >= convertSize(174)  && this.yPos <= convertSize(244))){
			setRoute(false);
			goToNextState(true);
			this.buttonsPressed[1] = true;
			this.changingState = true;
        }
        else if((this.xPos >= convertSize(30) && this.xPos <= convertSize(220)) && (this.yPos >= convertSize(261)  && this.yPos <= convertSize(331))){
			setRoute(false);
			goToNextState(true);
			this.buttonsPressed[2] = true;
			this.changingState = true;
        }
        else if((this.xPos >= convertSize(30) && this.xPos <= convertSize(220)) && (this.yPos >= convertSize(348)  && this.yPos <= convertSize(414))){
			setRoute(false);
            goToNextState(true);	
			this.buttonsPressed[3] = true;
			this.changingState = true;
        }
    }
}
