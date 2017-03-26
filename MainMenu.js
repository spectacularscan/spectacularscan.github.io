var difficulty = false;
var alertOneTime = false;
/** This is the javascript object for the main menu. It holdes all of the functions and variables used to make interactions for the user to the main menu.
*@author Luke
* @constructor
*/
function MainMenu(){
    var imageLoadDelay = 120;
    var imageOneTime = false;
	/**
	*This is the psudeo constructor function for the main menu object.
	*/
	this.init = function(){// Initiliser method for the Title menu
        if(isFirefox && !alertOneTime){
            alert("Please zoom in as necessary for the best viewing experience");
            alertOneTime = true;
        }
        audio_mainBGM.loop = true;
        audio_mainBGM.currentTime = 2;
        audio_mainBGM.play();
		var background = document.getElementById("background");
		background.style.display = "initial";
        document.getElementById("mouse").style.visibility = "visible";
		
		var myInterval;
		var boolSound = true;
		var Mainaudio = new Audio('assets/sounds/MainMenu_song.mp3');
		Mainaudio.loop = true;
		//Mainaudio.play();
		var toyAudio = new Audio('assets/sounds/toyAudio.mp3');
		toyAudio.volume = 0.1;
		var doorAudio = new Audio('assets/sounds/doorAudio.mp3');
		var plantAudio = new Audio('assets/sounds/plantAudio.mp3');
		this.disableImageDragging();
		/** This module of code is for the animation for the toy spaceship - Variables and functions used for the toy spaceship interaction*/
		{
			var elemToy = document.getElementById("myToy");
			/**This function animates the toyship element when the mouse hovers over it. 
			*/
			elemToy.onmouseover = function () {
				document.getElementById("toy").src="assets/menu/toyOn.png";
				elemToy.className = "scale";
				toyAudio.play();
			}
			/**This function stops the animation of the toyship element when the mouse hovers out of it. 
			*/
			elemToy.onmouseout = function () {
				document.getElementById("toy").src="assets/menu/toy.png";
				elemToy.className = "none";
				toyAudio.pause();
				toyAudio.currentTime = 0;
			}
		}	
		/**This module of code is for the animation for the animation for potted plant - Variables and functions for the plant interaction
		*/
		{
			var elemPlant = document.getElementById("myPlant");
			var elemText = document.getElementById("mazetext");
			/**This function sets the stage to the maze game stage */
			elemPlant.onclick = function () {
                document.getElementById("mouse").style.visibility = "hidden";
                goingToMazeGame = true;
                goToNextState(true);
			}
			/**This function animates the plant element when the mouse hovers over it. */
			elemPlant.onmouseover = function () {
				elemPlant.className = "over";
				plantAudio.play();
			}
			/**This function stops the animation of the plant element when the mouse hovers out of it. 
			*/
			elemPlant.onmouseout = function () {
				elemPlant.className = "none";
				plantAudio.pause();
				plantAudio.currentTime = 0;
			}
		}
		/**This module of code is for the animation for the animation for door - Variables and functions used for the door interaction
		*/
		{
			var elemDoor = document.getElementById("myDoor");
			/**This function brings up the clipboard element when the door is clicked */
			elemDoor.onclick = function () {
				document.getElementById("myClipboard").className = "vis";
				document.getElementById("myElements").style.display = "none";
			}
			/**This function animates the door element when the mouse hovers over it. */
			elemDoor.onmouseover = function () {
				elemDoor.className = "glo";
				doorAudio.play();
			}
			/**This function stops the animation of the door element when the mouse hovers out of it. 
			*/
			elemDoor.onmouseout = function () {
				elemDoor.className = "none";
				doorAudio.pause();
				doorAudio.currentTime = 0;
			}
		}
		/**This module of code is for the animation for clip board - Variables and functions used in the clip board element
		*/
		{
			var elemTick1 = document.getElementById("tick1");
			var elemTick2 = document.getElementById("tick2");
			/**This function goes to the next stage of the game when clicked - Leaves the main menu. 
			*/
			elemTick1.onclick = function () {
				var thisElem = document.getElementById("background");
				goToNextState(true);
			}	
			/**This function goes to the next stage of the game when clicked - Leaves the main menu, turns difficulty to true. 
			*/
			elemTick2.onclick = function () {
				var thisElem = document.getElementById("background");
				difficulty = true;
				goToNextState(true);
			}
			/**This function animates the tick element when the mouse hovers over the top tick box. */
			elemTick1.onmouseover = function () {
				elemTick1.className = "vis";
			}
			/**This function stops the animation of the tick element when the mouse hovers out of it. 
			*/
			elemTick1.onmouseout = function () {
				elemTick1.className = "notopac";
			}
			/**This function animates the tick2 element when the mouse hovers over the bottom tick box. */
			elemTick2.onmouseover = function () {
				elemTick2.className = "vis";
			}
			/**This function stops the animation of the tick2 element when the mouse hovers out of it. 
			*/
			elemTick2.onmouseout = function () {
				elemTick2.className = "notopac";
			}
		}
		/**This module of code is for the animation for home button - Variables and functions used for the home button. Used to switch from the clipboard back to the main menu.
		*/
		{
			var elemHome = document.getElementById("home");
			/**This function hides the clipboard and brings back the main menu when the home element is clicked. */
			elemHome.onclick = function () {
				var thisElem = document.getElementById("myClipboard");
				var thisElem2 = document.getElementById("myElements");
				thisElem.className = "invis";
				thisElem2.style.display = "inline";
				thisElem2.className = "vis";
				
			}
			/**This function animates the home button element when the mouse hovers over it. */
			elemHome.onmouseover = function () {
				elemHome.className = "glo";
			}
			/**This function stops the animation of the home button element when the mouse hovers out of it. 
			*/
			elemHome.onmouseout = function () {
				elemHome.className = "none";
			}
		}
		/**This module of code is for the self made cursor- Variables and functions used for the mouse cusor to move with the mouse
		*/
		{
			document.onmousemove = function(event){
				var thisElem = document.getElementById("mouse");
				var logo = document.getElementById('background');
				var logoTextRectangle = logo.getBoundingClientRect();
				//console.log(event.clientX-logoTextRectangle.left);
				thisElem.style.left = event.clientX-logoTextRectangle.left+"px";
				//console.log(event.clientY-logoTextRectangle.top);

				thisElem.style.top = event.clientY-logoTextRectangle.top-5+"px";
			}
		}
		/**This module of code is for the sound button - Variables and functions used for the sound mute button.
		*/
		{
			var soundBtn = document.getElementById("sound");
			/**This function toggles between muted and not muted sound when the button is clicked. */
			soundBtn.onclick = function () {
				if (boolSound){
					//Mainaudio.pause();
                    //audio_mainBGM.pause();
					toyAudio.muted = true;
					doorAudio.muted = true;
					plantAudio.muted = true;
					boolSound = false;
					document.getElementById("snd").src ="assets/menu/soundOff.png";
                    isGameMuted = true;
                    for(i=0;i<audioArray.length;++i)
                        audioArray[i].muted = true;
                }
				else{
					//Mainaudio.play();
                    //audio_mainBGM.play();
					toyAudio.muted = false;
					doorAudio.muted = false;
					plantAudio.muted = false;
					boolSound = true;
					document.getElementById("snd").src ="assets/menu/sound.png";
                    isGameMuted = false;
                    for(i=0;i<audioArray.length;++i)
                        audioArray[i].muted = false;
                }	
			}
		}
	}
	/**This is the update function used to commmunicate with the main script. Not used in this code*/
	this.update = function(){
        if(isFirefox){
            if(imageLoadDelay <= 0 && !imageOneTime){
                document.getElementById("loadingText").style.display = "none";
                document.getElementById("gameArea").style.visibility = "visible";
                imageOneTime = true;
            } 
            imageLoadDelay -= 1;
        } else {
            if(!imageOneTime){
                document.getElementById("loadingText").style.display = "none";
                document.getElementById("gameArea").style.visibility = "visible";
                imageOneTime = true;
            }
        }
	}	
	/**This function is used to draw anything that needs to be redrawn continuesly to make animations. The monkey animation used this function to make the monkey wave and blink.*/
	this.draw = function(){
		this.animMonkey();
	}
	/**This function is used to destroy or 'disable' the current object so another object - another stage - can take its place. For the main menu, it sets its display to none.*/
	this.destroy = function(){
		var thisElem = document.getElementById("background");
		thisElem.style.display = "none";
	}
	
	var monkeyCounter = 0; //counter variable for monkey animation
	var bmonkeyCounter = 0; //counter variable for monkey animation
	
	/**This function is used to animate the monkey waving and blinking */
	this.animMonkey = function(){
		if (monkeyCounter == 0){
			document.getElementById("change").src="assets/menu/monkeyW1.png";
			++monkeyCounter;
			++bmonkeyCounter;
		}
		else if (bmonkeyCounter >= 90 && bmonkeyCounter <= 93){
			document.getElementById("change").src="assets/menu/monkeyW2B.png";
			++bmonkeyCounter;
			++monkeyCounter;
			if(bmonkeyCounter == 92){
				bmonkeyCounter = 0;
			}
		}
		else if(monkeyCounter == 15){
			document.getElementById("change").src="assets/menu/monkeyW2.png";
			++monkeyCounter;
			++bmonkeyCounter;
		}
		else if(monkeyCounter >= 30){
			monkeyCounter = 0;
		}
		else{
			++monkeyCounter;
			++bmonkeyCounter;
		}
	}

	/**This function is used to disable dragging all visible image elements in the main menu.*/
	this.disableImageDragging = function() {
		document.getElementById("myToy").ondragstart = function() { return false; };
		document.getElementById("toy").ondragstart = function() { return false; };
		document.getElementById("myPlant").ondragstart = function() { return false; };
		document.getElementById("myDoor").ondragstart = function() { return false; };
		document.getElementById("myClipboard").ondragstart = function() { return false; };
		document.getElementById("myElements").ondragstart = function() { return false; };
		document.getElementById("tick1").ondragstart = function() { return false; };
		document.getElementById("tick2").ondragstart = function() { return false; };
		document.getElementById("background").ondragstart = function() { return false; };
		document.getElementById("home").ondragstart = function() { return false; };
		document.getElementById("change").ondragstart = function() { return false; };
	}
}