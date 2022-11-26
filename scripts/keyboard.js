
// Reference for creating fragment and keys: https://codepen.io/dcode-software/pen/KYYKxP

/*-------------------------THE KEYBOARD---------------------------------------*/

const virtualKeys = document.getElementById("virtualKeys");
virtualKeys.appendChild(createKeyBoard());

function createKeyBoard() {
    const fragment = document.createDocumentFragment();   // create a document fragment
    const keyLayout = [
        "-", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
        "a", "s", "d", "f", "g", "h", "j", "k", "l",
        "z", "x", "c", "v", "b", "n", "m"
    ];
    
    keyLayout.forEach( key => {
        const keyButton = document.createElement("button");   //create a button element
        const insertBreak = ["p", "l"].indexOf(key) !== -1;   // if key isn't p or l, index = -1, return false
        keyButton.textContent = key.toLowerCase();            //add content
        fragment.appendChild(keyButton);                      // add the button to the fragment
        if(insertBreak) { fragment.appendChild(document.createElement("br"));} 
        keyButton.addEventListener("click", () => {
            
            // when user clicks, the game logic (from project.js) is updated
            if(playing && !gameover) {
                checkLetter(targetName.toLowerCase(), key);
            }
        });
    });
    return fragment;
}
