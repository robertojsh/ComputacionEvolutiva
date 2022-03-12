let activeFunctionString = "";
let activeFunction;
let xl = 0;
let xu = 0;
let yl = 0;
let yu = 0;
let generations = 0;
let var2 = 0;
let esObj;
function init() {
  console.log("Starting...");
  esObj = new ES();
}

function historyUpdate(updatePoint) {
  console.log(updatePoint);
}

function getFunction(functionName) {
  let returnFunc;
  if(functionName === "functionOne") {
    returnFunc = functionOne;
  } else if(functionName === "functionTwo") {
    returnFunc = functionTwo;
  } else if(functionName === "rastringin") {
    returnFunc = rastringin;
  } else {
    returnFunc = dropwave;
  }
  return returnFunc;
}

function startExec() {
  activeFunctionString = document.querySelector('input[name="functionSelected"]:checked').value;
  activeFunction = getFunction(activeFunctionString); 
  xl = parseInt(document.getElementById("xl").value);
  xu = parseInt(document.getElementById("xu").value);
  yl = parseInt(document.getElementById("yl").value);
  yu = parseInt(document.getElementById("yu").value);
  var2 = parseInt(document.getElementById("var2").value);
  generations = parseInt(document.getElementById("generations").value);
  esVersion = document.getElementById("esVersion").value;
  console.log(typeof var2);
  esObj.exec(esVersion, generations, var2, activeFunction, xl, xu, yl, yu, historyUpdate);
  draw();
}

window.onload = function() {
  init();
};