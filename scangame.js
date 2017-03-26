//main object to store values for the game
var scan_game;
var ratio = 1;
var buttons_ratio = 1;
var CURRENT_WIDTH = document.getElementById('gameArea').width;
var CURRENT_HEIGHT = document.getElementById('gameArea').height;
var ORIGINAL_WIDTH = 800;
var ORIGINAL_HEIGHT = 450;


//object to store belt position coordinates and other values
function Belt_position(set_x, set_y, set_image_y, set_parts_y, set_belt_y, set_belt_end_y) {
    this.start_x    = set_x;
    this.start_y    = set_y; 
    this.belt_y     = set_belt_y;
    this.image_y    = set_image_y;
    this.parts_y    = set_parts_y;
    this.belt_end_y = set_belt_end_y;
}

function Scan_game() {
    this.init = function() {
		initialise_scangame();
	}
	
	this.update = function() {}
	
	this.draw = function() {
		draw_scangame();
	}
	
	this.destroy = function() {
        clear_scangame();
    }
}

//object to store all information that is needed in every function
function Data_scangame() {
    this.mouse_x        = 0;
    this.mouse_y        = 0;
    this.belt_current_x = 0;
    this.belt_current_y = 0;

    this.belt_positions = [];
    this.mousedown      = false;
    this.next_belt      = false;
    this.stop_loop      = false;

    this.bed            = new Image();
    this.belt           = new Image();
    this.belt_part_1    = new Image();
    this.belt_part_2    = new Image();

    this.bed.src         = 'bed_3.png';
    this.belt.src        = 'belt.png';
    this.belt_part_1.src = 'belt_part_1.png';
    this.belt_part_2.src = 'belt_part_3.png';
    this.stage           = 1;

    this.belt_positions.push(new Belt_position(140, 245.5, 600, 183, 205, 208));
    this.belt_positions.push(new Belt_position(140, 209, 1200, 148, 175, 172));

    this.current_beltpos = this.belt_positions[0];

    this.changeMousePos = function(x, y){
        this.mouse_x = x;
        this.mouse_y = y;
    }
}

var hover_on = false;
function draw_scangame(){
    
    if(CURRENT_WIDTH != document.getElementById('gameArea')){
        ratio = document.getElementById('gameCanvas').width / ORIGINAL_WIDTH;
        buttons_ratio = document.getElementById('gameArea').getBoundingClientRect().width / ORIGINAL_WIDTH;

        //console.log(document.getElementById('gameArea').getBoundingClientRect());
    }
    
    switch(scan_game.stage){
        case 0:
            break;
        case 1:
            if(hover_on)
                draw_mainscreen(0.95);
            else
                draw_mainscreen(0.85);
            break;
        case 2:
                draw_playscreen();
            break;
    }
    
}

function draw_moving_gamescreen(condition){
    scan_game.stage = 0;
	
	var w_1 = 590,
		h_1 = 434,
		w_2 = 544,
		h_2 = 455;
        
	var temp_x = scan_game.belt_current_x - scan_game.current_beltpos.start_x * ratio,
		temp_y = scan_game.belt_current_y - scan_game.current_beltpos.start_y * ratio,
		angle = Math.atan2(temp_y, temp_x) / Math.PI * 180,
		length = Math.sqrt(temp_x * temp_x + temp_y * temp_y);

    if(condition){
        scan_game.belt_current_x = scan_game.mouse_x;
        scan_game.belt_current_y = scan_game.mouse_y;
    }

    var ctx = document.getElementById('gameCanvas').getContext('2d');
    var grd = ctx.createLinearGradient(150 * ratio, 0, 660 * ratio, 0);

    ctx.clearRect(0, 0, 800 * ratio, 450 * ratio);

    grd.addColorStop(0,"black");
    grd.addColorStop(0.5,"#ABABAB");
    grd.addColorStop(1,"black");

    ctx.drawImage(scan_game.bed, 50, scan_game.current_beltpos.image_y, 1018, 950, 100 * ratio, 0 * ratio, 600 * ratio, 450 * ratio);

    ctx.strokeStyle = grd;
    ctx.lineWidth = 40 * ratio;
    ctx.beginPath();
    ctx.moveTo(scan_game.current_beltpos.start_x * ratio, scan_game.current_beltpos.start_y * ratio);
    ctx.lineTo(scan_game.belt_current_x, scan_game.belt_current_y);
    ctx.stroke();

    ctx.drawImage(scan_game.belt_part_1, 0, 0, 390, 1204, 124 * ratio, scan_game.current_beltpos.parts_y * ratio, 41 * ratio, 117 * ratio);
    ctx.drawImage(scan_game.belt_part_1, 0, 0, 390, 1204, 660 * ratio, scan_game.current_beltpos.parts_y * ratio, 41 * ratio, 117 * ratio);

    ctx.save();
    ctx.translate(scan_game.belt_current_x,  scan_game.belt_current_y);
    ctx.rotate(angle * Math.PI / 180);
    ctx.translate(-(scan_game.belt_current_x), -(scan_game.belt_current_y));

    ctx.drawImage(rescale(scan_game.belt, w_1, h_1), 0, 0, w_1 / 6, h_1 / 6, scan_game.belt_current_x - (w_1 / 12) * ratio, scan_game.belt_current_y - (h_1 / 12)  * ratio, (w_1 / 6) * ratio, (h_1 / 6) * ratio);

    ctx.restore();

    ctx.drawImage(rescale(scan_game.belt_part_2, w_2, h_2), 0, 0, w_2 / 6, h_2 / 6, 600 * ratio, scan_game.current_beltpos.belt_end_y * ratio, (w_2 / 6) * ratio, (h_2 / 6) * ratio);
}

//function to initialise the game
function initialise_scangame() {
    //new object
    scan_game = new Data_scangame();
    
    var game_canvas = document.getElementById('gameCanvas');
    var game_canvasCtx = game_canvas.getContext("2d");
    
    game_canvas.width = 800 * ratio;
    game_canvas.height = 450 * ratio;
    
    //set onmousemove to store mouse coordinates in the scan object
    document.getElementById('gameArea').onmousemove = function(e){
        scan_game.changeMousePos(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);

        //check if the mouse is on top of the button
        if(scan_game.mouse_x > 300 * buttons_ratio && scan_game.mouse_x < 500 * buttons_ratio && scan_game.mouse_y > 175 * buttons_ratio && scan_game.mouse_y < 275 * buttons_ratio){ 
            hover_on = true;
            //draw_mainscreen(0.95);
        }else {
            hover_on = false;
           // draw_mainscreen(0.85);
        }
    }
    
    //set onclick to check when the start button was clicked
    document.getElementById('gameArea').onclick = function(){
        if(scan_game.mouse_x > 300 * buttons_ratio && scan_game.mouse_x < 500 * buttons_ratio &&       scan_game.mouse_y > 175 * buttons_ratio && scan_game.mouse_y < 275 * buttons_ratio ){ 
            
            scan_game.stage = 0;
            
            pregame_zoom_scangame();
        }
    }
    
    draw_mainscreen(0.85);
}

//function to clear everything and return to defaults 
function clear_scangame(){
    document.getElementById('gameCanvas').getContext('2d').clearRect(0, 0, 800 * ratio, 450 * ratio);
    document.getElementById('gameArea').onmousemove = null;
    document.getElementById('gameArea').onclick = null;
    document.getElementById('gameArea').onmousedown = null;
    document.getElementById('gameArea').onmousedown = null;
    scan_game = null;
}

//function to call when the mouse is over the button to make a hover effect
function draw_mainscreen(opacity){

    var game_canvasCtx = document.getElementById('gameCanvas').getContext("2d");
    
    game_canvasCtx.clearRect(0, 0, 800 * ratio, 450 * ratio);
    
    game_canvasCtx.save();
    
    game_canvasCtx.globalAlpha = 0.5;
    game_canvasCtx.drawImage(scan_game.bed, 0, 0, 1168, 2578, 300 * ratio, 20 * ratio, 200 * ratio, 400 * ratio);

    game_canvasCtx.globalAlpha = opacity;
    game_canvasCtx.fillStyle = "#8FD281";
    game_canvasCtx.fillRect(300 * ratio, 175 * ratio, 200 * ratio, 100 * ratio);
    
    var font_size = 30 * ratio;
    
    game_canvasCtx.font = font_size + "px Georgia";
    game_canvasCtx.fillStyle = "white";
    game_canvasCtx.fillText("Start Game", 325 * ratio, 235 * ratio);
    
    game_canvasCtx.restore();
}

function draw_playscreen(){
    var w_1 = 590,
        h_1 = 434,
        w_2 = 544,
        h_2 = 455;
    
    var ctx = document.getElementById('gameCanvas').getContext("2d");

    ctx.clearRect(0, 0, 800 * ratio, 450 * ratio);
    
    ctx.drawImage(scan_game.bed, 50, scan_game.current_beltpos.image_y, 1018, 950, 100 * ratio, 0 * ratio, 600 * ratio, 450 * ratio);

    ctx.drawImage(scan_game.belt_part_1, 0, 0, 390, 1204, 124 * ratio, scan_game.current_beltpos.parts_y * ratio, 41 * ratio, 117 * ratio);
    ctx.drawImage(scan_game.belt_part_1, 0, 0, 390, 1204, 660 * ratio, scan_game.current_beltpos.parts_y * ratio, 41 * ratio, 117 * ratio);

    ctx.drawImage(rescale(scan_game.belt, w_1, h_1), 0, 0, w_1 / 6, h_1 / 6, 140 * ratio, scan_game.current_beltpos.belt_y * ratio, w_1 / 6 * ratio, h_1 / 6 * ratio);

    ctx.drawImage(rescale(scan_game.belt_part_2, w_2, h_2), 0, 0, w_2 / 6, h_2 / 6, 600 * ratio, scan_game.current_beltpos.belt_end_y * ratio, (w_2 / 6) * ratio, (h_2 / 6) * ratio);
}

//function to do the zoom animation
function pregame_zoom_scangame() {
    //sets onclick event back to default
    document.getElementById('gameArea').onclick = null;
    //changes the onmousemove event
    document.getElementById('gameArea').onmousemove = function(e){
        scan_game.changeMousePos(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    }
    
    var c   = document.getElementById("gameCanvas");
    var ctx = c.getContext("2d");

    var animation;
    var counter = 0;

    var x_1_change = 50 / 40,
        y_1_change = 600 / 40,
        w_1_change = -150 / 40,
        h_1_change = -1628 / 40,
        x_2_change = (-200 * ratio) / 40,
        y_2_change = (-20 * ratio) / 40,
        w_2_change = (400 * ratio) / 40,
        h_2_change = (50 * ratio) / 40;

    var x_1 = 0 ,
        y_1 = 0 ,
        w_1 = 1168,
        h_1 = 2578,
        x_2 = 300 * ratio,
        y_2 = 20 * ratio,
        w_2 = 200 * ratio,
        h_2 = 400 * ratio;


    function animation_func() {
        ctx.clearRect(0, 0, 800 * ratio, 450 * ratio);
        ctx.drawImage(scan_game.bed, x_1, y_1, w_1, h_1, x_2, y_2, w_2, h_2);

        x_1 += x_1_change;
        y_1 += y_1_change;
        w_1 += w_1_change;
        h_1 += h_1_change;
        x_2 += x_2_change;
        y_2 += y_2_change;
        w_2 += w_2_change;
        h_2 += h_2_change;


        counter++;
        console.log("animation_func");
        animation = requestAnimationFrame(animation_func);

        if(counter > 40){
            cancelAnimationFrame(animation);
            
            draw_playscreen();
            
            scan_game.stage = 2;
            
            set_onclick_scangame();
        }

    }

   animation_func();

}


//function to set onmousedown and onmouseon events to call the game animation if the belt was clicked
function set_onclick_scangame() {
    var w = 590,
        h = 434;

    var bound_1 = 140 * ratio,
        bound_2 = (140 + w / 6) * ratio,
        bound_3 = 207 * ratio,
        bound_4 = (200 + h / 6) * ratio;

    
    document.getElementById('gameArea').onmousedown = function() {

        if(scan_game.mouse_x >= 140 * buttons_ratio && 
           scan_game.mouse_x <  (140 + w / 6) * buttons_ratio && 
           scan_game.mouse_y >  207 * buttons_ratio && 
           scan_game.mouse_y <  (200 + h / 6) * buttons_ratio){

            scan_game.mousedown = true;

            game_loop_scangame();
        }
    
    }

    document.getElementById('gameArea').onmouseup = function() {
        scan_game.mousedown = false;
    }
}

//function to redraw the screen when the user moves the belt
function game_loop_scangame() {
    var game_animation;

    function animation(){
        var w_1 = 590,
            h_1 = 434,
            w_2 = 544,
            h_2 = 455;
        
        var temp_x = scan_game.mouse_x - scan_game.current_beltpos.start_x * ratio,
            temp_y = scan_game.mouse_y - scan_game.current_beltpos.start_y * ratio,
            angle = Math.atan2(temp_y, temp_x) / Math.PI * 180,
            length = Math.sqrt(temp_x * temp_x + temp_y * temp_y);
        
        if(scan_game.mousedown) {

            if(collision_check_scangame(scan_game.mouse_x, scan_game.mouse_y, angle, length))
                draw_moving_gamescreen(true);
            else 
                draw_moving_gamescreen(false);

			if(!scan_game.stop_loop){   
                console.log("animation");
				game_animation = requestAnimationFrame(animation);             
			} else {               
				cancelAnimationFrame(game_animation);      
				scan_game.mousedown = false;            
				scan_game.stage = 2;          
			}
            
            console.log("im here");
        }else{
            cancelAnimationFrame(game_animation); 
            scan_game.stage = 2;

            var ctx = document.getElementById('gameCanvas').getContext('2d');

            ctx.clearRect(0, 0, 800 * ratio, 450 * ratio);

            ctx.drawImage(scan_game.bed, 50, scan_game.current_beltpos.image_y, 1018, 950, 100 * ratio, 0, 600 * ratio, 450 * ratio);
            ctx.drawImage(scan_game.belt_part_1, 0, 0, 390, 1204, 124 * ratio, scan_game.current_beltpos.parts_y * ratio, 41 * ratio, 117 * ratio);
            ctx.drawImage(scan_game.belt_part_1, 0, 0, 390, 1204, 660 * ratio, scan_game.current_beltpos.parts_y * ratio, 41 * ratio, 117 * ratio);
            ctx.drawImage(rescale(scan_game.belt, w_1, h_1), 0, 0, w_1 / 6, h_1 / 6, 140 * ratio, scan_game.current_beltpos.belt_y * ratio, w_1 / 6 * ratio, h_1 / 6 * ratio);
            ctx.drawImage(rescale(scan_game.belt_part_2, w_2, h_2), 0, 0, w_2 / 6, h_2 / 6, 600 * ratio, scan_game.current_beltpos.belt_end_y * ratio, w_2 / 6 * ratio, h_2 / 6 * ratio);
        }
    }

    animation();
}

//function to check for different limits when the gameloop is on
function collision_check_scangame(x, y, angle, length) {
    if(!scan_game.next_belt){
        if(scan_game.mouse_x > 555 * ratio && 
           scan_game.mouse_x < (600 + 545 / 6) * ratio && 
           scan_game.mouse_y > 190.5 * ratio && 
           scan_game.mouse_y < (263 + 37.5) * ratio){

            if(scan_game.belt_current_y - (434 / 12) * ratio  > 206 * ratio && 
               scan_game.belt_current_y + (434 / 12) * ratio  < (208 + 455 / 6) * ratio){

                if(scan_game.belt_current_x > 600 * ratio){

                    scan_game.stop_loop = true;
                    scan_game.next_belt = true;

                    scan_game.mouse_x        = 0;
                    scan_game.mouse_y        = 0;
                    scan_game.belt_current_y = 0;
                    scan_game.belt_current_x = 0;

                    move_next_belt();
                    return false;
                }   
                return true;
            }   
            return false;
        }

        if(angle > 56 || angle < -56){
            return false;
        }
        
        if(length > 463 * ratio){
            return false;
        }
        
        return true; 
    }else {

        if(scan_game.mouse_x > 555  * ratio&& 
           scan_game.mouse_x < (600 + 545 / 6) * ratio && 
           scan_game.mouse_y > 154.5 * ratio&& 
           scan_game.mouse_y < (228 + 37.5) * ratio){

            if(scan_game.belt_current_y - (434 / 12) * ratio > 170  * ratio && 
               scan_game.belt_current_y + (434 / 12) * ratio < (172 + 455 / 6) * ratio){

                if(scan_game.belt_current_x > 600 * ratio){
                    scan_game.stop_loop = true;
                    
                    document.getElementById('gameCanvas').style.cursor = "default";
                    
                    console.log("Over");
					goToNextState();
                    return false;
                }   
                return true;
            }   
            return false;
        }
        
        if(angle > 56 || angle < -56){
            return false;
        }
        
        if(length > 463 * ratio){
            return false;
        }
        
        return true; 
    }
}

//function to move from one belt to another
function move_next_belt() {
    var ctx = document.getElementById('gameCanvas').getContext('2d');

    var y = 600,
        change_by_y = 600/20;

    var animation;
    var counter = 0;

    function animation_move_down(){

        var w_1 = 590,
            h_1 = 434,
            w_2 = 544,
            h_2 = 455;
        
        ctx.clearRect(0, 0, 800 * ratio, 450 * ratio);
        ctx.drawImage(scan_game.bed, 50, y, 1018, 950, 100 * ratio, 0, 600 * ratio, 450 * ratio);

        y += change_by_y;
        counter++;
        console.log("animation_move_down");
        animation = requestAnimationFrame(animation_move_down);

        if(counter > 20){
            cancelAnimationFrame(animation);           

            ctx.drawImage(scan_game.belt_part_1, 0, 0, 390, 1204, 124 * ratio, 148 * ratio, 41 * ratio, 117 * ratio);
            ctx.drawImage(scan_game.belt_part_1, 0, 0, 390, 1204, 660 * ratio, 148 * ratio, 41 * ratio, 117 * ratio);
            ctx.drawImage(rescale(scan_game.belt, w_1, h_1), 0, 0, w_1 / 6, h_1 / 6, 140 * ratio, 175 * ratio, (w_1 / 6) * ratio, (h_1 / 6) * ratio);
            ctx.drawImage(rescale(scan_game.belt_part_2, w_2, h_2), 0, 0, w_2 / 6, h_2 / 6, 600 * ratio, 170 * ratio, (w_2 / 6) * ratio, (h_2 / 6) * ratio);

            scan_game.current_beltpos = scan_game.belt_positions[1];
            scan_game.stop_loop       = false;    
        }
    }

    animation_move_down();
}

//function to rescale the image to make the image more clear
function rescale(img, w, h) {
    var w = w;
    var h = h;

    var can2 = document.createElement('canvas');
    can2.width = w/2;
    can2.height = w/2;
    var ctx2 = can2.getContext('2d');

    var can3 = document.createElement('canvas');
    can3.width = w/2;
    can3.height = w/2;
    var ctx3 = can3.getContext('2d');

    var can4 = document.createElement('canvas');
    can4.width = w/2;
    can4.height = w/2;
    var ctx4 = can4.getContext('2d');

    ctx2.drawImage(img, 0, 0, w / 2, h / 2);
    ctx3.drawImage(can2, 0, 0, w / 2, h / 2, 0, 0, w / 4, h / 4);
    ctx4.drawImage(can3, 0, 0, w / 4, h / 4, 0, 0, w / 6, h / 6);


    return can4;

}
