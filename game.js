var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

let frames =0;

const sprite = new Image();
sprite.src = "img/sprite.png";

const state = {
    current :0,
    getReady:0,
    game:1,
    over:2,
}

canvas.addEventListener('click',()=>{
    switch (state.current){
        case state.current: 
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

    draw: function(){
        ctx.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x,this.y,this.w,this.h);
        ctx.drawImage(sprite,this.sx,this.sy,this.w,this.h,this.x + this.w ,this.y,this.w,this.h);
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

    draw: function(){
        let bird = this.animation[this.frame];
        ctx.drawImage(sprite, bird.sx,bird.sy,this.w,this.h,this.x- this.w/2,this.y-this.h/2,this.w,this.h);
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

}

function loop(){

    update();
    draw();
    frames++;

    requestAnimationFrame(loop);
}

loop();