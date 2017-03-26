/**
 * Constructor for the Doctor's Room screen where the game tells
 * the user about the scan and the upcoming games.
 * @constructor
 * @param {string} whichPart - Which part of the script to display.
 */
function DoctorRoom(whichPart){
    /**
     * Where all the necessary variables for the Doctor's screen are initialised.
     * @function
     */
    this.init = function(){
        // The script contains the array of strings to be displayed on screen
        this.script = new Text(whichPart);
        this.counter = 0;
        this.nextButton = new Button("next", image_nextArrow, 675, 110, 112.5, 75);
        gameCanvas.style.backgroundImage = "url('" + image_doctorRoomBg.src + " ')";
        gameCanvas.style.backgroundSize = "cover";
        this.nextButton.startFadingIn();
        //adding the event listener for the next button
        bindNext = this.nextButtonHandler.bind(this);
        gameCanvas.addEventListener('click', bindNext, false);
        this.alpha = 0;
        this.fadingIn = true;
		this.nextButton.isPulsating = true;
        this.wordCounter = 0;
        this.currentMessage = "";
        this.isDisplaying = true;
        this.wordArray = [];
        this.wordDelay = 20;
        this.speechBubbleWidth = 0;
		this.monkeyX = 360;
		this.monkeyY = 230;
		this.monkeyWidth = 170;
		this.monkeyHeight = 192;
        this.blinkMask = new BlinkMask(this.monkeyX, this.monkeyY, this.monkeyWidth, this.monkeyHeight);
        this.isSoundOn = false;
    }
    
    /**
     * Where variables associated with displaying text on screen is constantly updated.
     * @function
     */
    this.update = function(){
        //handles the button sparkles, pulsating andd fading
        this.nextButton.update();
		this.blinkMask.update();
        
        //this is used to produce the fade in effect
         if (this.fadingIn) {
			if (this.alpha < 1) {
				this.alpha += 0.05;
			} else {
                this.alpha = 0;
			}
		}
        
        //this code is used when text is in the process of displaying on screen
        if(this.isDisplaying){
            if(!this.isSoundOn){
                audio_typingSound.loop = true;
                audio_typingSound.play();
                this.isSoundOn = true;
            }
            
            this.wordArray = this.script.lines[this.counter].split(" ");
            if(this.wordCounter < this.wordArray.length){
                if(this.alpha <= 0){
                    if(this.wordCounter === 0){
                         this.currentMessage += this.wordArray[this.wordCounter];
                    } else {
                        this.currentMessage += " " + this.wordArray[this.wordCounter];
                    }
                    ++this.wordCounter;
                }
            } else {
                //reset all necessary variables once we get to the end of a line in preparation for the next line
                this.isDisplaying = false;
                this.currentMessage = "";
                this.wordCounter = 0;
                this.alpha = 1;
                this.fadingIn = false;
            }
        } else {
            audio_typingSound.pause();
            audio_typingSound.currentTime = 0;
            this.isSoundOn = false;
        }
       
        //Used to ensure that the speech bubble's size is dependent on the text current displayed
        if(this.speechBubbleWidth < this.script.lines[this.counter].length * 8){
            this.speechBubbleWidth += 5; 
        }
            
    }
    
    /**
     * Where all the images and text is drawn onto the canvas.
     * @function
     */
    this.draw = function(){
        //draw monkey
		drawImageAdjusted(image_monkey, this.monkeyX, this.monkeyY, this.monkeyWidth, this.monkeyHeight);
        this.blinkMask.draw();
		
        //draw speech bubble
        drawImageAdjusted(image_speechBubble, 8, 8, this.speechBubbleWidth, 80);
        
        //prepare text to be drawn
        
        var dRFont = convertSize(11);
        gameContext.fillStyle = "white";
        gameContext.font = dRFont +"pt 'Comic Sans MS'";
        if(this.isDisplaying){
            //draw current message
            drawTextAdjusted(this.currentMessage, 28, 54.5, GAME_ACTUAL_WIDTH * 0.90);
            //then draw current message plus next part fading in and flashing
            gameContext.globalAlpha = this.alpha;
            gameContext.fillStyle = "yellow";
            if(this.wordCounter === 0){
                drawTextAdjusted(this.currentMessage + this.wordArray[this.wordCounter], 28, 54.5, GAME_ACTUAL_WIDTH * 0.90);
            } else {
                drawTextAdjusted(this.currentMessage + " " + this.wordArray[this.wordCounter], 28, 54.5, GAME_ACTUAL_WIDTH * 0.90);
            }
           
            gameContext.globalAlpha = 1;
        }else
            drawTextAdjusted(this.script.lines[this.counter], 28, 54.5, GAME_ACTUAL_WIDTH * 0.90);
        
        gameContext.textAlign = "left";
        
        //draw button to go next
        this.nextButton.draw();
    }
    
    /**
     * Where all the clean up happens - any listeners or global variables
     * are removed and change back to the default.
     * @function
     */
    this.destroy = function(){
		gameCanvas.style.backgroundImage = "none";
		gameCanvas.removeEventListener('click', bindNext, false);
        audio_typingSound.pause();
        audio_typingSound.currentTime = 0;
        this.isSoundOn = false;
    }
    
    /**
     * Where the handling of clicking the next button is handled.
     * This checks whether or not we click the button and takes the appropriate actions.
     * @function
     * @param {number} xpos - x position of cursor.
     * @param {number} ypos - y position of cursor.
     */
    this.buttonCollisionDetection = function(xpos, ypos){
        //is ther user clicking the button
        if(xpos >= convertSize(this.nextButton.x) && xpos <= convertSize(this.nextButton.x) + convertSize(this.nextButton.width) &&
                ypos >= convertSize(this.nextButton.y) && ypos <= convertSize(this.nextButton.y) + convertSize(this.nextButton.height)){
            //checking we're not at the end of the script
            audio_nextButtonPress.currentTime = 0.25;
            audio_nextButtonPress.play();
            if(this.counter < this.script.lines.length - 1){
                //if the script is the last line change the next arrow to a start arrow
                if(this.counter === this.script.lines.length - 2)
                    this.nextButton._image = image_startArrow;
                //resetting variables for the next line
                ++this.counter;
                this.isDisplaying = true;
                this.alpha = 0;
                this.fadingIn = true;
                this.speechBubbleWidth = 0;
                this.currentMessage = "";
                this.wordCounter = 0;
                
                audio_typingSound.pause();
                audio_typingSound.currentTime = 0;
                this.isSoundOn = false;
            } else if (!this.changingState){
                audio_typingSound.pause();
                audio_typingSound.currentTime = 0;
                this.isSoundOn = false;
				this.changingState = true;
                //ready to change state
				gameCanvas.removeEventListener('click', bindNext, false);
                goToNextState(true);
            }
        }
    }
    
    /**
     * Where @see {@link buttonCollisionDetection} is called to handle to next button.
     * @function
     * @param {Event} event - The click event.
     */
    this.nextButtonHandler = function(event){
        var rect = gameCanvas.getBoundingClientRect();
		this.buttonCollisionDetection(
                                Math.round((event.clientX-rect.left)/(rect.right-rect.left)*gameCanvas.width),
                                Math.round((event.clientY-rect.top)/(rect.bottom-rect.top)*gameCanvas.height));
    }
    
}

/**
 * Constructor whose objects contain the script for the Doctor's Room.
 * @constructor
 * @param {string} part - Which part of script.
 */
function Text(part){
    this.lines = [];
    //switch statement controls which part of th script to use
    switch(part){
        case "1": this.txt1 = "Hello and welcome to Spect-acular Scan!";
                this.txt2 = "We have our friend Marty here who needs to be seen.";
                this.txt3 = "Can you help him through it and have fun along the way?";
                this.txt4 = "Alright! First, tell us which scan we should do for Marty.";
    
                this.lines = [this.txt1, this.txt2, this.txt3, this.txt4];  
                break;
            
        case "2": this.txt1 = "We need you to put cream on Marty's hand or foot, you choose where.";
                this.txt2 = "The cream makes sure that he doesn't feel anything when we inject him.";
                this.txt3 = "No pain anywhere!       ";
                this.txt4 = "Look, he isn't worried. Marty knows it won't hurt a bit! Let's do it!";
            
                this.lines = [this.txt1, this.txt2, this.txt3, this.txt4];  
                break;
        
        case "3": this.txt1 = "Well done! We knew you could do it! It wasn't hard, was it?";
                this.txt2 = "Next, Marty is going to lie on the bed and you're going to help him strap in.";
                this.txt3 = "Don't move around on the bed Marty. It's going to be fine!";
                this.txt4 = "You're then going to move the cameras to Marty and take pictures.";
                this.txt5 = "Say cheese Marty! Let's get started!";
                
                this.lines = [this.txt1, this.txt2, this.txt3, this.txt4, this.txt5];
                break;
        
        case "4": this.txt1 = "Nice job! Marty didn't even realise the time going by.";
                this.txt2 = "He was too busy watching his favourite movie!";
                this.txt3 = "\u2026 Hey! What's going on?! \u2026 Look! ";
                this.txt4 = "Something is happening to the scanner!!";
                this.txt5 = "Help Marty avoid the asteroids! Here we go!";
            
                this.lines = [this.txt1, this.txt2, this.txt3, this.txt4, this.txt5];
                break;
        
        case "5": this.txt1 = "Amazing! You've done it all! The scan is done and Marty feels fine!";
                this.txt2 = "In fact, he couldn't be happier!";
                this.txt3 = "He can go back to his parents and go home!";
                this.txt4 = "Thanks for all your help, we couldn't have done it without you!"; 
                this.txt5 = "See you later!    ";
            
                this.lines = [this.txt1, this.txt2, this.txt3, this.txt4, this.txt5];
                break;
            
            //For the milk scan, this text will replace that of case 2
        case "6": this.txt1 = "To start, we need you to make the milk radioactive for the scan.";
                this.txt2 = "This lets us see the milk inside Marty with an x-ray.";
                this.txt3 = "Then you need to help Marty drink it. Let's do it!"
                
                this.lines = [this.txt1, this.txt2, this.txt3];
                break;
        
            //For the maze game
        case "7": this.txt1 = "Hi again! Had enough of the scan, huh?";
                this.txt2 = "Alright, let's go to the maze game!";
                this.txt3 = "Take the ball to the yellow square to win!";
                this.txt4 = "Use the arrows buttons on the screen or the arrow keys to play!";
                this.txt5 = "Got all that? Then it's time to play!";
            
                this.lines = [this.txt1, this.txt2, this.txt3, this.txt4, this.txt5];
                break;
        
        default: break;
    }
    
}

/**
 * Function used to draw text on the canvas relative to the
 * canvas' size, only used in the DoctorsRoom script.
 * @function 
 * @param {string} text - The text to display.
 * @param {number} x - The x position of the text.
 * @param {number} y - The y position of the text.
 * @param {number} w - The max width of the text.
 */
function drawTextAdjusted(text, x, y, w){
    gameContext.fillText(text, convertSize(x), convertSize(y), convertSize(w));
}