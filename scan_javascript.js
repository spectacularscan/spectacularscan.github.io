//the size that is used as a default size
//the ratio is the ratio between default and current size
var CONST_WIDTH = 800;
var CONST_HEIGHT = 450;
var ratio = 1;

//two objects for each moving scan part
var box_one = new Box(0, 'box_1', 4);
var box_two = new Box(180, 'box_2', 5);

//sets default values each box positions 
box_one.pos_y = 155 + (120 * Math.sin(0 * (Math.PI / 180)));
box_one.pos_x = 165 + (120 * Math.cos(0 * (Math.PI / 180)));

box_two.pos_y = 155 + (120 * Math.sin(180 * (Math.PI / 180)));
box_two.pos_x = 165 + (120 * Math.cos(180 * (Math.PI / 180)));


//array that holds every element that has to be changed on screen change
//name: id of the element
//top, left distances from top and left of a parent 
//width, height - sizes
//shadow_s is the shadow size, it is negative because it has to go above the element
//shadow_c is the shadow colour
//radius is the border radius (it makes edges rounded)
//border the size of the border
var all_elements = [{name:'circle', top:80, left:50, width:200, height:200, 
                     shadow_s: -15, shadow_c:'4D4D4D', radius: 250, border: 50}, 

                    {name:'back_box', top:280, left:59, width:282, height:100,
                     shadow_s: -20, shadow_c:'4D4D4D', radius: 10, border: 0},

                    {name:'floor', top:400, left:0, width:800, height:50, 
                     shadow_s: -40, shadow_c:'d1d1d1', radius: 0, border: 0},

                    {name:'bed', top:229, left:115, width:170, height:170, 
                     shadow_s: 0, shadow_c:'', radius: 0, border: 0},

                    {name:'box_1', top:box_one.pos_y, left:box_one.pos_x, 
                     width:70, height:150, shadow_s: 0, shadow_c:'', 
                     radius: 20, border: 0},

                    {name:'box_2', top:box_two.pos_y, left:box_two.pos_x, 
                     width:70 , height:150, shadow_s: 0, shadow_c:'', 
                     radius: 20, border: 0}];

//array that holds all buttons
//name, top, left, width and height as in previous array
//b_pos is the starting position of an image that is on top of this button, starting positions is 10, 10
//b_size is the width and height of the image 80, 80
//font_size is the size of the font (most likely will be removed in future)
var scan_buttons = [{name:'button_1', top:120, left:400, width:100 , height:100, 
                     b_pos:10, b_size: 80, font_size: 0},

                    {name:'button_2', top:240, left:400, width:100 , height:100, 
                     b_pos:10, b_size: 80, font_size: 0}, 

                    {name:'button_3', top:120, left:400, width:100 , height:100, 
                     b_pos:10, b_size: 80, font_size: 20},

                    {name:'button_4', top:240, left:400, width:100 , height:100, 
                     b_pos:10, b_size: 80, font_size: 20}];

//function to change elements' styles that are listed above
function change_size(x){
    //changes the value of ratio from default to current
    ratio = x;

    //loops through every element 
    for(var i = 0; i < all_elements.length; i++){
        var element = document.getElementById(all_elements[i].name);

        //assigns new positions and size by multipling current and ratio
        element.style.top = (all_elements[i].top * x) +"px";
        element.style.left = (all_elements[i].left * x) +"px";
        element.style.width = (all_elements[i].width * x) +"px";
        element.style.height = (all_elements[i].height * x) +"px";

        //extra style features that not all elements have
        if(all_elements[i].shadow_s != 0){
            element.style.boxShadow = "0px "+(all_elements[i].shadow_s * x)+
                "px #"+all_elements[i].shadow_c;
        }

        if(all_elements[i].radius != 0){
            element.style.borderRadius = (all_elements[i].radius * x) + "px";
        }

        if(all_elements[i].border != 0){
            element.style.border = (all_elements[i].border * x) + "px solid grey";
        }   
    }

    //loops through every button
    for(var i = 0; i < scan_buttons.length; i++){
        var element = document.getElementById(scan_buttons[i].name);

        //new positions and size
        element.style.top = (scan_buttons[i].top * x) +"px";
        element.style.left = (scan_buttons[i].left * x) +"px";
        element.style.width = (scan_buttons[i].width * x) +"px";
        element.style.height = (scan_buttons[i].height * x) +"px";

        //new position and size of the image that is on top of the button
        element.style.backgroundPosition = (scan_buttons[i].b_pos * x) + "px " + (scan_buttons[i].b_pos * x) + "px";

        element.style.backgroundSize = (scan_buttons[i].b_size * x) + "px " + (scan_buttons[i].b_size * x) + "px";

        //changes the font size (most likely will be removed in future)
        if(scan_buttons[i].font_size != 0){
            element.style.fontSize = scan_buttons[i].font_size * ratio + "px";
        }
    }

    draw_shadow();
}


//function to draw shadow on moving scan parts
function draw_shadow(){
    
    //calculates new x and y for the shadow
    var y_1 = ratio * (5 * Math.sin(box_one.shadow * (Math.PI / 180)));
    var x_1 = ratio * (5 * Math.cos(box_two.shadow * (Math.PI / 180)));

    //adds new shadow to the box
    document.getElementById(all_elements[4].name).style.boxShadow = x_1.toFixed(20)+"px "+y_1.toFixed(20)+"px #939393";

    var y_2 = ratio * (5 * Math.sin(box_two.shadow * (Math.PI / 180)));
    var x_2 = ratio * (5 * Math.cos(box_two.shadow * (Math.PI / 180)));

    document.getElementById(all_elements[5].name).style.boxShadow = x_2.toFixed(20) + "px " + y_2.toFixed(20) + "px #939393";
}

//function that is called when the screen is resized
function resizeGame() {
    //stores new width and height of the whole window
    var window_width = window.innerWidth;
    var window_height = window.innerHeight;

    var game_area = document.getElementById('gameArea');

    //assigns new width and height, the ration between width/height is 16/9
    game_area.style.width = window_width * 0.8+"px";
    game_area.style.height = window_width * 0.8 * (9/16)+"px";

    //if window height is less then required it changes the width and height to fit
    if(window_height < game_area.getBoundingClientRect().height){
        game_area.style.height = -15 +window_height+"px";
        game_area.style.width = window_height * (16/9)+"px";
    }

    //calls the method to change sizes of all elements, ratio is as a parameter
    change_size(game_area.getBoundingClientRect().width / CONST_WIDTH);
}

//screen change listeners
window.addEventListener('resize', resizeGame, false);
window.addEventListener('orientationchange', resizeGame, false);


//call resizeGame method as a default to set up the game
window.onload = function () {
    resizeGame();  
};


//current box in use but it doesn't change now but will later
var current = box_one;

//variables to store animations, it is needed to cancel animations
var animation_1;
var animation_2;
var animation_3;
var animation_4;

//object Box declaration
function Box(x, name, id){
    this.angle = x;
    this.name = name;
    this.rotate = 0;  
    this.shadow = 270;
    this.pos_x = 0;
    this.pox_y = 0;
    this.id = id;
}

//method that is call when move left button is down
function move_left_active(){
    var box = document.getElementById(current.name);

    //assigns new coordinates using style.top and style.left
    //also it is multiplied by the ratio
    box.style.top = 155 * ratio + (120 * ratio * Math.sin(current.angle * (Math.PI / 180)));
    box.style.left = 165 * ratio + (120 * ratio * Math.cos(current.angle * (Math.PI / 180))); 

    //stores new values in the object
    current.pos_y = 155 + (120 * Math.sin(current.angle * (Math.PI / 180)));
    current.pos_x = 165 + (120 * Math.cos(current.angle * (Math.PI / 180)));

    //updates the array with new values
    all_elements[current.id].top = current.pos_y;
    all_elements[current.id].left = current.pos_x;

    //changes the angle by 0.2
    current.angle = current.angle - 0.2;

    //calls animation using requestAnimationFrame
    animation_1 = requestAnimationFrame(move_left_active);
}

//function that is called when the mouse is up and it cancels the animation
function move_left_inactive(){
    cancelAnimationFrame(animation_1);
}


//same as above but instead of subtracting it adds to current angle and this changes the direciton
function move_right_active(){
    var box = document.getElementById(current.name);

    box.style.top = 155 * ratio + (120 * ratio * Math.sin(current.angle * (Math.PI / 180)));
    box.style.left = 165 * ratio + (120 * ratio * Math.cos(current.angle * (Math.PI / 180)));

    current.pos_y = 155 + (120 * Math.sin(current.angle * (Math.PI / 180)));
    current.pos_x = 165 + (120 * Math.cos(current.angle * (Math.PI / 180)));

    all_elements[current.id].top = current.pos_y;
    all_elements[current.id].left = current.pos_x;

    current.angle = current.angle + 0.2;

    animation_2 = requestAnimationFrame(move_right_active);
}

function move_right_inactive(){
    cancelAnimationFrame(animation_2);
}

//function to rotate the box left
function rotate_left_active(){
    //jquery has a command to do the rotation
    $('#'+current.name+'').rotate(current.rotate);

    //calcutes the new values of the shadow
    var y = ratio * (5 * Math.sin(current.shadow * (Math.PI / 180)));
    var x = ratio * (5 * Math.cos(current.shadow * (Math.PI / 180)));

    //assigns new shadow to the current box as it rotating
    document.getElementById(current.name).style.boxShadow = x.toFixed(20) + "px " + y.toFixed(20) + "px #939393";

    //changes the values of the rotate and shadow variables
    current.rotate = current.rotate - 0.2;
    current.shadow = current.shadow + 0.2;

    animation_3 = requestAnimationFrame(rotate_left_active);
}

//function to cancel the animation when the mouse is up from the click
function rotate_left_inactive(){
    cancelAnimationFrame(animation_3);
}


//same as above but new rotate and shadow have opposite calculations
function rotate_right_active(){
    $('#'+current.name+'').rotate(current.rotate);

    var y = ratio * (5 * Math.sin(current.shadow * (Math.PI / 180)));
    var x = ratio * (5 * Math.cos(current.shadow * (Math.PI / 180)));

    document.getElementById(current.name).style.boxShadow = x.toFixed(20) + "px " + y.toFixed(20) + "px #939393";

    current.rotate = current.rotate + 0.2;
    current.shadow = current.shadow - 0.2;

    animation_4 = requestAnimationFrame(rotate_right_active);
}

function rotate_right_inactive(){
    cancelAnimationFrame(animation_4);
}


//will be be deleted in future, is used to swap between different actions
var switch_flag = true;
function switch_actions(){
    if(switch_flag){
        document.getElementById('button_1').style.visibility = "hidden";
        document.getElementById('button_2').style.visibility = "hidden";
        document.getElementById('button_3').style.visibility = "visible";
        document.getElementById('button_4').style.visibility = "visible";

        switch_flag = false;
    }else {
        document.getElementById('button_4').style.visibility = "hidden";
        document.getElementById('button_3').style.visibility = "hidden";
        document.getElementById('button_2').style.visibility = "visible";
        document.getElementById('button_1').style.visibility = "visible";

        switch_flag = true;
    }
}