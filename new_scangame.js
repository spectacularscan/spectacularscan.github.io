//variables that hold canvas and its context 
var canvas = document.getElementById('gameCanvas');
var canvas_ctx = document.getElementById('gameCanvas').getContext('2d');

//variable to store an instance of an object that holds main data for the game
var Scangame_gamedata;

/**
 * Main object of a Scan game that has all methods for the game loop
 * @constructor
 */
function Scan_game(){
    
    /**
     * function draw that is made to be called by main game loop
     * @function
     */
    this.draw = function(){
        draw_scangame();
    }
    
    /**
     * function to intialise the data that is needed for the scan game
     * @function
     */
    this.init = function(){
		Scangame_gamedata = new Scangame_gamedata();
        add_listeners();
    }
    
    /**
     * empty function to follow the main structure of the game but unneed in this game
     * @function
     */
    this.update = function(){
        
    }
    
    /**
     * that destroys all listeners to not cause any conflicts in the future
     * @function
     */
    this.destroy = function(){
        if(onMobileDevice()){
            document.getElementById('gameArea').removeEventListener('touchmove', touchmove_scangame, true);
            document.getElementById('gameArea').removeEventListener('touchstart', touchstart_scangame, true);
            document.getElementById('gameArea').removeEventListener('touchend', touchend_scangame, true);
        }else{
            document.getElementById('gameArea').onmousemove = null;
            document.getElementById('gameArea').onmousedown = null;
            document.getElementById('gameArea').onmouseup   = null;
        }
    }
}

/**
 * An object that stores all data that is needed for the scan game
 * @constructor
 */
function Scangame_gamedata(){
    this.mouse_x             = 0;
    this.mouse_y             = 0;
    this.zoom_in             = true;
    this.game_stage          = 0;
    this.selected_item       = 0;
    this.game2_position      = 378;
    this.radius_of_items     = convertSize(75);
    this.circle_size_ratio   = 1;
    this.increase_radius     = true;
    this.game2_selected_belt = 1;
    this.completed_items     = [];
    this.main_completed_items= [];
    this.game_type           = 1;
    this.monkey_stop_move    = false;
    this.background_state    = 1;
    this.beltscreen_state    = 1;

    /**
     * function to change the x and y that is used to check if the buttons were clicked
     * @function
     */
    this.change_mouse_coords = function(x, y){
        this.mouse_x = x;
        this.mouse_y = y;
    }

}

//counter that is used to control the flow of the game loop in some cases
var animation_counter = 0;

/**
 * function that is called by the draw and is responsible for the scan game stage switch
 * this holds a switch that depending on a game stage calls different methods
 * using animation counter it controls how many times some of the game stages can be called
 * @function
 */
function draw_scangame(){
    
    if(Scangame_gamedata.increase_radius){
        Scangame_gamedata.circle_size_ratio += 0.00125;
        if(Scangame_gamedata.circle_size_ratio >= 1.05){
            Scangame_gamedata.increase_radius = false;
        }
    }else{
        Scangame_gamedata.circle_size_ratio -= 0.00125;
        if(Scangame_gamedata.circle_size_ratio <= 1){
            Scangame_gamedata.increase_radius = true;
        }
    }
    
    switch(Scangame_gamedata.game_stage){
        case 0:
            mainscreen();
            break;
        case 1:
            zoom_in_out();
            break;
        case 2:
            beltscreen();
            break;
        case 3:
            machinescreen();
            break;
        case 4:
            if(Scangame_gamedata.game_type == 1)
                move_belt();
            else
                zip_belt();
            break;
        case 5:
            move_machine_part();
            break;
        case 6:
            rocket_animation();
            break;
    }
    
    if(Scangame_gamedata.game_stage == 1){
        animation_counter++;

        if(animation_counter >= 58){
            if(Scangame_gamedata.zoom_in){
                Scangame_gamedata.completed_items = [];
                Scangame_gamedata.game_stage = 2;
                if(scangame_frame == 1)
                    Scangame_gamedata.beltscreen_state = 1;
                else
                    Scangame_gamedata.beltscreen_state = 2;
                
            }else {
                Scangame_gamedata.game_stage = 0;
            }
            animation_counter = 0;
        }
        
    }else if(Scangame_gamedata.game_stage == 3){
        
    }else if(Scangame_gamedata.game_stage == 4){
        if(Scangame_gamedata.game_type == 2){
            animation_counter++;

            if(animation_counter > 39){
  
                animation_counter = 0;
                x_belt = 233;
                if(belt_top){
                    Scangame_gamedata.completed_items.push(1);
                    belt_top_zip = true;
                }
                if(belt_bottom){
                    Scangame_gamedata.completed_items.push(2);
                    belt_bottom_zip = true;
                }

                if(Scangame_gamedata.completed_items.length >= 2){
                    Scangame_gamedata.main_completed_items.push(2);
                    Scangame_gamedata.completed_items = [];
                    Scangame_gamedata.monkey_stop_move = true;
                    Scangame_gamedata.background_state = 6;
                    Scangame_gamedata.zoom_in = false;
                    Scangame_gamedata.game_stage = 1;
                }else{
                    Scangame_gamedata.game_stage = 2;
                }

            }
            
        }
        

    }else if(Scangame_gamedata.game_stage == 5){
        if(change <= 0){
            audio_movingScanCameraSound.pause();
            Scangame_gamedata.game_stage = 3;
            block_onlick = false;
            if(belt_one)
                belt_one_moved = true;
            else
                belt_two_moved = true;
            
            if(Scangame_gamedata.completed_items.length == 2){
                Scangame_gamedata.game_stage = 0;
                Scangame_gamedata.completed_items = [];
                Scangame_gamedata.main_completed_items.push(1);
                
                if(Scangame_gamedata.main_completed_items.includes(2)){
                    Scangame_gamedata.background_state = 5;
                }else{
                   if(scangame_frame == 1)
                        Scangame_gamedata.background_state = 3;
                    else
                        Scangame_gamedata.background_state = 4;
                }
            }
        }
    }else if(Scangame_gamedata.game_stage == 0){
        block = false;
        if(Scangame_gamedata.main_completed_items.length == 2){
            block = true;
            if(animation_counter > 50){
                audio_transformingBed.loop = true;
                audio_transformingBed.play();
                Scangame_gamedata.game_stage = 6;
                animation_counter = 0;
            }else{
                animation_counter++;
            }
        }
    }

    if(Scangame_gamedata.game_stage != 0){
        block = true;
    }
    
}

//variables that are needed for the zoom in and zoom out animation
var x_1_change = 973 / 60,
    y_1_change = 762 / 60,
    w_1_change = -2200 / 60,
    h_1_change = -1175 / 60,
    x_2_change = 200 / 60,
    w_2_change = -200 / 60;

var x_1 = 0,
    y_1 = 0,
    w_1 = 2400,
    h_1 = 1350,
    x_2 = 0,
    w_2 = 800;

/**
 * function to zoom in and zoom out to the bed for one of the Scangame's minigames
 * it changes the value of the variables each iteration, so each time the image is printed
 * differently 
 * @function
 */
function zoom_in_out(){
    draw_mainbackground(x_1, y_1, w_1, h_1, x_2, w_2);
    draw_basics();
    
    canvas_ctx.drawImage(image_game1_logo_scangame, convertSize(100) - (convertSize(103) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(125) - (convertSize(94) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(103) * Scangame_gamedata.circle_size_ratio, convertSize(94) * Scangame_gamedata.circle_size_ratio);
    
    canvas_ctx.drawImage(image_game2_logo_scangame, convertSize(100) - (convertSize(65) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(325) - (convertSize(120) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(65) * Scangame_gamedata.circle_size_ratio, convertSize(120) * Scangame_gamedata.circle_size_ratio);

    if(Scangame_gamedata.zoom_in){
        x_1 += x_1_change;
        y_1 += y_1_change;
        w_1 += w_1_change;
        h_1 += h_1_change;
        x_2 += x_2_change;
        w_2 += w_2_change;
    }else{
        x_1 -= x_1_change;
        y_1 -= y_1_change;
        w_1 -= w_1_change;
        h_1 -= h_1_change;
        x_2 -= x_2_change;
        w_2 -= w_2_change;
    }
    
    change_frame();
}

//variables that are need for the glow animation that provides the hint
var current_blur = 0;
var increase_blur = false;
var pause_time = 0;

/**
 * function to draw the belt screen that is a main screen for one of the games
 * it draws background, logos on the side and belt positions
 * @function
 */
function beltscreen(){
    draw_beltscreen(100, 260, 600, 450);
    
    draw_basics();
    
    canvas_ctx.drawImage(image_belt1_logo, convertSize(100) - (convertSize(125) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(125) - (convertSize(90) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(125) * Scangame_gamedata.circle_size_ratio, convertSize(90) * Scangame_gamedata.circle_size_ratio);

    canvas_ctx.drawImage(image_belt2_logo, convertSize(100) - (convertSize(125) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(325) - (convertSize(90) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(125) * Scangame_gamedata.circle_size_ratio, convertSize(90) * Scangame_gamedata.circle_size_ratio);
    
    
    change_frame();

    if(belt_top_zip)
        draw_belt(643, 153, 0);
    else
        draw_belt(233, 153, 0);
    
    if(belt_bottom_zip)
        draw_belt(643, 370, 0);
    else
        draw_belt(233, 370, 0);

}

/**
 * function to draw the main screen
 * it draws the background and the logos of the mini games
 * @function
 */
function mainscreen(){
    draw_mainbackground(0, 0, 2400, 1350, 0, 800);
    
    draw_basics();
 
    canvas_ctx.drawImage(image_game1_logo_scangame, convertSize(100) - (convertSize(103) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(125) - (convertSize(94) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(103) * Scangame_gamedata.circle_size_ratio, convertSize(94) * Scangame_gamedata.circle_size_ratio);
    
    canvas_ctx.drawImage(image_game2_logo_scangame, convertSize(100) - (convertSize(65) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(325) - (convertSize(120) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(65) * Scangame_gamedata.circle_size_ratio, convertSize(120) * Scangame_gamedata.circle_size_ratio);
    
    change_frame();
}

/**
 * function to draw the machine's game screen 
 * @function
 */
function machinescreen(){
    canvas_ctx.clearRect(0, 0, convertSize(800), convertSize(450));
    canvas_ctx.drawImage(image_machine_game, 0, 0, convertSize(800), convertSize(450));
    
    draw_basics();
    
    restore = false;
    if(pause_time > 60 && Scangame_gamedata.completed_items.length != 2){
        canvas_ctx.save();

        canvas_ctx.shadowBlur = current_blur;
        canvas_ctx.shadowColor = "#E5AA21";

        restore = true;
        if(increase_blur){
            current_blur += 0.4;
            if(current_blur > 30){
                increase_blur = false;
            }
        }else {
            current_blur -= 0.4;
            if(current_blur < 10){
                increase_blur = true;
            }
        }
        
    }else{
        pause_time++;
    }
 
    if(!Scangame_gamedata.completed_items.includes(1)){
        if(belt_one_moved && !belt_two_moved){
            
        }else{
            draw_machine_part(angle);
        }
    }
    
    if(!Scangame_gamedata.completed_items.includes(2)){
        if(!belt_one_moved && belt_two_moved){
            
        }else{
            draw_machine_part(angle1);
        }
    }
    
    if(restore)
        canvas_ctx.restore();
    
    if(Scangame_gamedata.completed_items.includes(1))
        draw_machine_part(angle);
    
    if(Scangame_gamedata.completed_items.includes(2))
        draw_machine_part(angle1);

    if(belt_one_moved && !belt_two_moved)
        draw_machine_part(angle);
    
    if(!belt_one_moved && belt_two_moved)
        draw_machine_part(angle1);

    canvas_ctx.drawImage(image_machine_part1_logo, convertSize(100) - (convertSize(103) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(133) - (convertSize(94) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(103) * Scangame_gamedata.circle_size_ratio, convertSize(80) * Scangame_gamedata.circle_size_ratio);
    
    canvas_ctx.drawImage(image_machine_part2_logo, convertSize(100) - (convertSize(103) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(333) - (convertSize(94) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(103) * Scangame_gamedata.circle_size_ratio, convertSize(80) * Scangame_gamedata.circle_size_ratio);

}

/**
 * function to draw the machine part at specified position
 * @param {number} - temp_angle to rotate the canvas to that angle
 * @function
 */
function draw_machine_part(temp_angle){
    canvas_ctx.save();
    canvas_ctx.translate(convertSize(507.5), convertSize(233.5));
    canvas_ctx.rotate(temp_angle * Math.PI /180);
    canvas_ctx.translate(convertSize(-507.5), convertSize(-233.5));

    canvas_ctx.drawImage(image_machine_part, convertSize(408), convertSize(345), convertSize(200), convertSize(90));

    canvas_ctx.restore();
}

/**
 * function to draw the selected option
 * @function
 */
function selected_option(){
    if(Scangame_gamedata.selected_item == 1){
        canvas_ctx.fillStyle = "#A7973D";
        canvas_ctx.beginPath();
        canvas_ctx.arc(convertSize(100), convertSize(125), convertSize(85) * Scangame_gamedata.circle_size_ratio + convertSize(3), 0, 2 * Math.PI);
        canvas_ctx.stroke();
    }else if(Scangame_gamedata.selected_item == 2){
        canvas_ctx.fillStyle = "#A7973D";
        canvas_ctx.beginPath();
        canvas_ctx.arc(convertSize(100), convertSize(325), convertSize(85) * Scangame_gamedata.circle_size_ratio + convertSize(3), 0, 2 * Math.PI);
        canvas_ctx.stroke();
    }
    finished_options();
    
}

/**
 * function to draw the green arc around games and tasks that were completed
 * @function
 */
function finished_options(){

    if(Scangame_gamedata.game_stage == 0 || Scangame_gamedata.game_stage == 1){
        for(var i = 0; i < Scangame_gamedata.main_completed_items.length; i++){

            var circle_y = 0;
            var ticklogo_y = 0;

            if(Scangame_gamedata.main_completed_items[i] == 1){
                circle_y = 125;
                ticklogo_y = 80;
            }else if(Scangame_gamedata.main_completed_items[i] == 2){
                circle_y = 325;
                ticklogo_y = 280;
            }

            canvas_ctx.save();

            canvas_ctx.lineWidth = 3;
            canvas_ctx.strokeStyle = "#43D139";
            canvas_ctx.beginPath();
            canvas_ctx.arc(convertSize(100), convertSize(circle_y), convertSize(85) * Scangame_gamedata.circle_size_ratio + convertSize(3), 0, 2 * Math.PI);
            canvas_ctx.stroke();

            canvas_ctx.restore();

            canvas_ctx.drawImage(image_tick_logo, convertSize(65) + convertSize(85) * Scangame_gamedata.circle_size_ratio, convertSize(ticklogo_y) + convertSize(85) * Scangame_gamedata.circle_size_ratio, convertSize(30), convertSize(30));

        }
    }else{
        for(var i = 0; i < Scangame_gamedata.completed_items.length; i++){

            var circle_y = 0;
            var ticklogo_y = 0;

            if(Scangame_gamedata.completed_items[i] == 1){
                circle_y = 125;
                ticklogo_y = 80;
            }else if(Scangame_gamedata.completed_items[i] == 2){
                circle_y = 325;
                ticklogo_y = 280;
            }

            canvas_ctx.save();

            canvas_ctx.lineWidth = 3;
            canvas_ctx.strokeStyle = "#43D139";
            canvas_ctx.beginPath();
            canvas_ctx.arc(convertSize(100), convertSize(circle_y), convertSize(85) * Scangame_gamedata.circle_size_ratio + convertSize(3), 0, 2 * Math.PI);
            canvas_ctx.stroke();

            canvas_ctx.restore();

            canvas_ctx.drawImage(image_tick_logo, convertSize(65) + convertSize(85) * Scangame_gamedata.circle_size_ratio, convertSize(ticklogo_y) + convertSize(85) * Scangame_gamedata.circle_size_ratio, convertSize(30), convertSize(30));

        }
    }
    
}

/**
 * function to draw the side menu without logos, only the rectangle and the circles
 * @function
 */
function draw_basics(){
    canvas_ctx.fillStyle = "#C97575";
    canvas_ctx.fillRect(0, 0, convertSize(200), convertSize(450));

    canvas_ctx.fillStyle = "#EAD79E";
    canvas_ctx.strokeStyle = "#EAD79E";
    canvas_ctx.beginPath();
    canvas_ctx.arc(convertSize(100), convertSize(125), convertSize(85) * Scangame_gamedata.circle_size_ratio, 0, 2 * Math.PI);
    canvas_ctx.stroke();
    canvas_ctx.fill();

    canvas_ctx.beginPath();
    canvas_ctx.arc(convertSize(100), convertSize(325), convertSize(85) * Scangame_gamedata.circle_size_ratio, 0, 2 * Math.PI);
    canvas_ctx.stroke();
    canvas_ctx.fill();

    selected_option();
}

//variables that are needed for the moving machine's parts animation
var angle = 0;
var angle1 = 180;
var change = 90;
var change_direction = false;
var belt_one = true;
var belt_one_moved = false;
var belt_two_moved = false;

/**
 * function to draw the moving part
 * it changes the angle at each iteration and stops when the change variable reaches 0
 * @function
 */
function move_machine_part(){
    canvas_ctx.clearRect(0, 0, convertSize(800), convertSize(450));
    canvas_ctx.drawImage(image_machine_game, 0, 0, convertSize(800), convertSize(450));
    
    draw_basics();
    
    if(belt_one){
        if(!change_direction)
            angle++;
        else 
            angle--;
    }
    

    canvas_ctx.save();
    canvas_ctx.translate(convertSize(507.5), convertSize(233.5));
    canvas_ctx.rotate(angle * Math.PI /180);
    canvas_ctx.translate(convertSize(-507.5), convertSize(-233.5));
    
    canvas_ctx.drawImage(image_machine_part, convertSize(408), convertSize(345), convertSize(200), convertSize(90));
    canvas_ctx.restore();

    if(!belt_one)
        angle1++;
    
    canvas_ctx.save();
    canvas_ctx.translate(convertSize(507.5), convertSize(233.5));
    canvas_ctx.rotate(angle1 * Math.PI /180);
    canvas_ctx.translate(convertSize(-507.5), convertSize(-233.5));
    
    canvas_ctx.drawImage(image_machine_part, convertSize(408), convertSize(345), convertSize(200), convertSize(90));
    canvas_ctx.restore();
    
    canvas_ctx.drawImage(image_machine_part1_logo, convertSize(100) - (convertSize(103) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(133) - (convertSize(94) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(103) * Scangame_gamedata.circle_size_ratio, convertSize(80) * Scangame_gamedata.circle_size_ratio);
    
    canvas_ctx.drawImage(image_machine_part2_logo, convertSize(100) - (convertSize(103) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(333) - (convertSize(94) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(103) * Scangame_gamedata.circle_size_ratio, convertSize(80) * Scangame_gamedata.circle_size_ratio);
    
    
    change--;
    current_blur = 0;
}

//variables for the zip_belt function to do the animation
var x_belt = 233,
    changeby_x = 410 / 40;

var current_belt;

/**
 * function to draw the animation that moves the belt from one side to the end of the belt
 * @function
 */
function zip_belt(){

    draw_beltscreen(100, 260, 600, 450);
    draw_basics();

    canvas_ctx.drawImage(image_belt1_logo, convertSize(100) - (convertSize(125) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(125) - (convertSize(90) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(125) * Scangame_gamedata.circle_size_ratio, convertSize(90) * Scangame_gamedata.circle_size_ratio);

    canvas_ctx.drawImage(image_belt2_logo, convertSize(100) - (convertSize(125) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(325) - (convertSize(90) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(125) * Scangame_gamedata.circle_size_ratio, convertSize(90) * Scangame_gamedata.circle_size_ratio);
    
    
    if(belt_top && !belt_top_zip)
        draw_belt(x_belt, 153, 0);
    else if(belt_top && belt_top_zip)
        draw_belt(643, 153, 0);
    else if(!belt_top && !belt_top_zip)
        draw_belt(233, 153, 0);
    
    
    if(belt_bottom && !belt_bottom_zip)
        draw_belt(x_belt, 370, 0);
    else if(belt_bottom && belt_bottom_zip)
        draw_belt(643, 370, 0);
    else if(!belt_bottom && !belt_bottom_zip)
        draw_belt(233, 370, 0);
    
    
    if(!stop)
        x_belt += changeby_x;
    else
        x_belt = 233;
    
    
    change_frame();
}

/**
 * function that works like zip_belt() but the user controls how far the belt goes
 * it uses the difference in x positions to find the lenght and check if it reaches 441
 * @function
 */
function move_belt(){
    var length;
    var actual_length = 0;
    var rect = document.getElementById('gameArea').getBoundingClientRect();
    var rect_ratio = rect.width / 800;
    
    if(Scangame_gamedata.mouse_x < rect_ratio * (233 + 30.5)){
        length = convertSize(30.5);
    }else {
        actual_length = Scangame_gamedata.mouse_x - 233 * rect_ratio;
        length = convertSize(Scangame_gamedata.mouse_x / rect_ratio - 233);
    }
    
    
    draw_beltscreen(100, 260, 600, 450);
        
    draw_basics();

    if(belt_top && !belt_top_zip)
        draw_belt(233, 153, length);
    else if(belt_top && belt_top_zip)
        draw_belt(643, 153, 0);
    else if(!belt_top && !belt_top_zip)
        draw_belt(233, 153, 0);
    
    
    if(belt_bottom && !belt_bottom_zip)
        draw_belt(233, 370, length);
    else if(belt_bottom && belt_bottom_zip)
        draw_belt(643, 370, 0);
    else if(!belt_bottom && !belt_bottom_zip)
        draw_belt(233, 370, 0);
    
    
    
    canvas_ctx.drawImage(image_belt1_logo, convertSize(100) - (convertSize(125) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(125) - (convertSize(90) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(125) * Scangame_gamedata.circle_size_ratio, convertSize(90) * Scangame_gamedata.circle_size_ratio);

    canvas_ctx.drawImage(image_belt2_logo, convertSize(100) - (convertSize(125) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(325) - (convertSize(90) * Scangame_gamedata.circle_size_ratio) / 2, convertSize(125) * Scangame_gamedata.circle_size_ratio, convertSize(90) * Scangame_gamedata.circle_size_ratio);
    
    
    if(actual_length > 411 * rect_ratio){
        audio_pullingBelt.pause();
        audio_scanBeltLock.play();
        Scangame_gamedata.game_stage = 2;
        if(belt_top){
            belt_top_zip = true;
            Scangame_gamedata.completed_items.push(1);
        }
        
        if(belt_bottom){
            belt_bottom_zip = true;
            Scangame_gamedata.completed_items.push(2);
        }
        
        if(Scangame_gamedata.completed_items.length > 2){
            Scangame_gamedata.completed_items = [];
            Scangame_gamedata.main_completed_items.push(2);
            Scangame_gamedata.monkey_stop_move = true;
            Scangame_gamedata.background_state = 6;
            Scangame_gamedata.zoom_in = false;
            Scangame_gamedata.game_stage = 1;
        }
    }
    
    change_frame();

}

/**
 * function to draw the belt at specified position and with glow/hint effect if needed
 * @function
 */
function draw_belt(x, y, length){
    
    var grd_1 = canvas_ctx.createLinearGradient(convertSize(220), 0, convertSize(770), 0);
    grd_1.addColorStop(0, "#C4C4C4");
    grd_1.addColorStop(0.5, "#EDEDED");
    grd_1.addColorStop(1, "#C4C4C4");
    
    canvas_ctx.strokeStyle = grd_1;
    canvas_ctx.lineWidth = convertSize(47);
    canvas_ctx.beginPath();
    canvas_ctx.moveTo(convertSize(223), convertSize(y));
    canvas_ctx.lineTo(convertSize(x + 1) + length, convertSize(y));
    canvas_ctx.stroke();
    
    var grd_2 = canvas_ctx.createLinearGradient(convertSize(220), 0, convertSize(770), 0);
    grd_2.addColorStop(0, "#9C9C9C");
    grd_2.addColorStop(0.5, "#C1C1C1");
    grd_2.addColorStop(1, "#9C9C9C");
    
    canvas_ctx.strokeStyle = grd_2;
    canvas_ctx.lineWidth = convertSize(1);
    
    canvas_ctx.beginPath();
    canvas_ctx.moveTo(convertSize(223), convertSize(y + 0.5) - (convertSize(47) / 2));
    canvas_ctx.lineTo(convertSize(x + 1) + length, convertSize(y + 0.5) - (convertSize(47) / 2));
    canvas_ctx.moveTo(convertSize(223), convertSize(y) + (convertSize(47) / 2));
    canvas_ctx.lineTo(convertSize(x + 1) + length, convertSize(y) + (convertSize(47) / 2));
    canvas_ctx.stroke();
    
    canvas_ctx.restore();
    
    var restore = false;
    if(pause_time > 60){
        canvas_ctx.save();

        canvas_ctx.shadowBlur = current_blur;
        canvas_ctx.shadowColor = "#25CAAF";
        
        restore = true;

        if(increase_blur){
            current_blur += 0.4;
            if(current_blur > 30){
                increase_blur = false;
            }
        }else {
            current_blur -= 0.4;
            if(current_blur < 10){
                increase_blur = true;
            }
        }
        
    }else{
        pause_time++;
    }

    if(y == 153 && belt_top){
        canvas_ctx.restore();
        restore = false;
    }
    
    if(y == 370 && belt_bottom){
        canvas_ctx.restore();
        restore = false;
    }
    
    canvas_ctx.drawImage(image_belt_image, convertSize(x) + length, convertSize(y - 30), convertSize(86), convertSize(61));
    
    if(restore)
        canvas_ctx.restore();

    canvas_ctx.drawImage(image_belt_end_image, convertSize(687), convertSize(y - 29), convertSize(72), convertSize(62));
}

//variables to control the listeners and stop actions that can brake the code
var stop = false;
var block = false;
var block_onlick = false;
var belt_top = false;
var belt_bottom = false;
var belt_top_zip = false;
var belt_bottom_zip = false;
var temp_completed_items;

/**
 * function to add different listeners depending if it is a mobile device of a computer
 * @function
 */
function add_listeners(){
    if(onMobileDevice()){
        document.getElementById('gameArea').addEventListener('touchstart', touchstart_scangame, true);
        
        document.getElementById('gameArea').addEventListener('touchend', touchend_scangame, true);
        
        document.getElementById('gameArea').addEventListener('touchmove', touchmove_scangame, true);
    }else{
        document.getElementById('gameArea').onmousemove = function(e){
            Scangame_gamedata.change_mouse_coords(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        }
        document.getElementById('gameArea').onmousedown = function(){
            check3();
            check1();
        }

        document.getElementById('gameArea').onmouseup = function(){
            check2();

        }
    }

}

/**
 * function for the touch move listener
 * @function
 */
function touchmove_scangame(e){
    Scangame_gamedata.change_mouse_coords(e.touches[0].pageX - this.offsetLeft, e.touches[0].pageY - this.offsetTop);
}

/**
 * function for the touch start listener
 * @function
 */
function touchstart_scangame(e){
    Scangame_gamedata.change_mouse_coords(e.touches[0].pageX - this.offsetLeft, e.touches[0].pageY - this.offsetTop);
    check3();
    check1();
}

/**
 * function for the touch end listener
 * @function
 */
function touchend_scangame(e){
    Scangame_gamedata.change_mouse_coords(e.touches[0].pageX - this.offsetLeft, e.touches[0].pageY - this.offsetTop);
    check2();
}

/**
 * function to check if the click was at any buttons and it changes the game stage if 
 * all conditions were met 
 * @function
 */
function check1(){
    var rect = document.getElementById('gameArea').getBoundingClientRect();
    var rect_ratio = rect.width / 800;

    if(Scangame_gamedata.mouse_x > 233 * rect_ratio && 
       Scangame_gamedata.mouse_x < 320 * rect_ratio && 
       Scangame_gamedata.mouse_y > 122.5 * rect_ratio &&
       Scangame_gamedata.mouse_y < 183.5 * rect_ratio){

        if(Scangame_gamedata.game_stage == 2){   
            current_blur = 0;
            pause_time = 0;
            Scangame_gamedata.game_stage = 4;
            audio_pullingBelt.loop = true;
            audio_pullingBelt.play();
            belt_top = true;
        }

    }

    if(Scangame_gamedata.mouse_x > 233 * rect_ratio && 
       Scangame_gamedata.mouse_x < 320 * rect_ratio && 
       Scangame_gamedata.mouse_y > 340.5 * rect_ratio &&
       Scangame_gamedata.mouse_y < 401.5 * rect_ratio){

        if(Scangame_gamedata.game_stage == 2){
            current_blur = 0;
            pause_time = 0;
            Scangame_gamedata.game_stage = 4;
            audio_pullingBelt.loop = true;
            audio_pullingBelt.play();
            belt_bottom = true;

            current_belt = 370;
        }

    }

    if(Scangame_gamedata.mouse_x > 398 * rect_ratio && 
       Scangame_gamedata.mouse_x < 618 * rect_ratio && 
       Scangame_gamedata.mouse_y > 335 * rect_ratio && 
       Scangame_gamedata.mouse_y < 425 * rect_ratio &&
       !belt_one_moved &&
       !block_onlick && Scangame_gamedata.game_stage == 3){

        block_onlick = true;
        belt_one = true;
        change = 90;
        Scangame_gamedata.game_stage = 5;
        audio_movingScanCameraSound.loop = true;
        audio_movingScanCameraSound.play();


    }else if(Scangame_gamedata.mouse_x > 398 * rect_ratio &&
             Scangame_gamedata.mouse_x < 618 * rect_ratio &&
             Scangame_gamedata.mouse_y > 42  * rect_ratio &&
             Scangame_gamedata.mouse_y < 132 * rect_ratio &&
             !belt_two_moved &&
             !block_onlick && Scangame_gamedata.game_stage == 3){

        block_onlick = true;
        belt_one = false;
        change = 90;
        Scangame_gamedata.game_stage = 5;
        audio_movingScanCameraSound.loop = true;
        audio_movingScanCameraSound.play();
    }

    else if(Scangame_gamedata.mouse_x > 305.5 * rect_ratio && 
            Scangame_gamedata.mouse_x < 395.5 * rect_ratio && 
            Scangame_gamedata.mouse_y > 134 * rect_ratio && 
            Scangame_gamedata.mouse_y < 334 * rect_ratio && 
            belt_one_moved && 
            belt_two_moved &&
            !block_onlick && 
            Scangame_gamedata.game_stage == 3 &&
            Scangame_gamedata.completed_items.length != 2){

        Scangame_gamedata.completed_items.push(1);
        block_onlick = true;
        belt_one = true;
        change = 45;
        change_direction = true;
        Scangame_gamedata.game_stage = 5;
        audio_movingScanCameraSound.loop = true;
        audio_movingScanCameraSound.play();

    }
    else if(Scangame_gamedata.mouse_x > 619.5 * rect_ratio && 
            Scangame_gamedata.mouse_x < 709.5 * rect_ratio && 
            Scangame_gamedata.mouse_y > 134 * rect_ratio && 
            Scangame_gamedata.mouse_y < 334 * rect_ratio && 
            belt_two_moved && 
            belt_one_moved &&
            !block_onlick && 
            Scangame_gamedata.game_stage == 3 && 
            Scangame_gamedata.completed_items.length != 2){

        Scangame_gamedata.completed_items.push(2);
        block_onlick = true;
        belt_one = false;
        change = 45;
        Scangame_gamedata.game_stage = 5;
        audio_movingScanCameraSound.loop = true;
        audio_movingScanCameraSound.play();
    }

}

/**
 * function to stop the animation if the belt zipping is manual
 * @function
 */
function check2(){
    if(Scangame_gamedata.game_type == 1){
        if(Scangame_gamedata.game_stage == 4){
            audio_pullingBelt.pause();
            if(belt_top && !belt_top_zip)
                belt_top = false;
            if(belt_bottom && !belt_bottom_zip)
                belt_bottom = false;

            Scangame_gamedata.game_stage = 2;
        }
    }
}

/**
 * function to check if any game was selected at the main menu in the Scan game
 * @function
 */
function check3(){
    var rect = document.getElementById('gameArea').getBoundingClientRect();
    var rect_ratio = rect.width/800;

    if(!block){
        if(Math.pow(Scangame_gamedata.mouse_x - 100 * rect_ratio, 2) +
           Math.pow(Scangame_gamedata.mouse_y - 125 * rect_ratio, 2) < 
           Math.pow(85 * rect_ratio * Scangame_gamedata.circle_size_ratio, 2) &&
           !Scangame_gamedata.main_completed_items.includes(1) && Scangame_gamedata.game_stage != 1){

            if(Scangame_gamedata.game_stage == 0){
                Scangame_gamedata.game_stage = 3;
                Scangame_gamedata.completed_items = [];

            }

        }else if(Math.pow(Scangame_gamedata.mouse_x - 100 * rect_ratio, 2) +
                 Math.pow(Scangame_gamedata.mouse_y - 325 * rect_ratio, 2) < 
                 Math.pow(85 * rect_ratio * Scangame_gamedata.circle_size_ratio, 2) &&
                 !Scangame_gamedata.main_completed_items.includes(2) && Scangame_gamedata.game_stage != 1){

            if(Scangame_gamedata.game_stage == 2){

            }else{
                Scangame_gamedata.completed_items = [];
                Scangame_gamedata.game_stage = 1;
            }

        }else if(Scangame_gamedata.mouse_x > 750 * rect_ratio && 
                 Scangame_gamedata.mouse_x < 800 * rect_ratio &&
                 Scangame_gamedata.mouse_y > 400 * rect_ratio &&
                 Scangame_gamedata.mouse_y < 450 * rect_ratio){
            Scangame_gamedata.game_stage = 6;
        }
    }
}

var scangame_frame = 2;
var pause_time1 = 0;

/**
 * function that is responsible for the in-game animation that changes frames and 
 * makes the monkey move hands
 * @function
 */
function change_frame(){
    pause_time1++;
    if(pause_time1 > 40){
        if(Scangame_gamedata.game_stage == 0 || Scangame_gamedata.game_stage == 1){
            if(Scangame_gamedata.monkey_stop_move){
                if(Scangame_gamedata.main_completed_items.includes(1))
                    Scangame_gamedata.background_state = 5;
                else 
                    Scangame_gamedata.background_state = 6;
            }else{
                if(scangame_frame == 1){
                    if(Scangame_gamedata.main_completed_items.includes(1))
                        Scangame_gamedata.background_state = 3;
                    else
                        Scangame_gamedata.background_state = 1;
                }else{
                    if(Scangame_gamedata.main_completed_items.includes(1))
                        Scangame_gamedata.background_state = 4;
                    else
                        Scangame_gamedata.background_state = 2;
                }
            }
        }else if(Scangame_gamedata.game_stage == 2 || Scangame_gamedata.game_stage == 4){
            if(Scangame_gamedata.monkey_stop_move){
                Scangame_gamedata.beltscreen_state = 1;
            }else{
                if(scangame_frame == 1)
                    Scangame_gamedata.beltscreen_state = 1;
                else
                    Scangame_gamedata.beltscreen_state = 2;
            }
        }
        
        if(scangame_frame == 1)
            scangame_frame = 2;
        else
            scangame_frame = 1;
        
        pause_time1 = 0;      
    }else{
        pause_time1++;
    }
}


var rocketanimation_counter = 0;
var current_rocket_anim = 0;

/**
 * function to control the flow of the rocket animation
 * it has a switch that calls different methods 
 * @function
 */
function rocket_animation(){
    switch(current_rocket_anim){
        case 0:
            move_bed_rocket();
            break;
        case 1:
            move_left_rocket();
            break;
        case 2:
            fade_out_rocket();
            break;
        case 3:
            fade_in_rocket();
            break;
        case 4:
            rotate_rocket();
            break;
        case 5:
            fly_rocket();
            break;
        case 6:
            break;
    }
        
    if(current_rocket_anim == 0){
        if(rocketanimation_counter > 37){
            new_y_rocket = current_y_rocket + changeby_y_rocket;
            rocketanimation_counter = 0;
            current_rocket_anim = 1;
        }else{
            rocketanimation_counter++;
        }
        
    }else if(current_rocket_anim == 1){
        if(rocketanimation_counter > 40){
            new_x_rocket = current_x_rocket + changeby_x_rocket;
            rocketanimation_counter = 0;
            current_rocket_anim = 2;
        }else{
            rocketanimation_counter++;
        }
    }else if(current_rocket_anim == 2){
        if(alpha_rocket <= 0){
            alpha_rocket = 0;
            current_rocket_anim = 3;
        }
    }else if(current_rocket_anim == 3){
        if(alpha_rocket > 0){
            current_rocket_anim = 4;
            
            canvas_ctx.clearRect(0, 0, convertSize(800), convertSize(450));

            canvas_ctx.drawImage(image_rocket_background, 0, 0, convertSize(800), convertSize(450));
            canvas_ctx.drawImage(image_rocket, convertSize(76.5), convertSize(3), convertSize(407), convertSize(416));
        }
    }else if(current_rocket_anim == 4){
        if(angle_rocket > 104){
            current_rocket_anim = 5;
            audio_transformingBed.pause();
            rocketanimation_counter = 0;
        }
    }else if(current_rocket_anim == 5){
        if(rocketanimation_counter > 130){
            current_rocket_anim = 6;
            goToNextState(true);
        }else {
            rocketanimation_counter++;
        }
    }
}

var new_y_rocket = 0;
var current_y_rocket = 0,
    changeby_y_rocket = 2;

/**
 * function to make the animation where the bed moves up
 * @function
 */
function move_bed_rocket(){
    canvas_ctx.clearRect(0, 0, convertSize(800), convertSize(450));

    canvas_ctx.drawImage(image_rocket_background, 0, 0, convertSize(800), convertSize(450));

    canvas_ctx.drawImage(image_machine_rocket, convertSize(257), 0, convertSize(209), convertSize(193.1)); 
    canvas_ctx.drawImage(image_bed_part1, convertSize(309), convertSize(197 + current_y_rocket), convertSize(103), convertSize(195));
    canvas_ctx.drawImage(image_bed_part2, convertSize(298), convertSize(371 + current_y_rocket), convertSize(125), convertSize(71));

    current_y_rocket -= changeby_y_rocket;

}

var new_x_rocket = 0;
var current_x_rocket = 0,
    changeby_x_rocket = 2;

/**
 * function to make the animation where the bed and the machine moves left
 * @function
 */
function move_left_rocket(){
    canvas_ctx.clearRect(0, 0, convertSize(800), convertSize(450));

    canvas_ctx.drawImage(image_rocket_background, 0, 0, convertSize(800), convertSize(450));

    canvas_ctx.drawImage(image_machine_rocket, convertSize(257 + current_x_rocket), 0, convertSize(209), convertSize(193.1)); 
    canvas_ctx.drawImage(image_bed_part1, convertSize(309 + current_x_rocket), convertSize(197 + new_y_rocket), convertSize(103), convertSize(195));
    canvas_ctx.drawImage(image_bed_part2, convertSize(298 + current_x_rocket), convertSize(371 + new_y_rocket), convertSize(125), convertSize(71));

    current_x_rocket -= changeby_x_rocket;

}

var alpha_rocket = 1;

/**
 * function to fade-out one part of the bed
 * @function
 */
function fade_out_rocket(){
    
    canvas_ctx.clearRect(0, 0, convertSize(800), convertSize(450));

    canvas_ctx.drawImage(image_rocket_background, 0, 0, convertSize(800), convertSize(450));
    canvas_ctx.drawImage(image_machine_rocket, convertSize(257 + new_x_rocket), 0, convertSize(209), convertSize(193.1)); 
    canvas_ctx.drawImage(image_bed_part1, convertSize(309 + new_x_rocket), convertSize(197 + new_y_rocket), convertSize(103), convertSize(195));

    canvas_ctx.save();
    canvas_ctx.globalAlpha = alpha_rocket;
    canvas_ctx.drawImage(image_bed_part2, convertSize(298 + new_x_rocket), convertSize(371 + new_y_rocket), convertSize(125), convertSize(71));
    canvas_ctx.restore();

    alpha_rocket -= 0.05;

}

/**
 * function to fade-in the rocket parts on top of the bed and the machine 
 * @function
 */
function fade_in_rocket(){

    canvas_ctx.clearRect(0, 0, convertSize(800), convertSize(450));

    canvas_ctx.drawImage(image_rocket_background, 0, 0, convertSize(800), convertSize(450));
    canvas_ctx.drawImage(image_machine_rocket, convertSize(257 + new_x_rocket), 0, convertSize(209), convertSize(193.1)); 
    canvas_ctx.drawImage(image_bed_part1, convertSize(309 + new_x_rocket), convertSize(197 + new_y_rocket), convertSize(103), convertSize(195));

    canvas_ctx.save();
    canvas_ctx.globalAlpha = alpha_rocket;
    canvas_ctx.drawImage(image_wings_rocket, convertSize(78), convertSize(125), convertSize(406), convertSize(180));
    canvas_ctx.drawImage(image_middle_rocket, convertSize(314 + new_x_rocket), convertSize(195 + new_y_rocket), convertSize(93), convertSize(297));
    canvas_ctx.restore();

    alpha_rocket += 0.05;

}

var angle_rocket   = 0;
    
var width_rocket = 407,
    height_rocket = 416;
    
var center_x1_rocket = 76.5 + 407/2,
    center_y1_rocket = 3 + 416/2;

/**
 * function to rotate the rocket and make it smaller in same time as an animation
 * @function
 */
function rotate_rocket(){

    canvas_ctx.clearRect(0, 0, convertSize(800), convertSize(450));

    canvas_ctx.drawImage(image_rocket_background, 0, 0, convertSize(800), convertSize(450));   

    canvas_ctx.save();
    canvas_ctx.translate(convertSize(center_x1_rocket), convertSize(center_y1_rocket));
    canvas_ctx.rotate(angle_rocket * Math.PI / 180);
    canvas_ctx.translate(convertSize(-center_x1_rocket), convertSize(-center_y1_rocket));
    canvas_ctx.drawImage(image_rocket, convertSize(center_x1_rocket - width_rocket / 2), convertSize(center_y1_rocket - height_rocket/2), convertSize(width_rocket), convertSize(height_rocket));
    canvas_ctx.restore();

    angle_rocket++;
    width_rocket -= 3.5;
    height_rocket -= 3.5;


}

var center_x_rocket = 76.5 + 407/2,
    center_y_rocket = 3 + 416/2;
    
var add_y_rocket = 0;
    
/**
 * function to make the animation where the rocket flies into the tv
 * @function
 */
function fly_rocket(){
    canvas_ctx.clearRect(0, 0, convertSize(800), convertSize(450));

    canvas_ctx.drawImage(image_rocket_background, 0, 0, convertSize(800), convertSize(450));      

    canvas_ctx.save();
    canvas_ctx.translate(convertSize(center_x_rocket), convertSize(center_y_rocket));
    canvas_ctx.rotate(angle_rocket * Math.PI / 180);
    canvas_ctx.translate(convertSize(-center_x_rocket), convertSize(-center_y_rocket));
    canvas_ctx.drawImage(image_rocket, convertSize(center_x_rocket - width_rocket / 2), convertSize((center_y_rocket - height_rocket/2) + add_y_rocket), convertSize(width_rocket), convertSize(height_rocket));
    canvas_ctx.restore();

    canvas_ctx.drawImage(image_tv_image, 0, convertSize(107.5), convertSize(31), convertSize(65.3));

    add_y_rocket += 3;

}

/**
 * function to draw different backgrounds depending of the background state
 * @param {Number} - x position on the image 
 * @param {Number} - y position on the image 
 * @param {Number} - w width starting from the x position 
 * @param {Number} - y height starting from the y position 
 * @param {Number} - x1 position on the canvas
 * @param {Number} - w1 width on the canvas starting from the x1
 * @function
 */
function draw_mainbackground(x, y, w, h, x1, w1){
    canvas_ctx.clearRect(0, 0, convertSize(800), convertSize(450));

    switch(Scangame_gamedata.background_state){
        case 1:
            canvas_ctx.drawImage(image_background_image1, x, y, w, h, convertSize(x1), 0, convertSize(w1), convertSize(450));
            break;
        case 2:
            canvas_ctx.drawImage(image_background_image2, x, y, w, h, convertSize(x1), 0, convertSize(w1), convertSize(450));
            break;
        case 3:
            canvas_ctx.drawImage(image_background_image3, x, y, w, h, convertSize(x1), 0, convertSize(w1), convertSize(450));
            break;
        case 4:
            canvas_ctx.drawImage(image_background_image4, x, y, w, h, convertSize(x1), 0, convertSize(w1), convertSize(450));
            break;
        case 5:
            canvas_ctx.drawImage(image_background_image5, x, y, w, h, convertSize(x1), 0, convertSize(w1), convertSize(450));
            break;
        case 6:
            canvas_ctx.drawImage(image_background_image6, x, y, w, h, convertSize(x1), 0, convertSize(w1), convertSize(450));
            break;
    }
}

/**
 * function to draw different backgrounds depending of the background state
 * @param {int} - x position on the image 
 * @param {int} - y position on the image 
 * @param {int} - w width starting from the x position 
 * @param {int} - y height starting from the y position 
 * @function
 */
function draw_beltscreen(x, y, w, h){
    canvas_ctx.clearRect(0, 0, convertSize(800), convertSize(450));

    switch(Scangame_gamedata.beltscreen_state){
        case 1:
            canvas_ctx.drawImage(image_bed_image1, x, y, w, h, convertSize(200), 0, convertSize(600), convertSize(450));
            break;
        case 2:
            canvas_ctx.drawImage(image_bed_image2, x, y, w, h, convertSize(200), 0, convertSize(600), convertSize(450));
            break;
    }
}
