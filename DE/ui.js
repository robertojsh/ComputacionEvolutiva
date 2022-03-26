let activeFunctionString = "";
let activeFunction;
let xl = 0;
let xu = 0;
let yl = 0;
let yu = 0;
let deVersion = "";
let generations = 0;
let deObj;
let history = {};
let CARDINALITY = 100;
let functionData;
let lambda;
let cr;
let population = 0;

function init() {
  deObj = new DE();
}

function historyUpdate(generationPoints) {
  let xPoint = [];
  let yPoint = [];
  let zPoint = [];
  for(let i=0; i < generationPoints.length; i++) {
    xPoint.push(generationPoints[i].x);
    yPoint.push(generationPoints[i].y);
    zPoint.push(generationPoints[i].z);
  }
  let points = {
    x: xPoint,
    y: yPoint,
    z: zPoint
  }
  console.log(points);
  history.generations.push(points);
}

function getFunction(functionName) {
  let returnFunc;
  if(functionName === "rastrigin") {
    returnFunc = rastrigin;
  } else if(functionName === "dropwave") {
    returnFunc = dropwave;
  } else if(functionName === "ackley") {
    returnFunc = ackley;
  } else if(functionName === "sphere") {
    returnFunc = sphere;
  }
  return returnFunc;
}

function startExec() {
  history.generations = [];
  activeFunctionString = document.querySelector('input[name="functionSelected"]:checked').value;
  activeFunction = getFunction(activeFunctionString); 
  xl = parseInt(document.getElementById("xl").value);
  xu = parseInt(document.getElementById("xu").value);
  yl = parseInt(document.getElementById("yl").value);
  yu = parseInt(document.getElementById("yu").value);
  generations = parseInt(document.getElementById("generations").value);
  deVersion = document.getElementById("deVersion").value;
  cr = parseFloat(document.getElementById("cr").value);
  lambda = parseInt(document.getElementById("lambda").value);
  population = parseInt(document.getElementById("population").value);
  deObj.exec(deVersion, generations, population, activeFunction, xl, xu, yl, yu, cr, lambda, historyUpdate);

  functionData = calculateFunctionPointsData(activeFunction, xl, xu, yl, yu, CARDINALITY);
  document.getElementById("graphContainer").style.display = "";
  document.getElementById("generationId").value = generations;
  updateGraphic(generations);
}

function updateGraphic(value) {
  if(value > 0 && value <= generations) {
    let generationToUse = history.generations[value-1];
    draw(functionData, generationToUse);
  }
}


window.onload = function() {
  init();
  let nextGenBtn = document.getElementById("nextGenBtn");
  let prevGenBtn = document.getElementById("prevGenBtn");
  let genIdInput = document.getElementById("generationId");

  nextGenBtn.addEventListener("click", () => {
    let currentGen = parseInt(genIdInput.value);
    if(currentGen !== generations) {
      let newGen = currentGen + 1;
      genIdInput.value = newGen;
      updateGraphic(newGen);
    }    
  });

  prevGenBtn.addEventListener("click", () => {    
    let currentGen = parseInt(genIdInput.value);
    if(currentGen !== 1) {
      let newGen = currentGen - 1;
      genIdInput.value = newGen;
      updateGraphic(newGen);
    }    
  });

  genIdInput.addEventListener("change", () => {
    updateGraphic(parseInt(genIdInput.value));
  });
};