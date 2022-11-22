
/*-------------------------CANVAS DISPLAY---------------------------------------*/
const platform      = ["candy", "stars", "castle", "trees"];
const picNums       = [6, 9, 7, 7];
let platformChoice  = 0;
let animationId;
let stopBackGround  = false;
// the following will change these according to game state
let background      = new Background(platform[platformChoice], picNums[platformChoice]);
let angel           = new Angel("fly"); 
let numOfMonsters   = 5;
let monsters        = [];
let death           = false;
let counter         = 0;

// will increase the number of monsters for each fail
function addMonsters(num) {
    monsters        = [];
    for (let i = 0; i < num; i++) {
        monsters.push(new Monster());
    }
}
addMonsters(numOfMonsters); // when windows loads, there will be numOfMonsters

// create a gameover word
const over = new Image();
over.src   = 'images/gameover.png';

function cancelAnimation() {
    counter = 0; // reset the counter to stop animation in animate()
    cancelAnimationFrame(animationId);
}

function animate() {
    ctx.clearRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // backgroundLayers in background.js
    backgroundLayers.forEach((layer) => {
        layer.draw();
        layer.update();
    });

    angel.draw();
    angel.update();

    monsters.forEach((monster) => {
        monster.draw();
        monster.update();
    });
    // animation stops after the counter increases
    counter++;
    if(counter === 45 && death) {
        ctx.fillStyle = 'rgba(225,225,225,0.5)'; // draw a transparent layer
        ctx.fillRect(0,0,500,300);
        ctx.drawImage(over, 150, 140, 200, 88);
        return;
    }

    animationId = requestAnimationFrame(animate);
}
window.addEventListener('load', () => { 
    animate();
});

/*-------------------------THE GAME LOGIC---------------------------------------*/

const btn1       = document.getElementById('button1');
const btn2       = document.getElementById('button2');
const btn3       = document.getElementById('button3');
const imageData  = document.getElementById('imageData');
const nameData   = document.getElementById('nameData');
const startBtn   = document.getElementById('start');
const restartBtn = document.getElementById('restart');
const instruction= document.getElementById('instruction');
const notice     = document.getElementById('notice');

const MAX_NAMES      = 3;
const MAX_FAILS      = 3;
const animalsURL     = 'https://zoo-animal-api.herokuapp.com/animals/rand/10';
const HPotterURL     = 'https://hp-api.herokuapp.com/api/characters';
const BobsBurgerURL  = 'https://bobsburgers-api.herokuapp.com/characters/';

let names  = [];
let images = [];

let result         = [];
let targetName     = '';
let failCount      = 0;
let fullSuccess    = false;
let playing        = false;
let gameover       = false;
let currentNameIdx = 0;
let overSound      = new Audio("audio/GameOver.wav");
let wrongSound     = new Audio("audio/Wrong.wav");

btn1.addEventListener("click", () => {
     // display instruction
     instruction.innerHTML = "Please guess the name of the animal you see. Press 'start' to play.";
     getData(animalsURL);});
btn2.addEventListener("click", () => { 
    // display instruction
    instruction.innerHTML = "Please guess the last name of the character you see. Press 'start' to play";
    getData(HPotterURL);});
btn3.addEventListener("click", () => {
    // display instruction
    instruction.innerHTML = "Please guess the name of the character you see. Press 'start' to play";
    getData(BobsBurgerURL);});

startBtn.addEventListener("click", () =>  {
    showFirstDisplay(currentNameIdx);
    notice.innerHTML = `If you fail ${MAX_FAILS} times, there will be total bat infestation.`;
});

restartBtn.addEventListener("click", () => { 
    notice.innerHTML = `If you fail ${MAX_FAILS} times, there will be total bat infestation.`;
    playAgain();
});

// Get data from API
function getData (URL){
    reset();
    resetCanvas();
    names = [];
    images = [];
    currentNameIdx = 0;
    gameover = false;
     // remove image and name data
     imageData.innerHTML = "Image will be displayed here";
     nameData.innerHTML  = '';
     // display notice
     notice.innerHTML    = 'Help the angle destroy the bats!';

    fetch(URL )        
        .then(function( response ){   
            if( response.ok ){
                return response.json();
            }
        })
        .then(function( data ){
            // only get data with images
            if(URL == HPotterURL) {
                data = data.filter((element) => element.image);
            }
            // sort the elements randomly and get MAX_NAMES elements
            data = data.sort(()=> 0.5 - Math.random()).slice(0,MAX_NAMES);
         
            for (const element of data) { 
                const name = element.name;
                const imageLink =  (URL != animalsURL) ? element.image : element.image_link;
                names.push(name);
                images.push(imageLink);
                console.log("Finish loading");
            }
            //show start button here
            startBtn.classList.remove("hidden");
            //remove try again button
            restartBtn.classList.add("hidden");
        })
        .catch(function(){            
            console.log("Catch fetch error");
        });
}

// Reset page values
function reset() {
    failCount = 0;
    playing   = true;
    result    = [];
}

function resetCanvas() {
    cancelAnimationFrame(animationId);
    platformChoice  = 0;
    stopBackGround  = false;
    background      = new Background(platform[platformChoice], picNums[platformChoice]);
    angel           = new Angel("fly"); 
    numOfMonsters   = 5;
    monsters        = [];
    death           = false;
    counter         = 0;
    addMonsters(numOfMonsters);
    animate();
}
// Go through the array of names
function playAgain() {
    //remove after initial display
    restartBtn.classList.add("hidden");
    // reset page values
    reset();
    // move to the next name in the array
    currentNameIdx++;
    if(currentNameIdx < MAX_NAMES) {
        showFirstDisplay(currentNameIdx);
         //cancel animation
        cancelAnimationFrame(animationId);
        //change canvas background and restart
        platformChoice++;
        if(platformChoice === 4) { platformChoice= 0};
        background = new Background(platform[platformChoice], picNums[platformChoice]);
        animate();
    }
    else {
        imageData.innerHTML = "No more names to guess. Please choose another topic.";
        gameover = true;
        playing  = false;
        // hide the start and restart btns
        restartBtn.classList.add("hidden");
        startBtn.classList.add("hidden");
        // remove the instruction, the wrong guess
        instruction.innerHTML = ``;
        nameData.innerHTML = ``;
        if(!fullSuccess) {
             // play sound
            overSound.play();
            notice.innerHTML = `THE ANGEL IS DEAD &#9760; THANKS TO YOU!!`;
            // change the canvas display
            cancelAnimation();
            angel = new Angel("die");
            death = true;
            numOfMonsters = 1;
            addMonsters(numOfMonsters)
            animate();
        }
        else {
            cancelAnimation();
            angel = new Angel("attack");
            numOfMonsters = 0;
            addMonsters(numOfMonsters)
            animate();
            notice.innerHTML = `CONGRATULATIONS! YOU WON!`;
        }
    }
}

// Gameover 
function checkAttempts() {
    if(failCount < MAX_FAILS) {
        notice.innerHTML = `You only have 
                            <span class="highlight">${MAX_FAILS - failCount}</span> guesses left.`;
    }
    else if(failCount === MAX_FAILS) {
        wrongSound.play();
        notice.innerHTML = `You failed <span class="highlight"> ${MAX_FAILS}</span> times. BAT INFESTATION!`;
        //show name 
        nameData.innerHTML = `<p>${targetName}</p>`;
        // stop the game
        playing = false;
        // show restart button here
        restartBtn.classList.remove("hidden");
        // cancel animation
        cancelAnimationFrame(animationId);
    }
    else { return;}
}

function checkWinning() {
    if(!(result.includes("-"))) {
        fullSuccess = true;
        notice.innerHTML = `YAY! YOU WON`;
        playing = false;
        //show playmore button here
        restartBtn.classList.remove("hidden");
        //restartBtn.classList.add("hidden");
        restartBtn.textContent = "Play more";
    }
    else {
        fullSuccess = false;
    }
}
function checkRightGuess (guess) {
    if(result.includes(guess)) {
        console.log(`You got it right!`);
        // add animation effect
    }
}

// what happens when the guess is wrong
function checkWrongGuess (guess) {
    if(!(result.includes(guess))) {
        failCount++;
        console.log(`You got it wrong!`);
        // add sound 
        wrongSound.play();
        // add animation effect
        cancelAnimationFrame(animationId);
        numOfMonsters += 10;
        addMonsters(numOfMonsters);
        angel = new Angel("run");
        animate();
    }
}

// Show empty string
function showFirstDisplay (currentIndx) {
    processName(names[currentIndx]);
    if(!result || !result.length) {
        // spread ...operator allows the string to be expanded in places where
        // elements (for array literals) are expected
        [...targetName].forEach( () => result.push("-"));
    }
    nameData.innerHTML = `<p>${result.join('')}</p>`;
    console.log(images[currentIndx]);
    imageData.innerHTML = `<img src="${images[currentIndx]}" alt="${images[currentIndx]}">`;
    // remove startButton after first display
    startBtn.classList.add("hidden");
}

// Get the last word of a string
function processName(string){
    let nameArray = string.split(" ");
    targetName    = nameArray[nameArray.length - 1];
}


// Display userInput
function checkLetter(guess) {
    console.log(targetName);
    let indices = [];
    for(i = 0; i < targetName.length; i++) {
        if(targetName[i]=== guess) {
            indices.push(i);
        }
    };

    [...targetName].forEach((element, index) => {
        if (indices.includes(index)) {
            result[index] = guess;
        }
        else if (result[index]!=='-') {
            result[index] = result[index];
        }
        else {
            result[index] = '-';
        }
    });
    nameData.innerHTML = `<p>${result.join('')}</p>`;
    checkWrongGuess(guess);
    checkRightGuess(guess);
    checkWinning(targetName);
}
