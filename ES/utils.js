function generateVz(f, vx, vy, CARDINALITY) {
    let vz = new Array(CARDINALITY);
    for (let i = 0; i < CARDINALITY; i++) {
        vz[i] = new Array();
        for (let j = 0; j < CARDINALITY; j++)
            vz[i][j] = f(vx[i], vy[j]);
    }
    return vz;
}

function startStuff() {
  console.log("started");
  let CARDINALITY = 100;
  let xl = -2;
  let xu = 2;
  let yl = -2;
  let yu = 2;
  let f = f_rastrigin;
  let vx = new Array();
  let vy = new Array();
  vx = makeArrRanged(xl, xu, CARDINALITY);
  vy = makeArrRanged(yl, yu, CARDINALITY);
  let data = { 
    "vx": vx, 
    "vy": vy, 
    "vz": generateVz(f,vx,vy,CARDINALITY),
    "rvx": [0],
    "rvy": [0],
    "rvz": [0] };
  console.log("here");
  draw(data.vx, data.vy, data.vz, data.rvx, data.rvy, data.rvz);
  console.log("here2");

  let es = new ES();
  let lastPoint = es.exec(1000, 25, f_rastrigin, -5, 5, -5, 5, true);
  draw(data.vx, data.vy, data.vz, [lastPoint.x], [lastPoint.y], [lastPoint.z]);
}

function randn_bm(stdDev) {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
  return num * stdDev;
}

function makeArrRanged(startValue, stopValue, cardinality) {
  var arr = [];
  var step = (stopValue - startValue) / (cardinality - 1);
  for (var i = 0; i < cardinality; i++) {
      arr.push(startValue + (step * i));
  }
  return arr;
}