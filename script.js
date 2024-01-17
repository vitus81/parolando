// Initial references

let draggableObjects;
let dropPoints;
const result = document.getElementById("result");
const startButton = document.getElementById("start");
const controls = document.querySelector(".controls-container");
const dragContainer = document.querySelector(".draggable-objects");
const dropContainer = document.querySelector(".drop-points");
const letter = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
const points = [1,4,1,4,1,4,4,8,1,10,10,2,2,2,1,3,10,1,1,1,4,4,10,10,10,8];
const cdf_blue = [
    0.117541,
    0.126752,
    0.171806,
    0.209151,
    0.326492,
    0.336003,
    0.352423,
    0.367841,
    0.480777,
    0.480777,
    0.480777,
    0.545955,
    0.571085,
    0.639968,
    0.738386,
    0.768923,
    0.774029,
    0.837805,
    0.887665,
    0.943933,
    0.974069,
    0.995094,
    0.995094,
    0.995094,
    0.995094,
    1.000000    
];
const cdf_orange = [
    0.000000,
    0.083333,
    0.125000,
    0.208333,
    0.208333,
    0.250000,
    0.333333,
    0.375000,
    0.375000,
    0.375000,
    0.375000,
    0.458333,
    0.500000,
    0.541667,
    0.541667,
    0.625000,
    0.666667,
    0.708333,
    0.750000,
    0.833333,
    0.875000,
    0.958333,
    0.958333,
    0.958333,
    0.958333,
    1.000000     
];

let deviceType = "";
let initialX = 0, initialY = 0;
let currentElement = "";
let moveElement = false;

// --------

var m_w = 123456789;
var m_z = 987654321;
var mask = 0xffffffff;

// Takes any integer
function seed(i) {
    m_w = (123456789 + i) & mask;
    m_z = (987654321 - i) & mask;
}

// Returns number between 0 (inclusive) and 1.0 (exclusive),
// just like Math.random().
function random()
{
    m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
    m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
    var result = ((m_z << 16) + (m_w & 65535)) >>> 0;
    result /= 4294967296;
    return result;
}

// ----------

//Detect touch device
const isTouchDevice = () => {
    try {
      //We try to create Touch Event (It would fail for desktops and throw error)
      document.createEvent("TouchEvent");
      deviceType = "touch";
      return true;
    } catch (e) {
      deviceType = "mouse";
      return false;
    }
  };

  // Drag and drop
  function dragStart(e) {
    if (isTouchDevice()){
        initialX = e.touches[0].clientX;
        initialY = e.touches[0].clientY;
        moveElement = true;
        currentElement = e.target;
    } else {
        e.dataTransfer.setData("text",e.target.id)
    }
  }

  // Events fired on the drop target
  function dragOver(e) {
    e.preventDefault();
  }

  const touchMove = (e) => {
    if (moveElement) {
        e.preventDefault();
        let newX = e.touches[0].clientX;
        let newY = e.touches[0].clientY;
        let currentSelectedElement = document.getElementById(e.target.id);
        currentSelectedElement.parentElement.style.top = currentSelectedElement.parentElement.offsetTop - (initialY-newY) + "px";
        currentSelectedElement.parentElement.style.left = currentSelectedElement.parentElement.offsetLeft - (initialX-newX)+ "px";
        initialX = newX;
        initialY = newY;
    }
  };


//   const drop = (e) => {
//     e.preventDefault();
//     //For touch screen
//     if (isTouchDevice()) {
//       moveElement = false;
//       //Select country name div using the custom attribute
//       const currentDrop = document.querySelector(`div[data-id='${e.target.id}']`);
//       //Get boundaries of div
//       const currentDropBound = currentDrop.getBoundingClientRect();
//       //if the position of flag falls inside the bounds of the countru name
//       if (
//         initialX >= currentDropBound.left &&
//         initialX <= currentDropBound.right &&
//         initialY >= currentDropBound.top &&
//         initialY <= currentDropBound.bottom
//       ) {
//         currentDrop.classList.add("dropped");
//         //hide actual image
//         currentElement.classList.add("hide");
//         currentDrop.innerHTML = ``;
//         //Insert new img element
//         currentDrop.insertAdjacentHTML(
//           "afterbegin",
//           `<img src= "${currentElement.id}.png">`
//         );
//         count += 1;
//       }
//     } else {
//       //Access data
//       const draggedElementData = e.dataTransfer.getData("text");
//       //Get custom attribute value
//       const droppableElementData = e.target.getAttribute("data-id");
//       if (draggedElementData === droppableElementData) {
//         const draggedElement = document.getElementById(draggedElementData);
//         //dropped class
//         e.target.classList.add("dropped");
//         //hide current img
//         draggedElement.classList.add("hide");
//         //draggable set to false
//         draggedElement.setAttribute("draggable", "false");
//         e.target.innerHTML = ``;
//         //insert new img
//         e.target.insertAdjacentHTML(
//           "afterbegin",
//           `<img src="${draggedElementData}.png">`
//         );
//         count += 1;
//       }
//     }
//     //Win
//     if (count == 3) {
//       result.innerText = `You Won!`;
//       stopGame();
//     }
//   };  
  
  // ---------


function getLetterFromDist(cdf_dist) {
    let tmp = random();
    for (let i = 0; i<26; i++) {
        if (tmp < cdf_dist[i]) return i;
    }    
}

function getOrange(cdf_in, letter){
    let count = new Array(26);
    for (let i=0; i<26; i++) count[i] = 0;
    let used = new Array(36);
    for (let i=0; i<36; i++) used[i] = 0;    
    let tmp;
    let tmpPos;
    let letters = [];
    for (let j=0 ; j<5 ; j++) {
        do {
            tmp = getLetterFromDist(cdf_in);
        } while ((count[tmp]>=2) || (count[tmp]==1 && letter[tmp]=="Q"));
        count[tmp]++;
        do {
            tmpPos = Math.floor(random()*34);
        } while ((used[tmpPos]==1) || (letter[tmp]=="Q" && (tmpPos==34 || tmpPos==29 || tmpPos==28) ));
        used[tmpPos]=1;        
        letters.push({value : letter[tmp], position : tmpPos, points : points[tmp]});
    }
    return letters;
}

function getBlue(cdf_in,letter) {
    let rounds = new Array(20);
    for (let i=0; i<rounds.length;i++) {
        rounds[i] = [];
        for (let j=0; j<3; j++) {
            let tmp = getLetterFromDist(cdf_in);
            rounds[i].push({value : letter[tmp], points : points[tmp]});
        }
    }
    return rounds;
}

function playGame() {
    startGame();   
    // TODO 
}

function startGame() {    
    currentDate = new Date();
    // seed(7781);
    seed(currentDate.getTime());
    gameStatus.score = 0;
    gameStatus.missing = 60;
    gameStatus.listOrange = getOrange(cdf_orange, letter);
    gameStatus.roundsTable = getBlue(cdf_blue, letter);
    dragContainer.innerHTML = "";
    dropContainer.innerHTML = "";

    const boardDiv = document.createElement("div");
    dropContainer.appendChild(boardDiv);
    for (let i = 0; i < 36; i++) {        
        const tileDiv = document.createElement("div");
        tileDiv.classList.add("board-tile");
        tileDiv.setAttribute("draggable", false);
        let col = i % 6;
        let row = Math.floor(i/6);       
        tileDiv.style.position = "absolute"; 
        tileDiv.style.left = col*50+"px";
        tileDiv.style.top = row*50+"px";    
        tileDiv.innerHTML = `<div id="boardTile${i}"></div>`;  
        for (let j=0; j<5; j++) {            
            if (gameStatus.listOrange[j].position==i) {                
                tileDiv.classList.add("special-tile");
                tileDiv.classList.remove("board-tile");
                tileDiv.innerHTML = `<div id="boardTile${i}"><span class="letter">${gameStatus.listOrange[j].value}</span><span class="points">${gameStatus.listOrange[j].points}</span><span class="bonus">2X</span></div>`;
            }
        }
        boardDiv.appendChild(tileDiv);
    }            

    for (let i = 0; i < 3; i++) {        
        const letterDiv = document.createElement("div");
        letterDiv.classList.add("draggable-tile");
        letterDiv.setAttribute("draggable", true);
        // if (isTouchDevice()) {
            letterDiv.style.position = "absolute";
            letterDiv.style.left = (45+i*70)+"px";
            letterDiv.style.top = 20 + "px";
        // }        
        letterDiv.innerHTML = `<div id=tile${i}><span class="letter">${gameStatus.roundsTable[0][i].value}</span><span class="points">${gameStatus.roundsTable[0][i].points}</span></div>`;
        dragContainer.appendChild(letterDiv);
    }


    //var board = initBoard(); // TODO
}

// -------------------------------------

// //Creates flags and countries
// const creator = () => {
//     dragContainer.innerHTML = "";
//     dropContainer.innerHTML = "";
//     let randomData = [];
//     //for string random values in array
//     for (let i = 1; i <= 3; i++) {
//       let randomValue = randomValueGenerator();
//       if (!randomData.includes(randomValue)) {
//         randomData.push(randomValue);
//       } else {
//         //If value already exists then decrement i by 1
//         i -= 1;
//       }
//     }
//     for (let i of randomData) {
//       const flagDiv = document.createElement("div");
//       flagDiv.classList.add("draggable-image");
//       flagDiv.setAttribute("draggable", true);
//       if (isTouchDevice()) {
//         flagDiv.style.position = "absolute";
//       }
//       flagDiv.innerHTML = `<img src="${i}.png" id="${i}">`;
//       dragContainer.appendChild(flagDiv);
//     }
//     //Sort the array randomly before creating country divs
//     randomData = randomData.sort(() => 0.5 - Math.random());
//     for (let i of randomData) {
//       const countryDiv = document.createElement("div");
//       countryDiv.innerHTML = `<div class='countries' data-id='${i}'>
//       ${i.charAt(0).toUpperCase() + i.slice(1).replace("-", " ")}
//       </div>
//       `;
//       dropContainer.appendChild(countryDiv);
//     }
//   };

//   //Start Game
//   startButton.addEventListener(
//     "click",
//     (startGame = async () => {
//       currentElement = "";
//       controls.classList.add("hide");
//       startButton.classList.add("hide");
//       //This will wait for creator to create the images and then move forward
//       await creator();
//       count = 0;
//       dropPoints = document.querySelectorAll(".countries");
//       draggableObjects = document.querySelectorAll(".draggable-image");
//       //Events
//       draggableObjects.forEach((element) => {
//         element.addEventListener("dragstart", dragStart);
//         //for touch screen
//         element.addEventListener("touchstart", dragStart);
//         element.addEventListener("touchend", drop);
//         element.addEventListener("touchmove", touchMove);
//       });
//       dropPoints.forEach((element) => {
//         element.addEventListener("dragover", dragOver);
//         element.addEventListener("drop", drop);
//       });
//     })
//   );

var gameStatus = {
    score: 0,
    missing: 60,
    listOrange: [],
    roundsTable: [],
    combos: [],
};

playGame();
// document.write("Score: " + gameStatus.score + "<br>");
// document.write(isTouchDevice()+"<br>");

// // let listOrange = getOrange(cdf_orange, letter);
// for (let k = 0;k<5;k++) {  
//     document.write(gameStatus.listOrange[k].value + " " + gameStatus.listOrange[k].points + " pos. " + gameStatus.listOrange[k].position +"<br>");
// }
// document.write("<br><br>");

// // let roundsTable = getBlue(cdf_blue, letter);
// for (let j=0 ; j < 20 ; j++){
//     for (let k = 0 ; k < 3 ; k++) {   
//         document.write(gameStatus.roundsTable[j][k].value + " " + gameStatus.roundsTable[j][k].points + "    ");     
//     }
//     document.write("<br>");
// }

