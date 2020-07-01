var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

let frames =0;
const DEGREE = Math.PI/180;

const sprite = new Image();
sprite.src = "img/sprite.png";

const state = {
    current :0,
    getReady:0,
    game:1,
    over:2,
}

canvas.addEventListener('click',function(evt){
    switch (state.current){
        case state.getReady: 
        state.current = state.game;
        break;
        case state.game:
        bird.flap();
        break;
        case state.over:
        state.current = state.getReady;
        break;    
    }
   
})
const bg ={
  sx:0,
  sy:0,
  w:275,
  h:226,
  x:0,
  y:canvas.height-226,

  draw: function(){
      ctx.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x,this.y,this.w,this.h);
      ctx.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x + this.w ,this.y,this.w,this.h);
  }
}

const fg = {
    sx:276,
    sy:0,
    w:224,
    h:112,
    x:0,
    y:canvas.height - 112,
    dx:2,

    draw: function(){
        ctx.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x,this.y,this.w,this.h);
        ctx.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x + this.w ,this.y,this.w,this.h);
    },

    update: function(){
      
        if (state.current==state.game)
        {
        this.x = (this.x - this.dx)%(this.w/2);
        
        }
    }

}



const bird = {
    animation: [
        { sx: 276, sy:112 },
        { sx: 276, sy:139 },
        { sx: 276, sy:164 },
        { sx: 276, sy:139 },
    ],
    x:50,
    y:150,
    w:34,
    h:26,
    frame:0,
    gravity:0.25,
    speed:0,
    jump: 5,
    rotation:0,

    draw: function(){
        let bird = this.animation[this.frame];

        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite, bird.sx,bird.sy,this.w,this.h,- this.w/2,-this.h/2,this.w,this.h);
        ctx.restore();
    
    },
    flap: function(){
    
       this.speed=-this.jump; 
      
      
    },
    update: function(){
        this.period= state.current==state.getReady? 10:5;
        this.frame += frames% this.period ==0 ?1:0;
        this.frame= this.frame% this.animation.length;
        
        if (state.current==state.getReady){
        this.y=150;
        this.rotation = 0*DEGREE;
        }
        else {
        this.speed+=this.gravity;
        this.y+=this.speed;

        if ( this.y+ this.h/2 >= canvas.height - fg.h){
            this.y = canvas.height - fg.h - this.h/2;
            if(state.current == state.game){
                state.current = state.over;
            
            }
        }

        if( this.speed >=  this.jump){
            this.rotation = 90 * DEGREE;
            this.frame = 1;
        }
        else if (state.current == state.game){
            this.rotation = -25 * DEGREE;
        }
        }
    }
}

const getReady ={
    sx:0,
    sy:228,
    w:173,
    h:152,
    x: canvas.width/2 - 173/2,
    y:80,

    draw: function(){
        if (state.current==state.getReady)
        ctx.drawImage(sprite, this.sx,this.sy,this.w,this.h,this.x,this.y,this.w,this.h);
    }
}
const gameOver ={
    sx:175,
    sy:228,
    w:225 ,
    h:202,
    x: canvas.width/2 - 225/2,
    y:80,

    draw: function(){
        if(state.current==state.over)
        ctx.drawImage(sprite, this.sx,this.sy,this.w,this.h,this.x,this.y,this.w,this.h);
    }
}

function draw(){
  
 ctx.fillStyle ='#70c5ce';
 ctx.fillRect(0,0,canvas.width,canvas.height);
 bg.draw();
 fg.draw();
 bird.draw();
 getReady.draw();
 gameOver.draw();

}

function update(){
 bird.update();
 fg.update();
}

function loop(){

    update();
    draw();
    frames++;

    requestAnimationFrame(loop);
}

loop();