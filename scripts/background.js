const canvas        = document.getElementById("canvas");
const ctx           = canvas.getContext('2d');
const CANVAS_WIDTH  = canvas.width = 500;
const CANVAS_HEIGHT = canvas.height = 300;
const IMG_NUM       = 8;
const gameSpeed     = 1;

/*---------------------Class Layer---------------------*/
class Layer {
    constructor(image, speedModifier) {
        this.image = image;
        this.x     = 0;
        this.y     = 0;
        this.width = 500;
        this.height= 300;
        this.speed = gameSpeed * speedModifier;
    };
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    };
    update() {
        if(this.x <= -this.width) {
            this.x = 0;
        }
        this.x = Math.floor(this.x - this.speed);
    }
};
/*---------------------Background Class---------------------*/
let imgs             = [];
let backgroundLayers = [];
class Background {
    constructor(platform, picNum){
        this.platform    = platform;
        this.picNum      = picNum;
        imgs             = [];
        backgroundLayers = [];
        // create new Image()
        for(let i=0; i < this.picNum; i++) {
            imgs.push(new Image());
        }
        // add image sources and create new Layer()
        for(let i=0; i < imgs.length; i++) {
            imgs[i].src = `images/Backgrounds/${this.platform}/${i+1}.png`;
        }
        // create new Layer()
        for(let i=0, j=imgs.length-1; i < imgs.length, j >= 0; i++, j--) {
            backgroundLayers[i]     =  new Layer(imgs[j], 0.5);
            if(i==2) {
                backgroundLayers[i]     =  new Layer(imgs[j], 2);
            }
        }
    }
};