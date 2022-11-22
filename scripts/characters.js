const angelStates  = [ 
    { 
        name: 'stand',
        frameNum: 7, }, 
    { 
        name: 'fly',
        frameNum: 7,},
    {
        name: 'walk',
        frameNum: 7, },
    { 
        name: 'run',
        frameNum: 7,},
    { 
        name: 'attack',
        frameNum: 3,}, 
    { 
        name: 'fallback',
        frameNum: 1,},
    {
        name: 'die',
        frameNum: 5,
    }];

/*---------------------Angel---------------------*/

class Angel {
    constructor(angelState) {
        this.image          = new Image();
        this.image.src      = "images/angel.png";
        this.angelState     = angelState;
        this.spriteWidth    = 1098/9;
        this.spriteHeight   = 672/7;
        this.frameX         = 0;
        this.frameY         = 0;
        this.gameFrame      = 0;
        this.staggerFrames  = 10;
        this.angelAnimations= {};
        this.x              = 30; 
        this.y              = 150;
        this.fixedY         = 150
        //this.speed        = 9;

        angelStates.forEach((state, index) => {
            // create a frames object that has 1 property loc that 
            // has an array of position x, y
            let frames = {
                loc: [],
            }
            for(let i = 0; i < state.frameNum; i++) {
                let positionX  = i * this.spriteWidth;
                let positionY  = index * this.spriteHeight;
                frames.loc.push({x: positionX, y: positionY})
            }
            // the object will have an array of position x, y for each state of the angel
            this.angelAnimations[state.name] = frames;
        });
    }

    draw() {
        // Note 1: frameIndex only changes value when gameFrame increases to a certain number
        // frameIndex stays within range 0 to 7
        // Note 2: state is a string, so we use objectName["propertyName"] instead of objectName.propertyName
        let frameIndex  = Math.floor(this.gameFrame/this.staggerFrames) % this.angelAnimations[this.angelState].loc.length;  
        this.frameX     = frameIndex* this.spriteWidth;
        this.frameY     = this.angelAnimations[this.angelState].loc[frameIndex].y;
        ctx.drawImage(this.image, this.frameX, this.frameY, this.spriteWidth, this.spriteHeight, 
                                  this.x, this.y, this.spriteWidth, this.spriteHeight);
        this.gameFrame++;
    }

    update() {
        // fly to the right
        // if (this.gameFrame % this.staggerFrames === 0) { this.x += this.speed;}
        // if(this.x - this.spriteWidth > canvas.width) { this.x = 0;}; 
        if(this.y > this.fixedY) { this.y -= 1;
        } else {
            this.y += Math.random()* 1 - 0.5; //from -0.5 to 0.5 making character stay in place
        }
    }
}

/*---------------------Monster---------------------*/
 class Monster {
    constructor() {
        this.image          = new Image();
        this.image.src      = "images/bat.png";
        this.spriteWidth    = 128/4;
        this.spriteHeight   = 64/2;
        this.frameX         = 0;
        this.frameY         = 0;
        // will update the position of the monster on canvas
        this.x              = Math.random() * (canvas.width - this.spriteWidth); // stay within canvas
        this.y              = Math.random() * (canvas.height - this.spriteHeight);
        this.speed          = Math.random()* 2 + 1; //from 1 to 3
        this.angle          = 0;
        this.angleSpeed     = Math.random() * 0.1 //from 0 to 0.1
        this.curve          = Math.random() * 5 //get a random prominent curve for sine wave
        // will change the frame position
        this.frame          = 0;
        this.minFrames      = 0;
        this.maxFrames      = 5;
        // will slow down the change of frame
        this.gameFrame      = 0;
        this.staggerFrames  = 10;
    }

    draw() {
        // slow down the animation
        if (this.gameFrame % this.staggerFrames === 0) {
            // move frame to animate the mosnter
            (this.frame < this.maxFrames) ? this.frame++ : this.frame = this.minFrames;
        }
        // move the frame according to number of frames available
        this.frameY  = Math.floor(this.frame/3);
        (this.frameY === 1) ? this.frameX  = this.frame % 2 : this.frameX  = this.frame % 3;

        ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, 
                     this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth, this.spriteHeight);
        this.gameFrame++;
    }

    update (){
        this.x -= this.speed;// fly to the left
        this.y += this.curve * Math.sin(this.angle); // create sine wave movement
        this.angle += this.angleSpeed; //each character has its own angle value
        if(this.x + this.spriteWidth < 0) this.x = canvas.width; //fly back from the right
    }
 }
