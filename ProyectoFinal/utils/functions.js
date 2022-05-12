function functionOne(x, y) {
    return Math.pow((x - 2), 2) + Math.pow((y - 2), 2);
}

function rastrigin(x, y) {
  let A = 10;
  return A * 2 + Math.pow(x, 2) + Math.pow(y, 2) - (A * (Math.cos(2 * Math.PI * x) + Math.cos(2 * Math.PI * y)));
}

function dropwave(x, y){
  return (-1)*( (1 + Math.cos( 12 * Math.sqrt( Math.pow(x,2) + Math.pow(y,2) ) ) ) / (0.5 * ( Math.pow(x,2) + Math.pow(y,2) ) + 2 ) );
}

function functionTwo(x, y) {
  return x * Math.pow(2.7182, (-1) * (Math.pow(x, 2) + Math.pow(y, 2)));
}

function ackley(x, y) {
  // -20*exp( -0.2*sqrt(0.5*(x.^2 + y.^2)) ) - exp( 0.5*(cos(2*pi*x)+cos(2*pi*y)) ) +20+exp(1);
  return -20 * Math.exp(-0.2 * Math.sqrt(0.5 * (Math.pow(x,2) + Math.pow(y, 2)))) - Math.exp(0.5*( Math.cos(2*Math.PI*x)+Math.cos(2*Math.PI*y ) )) + 20*Math.exp(1);
}

function sphere(x, y) {
  // (x+2).^2 + (y+2).^2;
  return Math.pow(x+2, 2) + Math.pow(y+2, 2);
}

function booth(x, y) {
  // f(x,y)= (x+2y-7)^2+(2x+y-5)^2
  return Math.pow((x + (2*y) - 7), 2) + Math.pow((2*x) + y -5, 2);
}

function spring_weight(x1,x2,x3){
  return (x3 + 2) * (x2 * Math.pow(x1,2));
}

/*
  D = Coil Diameter 
  d = Wire Diameter
  N = # of active coils
*/
let constrainMinimumDeflection = (coilDiameter, wireDiameter, coilNumber) => {
  return 1 - ( (Math.pow(coilDiameter,3) * coilNumber) / ( 71785 * Math.pow(wireDiameter, 4)) );
}

let constrainShearStress = (coilDiameter, wireDiameter, coilNumber) => {
  return ( (4*Math.pow(coilDiameter,2) - coilDiameter*wireDiameter) / (12566*(coilDiameter * Math.pow(wireDiameter,3)-Math.pow(wireDiameter,4))) ) + (1/(5108*Math.pow(wireDiameter,2))) - 1;
} // 4 - 1 / 12566*

let constrainSurgeFrequency = (coilDiameter, wireDiameter, coilNumber)  => {
  return 1 - (140.45*coilDiameter / (Math.pow(wireDiameter,2)*coilNumber));
}

let constrainOutsideDiameter = (coilDiameter, wireDiameter, coilNumber)  =>{
  return (coilDiameter + wireDiameter)/1.5 - 1;
}

let constraintFunctionsList = [
  constrainMinimumDeflection,
  constrainShearStress,
  constrainSurgeFrequency,
  constrainOutsideDiameter
];
/*
springObject[0] - COIL DIAMETER
springObject[1] - WIRE DIAMETER
springObject[2] - # ACTIVE COILS
*/
function getFeasibilityResults(springObject) {
  let resultObject = {};
  let summation = 0;
  let isFeasible = true;
  let constrainFunction;
  let result;

  for(let i=0; i<constraintFunctionsList.length; i++) {
    constrainFunction = constraintFunctionsList[i];
    result = constrainFunction(springObject[0], springObject[1], springObject[2]);
    if(result > 0) {
      isFeasible = false;
    }
    summation += result;
    resultObject[constrainFunction.name] = result;
  }

  resultObject["isFeasible"] = isFeasible;
  resultObject["summation"] = summation;
  return resultObject;
}