var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

let frames =0;
const DEGREE = Math.PI/180;

//load image
const sprite = new Image();
sprite.src = "img/sprite.png";

//load sounds
const score_s = new Audio();
score_s.src = "audio/sfx_point.wav";

const flap_s = new Audio();
flap_s.src = "audio/sfx_flap.wav";

const hit_s = new Audio();
hit_s.src = "audio/sfx_hit.wav";

const swooshing_s = new Audio();
swooshing_s.src = "audio/sfx_swooshing.wav";

const die_s = new Audio();
die_s.src = "audio/sfx_die.wav";

//game states
const state = {
    current :0,
    getReady:0,
    game:1,
    over:2,
}

//start button coordinates
const start = {
  x: 120,
  y: 263,
  w: 83,
  h: 29,
}

canvas.addEventListener('click',function(evt){
    switch (state.current){
        case state.getReady: 
        state.current = state.game;
        swooshing_s.play();
        break;
        case state.game:
        if(bird.y - bird.radius <= 0) return;
        bird.flap();
        flap_s.play();
        break;
        case state.over:
            // The Element.getBoundingClientRect() method returns the size of an element and 
            // its position relative to the viewport.
            let rect = canvas.getBoundingClientRect();
            let clickX = evt.clientX - rect.left;
            let clickY = evt.clientY - rect.top;
       
            if(clickX >= start.x && clickX <=start.w+start.x && clickY<=start.h+start.y && clickY >=start.y){
              
             pipes.reset();
             bird.speedReset();
             score.reset();
             state.current = state.getReady;
             }
        break;    
    }
   
})
//background
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

//foreground
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

//bird
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
    gravity:0.2,
    speed:0,
    jump:4,
    rotation:0,
    radius:12,

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
        // at get ready state the bird should flap slowly
        this.period= state.current==state.getReady? 10:5;
        this.frame += frames% this.period ==0 ?1:0;
        //frame goes from 0 to 4 and then back to 4
        this.frame= this.frame% this.animation.length;
        
        if (state.current==state.getReady){
        this.y=150; //rest position of bird after game is over
        this.rotation = 0*DEGREE;
        }
        else {
        this.speed+=this.gravity;
        this.y+=this.speed;

        if ( this.y+ this.h/2 >= canvas.height - fg.h){
            this.y = canvas.height - fg.h - this.h/2;
            if(state.current == state.game){
                state.current = state.over;
                die_s.play();
            }
        }
        //if speed is greater than jump then bird is falling down
        if( this.speed >=  this.jump){
            this.rotation = 90 * DEGREE;
            this.frame = 1;
        }
        else{
            this.rotation = -25 * DEGREE;
        }
        }
    },

    speedReset : function(){
        this.speed = 0;
    }
}

//get ready message
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

//game over message
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

//pipes
const pipes = {
    position : [],

    top: {
        sx:553,
        sy:0,
    },
    bottom:{
        sx:502,
        sy:0
    },
    w:53,
    h:400,
    gap:85,
    maxYPos: -150,
    dx:2,
    draw: function(){
        
        for(let i=0;i< this.position.length;i++){
            let p=this.position[i];
            let bottomYPos = p.y + this.h + this.gap;
            ctx.drawImage(sprite, this.top.sx,this.top.sy,this.w,this.h,p.x,p.y,this.w,this.h);
            ctx.drawImage(sprite, this.bottom.sx,this.bottom.sy,this.w,this.h,p.x,bottomYPos,this.w,this.h);
        }
    },

    update: function(){
       if(state.current !== state.game) return;

       if(frames%100 ==0){
        this.position.push({
            x:canvas.width,
            y:this.maxYPos* (Math.random()+1),
        });
        }

       for(let i=0;i< this.position.length;i++){
        let p=this.position[i];
        //   p.x-=this.dx;
          let bottomPipeY = this.h + this.gap + p.y;

          //collision detection
           if(bird.x+bird.radius > p.x && bird.x- bird.radius <p.x+this.w 
            && bird.y -bird.radius < p.y+this.h && bird.y+bird.radius>p.y )
           {
               state.current = state.over;
               hit_s.play();
           }
           if(bird.x+bird.radius > p.x && bird.x- bird.radius <p.x+this.w
            && bird.y -bird.radius < bottomPipeY + this.h && bird.y+bird.radius> bottomPipeY)
           {
               state.current = state.over;
               hit_s.play();
           }

           p.x-=this.dx;

           //if pipes go beyound canvas, we delete them from the array
            if(p.x+this.w <=0){
           this.position.shift();
           score.value+=1;
           score_s.play();
           score.best = Math.max(score.value,score.best);
           localStorage.setItem('best',score.best);
            }
       }  
    },

    reset : function(){
        this.position=[];
    }
}

//score
const score = {
    best : parseInt(localStorage.getItem('best')) || 0,
    value: 0,

    draw : function(){
        ctx.fillStyle = '#FFF';
        ctx.strokeStyle='#000';

        if(state.current == state.game){
            ctx.lineWidth=2;
            ctx.font= "35px Ariel";
            ctx.fillText(this.value,canvas.width/2,50);
            ctx.strokeText(this.value,canvas.width/2,50);
        }
        else if(state.current==state.over){
            
            ctx.font= "20px Ariel";
            ctx.fillText(this.value,225,175);
            ctx.strokeText(this.value,225,175);
            ctx.fillText(this.best,225,215);
            ctx.strokeText(this.best,225,215);
        }
    },

    reset: function(){
        this.value=0;
    }
}

//medals
const medal = {
    sX : 359,
    sY : 157,
    x : 72,
    y : 165,
    width : 45,
    height : 45,
    
    draw: function(){
     if(state.current == state.over && score.value <= 10){
        ctx.drawImage(sprite, this.sX, this.sY, this.width, this.height, this.x, this.y, this.width, this.height);
     }
     if(state.current == state.over && score.value <= 20){
        ctx.drawImage(sprite, this.sX, this.sY - 46, this.width, this.height, this.x, this.y, this.width, this.height);
     }
     if(state.current == state.over && score.value <= 30){
        ctx.drawImage(sprite, this.sX - 48, this.sY, this.width, this.height, this.x, this.y, this.width, this.height);
     }
     if(state.current == state.over && score.value <= 40){
        ctx.drawImage(sprite, this.sX - 48, this.sY - 46, this.width, this.height, this.x, this.y, this.width, this.height);
     }
    }
}
function draw(){
  
 ctx.fillStyle ='#70c5ce';
 ctx.fillRect(0,0,canvas.width,canvas.height);

 bg.draw();
 pipes.draw();
 fg.draw();
 bird.draw();
 getReady.draw();
 gameOver.draw();
 score.draw();
 medal.draw();
}

function update(){ 
  
 bird.update();
 fg.update();
 pipes.update();
}

function loop(){

    update();
    draw();
    frames++;

    requestAnimationFrame(loop);
}

loop();