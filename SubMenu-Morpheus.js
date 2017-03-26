var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

function subMenu(){

    this.init = function(){
        this.xPos = 0;
        this.yPos = 0;
        this.select_Menu = new Image();
        this.select_Menu.src = "assets/Select Scan.png";
        this.glowyThing = true;
        
        this.bindItTwo = this.mouseClickHandler.bind(this);
        document.addEventListener("mousedown", this.bindItTwo, false);
        
        this.bindIt = this.mouseMoveHandler.bind(this);
        document.addEventListener("mousemove", this.bindIt, false);
		
		console.log("ssssssssssssssssssssssssssssssssssssssssss");
    }
    
    this.draw = function(){
        var cliX;
        var cliY;
        ctx.beginPath();
		//console.log("hello>");
        ctx.drawImage(this.select_Menu,0,0,canvas.width,canvas.height);
        ctx.closePath();
    }
    
    this.update = function(){
        
        if(this.glowyThing){
            if((this.xPos >= 76 && this.xPos <= 558) && (this.yPos >= 218  && this.yPos <= 392)){
                this.select_Menu.src = "assets/Milk Glow.png";
            }
            else if((this.xPos >= 76 && this.xPos <= 558) && (this.yPos >= 438  && this.yPos <= 608)){
                this.select_Menu.src = "assets/Mag3 Glow.png";
            }

            else if((this.xPos >= 76 && this.xPos <= 558) && (this.yPos >= 658  && this.yPos <= 826)){
                this.select_Menu.src = "assets/DMSA Glow.png";
            }

            else if((this.xPos >= 76 && this.xPos <= 558) && (this.yPos >= 874  && this.yPos <= 1046)){
                this.select_Menu.src = "assets/Meckel Glow.png";
            }

            else{
                this.select_Menu.src = "assets/Select Scan.png";	
            }	
        }
    }
    
    this.destroy = function(){
        ctx.clearRect(0,0, canvas.width, canvas.height);
        document.removeEventListener("mousedown", this.bindItTwo, false);
        document.removeEventListener("mousemove", this.bindIt, false);
    }

    this.mouseMoveHandler = function(e){
        var can = canvas.getBoundingClientRect()
 /*        console.log(e.clientX - can.left);
        console.log(e.clientY - can.top); */
        this.xPos = e.clientX - can.left;
        this.yPos = e.clientY - can.top;
    }

    this.mouseClickHandler = function(e){
        
        var can = canvas.getBoundingClientRect()
        if((this.xPos >= 76 && this.xPos <=558) && (this.yPos >= 218 && this.yPos <= 392)){
            this.glowyThing = false;
            this.select_Menu.src = "assets/Milk Press.png";	
            
        }
        else if((this.xPos >= 76 && this.xPos <= 558) && (this.yPos >= 438 && this.yPos <= 608)){
            this.glowyThing = false;
            this.select_Menu.src = "assets/Mag3 Press.png";	
        }
        else if((this.xPos >= 76 && this.xPos <= 558) && (this.yPos >= 658 && this.yPos <= 826)){
            this.glowyThing = false;
            this.select_Menu.src = "assets/Dmsa Press.png";	
        }
        else if((this.xPos >= 76 && this.xPos <= 558) && (this.yPos >= 874 && this.yPos <= 1046)){
            this.glowyThing = false;
            this.select_Menu.src = "assets/Meckel Press.png";	
        }
    }
}
