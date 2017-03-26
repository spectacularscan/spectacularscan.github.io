/**
 * Constructor for our user-made button. It contains behaviour for shaking,
 * pulsating and fading, among other things.
 * @constructor
 * @param {string} id - id for button to identify it.
 * @param {Image} image - image to use for button.
 * @param {Number} x - x position of button.
 * @param {Number} y - y position of button.
 * @param {Number} width - width of button.
 * @param {Number} height - height of button.
 */
function Button(id, image, x, y, width, height) {
    this.id = id;
	this.image = image;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.alpha = 0;
	this.fadingIn = false;
	this.isPulsating = false;
	this.pulsateSizeBoost = 0;
	this.pulsateSineCounter = 0;
	this.shakeOffset = 0;
	this.shakeTimer = 0;
	this.sparkles = [];
	this.sparkleCounter = 0;
	for (var i = 0; i < 20; ++i) {
		this.sparkles[i] = new Sparkle(8,8);
	}	
	this.update = function() {
        //using the alpha to produce fading effect
		if (this.fadingIn) {
			if (this.alpha < 1) {
				this.alpha += 0.02;
			} else {
				this.alpha = 1;
				this.fadingIn = false;
			}
		}
        //using sine to change the size of buttons to produce pulsating effect
		if (this.isPulsating) {
			this.pulsateSizeBoost = 8 + Math.sin(this.pulsateSineCounter) * 8;
			this.pulsateSineCounter += 0.05;
			// Manage sparkles
			for (var i = 0; i < this.sparkles.length; ++i) {
				if (!this.sparkles[i].disabled) {
					this.sparkles[i].update();
					if (this.sparkles[i].y+this.sparkles[i].height > this.y+this.height)
						// Disable sparkle
						this.sparkles[i].disabled = true;
				}
			}
            //produce sparkles
			if (this.sparkleCounter <= 0) {
				// New sparkle
				this.sparkleCounter = 0.25;
				if (this.sparkles[0].disabled) {
					this.sparkles[0].appear(this.x, this.y, this.width, this.height);
					// Move sparkle to back of array
					this.sparkles.push(this.sparkles.shift());
				}
			} else {
				this.sparkleCounter -= 0.05;
			}
					
		}
        //produce shaking effect
		if (this.shakeTimer > 0) {
			this.shakeOffset = Math.sin(this.shakeTimer) * 5;
			this.shakeTimer -= 0.45;
			if (this.shakeTimer <= 0)
				this.shakeOffset = 0;
		}
		
	}
	
	this.startFadingIn = function() {
		this.fadingIn = true;
	}
	this.setPulsating = function(pulsate) {
		this.isPulsating = pulsate;
		if (!pulsate)
			this.pulsateSizeBoost = 0;
	}
	
	this.startShake = function() {
		this.shakeTimer = 25;
	}
	
	this.draw = function() {
		gameContext.globalAlpha = this.alpha;
		drawImageAdjusted(this.image, this.x - this.pulsateSizeBoost/2 + this.shakeOffset, this.y - this.pulsateSizeBoost/2, 
		this.width + this.pulsateSizeBoost, this.height + this.pulsateSizeBoost);
		gameContext.globalAlpha = 1;
		
		// Draw sparkles
		if (this.isPulsating)
			for (var i = 0; i < this.sparkles.length; ++i)
				if (!this.sparkles[i].disabled)
					this.sparkles[i].draw();
	}
}

/**
 * Constructor for button sparkles
 * @constructor
 * @param {Number} width - width of sparkle.
 * @param {Number} height - height of sparkle.
 */
function Sparkle(width, height) {
	this.gravity = 0.001;
	this.width = width;
	this.height = height;
	this.disabled = true;
	
	// Pass it x and y for the top left of the spawn area
	this.appear = function(x, y, spawnAreaWidth, spawnAreaHeight) {
		this.x = x + Math.random() * spawnAreaWidth;
		this.y = y + Math.random() * spawnAreaHeight;
		// Random speeds
		this.ySpeed = -0.05;
		this.disabled = false;
	}
	
	this.update = function() {
		// Fall
		this.ySpeed += this.gravity;
		this.y += this.ySpeed;
	}
	
	this.draw = function() {
		drawImageAdjusted(image_sparkle, this.x, this.y, this.width, this.height);
	}
}

// buttons is an array of buttons
// position: "left", "right"
// padding - a number of pixels
function positionButtons(buttons, position, padding, distanceFromEdge=16, distanceFromTop=0) {
	var y = 16 + distanceFromTop;
	
	for (var i = 0; i < buttons.length; ++i) {		
		if (position === "right") {
			buttons[i].x = GAME_ACTUAL_WIDTH - buttons[i].width - distanceFromEdge;
		} else
			buttons[i].x = distanceFromEdge;
	

		if (i === 0) {
			buttons[i].y = y;
			y += buttons[i].height + padding;
		} else {
			buttons[i].y = y;
			y += buttons[i].height + padding;
		}
	}
}