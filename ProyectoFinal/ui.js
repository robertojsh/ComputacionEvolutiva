let activeFunctionString = "";
let activeFunction;
let xl = 0;
let xu = 0;
let yl = 0;
let yu = 0;
let deVersion = "";
let generations = 0;
let bfoObj;
let history = {};
let CARDINALITY = 100;
let functionData;
let pf;
let tries;
let population = 0;
let grap3d = true;
let pso_memory = new Array();


function historyUpdateBfo(generationPoints) {
  let xPoint = [];
  let yPoint = [];
  let zPoint = [];
  for(let i=0; i < generationPoints.length; i++) {
    xPoint.push(generationPoints[i].position[0]);
    yPoint.push(generationPoints[i].position[1]);
    zPoint.push(generationPoints[i].z);
  }
  let points = {
    x: xPoint,
    y: yPoint,
    z: zPoint
  }
  history.generations.push(points);
}

function addMemoryPSO(g) {
  pso_memory.push(g);
}


function startExec() {
  let algorithmSelected = document.getElementById("algorithmSelected").value;
  let activeFunctionString = document.querySelector('input[name="functionSelected"]:checked').value;
  let activeFunc;  
  let boundariesArray;
  let dimension = 0;
  let compareFunction;
  let constrainList;
  let generationsHistory;
  let algorithmObject;

  if(activeFunctionString === "paper") {
    activeFunc = paperFunction;
    boundariesArray = [
      {upper: 10, lower: 0},
      {upper: 10, lower: 0}
    ];
    dimension = 2;
    compareFunction = maximizeCompareFunction;
    constrainList = paperConstrains;
  } else {
    activeFunc = springWeight;
    boundariesArray = [
      {upper: 1.3, lower: 0.25},
      {upper: 2, lower: 0.05},
      {upper: 15, lower: 1.3},
    ];
    dimension = 3;
    compareFunction = minimizeCompareFunction;
    constrainList = constrainsFunctionsList;
  }

  if(algorithmSelected === "bfo") {
    history.generations = [];
    

    x1_l = 0.05;
    x1_u = 2;
    x2_l = 0.25;
    x2_u = 1.3;
    x3_l = 1.3;
    x3_u = 15;

    //(𝜇+ 𝜆)- ES because of its selection strat (50%)
    //variance square
    //gen
    //mu
    //lambda

    //BFO (Maybe because of the modification proposed by Mezura Montes) and N dimentional
    //search space dim
    //Total amount of bact
    p = 3;
    S_bacteria = parseInt(document.getElementById("S_bacteria").value);
    Nc = parseInt(document.getElementById("Nc").value);
    Ns = parseInt(document.getElementById("Ns").value);
    Nre = parseInt(document.getElementById("Nre").value);
    Ned = parseInt(document.getElementById("Ned").value);
    Ped = parseFloat(document.getElementById("Ped").value);
    Ci = parseFloat(document.getElementById("Ci").value);

    

    report("BFO***********************************");
    bfoObj = new BFO(p,S_bacteria,Nc,Ns,Nre,Ned,Ped,Ci,[x1_l,x2_l,x3_l],[x1_u,x2_u,x3_u],spring_weight,report);
    bfoObj.exec(historyUpdateBfo);
  } else if(algorithmSelected === "pso") {

    //Total amount of step (Chemotaxis)
    //Swims
    //Reproduction number
    //Eliminations number
    //Elimination and dispersal probability
    //	the run-length unit 

    //PSO control parameters
    //w inertia
    //c1 learning rate factor
    //c2 learning rate factor
    //no iter
    let generations = $("#generations").val();
    let pso_w = $("#pso_w").val();
    let pso_c1 = $("#pso_c1").val();
    let pso_c2 = $("#pso_c2").val();
    report("PSO***********************************");
    pso(pso_w,pso_c1,pso_c2,100,[x1_l,x2_l,x3_l],[x1_u,x2_u,x3_u],spring_weight,generations,addMemoryPSO,report)

    report("GA***********************************");
    let ga = new GA();
    let population = S_bacteria;
    mutationRate = .6;
    ga.exec(population, generations, spring_weight, mutationRate,[x1_l,x2_l,x3_l],[x1_u,x2_u,x3_u]);
  
  } else if(algorithmSelected === "es") {
    let var2 = parseInt(document.getElementById("var2").value);
    let generations = parseInt(document.getElementById("generations").value);
    let mu = parseInt(document.getElementById("mu").value);
    let lambda = parseInt(document.getElementById("lambda").value);
    
    let esObj = new ES(generations, var2, dimension, activeFunc, boundariesArray, mu, lambda, compareFunction, constrainList);
    esObj.exec();
    algorithmObject = esObj;
  } else {
    //algorithmObject = new DE();
  }

  if(activeFunctionString === "paper") {
    let generationToUse = generationsHistory[parseInt(document.getElementById("generations").value)-1];
    let feasibleSolutions = {
      x: [],
      y: []
    };

    let unfeasibleSolutions = {
      x: [],
      y: []
    };

    for(let i=0; i<generationToUse.values.length; i++) {
      let indiv = generationToUse.values[i];
      if(indiv.results.isFeasible) {
        feasibleSolutions.x.push(indiv.dimensionArray[0]);
        feasibleSolutions.y.push(indiv.dimensionArray[1]);
      } else {
        unfeasibleSolutions.x.push(indiv.dimensionArray[0]);
        unfeasibleSolutions.y.push(indiv.dimensionArray[1]);
      }
    }

    let x = makeArrRanged(0, 2.5, 100);
    let y = [];
    let x2 = makeArrRanged(2, 6, 100);
    let y2 = [];

    for(let i=0; i < 100; i++) {
      y.push(paperConstrainGraphic1(x[i]));
    }
    for(let i=0; i < 100; i++) {
      y2.push(paperConstrainGraphic2(x2[i]));
    }
    drawPaper(x, y, x2, y2, feasibleSolutions, unfeasibleSolutions);
    document.getElementById("graphContainer").style.display = "";
  }
  console.log(algorithmObject);
  return algorithmObject;
}

function runTest(){
  report("X      |      Y      |      fitness    ");
  for(let i=0;i<30;i++){
      startExec();
      let best = getBest(history.generations[i]);
      report(best.x + ","+best.y+","+best.z);
      
  }
}

function runTestCSV() {
  let runs = 3;
  let data = [];
  data.push("Iteration,Generation,WireDiameter(d),CoilDiameter(D),NumberOfCoils(N),Fitness(W),constrainMinimumDeflection,constrainShearStress,constrainSurgeFrequency,constrainOutsideDiameter,isFeasible,isBest,execTime");

  document.getElementById("spring").checked = true;  
  for(let i=1; i <= runs; i++) {      
    results = [];
    let algorithmObject = startExec();   
    let generationsHistory = algorithmObject.getAllGenerations();
    
    for(let generationCounter=1; generationCounter <= generationsHistory.length; generationCounter++) {
      let currentGeneration = generationsHistory[generationCounter-1];
      let bestGenIndex = currentGeneration.bestSolutionIndex;
      let generationExecTime = currentGeneration.executionTime;
      let generationValues = currentGeneration.values;

      generationValues.forEach((indiv, index) => {
        let indivData = [];
        indivData.push(i);
        indivData.push(generationCounter);
        indivData.push(indiv.dimensionArray[1]);
        indivData.push(indiv.dimensionArray[0]);
        indivData.push(indiv.dimensionArray[2]);
        indivData.push(indiv.dimensionArray[3]);
        indivData.push(indiv.results.constrainMinimumDeflection);
        indivData.push(indiv.results.constrainShearStress);
        indivData.push(indiv.results.constrainSurgeFrequency);
        indivData.push(indiv.results.constrainOutsideDiameter);
        indivData.push(indiv.results.isFeasible);
        indivData.push((index === bestGenIndex));
        indivData.push(generationExecTime);
        data.push(indivData.join(","));
      });
    }
  }
  download(data.join("\n"), "results.csv", "csv");
}

function report(log) {
  $('#log').show();
  let newp = document.createElement("p");
  let text = document.createTextNode(log);
  newp.appendChild(text);
  document.getElementById('log').appendChild(newp);

}

function updateGraphic(value) {
  if(value > 0 && value <= generations) {
    let generationToUse = history.generations[value-1];
    setBestUI(getBest(generationToUse));
    draw(functionData, generationToUse,grap3d);
  }
}

function play(){
  document.getElementById("generationId").value = 1;
  setTimeout(verifyPlay,400);

}

function verifyPlay(){

  document.getElementById("nextGenBtn").click();

  let current = parseInt(document.getElementById("generationId").value);
  if(current < history.generations.length)
    setTimeout(verifyPlay,400);
}

function setBestUI(best){
  document.getElementById("bestX").value = best.x;
  document.getElementById("bestY").value = best.y;
  document.getElementById("bestZ").value = best.z;
}

function getBest(gen){
  let currentBest = 0;
  for(let i=1;i<gen.x.length;i++){
    if(gen.z[i] < gen.z[currentBest])
      currentBest = i;
  }

  return { 'x' : gen.x[currentBest], 'y': gen.y[currentBest], 'z': gen.z[currentBest] };
}


function updateAlgorithmUI(selectedAlgorithm) {
  let algorithmList = [ "bfo", "es", "de", "pso"];
  document.getElementById(selectedAlgorithm+"_container").style.display = "";
  for(let i=0; i<algorithmList.length; i++) {
    let algorithm = algorithmList[i];
    if(algorithm == selectedAlgorithm) {
      continue;
    }
    document.getElementById(algorithm+"_container").style.display = "none";
  }
}

window.onload = function() {
  
  let nextGenBtn = document.getElementById("nextGenBtn");
  let prevGenBtn = document.getElementById("prevGenBtn");
  let genIdInput = document.getElementById("generationId");
  let playBtn = document.getElementById("playBtn");
  let algorithmsDropdown = document.getElementById("algorithmSelected");

  playBtn.addEventListener("click",play);

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

  algorithmsDropdown.addEventListener("change", (event) => {
    updateAlgorithmUI(event.target.value);
  });
  updateAlgorithmUI(document.getElementById("algorithmSelected").value);
};