/**
 * Constructor for the cursor manager which handles all
 * cursor behaviour.
 * @constructor
 */
function CursorManager() {	
	this.init = function() {
		// Track cursor
		// Need to bind the method because can't use "this" for addEventListener
		var bindIt = this.updateCursorPosition.bind(this);
		gameCanvas.addEventListener('mousemove', bindIt, false);
		gameCanvas.addEventListener('touchmove', bindIt, false);
		gameCanvas.addEventListener('touchstart', bindIt, false);
		
		// Set initial cursor
		this.hideCursor = false;
		this.customCursorScale = 0;
		var im = image_arrowCursor;
		this.setCustomCursor(true, im, "default", 0,0, 42, 42);
		this.setCustomCursorToNewValues();
	}
	
	this.update = function() {
		// Deal with size of cursor
		if (this.drawCustomCursor)
			this.growCursor();
	}
	
	this.draw = function() {
		if (this.drawCustomCursor && !this.hideCursor) {	
			gameContext.globalAlpha = this.customCursorAlpha;
			gameContext.drawImage(this.customCursorImage, 
			this.cursorX+convertSize(this.customCursorXOffset + this.customCursorWidth/2*(1-this.customCursorScale)),
			this.cursorY+convertSize(this.customCursorYOffset + this.customCursorHeight/2*(1-this.customCursorScale)),
			convertSize(this.customCursorWidth * this.customCursorScale),
			convertSize(this.customCursorHeight * this.customCursorScale));
			gameContext.globalAlpha = 1;
		}
	}
	
    //Allows the use of images as cursors
	/**
	 * Show/hide and set the custom cursor.
	 * @param turnOnCustomCursor - whether or not to show the new cursor
	 * @param _image - the image to change the cursor to
	 * @param xOffset - x offset for the x position of the cursor
	 * @param yOffset - y offset for the y position of the cursor
	 * @param drawAlpha - alpha value used when drawing the cursor
	 */
	this.setCustomCursor = function(turnOnCustomCursor, _image, cursorID, xOffset, yOffset, width, height, drawAlpha=1) {
		if (!turnOnCustomCursor) {
			this.drawCustomCursor = false;
			this.setHideCursor(0, false);
			return;
		}
		
		if (this.customCursorID === cursorID)
			return;
		this.setHideCursor("gameCanvas", true);
		this.drawCustomCursor = true;
		this.customCursorNewImage = _image;
		this.customCursorNewXOffset = xOffset;
		this.customCursorNewYOffset = yOffset;
		this.customCursorNewWidth = width;
		this.customCursorNewHeight = height;
		this.customCursorNewAlpha = drawAlpha;
		this.customCursorChanging = true;
		this.customCursorID = cursorID;
		
		if (onMobileDevice() && this.customCursorID === "default") {
			this.hideCursor = true;
			document.getElementById("mouse").style.display = "none";
		}
	}
	
	/**
	 * Hides the default cursor.
	 * @param id - id of the canvas
	 * @param hide - whether to hide or show the cursor
	 */
	this.setHideCursor = function(id, hide) {
		if (hide) {
			if(document.getElementById && (elem = document.getElementById(id))){
			if(elem.style)
				elem.style.cursor = "url('" + image_nothing.src +"'), auto";
			}
			
		} else {
			// TODO: Set cursor back to default here
			0;
		}
	}
	
		
	this.growCursor = function() {
		if (this.customCursorChanging) {
			// Shrink to scale 0
			if (this.customCursorScale > 0)
				this.customCursorScale -= 0.05;
			else {
				this.customCursorScale = 0;
				this.customCursorChanging = false;
				this.setCustomCursorToNewValues();
			}
		} else {
			// Grow to full size
			if (this.customCursorScale < 1)
				this.customCursorScale += 0.05;
		}
	}
		
	this.setCustomCursorToNewValues = function() {
		this.customCursorImage = this.customCursorNewImage;
		this.customCursorXOffset = this.customCursorNewXOffset;
		this.customCursorYOffset = this.customCursorNewYOffset;
		this.customCursorWidth = this.customCursorNewWidth;
		this.customCursorHeight = this.customCursorNewHeight;
		this.customCursorAlpha = this.customCursorNewAlpha;
	}
	
	this.updateCursorPosition = function(event) {
		var rect = gameCanvas.getBoundingClientRect();
        if(onMobileDevice()){
            this.cursorX = Math.round((event.touches[0].clientX-rect.left)/(rect.right-rect.left)*gameCanvas.width);
            this.cursorY = Math.round((event.touches[0].clientY-rect.top)/(rect.bottom-rect.top)*gameCanvas.height);	
        } else {
            this.cursorX = Math.round((event.clientX-rect.left)/(rect.right-rect.left)*gameCanvas.width);
            this.cursorY = Math.round((event.clientY-rect.top)/(rect.bottom-rect.top)*gameCanvas.height);
        }	
	}
	
	this.getCurrentCursorID = function() {
		return this.customCursorID;
	}
}