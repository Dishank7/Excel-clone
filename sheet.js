const COLS = 26;
const ROWS = 100;
const transparent = "transparent";
const transparentBlue = "#ddddff";
const arrMatrix = 'arrMatrix';
// table components
const tHeadRow = document.getElementById("table-heading-row");
const tBody = document.getElementById("table-body");
const currentCellHeading = document.getElementById("current-cell");
const sheetNo = document.getElementById('sheet-no');
const buttonContainer = document.getElementById('button-container');
//btn's
const boldBtn = document.getElementById("bold-btn");
const italicsBtn = document.getElementById('italic-btn');
const underlineBtn = document.getElementById('underline-btn');
const rightBtn = document.getElementById('rigth-btn');
const leftBtn = document.getElementById('left-btn');
const centerBtn = document.getElementById('center-btn');
const cutBtn = document.getElementById('cut-btn');
const pasteBtn = document.getElementById('paste-btn');
const copyBtn = document.getElementById('copy-btn');
const uploadInput = document.getElementById('upload-input');
const addSheetBtn = document.getElementById('add-sheet-btn');
const saveSheetBtn = document.getElementById('save-sheet-btn');


//Sizeinputs
const fontStyleDropdown = document.getElementById('font-style-dropdown');
const fontSizeDropdown = document.getElementById('font-size-dropdown');

//
const bgColor = document.getElementById('bgColor');
const fontColor = document.getElementById('fontColor');

// cache
let currentCell;
let previousCell;
let btnPress;
let cutCell;
let numSheets=1; // size
let currentSheet = 1; // index
let prevSheet;


//matrix to store sheet
let matrix = new Array(ROWS);

function createNewMatrix() {
  for (let row = 0; row < ROWS; row++) {
    matrix[row] = new Array(COLS);
    for (let col = 0; col < COLS; col++) {
      matrix[row][col] = {};
    }
  }
}
// this is creating matrix for the first time
createNewMatrix();


function colGen(typeOfCell, tableRow, isInnerText, rowNumber) {
  for (let col = 0; col < COLS; col++) {
    const cell = document.createElement(typeOfCell);
  
    if (isInnerText) {
      cell.innerText = String.fromCharCode(col + 65);
      cell.setAttribute("id", String.fromCharCode(col + 65));
    } else {
      // COL -> A,B,C,D
      cell.setAttribute("id", `${String.fromCharCode(col + 65)}${rowNumber}`);
      cell.setAttribute("contenteditable", true);
      //   event.target is my currentCell
      cell.addEventListener("focus", (event) => focusHandler(event.target));
    }
    tableRow.append(cell);
  }
}
// this is for heading
colGen("th", tHeadRow, true);

function setHeaderColor(colId, rowId , color) {
   // console.log(colId,rowId)
   const colHead = document.getElementById(colId);
   const rowHead = document.getElementById(rowId);
 
  colHead.style.backgroundColor = color;
  rowHead.style.backgroundColor = color;
}
function btnHighlighter(btn,styleProperty, style){
  if(currentCell.style[styleProperty] === style){
    btn.style.backgroundColor = transparentBlue;
  } else{
    btn.style.backgroundColor = transparent;
  }    
}

function focusHandler(cell) {
  //console.log(typeof(cell.id))
  currentCell = cell;
  if(previousCell){
    setHeaderColor(previousCell.id[0] , previousCell.id.substring(1) ,transparent);
  }
  btnHighlighter(boldBtn,"fontWeight", "bold");
  btnHighlighter(italicsBtn,"fontStyle", "italic");
  btnHighlighter(underlineBtn, "textDecoration", "underline");
  
  setHeaderColor(cell.id[0], cell.id.substring(1) , transparentBlue);
  currentCellHeading.innerText = cell.id + " " + "selected";
  previousCell = currentCell;
}

function downloadMatrix(){
  const matrixString = JSON.stringify(matrix);

  const blob = new Blob([matrixString],{type:'application/json'});
  //console.log(blob);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'table.json';
  link.click();
}

// for (let row = 1; row <= ROWS; row++) {
//   const tr = document.createElement("tr");
//   const th = document.createElement("th");
//   th.innerText = row;
//   th.setAttribute("id", row);
//   tr.append(th);
//   //   for (let col = 0; col < COLS; col++) {
//   //     const td = document.createElement("td");
//   //     tr.append(td);
//   //   }
//   //   this is for empty cell
//   colGen("td", tr, false, row);
//   tBody.append(tr);
// }



function tableBodyGen(){
  // cleanup my table body
  tBody.innerHTML='';
  for (let row = 1; row <= ROWS; row++) {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.innerText = row;
    th.setAttribute("id", row);
    tr.append(th);
    //   for (let col = 0; col < COLS; col++) {
    //     const td = document.createElement("td");
    //     tr.append(td);
    //   }
    //   this is for empty cell
    colGen("td", tr, false, row);
    tBody.append(tr);
  }
}
// creating table for the first time
tableBodyGen();




if(localStorage.getItem(arrMatrix)){
  matrix=JSON.parse(localStorage.getItem(arrMatrix))[0];
  renderMatrix();
}


boldBtn.addEventListener("click", () => {
  if (currentCell.style.fontWeight === "bold") {
    currentCell.style.fontWeight = "normal";
    boldBtn.style.backgroundColor = transparent;
  } else {
    currentCell.style.fontWeight = "bold";
    boldBtn.style.backgroundColor = transparentBlue;
  }
});

italicsBtn.addEventListener("click", () => {
  if (currentCell.style.fontStyle === "italic") {
    currentCell.style.fontStyle = "normal";
    italicsBtn.style.backgroundColor = transparent;
  } else {
    currentCell.style.fontStyle = "italic";
    italicsBtn.style.backgroundColor = transparentBlue;
  }
});

underlineBtn.addEventListener("click", () => {
  if (currentCell.style.textDecoration === "underline") {
    currentCell.style.textDecoration = "none";
    underlineBtn.style.backgroundColor = transparent;
  } else {
    currentCell.style.textDecoration = "underline";
    underlineBtn.style.backgroundColor = transparentBlue;
  }
});


fontStyleDropdown.addEventListener('change', ()=>{
  currentCell.style.fontFamily = fontStyleDropdown.value;
})

fontSizeDropdown.addEventListener('change',()=>{
  currentCell.style.fontSize = fontSizeDropdown.value;
})

leftBtn.addEventListener('click', ()=>{
  currentCell.style.textAlign = 'left';
})

rightBtn.addEventListener('click',()=>{
  currentCell.style.textAlign = "right";
})
centerBtn.addEventListener('click',()=>{
  currentCell.style.textAlign = 'center';
})

bgColor.addEventListener('input',()=>{
  currentCell.style.backgroundColor = bgColor.value;
})
fontColor.addEventListener('input', ()=>{
  currentCell.style.color = fontColor.value;
})

cutBtn.addEventListener('click',()=>{
  btnPress = 'cut';
  cutCell ={
    text:currentCell.innerText,
    style:currentCell.style.cssText,
  }
  currentCell.innerText = "";
  currentCell.style.cssText ="";
})

copyBtn.addEventListener('click',()=>{
  btnPress = 'copy';
  cutCell ={
    text:currentCell.innerText,
    style:currentCell.style.cssText,
  }
})

pasteBtn.addEventListener('click',()=>{
  currentCell.innerText = cutCell.text;
  currentCell.style.cssText = cutCell.cssText;

  if(btnPress === 'cut'){
    cutCell = undefined;
  }
})

function genNextSheetButton(){
  const btn = document.createElement('button');
  numSheets++;
  currentSheet=numSheets;
  btn.innerText=`Sheet ${currentSheet}`;
  btn.setAttribute('id',`sheet-${currentSheet}`);
  btn.setAttribute('onclick','viewSheet(event)');
  buttonContainer.append(btn);
}

addSheetBtn.addEventListener('click',()=>{
  genNextSheetButton();
  sheetNo.innerText = `Sheet No - ${currentSheet}`;
  // add nextSheetButton
  // Save Matrix -> ✅
  saveMatrix();
  // clean matrix -> ✅
  createNewMatrix();// it's creating matrix again (sort of used as cleaner fn)
  // clean html
  tableBodyGen();
})

// saveMatrix
// arrMatrix -> array for matrix
// I should keep my arrMatrix in localStorage
function saveMatrix() {
  if (localStorage.getItem(arrMatrix)) {
    // pressing add sheet not for the first time
    let tempArrMatrix = JSON.parse(localStorage.getItem(arrMatrix));
    tempArrMatrix.push(matrix);
    localStorage.setItem(arrMatrix, JSON.stringify(tempArrMatrix));
  } else {
    // pressing add sheet for the first time
    let tempArrMatrix = [matrix];
    localStorage.setItem(arrMatrix, JSON.stringify(tempArrMatrix));
  }
}

function renderMatrix() {
  matrix.forEach((row) => {
    row.forEach((cellObj) => {
      if (cellObj.id) {
        let currentCell = document.getElementById(cellObj.id);
        currentCell.innerText = cellObj.text;
        currentCell.style = cellObj.style;
      }
    });
  });
}

function viewSheet(event){
  // save prev sheet before doing anything
  prevSheet=currentSheet;
  currentSheet=event.target.id.split('-')[1];
  let matrixArr = JSON.parse(localStorage.getItem(arrMatrix));
  // save my matrix in local storage
  matrixArr[prevSheet-1] = matrix;
  localStorage.setItem(arrMatrix,JSON.stringify(matrixArr));

  // I have updated my virtual memory
  matrix = matrixArr[currentSheet-1];
  // clean my html table
  tableBodyGen();
  // render the matrix in html
  renderMatrix();
}
