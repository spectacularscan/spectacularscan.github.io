/** Scale coordinates based on canvas size. This version converts two values.
 * @param {Number} sizex - First value to convert.
 * @param {Number} sizey - Second value to convert.
 */
function convertSizes(sizex, sizey){
    var scaleFactor = gameCanvas.width/GAME_ACTUAL_WIDTH;
    return [sizex*scaleFactor, sizey*scaleFactor];   
}

/** Scale coordinates based on canvas size.
 * @param {Number} size - Value to convert.
 */
function convertSize(size){
    return size*(gameCanvas.width/GAME_ACTUAL_WIDTH);
}

/** Draws image using the context
 * This should be called instead of context.drawImage, because it will
 * scale the dimensions for you.
 * @param {Image} _image - Already loaded image to draw.
 * @param {Number} x - x position to draw image at
 * @param {Number} y - y position to draw image at
 * @param {Number} w - width of image
 * @param {Number} h - height of image
 */
function drawImageAdjusted(_image, x, y, w, h) {
	gameContext.drawImage(_image, convertSize(x), convertSize(y), convertSize(w), convertSize(h));	
}

/** @see {@link drawImageAdjusted} but draws a rect instead of an image. */
function fillRectAdjusted(x, y, w, h) {
	gameContext.fillRect(convertSize(x), convertSize(y), convertSize(w), convertSize(h));
}

// NOTE - A bit buggy - would not use this
/** Rotates and draws an image. */
function drawRotatedRect(x,y,width,height,degrees){
    // save the untranslated/unrotated context so we can go back to it -- yeah that's what it does
    gameContext.save();
    gameContext.beginPath();
    // move the rotation point to the center of the rect
    gameContext.translate(convertSize(x), convertSize(y));
    // rotate the rect
	var angle = degrees*Math.PI/180;
    gameContext.rotate(angle);

    // draw the rect on the transformed context
    gameContext.fillRect(convertSize(-width), convertSize(-height),
                         convertSize(width), convertSize(height));

    // restore the context to its untranslated/unrotated state -- go back to the context we saved
	gameContext.restore();
}

/** 
 * @returns {boolean} True if user is on mobile device, false otherwise.
 */
function onMobileDevice(){
    var isMobile = { 
        Android: function() { return navigator.userAgent.match(/Android/i); }, 
        BlackBerry: function() { return navigator.userAgent.match(/BlackBerry/i); }, 
        iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, 
        Opera: function() { return navigator.userAgent.match(/Opera Mini/i); }, 
        Windows: function() { return navigator.userAgent.match(/IEMobile/i); }, 
        any: function() { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } 
    }; 
    
    return isMobile.any();
}

var isFirefox = typeof InstallTrigger !== 'undefined';

/**
 * Constructor for the AudioManager which handles the audio fading transition.
 * @constructor
 * @param {Audio} toFadeIn - Audio which fades in.
 * @param {Audio} toFadeOut - Audio which fades out.
 */
function AudioManager(toFadeIn, toFadeOut){
    this.oneTime = true;
    
    this.audioFadeInit = function(){
        if(isGameMuted){
            toFadeIn.volume = 0.99;
            toFadeOut.volume = 0.01;
        } else {
            toFadeIn.volume = 0.01;
            toFadeOut.volume = 0.99;
        }
            
        this.isFadeFinished = false
        toFadeIn.currentTime = 5;
        toFadeIn.loop = true;
        toFadeIn.play();
    }
    
    this.audioFadeUpdate = function(){
        if(toFadeOut.volume >= 0.02){
            toFadeOut.volume -= 0.005;
            toFadeIn.volume += 0.005;
        } else {
            toFadeOut.pause();
            this.isFadeFinished = true;
        }
    }
    
    this.reverseAudio = function(){
        if(this.oneTime){
            var temp = toFadeIn;
            toFadeIn = toFadeOut;
            toFadeOut = temp;
            this.audioFadeInit();
            this.oneTime = false;
        }
    }
    
    this.setOneTime = function(val){
        this.oneTime = val;
    }
}