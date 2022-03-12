class ES {
  constructor() { 

  }

  exec(esVersion, generations, variance, objectiveFunc, xl, xu, yl, yu, historyUpdateFunc) {
    if(esVersion === "1+1-ES" || esVersion === "1+1-ES-Adap") {
      let adjustmentEnabled = (esVersion === "1+1-ES-Adap");
      this.one_plus_one_ES(generations, variance, objectiveFunc, xl, xu, yl, yu, adjustmentEnabled, historyUpdateFunc);
    } else if(esVersion === "m+l-ES") {
      this.mu_plus_lambda_ES();
    } else if(esVersion === "m_l-ES") {
      this.mu_comma_lambda_ES();
    }
  }

  one_plus_one_ES(generations, variance, objectiveFunc, xl, xu, yl, yu, adjustmentEnabled, historyUpdateFunc) {
    let stdDev = Math.sqrt(variance);
    let xp = new Individual(xl, xu, yl, yu);
    xp.z = objectiveFunc(xp.x, xp.y);
    let xh = {};
    let ne = 0;
    for(let gen = 0; gen < generations; gen++) {
      let r = [];
      r.push(this.randn_bm(stdDev));
      r.push(this.randn_bm(stdDev));
      xh.x = xp.x + r[0];
      xh.y = xp.y + r[1]; 

      let xhzTemp = objectiveFunc(xh.x, xh.y);
      let xpzTemp = objectiveFunc(xp.x, xp.y);
      if(xhzTemp < xpzTemp) {    
        ne += 1;    
        xp = {
          x: xh.x,
          y: xh.y,
          z: xhzTemp
        }
      }
      if(adjustmentEnabled) {
        stdDev = this.adjustStdDev(stdDev, gen, ne);
      }      
      historyUpdateFunc(xp);
    }
    return xp;
  }

  one_plus_one_ES_adap(generations, variance, objectiveFunc, xl, xu, yl, yu) {

  }

  mu_plus_lambda_ES(generations, variance, objectiveFunc, xl, xu, yl, yu) {

  }

  mu_comma_lambda_ES(generations, variance, objectiveFunc, xl, xu, yl, yu) {

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

  randn_bm(stdDev) {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
    return (num - 0.5) * stdDev;
  }
}

class Individual {
  constructor(xl, xu, yl, yu) {
    this.x = xl + (xu - xl) * Math.random();
    this.y = yl + (yu - yl) * Math.random();
    this.z = 0;
  }
}