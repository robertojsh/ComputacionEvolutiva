class ES {
  constructor() { 

  }

  exec(generations, variance, objectiveFunc, xl, xu, yl, yu, adjustmentEnabled) {
    let stdDev = Math.sqrt(variance);
    let xp = new Individual(xl, xu, yl, yu);
    let ne = 0;
    for(let gen = 0; gen < generations; gen++) {
      let r = [];
      r.push(randn_bm(stdDev));
      r.push(randn_bm(stdDev));

      let xh = new Individual(0, 0, 0, 0);
      xh.x = xp.x + r[0];
      xh.y = xp.y + r[1]; 

      xh.z = objectiveFunc(xh.x, xh.y);
      xp.z = objectiveFunc(xp.x, xp.y);
      if(xh.z < xp.z) {    
        ne += 1;    
        xp = xh;
      }
      console.log(xp);
      if(adjustmentEnabled) {
        stdDev = this.adjustStdDev(stdDev, gen, ne);
      }
    }
    return xp;
  }

  adjustStdDev(stdDev, gen, ne) {
    let newStdDev = stdDev;
    let p = ne / gen;
    if(p < 0.2) {
      newStdDev = Math.pow(0.817,2) * stdDev
    } else if(p > 0.2) {
      newStdDev = stdDev / Math.pow(0.817,2);
    }
    return newStdDev;
  }
}

class Individual {
  constructor(xl, xu, yl, yu) {
    this.x = xl + (xu - xl) * Math.random();
    this.y = yl + (yu - yl) * Math.random();
    this.z = 0;
  }
}