function generateVz(f, vx, vy, CARDINALITY) {
    let vz = new Array(CARDINALITY);
    for (let i = 0; i < CARDINALITY; i++) {
        vz[i] = new Array();
        for (let j = 0; j < CARDINALITY; j++)
            vz[i][j] = f(vx[i], vy[j]);
    }
    return vz;
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