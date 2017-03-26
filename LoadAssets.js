//counter to check we have loaded all assets
var numLoaded = 0;
/**
 * Loads all assets which will be used in the game. It is called once
 * when the game starts.
 * @function
 */
function loadAssets() {
    // Cream game assets
    image_creamButton = loadImage("assets/creamgame/cream_button.png");
    image_creamSpread = loadImage("assets/creamgame/cream_spread.png");
    image_creamTube = loadImage("assets/creamgame/cream_tube.png");
    image_helperArrowLeft = loadImage("assets/creamgame/helper_arrow0.png");
    image_helperArrowRight = loadImage("assets/creamgame/helper_arrow1.png");
    image_injectionButton = loadImage("assets/creamgame/injection_button.png");
    image_syringe0 = loadImage("assets/creamgame/syringe_clear0.png");
    image_syringe1 = loadImage("assets/creamgame/syringe_clear1.png");

    // Spaceship game assets
    image_asteroid1 = loadImage("assets/spaceshipgame/asteroid1.png");
    image_asteroid2 = loadImage("assets/spaceshipgame/asteroid2.png");
    image_asteroid3 = loadImage("assets/spaceshipgame/asteroid3.png");
    image_asteroid4 = loadImage("assets/spaceshipgame/asteroid4.png");
    image_spaceship = loadImage("assets/spaceshipgame/spaceship.png");
    image_spaceship2 = loadImage("assets/spaceshipgame/spaceship2.png");
    image_spaceship3 = loadImage("assets/spaceshipgame/spaceship3.png");
    image_spaceship4 = loadImage("assets/spaceshipgame/spaceship4.png");
    image_spaceship5 = loadImage("assets/spaceshipgame/spaceship5.png");
    image_spaceshipDown = loadImage("assets/spaceshipgame/spaceshipDown.png");
    image_spaceshipUp = loadImage("assets/spaceshipgame/spaceshipUp.png");

    // Menu assets
    image_milkUnpressed = loadImage("assets/submenu/milk_unpressed.png");
    image_milkGlow = loadImage("assets/submenu/milk_glow.png");
    image_milkPressed = loadImage("assets/submenu/milk_pressed.png");
    image_mag3Unpressed = loadImage("assets/submenu/mag3_unpressed.png");
    image_mag3Glow = loadImage("assets/submenu/mag3_glow.png");
    image_mag3Pressed = loadImage("assets/submenu/mag3_pressed.png");
    image_dmsaUnpressed = loadImage("assets/submenu/dmsa_unpressed.png");
    image_dmsaGlow = loadImage("assets/submenu/dmsa_glow.png");
    image_dmsaPressed = loadImage("assets/submenu/dmsa_pressed.png");
    image_meckelUnpressed = loadImage("assets/submenu/meckel_unpressed.png");
    image_meckelGlow = loadImage("assets/submenu/meckel_glow.png");
    image_meckelPressed = loadImage("assets/submenu/meckel_pressed.png");
    image_selectMinigameHeader = loadImage("assets/submenu/select_minigame_header.png");
    image_tvScreen = loadImage("assets/submenu/tv_screen.png");

    // Other
    image_arrowCursor = loadImage("assets/other/arrow_cursor.png");
    image_downButton = loadImage("assets/other/ButtonDown.png");
    image_ButtonDownD = loadImage("assets/other/ButtonDownD.png");
    image_upButton = loadImage("assets/other/ButtonUp.png");

    image_upButtonHover = loadImage('assets/other/ButtonUpHover.png');
    image_downButtonHover = loadImage('assets/other/ButtonDownHover.png');
    image_ButtonUpU = loadImage("assets/other/ButtonUpU.png");
    image_ButtonLeft = loadImage("assets/other/ButtonLeft.png");
    image_ButtonRight = loadImage("assets/other/ButtonRight.png");
    image_ButtonRightPressed = loadImage("assets/other/ButtonRightPressed.png");
    image_ButtonLeftPressed = loadImage("assets/other/ButtonLeftPressed.png");
    image_nextArrow = loadImage("assets/other/nextArrow.png");
    image_startArrow = loadImage("assets/other/startArrow.png");
    image_sideBar = loadImage("assets/other/sidebar.png");
    image_clickMeArrowHelper = loadImage("assets/other/arrowHelperStage1.png");
    image_quadArrowHelp = loadImage("assets/other/arrowHelp.png");
    image_nothing = loadImage("assets/other/nothing.png");
    image_sparkle = loadImage("assets/other/sparkle.png");
    image_speechBubble = loadImage("assets/other/speechBubble.png");

    image_skipButton = loadImage("assets/other/skipButton.png");
    image_resetButton = loadImage("assets/other/resetButton.png");

    // Milk game assets
    image_milkdrinkButton = loadImage("assets/milkgame/milkdrink_button.png");
    image_cartonButton = loadImage("assets/milkgame/carton_button.png");
    image_crystalButton = loadImage("assets/milkgame/crystal_button.png");
    image_cartonCursor = loadImage("assets/milkgame/cartonCursor.png");
    image_milkButton = loadImage("assets/milkgame/milk_button.png");
    image_RadioActiveCrystal = loadImage("assets/milkgame/Crystal.png");

    image_milkGameMonkey1 = loadImage("assets/milkgame/monkey_drinking/MilkBottle1.png");
    // Clicker Helper
    //Stage 3 for the clicker
    image_arrowHelpClicker = loadImage("assets/milkgame/ClickerHelp.png");
    //

    image_milkGameMonkey2 = loadImage("assets/milkgame/monkey_drinking/MilkBottle2.png");
    image_milkGameMonkey3 = loadImage("assets/milkgame/monkey_drinking/MilkBottle3.png");
    image_milkGameMonkey4 = loadImage("assets/milkgame/monkey_drinking/MilkBottle4.png");
    image_milkGameMonkey5 = loadImage("assets/milkgame/monkey_drinking/MilkBottle5.png");
    image_milkGameMonkey6 = loadImage("assets/milkgame/monkey_drinking/MilkBottle6.png");
    image_milkGameMonkey7 = loadImage("assets/milkgame/monkey_drinking/MilkBottle7.png");
    image_milkGameMonkey8 = loadImage("assets/milkgame/monkey_drinking/MilkBottle8.png");
    image_milkGameMonkey9 = loadImage("assets/milkgame/monkey_drinking/MilkBottle9.png");
    image_milkGameMonkey10 = loadImage("assets/milkgame/monkey_drinking/MilkBottle10.png");
    image_milkGameMonkey11 = loadImage("assets/milkgame/monkey_drinking/MilkBottle11.png");
    image_milkGameMonkey12 = loadImage("assets/milkgame/monkey_drinking/MilkBottle12.png");
    image_milkGameMonkey13 = loadImage("assets/milkgame/monkey_drinking/MilkBottle13.png");
    image_milkGameMonkey14 = loadImage("assets/milkgame/monkey_drinking/MilkBottle14.png");
    image_milkGameMonkey15 = loadImage("assets/milkgame/monkey_drinking/MilkBottle15.png");
    image_milkGameMonkey16 = loadImage("assets/milkgame/monkey_drinking/MilkBottle16.png");
    image_milkGameMonkey17 = loadImage("assets/milkgame/monkey_drinking/MilkBottle17.png");
    image_milkGameMonkey18 = loadImage("assets/milkgame/monkey_drinking/MilkBottle18.png");
    image_milkGameMonkey19 = loadImage("assets/milkgame/monkey_drinking/MilkBottle19.png");
    image_milkGameMonkey20 = loadImage("assets/milkgame/monkey_drinking/MilkBottle20.png");

    image_milkCarton1 = loadImage("assets/milkgame/milk_carton/MilkCarton1.png");
    image_milkCarton2 = loadImage("assets/milkgame/milk_carton/MilkCarton2.png");
    image_milkCarton3 = loadImage("assets/milkgame/milk_carton/MilkCarton3.png");
    image_milkCarton4 = loadImage("assets/milkgame/milk_carton/MilkCarton4.png");
    image_milkCarton5 = loadImage("assets/milkgame/milk_carton/MilkCarton5.png");
    image_milkCarton6 = loadImage("assets/milkgame/milk_carton/MilkCarton6.png");
    image_milkCarton7 = loadImage("assets/milkgame/milk_carton/MilkCarton7.png");
    image_milkCarton8 = loadImage("assets/milkgame/milk_carton/MilkCarton8.png");
    image_milkCarton9 = loadImage("assets/milkgame/milk_carton/MilkCarton9.png");
    image_milkCarton10 = loadImage("assets/milkgame/milk_carton/MilkCarton10.png");

    image_milkBottle1 = loadImage("assets/milkgame/milk_bottle/Milk1.png");
    image_milkBottle2 = loadImage("assets/milkgame/milk_bottle/Milk2.png");
    image_milkBottle3 = loadImage("assets/milkgame/milk_bottle/Milk3.png");
    image_milkBottle4 = loadImage("assets/milkgame/milk_bottle/Milk4.png");
    image_milkBottle5 = loadImage("assets/milkgame/milk_bottle/Milk5.png");
    image_milkBottle6 = loadImage("assets/milkgame/milk_bottle/Milk6.png");
    image_milkBottle7 = loadImage("assets/milkgame/milk_bottle/Milk7.png");
    image_milkBottle8 = loadImage("assets/milkgame/milk_bottle/Milk8.png");
    image_milkBottle9 = loadImage("assets/milkgame/milk_bottle/Milk9.png");
    image_milkBottle10 = loadImage("assets/milkgame/milk_bottle/Milk10.png");
    image_milkBottle11 = loadImage("assets/milkgame/milk_bottle/Milk11.png");
    image_milkBottle12 = loadImage("assets/milkgame/milk_bottle/Milk12.png");
    image_milkBottle13 = loadImage("assets/milkgame/milk_bottle/Milk13.png");
    image_milkBottle14 = loadImage("assets/milkgame/milk_bottle/Milk14.png");
    image_milkBottle15 = loadImage("assets/milkgame/milk_bottle/Milk15.png");

    image_milkGameCartonRad1 = loadImage("assets/milkgame/radioactive_carton/MilkCarton1.png");
    image_milkGameCartonRad2 = loadImage("assets/milkgame/radioactive_carton/MilkCarton2.png");
    image_milkGameCartonRad3 = loadImage("assets/milkgame/radioactive_carton/MilkCarton3.png");
    image_milkGameCartonRad4 = loadImage("assets/milkgame/radioactive_carton/MilkCarton4.png");
    image_milkGameCartonRad5 = loadImage("assets/milkgame/radioactive_carton/MilkCarton5.png");
    image_milkGameCartonRad6 = loadImage("assets/milkgame/radioactive_carton/MilkCarton6.png");
    image_milkGameCartonRad7 = loadImage("assets/milkgame/radioactive_carton/MilkCarton7.png");
    image_milkGameCartonRad8 = loadImage("assets/milkgame/radioactive_carton/MilkCarton8.png");
    image_milkGameCartonRad9 = loadImage("assets/milkgame/radioactive_carton/MilkCarton9.png");
    image_milkGameCartonRad10 = loadImage("assets/milkgame/radioactive_carton/MilkCarton10.png");

    // Scan game assets

    // Monkey
    image_monkey = loadImage("assets/monkey/monkey_smile.png");
    image_monkeySad = loadImage("assets/monkey/monkey_sad.png");
    image_monkeyHand = loadImage("assets/monkey/monkey_hand.png");
    image_flyingMonkey = loadImage("assets/monkey/monkeyFly.png");
	image_doctorMonkey = loadImage("assets/monkey/MonkeyDoctorMode.png");
	image_waveMonkey = loadImage("assets/menu/monkeyW1.png");
	image_karateMonkey = loadImage("assets/monkey/MonkeyKarateMode.png");
	image_blinkMask = loadImage("assets/monkey/blink_mask.png");
	
    // Backgrounds
    image_transition = loadImage("assets/backgrounds/greenBackground.png");
    image_restBackground = loadImage("assets/backgrounds/restBackground.png");
    image_spaceshipBackground = loadImage("assets/backgrounds/spaceshipBG.png");
    image_doctorRoomBg = loadImage("assets/backgrounds/doctors_room_side.png");

    // Maze game assets
    image_bgIncrScale = loadImage("assets/mazegame/bgIncrScale.png");
    image_blocksPurple = loadImage("assets/mazegame/blocksPurple.png");
    image_blocksPurpleP = loadImage("assets/mazegame/blocksPurpleP.png");
    image_blocksRed = loadImage("assets/mazegame/blocksRed.png");
    image_blocksRedR = loadImage("assets/mazegame/blocksRedR.png");
    image_blocksWhiteW = loadImage("assets/mazegame/blocksWhiteW.png");
    image_EndTile = loadImage("assets/mazegame/EndTile.png");
    image_EndTileMc = loadImage("assets/mazegame/EndTileMC.png");
    image_YouWin = loadImage("assets/other/good.png");
    image_YouWin2 = loadImage("assets/other/good2.png");
    
    //Mute Button
    image_muteButtonSoundOn = loadImage("assets/menu/sound.png");
    image_muteButtonSoundOff = loadImage("assets/menu/soundOff.png");
    
    // Game Audio
    audio_transformingBed = loadAudio("assets/sounds/bed transforming sound.mp3");
    audio_scanBeltLock = loadAudio("assets/sounds/belt lock sound.mp3");
    audio_buttonPress = loadAudio("assets/sounds/Button press sound.mp3");
    audio_drinkingWithStraw = loadAudio("assets/sounds/drinking through straw sound.mp3");
    audio_mainBGM = loadAudio("assets/sounds/Main background music.mp3");
    audio_mazeGameBGM = loadAudio("assets/sounds/Maze Game Background Music.mp3");
    audio_milkPouring = loadAudio("assets/sounds/pouring.mp3");
    audio_pullingBelt = loadAudio("assets/sounds/pulling belt sound.mp3");
    audio_spaceshipGameBGM = loadAudio("assets/sounds/Spaceship Game Background Music.mp3");
    audio_creamSquish = loadAudio("assets/sounds/squish.mp3");
    audio_syringeOnSkin = loadAudio("assets/sounds/syringe hitting skin sound.mp3");
    audio_transitionWhoosh = loadAudio("assets/sounds/Transition whoosh.mp3");
    audio_typingSound = loadAudio("assets/sounds/Typing sound.mp3");
    audio_movingScanCameraSound = loadAudio("assets/sounds/scan cameras moving.mp3");
    audio_limbSelectionSound = loadAudio("assets/sounds/Limb Selection Sound.mp3");
    audio_nextButtonPress = loadAudio("assets/sounds/Next Button Press.mp3");
    audio_explosion = loadAudio("assets/sounds/radioactive explosion sound.mp3");
    audio_ballRolling = loadAudio("assets/sounds/maze ball rolling.mp3");
    
    audioArray = [audio_transformingBed, audio_scanBeltLock, audio_buttonPress, audio_drinkingWithStraw, audio_mainBGM,
                 audio_mazeGameBGM, audio_milkPouring, audio_pullingBelt, audio_spaceshipGameBGM, audio_creamSquish,
                 audio_syringeOnSkin, audio_transitionWhoosh, audio_typingSound, audio_movingScanCameraSound,
                 audio_limbSelectionSound, audio_nextButtonPress, audio_explosion, audio_ballRolling];

    //Scan game assets 
    image_rocket              = loadImage('assets/scangame/rocket.png');
    image_tv_image            = loadImage('assets/scangame/tv.png');
    image_tick_logo           = loadImage('assets/scangame/tick_logo.png');
    image_bed_part1           = loadImage('assets/scangame/bed_part1.png');
    image_bed_part2           = loadImage('assets/scangame/bed_part2.png');
    image_bed_image1          = loadImage('assets/scangame/new_bed_frame1.png');
    image_bed_image2          = loadImage('assets/scangame/new_bed_frame2.png');
    image_belt1_logo          = loadImage('assets/scangame/belt_numberone.png');
    image_belt2_logo          = loadImage('assets/scangame/belt_numbertwo.png');
    image_belt_image          = loadImage('assets/scangame/belt_v3.png');
    image_machine_part        = loadImage('assets/scangame/machine_part.png');
    image_machine_game        = loadImage('assets/scangame/machine_front.png');
    image_wings_rocket        = loadImage('assets/scangame/wings_rocket.png');
    image_middle_rocket       = loadImage('assets/scangame/middlepart_rocket.png');
    image_belt_end_image      = loadImage('assets/scangame/belt_end.png');
    image_machine_rocket      = loadImage('assets/scangame/machine_image.png');
    image_rocket_background   = loadImage('assets/scangame/background_v6.png');
    image_background_image1   = loadImage('assets/scangame/background_frame1.png');
    image_background_image2   = loadImage('assets/scangame/background_frame2.png');
    image_background_image3   = loadImage('assets/scangame/background2_frame1.png');
    image_background_image4   = loadImage('assets/scangame/background2_frame2.png');
    image_background_image5   = loadImage('assets/scangame/final_background1.png');
    image_background_image6   = loadImage('assets/scangame/final_background2.png');
    image_machine_part1_logo  = loadImage('assets/scangame/scan_part1_logo.png');
    image_machine_part2_logo  = loadImage('assets/scangame/scan_part2_logo.png');
    image_game1_logo_scangame = loadImage('assets/scangame/machine.png');
    image_game2_logo_scangame = loadImage('assets/scangame/unzip_bed.png');
    
    loadChecker();
}

/**
 * Checks that all images have been loaded successfully.
 * @function 
 */
function loadChecker() {
    if (numLoaded >= 185) {
		if (document.readyState == "loaded" || document.readyState == "complete") {
			// Everything has loaded
			mainInitialization();
			orientationCheck();
			window.addEventListener('focus', function(){
            if(!isGameMuted)
                for(i=0;i<audioArray.length;++i) audioArray[i].muted = false;
			}, false);
			
			window.addEventListener('blur', function(){
				for(i=0;i<audioArray.length;++i)
					audioArray[i].muted = true;
			}, false);
		} else {
			window.requestAnimationFrame(loadChecker);
		}
    } else {
        window.requestAnimationFrame(loadChecker);
    }
}

/**
 * Loads a single image for use in the game.
 * @function
 * @param {string} url - url of image to load.
 * @returns {Image} image that has just been loaded.
 */
function loadImage(url) {
    nextImage = new Image();
    nextImage.src = url;
    nextImage.onload = incrementNumLoaded(url);
    nextImage.onerror = function () {
        console.log("Failed to load image: \"" + url + "\"");
    }
    return nextImage;
}

/**
 * Loads a single audio clip for use in the game.
 * @function
 * @param {string} url - url of sound clip to load.
 * @returns {Audio} sound clip that has just been loaded.
 */
function loadAudio(url) {
    nextAudio = new Audio(url);
    nextAudio.oncanplaythrough = incrementNumLoaded(url);
    nextAudio.onerror = function () {
        console.log("Failed to load audio: \"" + url + "\"");
    }
    return nextAudio;
}

//method extracted to improve readability
function incrementNumLoaded(url) {
    ++numLoaded;
    console.log("(" + numLoaded + ") " + "Successfully loaded image: \"" + url + "\"");
}