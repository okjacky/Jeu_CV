//select canvas
var cvs = document.getElementById('canvas');
var ctx = cvs.getContext("2d");



//load sprite

const sprite = new Image();
sprite.src = "images/flappysprite.png"
const birdSprite = new Image();
birdSprite.src = "images/sprite.png"

//load Sounds

const SCORE_S = new Audio();
SCORE_S.src = "audio/sfx_point.wav";

const FLAP = new Audio();
FLAP.src = "audio/sfx_flap.wav";

const HIT = new Audio();
HIT.src = "audio/sfx_hit.wav";

const SWOOSHING = new Audio();
SWOOSHING.src = "audio/sfx_swooshing.wav";

const DIE = new Audio();
DIE.src = "audio/sfx_die.wav";

//GAME STATE
const state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2

}

//Start button coord
const startBtn = {
    x: 120,
    y: 263,
    w: 83,
    h: 29
}

//CONTROL THE GAME
cvs.addEventListener('click', function(evt){
    switch(state.current){
        case state.getReady:
            state.current = state.game;
            SWOOSHING.play();
            break;
        case state.game:
            bird.flap();
            FLAP.play();
            break;
        case state.over:
            let rect = cvs.getBoundingClientRect();
            let clickX = evt.clientX - rect.left;
            let clickY = evt.clientY - rect.top;

            //check if we click on the start button
            if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h){
                pipes.reset();
                bird.speedReset();
                score.reset();
                state.current = state.getReady;
            }
            break;

    }
});
// console.log(state.current);

// vars and consts
let frames = 0;
const DEGREE = Math.PI/180;

const bg = {
    sX: 292,
    sY: 0,
    w: 288,
    h: 512,
    x: 0,
    y: 0,
    draw: function(){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    }

}
const fg = {
    sX: 584,
    sY: 0,
    w: 336,
    h: 113,
    x: 0,
    y: cvs.height - 112,

    dx: 2,
    
    draw: function(){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);

        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x+this.w, this.y, this.w, this.h);
    },

    update: function(){
        if(state.current == state.game){
            this.x = (this.x - this.dx)%(this.w/2);
        }
    }

}

const bird = {
    animation: [
        {sX : 276, sY : 112},
        {sX : 276, sY : 139},
        {sX : 276, sY : 164},
        {sX : 276, sY : 139},
    ],
    x : 50,
    y : 150,
    w : 34,
    h : 26,

    radius: 12,

    frame: 0,
    gravity: 0.25,
    jump: 3.6,
    speed: 0,
    rotation: 0,

    draw: function(){
        let bird = this.animation[this.frame];

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(birdSprite, bird.sX, bird.sY, this.w, this.h,  - this.w/2,  - this.h/2, this.w, this.h);

        ctx.restore();
    },

    flap: function(){
        this.speed = -this.jump;
    },
    
    update: function(){
         //If the game state is getReady, the bird must flap slowly
       
         this.period = state.current == state.getReady ? 10 : 5;
         //We increment the frame by 1, for each period
        
         this.frame += frames%this.period == 0 ? 1 : 0;
         // frame goes from 0 to 4, then again to 0
         this.frame = this.frame%this.animation.length;

         if(state.current == state.getReady){
            this.y = 150; //reset position of the bird after game Over
            this.rotation = 0 * DEGREE; 
         }else{
             this.speed += this.gravity;
             this.y += this.speed;

             if(this.y + this.h/2 >= cvs.height - fg.h){
                 this.y = cvs.height - fg.h - this.h/2;
                 if(state.current == state.game){
                     state.current = state.over;
                     DIE.play();                    
                 }
             }
             // if the speed is greater than jump means the bird is falling down
             if(this.speed >= this.jump){
                 this.rotation = 90 * DEGREE;
                 this.frame = 1;
             }else{
                 this.rotation = -25 * DEGREE;
             }
         }
    },
    speedReset: function(){
        this.speed = 0;
    }
}

//Pipes
const pipes = {
    position : [],

    top:{
        sX: 553,
        sY: 0
    },
    bottom: {
        sX: 502,
        sY: 0
    },
    w: 53,
    h: 400,
    gap: 105,
    maxYPos: -150,
    dx: 2,

    draw: function(){
        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i];

            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;

            //top pipe
            ctx.drawImage(birdSprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);

            //bottom pipe
            ctx.drawImage(birdSprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);
        }
    },
    update: function(){
        if(state.current !== state.game){return};

        if(frames%100 == 0){
            this.position.push({
                x: cvs.width,
                y: this.maxYPos * (Math.random()+ 1)
            });
        }
        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i];
            let bottomPipeYPos = p.y + this.h + this.gap;
            
            // Collision detection
            // top pipe
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h){
                state.current = state.over;
                HIT.play();
            }
            // bottom pipe
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPipeYPos && bird.y - bird.radius < bottomPipeYPos + this.h){
                state.current = state.over;
                HIT.play();
            }


            //if the pipe go beyond canvas, we delete them from the array
            if(p.x + this.w <= 0){
                this.position.shift();
                score.value += 1 ;
                SCORE_S.play();

                score.best = Math.max(score.value, score.best);
                localStorage.setItem("best", score.best);

            } 
            
            // pipe move to the left side
            p.x -= this.dx;
        }
    },
    reset: function(){
        this.position = [];
    }
}

// Score
const score = {
    best: parseInt(localStorage.getItem('best')) || 0,
    value: 0,

    draw: function(){
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";

        if(state.current == state.game){
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText(this.value, cvs.width/2, 50);
            ctx.strokeText(this.value, cvs.width/2, 50);
        }else if(state.current == state.over){
            // score value
            ctx.font = "25px Teko";
            ctx.fillText(this.value, 225, 186);
            ctx.strokeText(this.value, 225, 186);
            // best score
            ctx.fillText(this.best, 225, 228);
            ctx.strokeText(this.best, 225, 228); 
        }


    },
    reset: function(){
        this.value = 0;
    }

};

//getReady message
const getReady = {
    sX: 0,
    sY: 228,
    w: 173,
    h: 152,
    x: cvs.width/2 - 173/2,
    y: 80,
    
    draw: function(){
        if(state.current == state.getReady){
            ctx.drawImage(birdSprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
       
    }
}

//gameOver message
const gameOver = {
    sX: 175,
    sY: 228,
    w: 225,
    h: 202,
    x: cvs.width/2 - 225/2,
    y: 90,
    
    draw: function(){
        if(state.current==state.over){
            ctx.drawImage(birdSprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        };
       
    }
}

//Draw

function draw (){
    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
    score.draw();
}

//UPDATE

function update(){
    bird.update();
    fg.update();
    pipes.update();

}

// LOOP

function loop (){
    update();
    draw();
    frames++;

    requestAnimationFrame(loop);
}
loop();



// var loadImages = function(url){
//     return new Promise(function(resolve){
//         const image = new Image();
//         image.addEventListener('laod', function(){
//             resolve(image);
//         });
//         image.src = url;
//     });
// };
