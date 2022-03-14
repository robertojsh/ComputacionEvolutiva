function N(mean, std, D) {
    return Array(D).fill(0).map(() => {

        let r1 = Math.random();
        let r2 = Math.random();

        let z0 = Math.sqrt(-2.0 * Math.log(r1)) * Math.cos((Math.PI * 2) * r2);

        console.log("data: " + mean + "," + std +  "  N: " + z0 * std + mean);
        return z0 * std + mean;        
    })
}

function getRandomParent(xl, xu, yl, yu) {
    let y = yl + (yu - yl) * Math.random();
    let x = xl + (xu - xl) * Math.random();

    return { "x": x, "y": y };
}

function getRandomPopulation(mu,xl,xu,yl,yu,variance){
    let population = new Array();
    for(let i =0; i< mu;i++){
        let parent = getRandomParent(xl,xu,yl,yu);
        parent.variance = N(0,variance,2);
        population.push(parent);
    }

    return population;
}

function selectRandomParent(population,mu,exclude){

    let rndInt = getRandomInt(mu);
    let p = population[rndInt];

    if(exclude &&
        (p.x == exclude.x && p.y == exclude.y))
        p = population[getRandomInt(mu)];

    return p;
}

function combine(xp1,xp2){
    let xH = {};

    xH.x = xp1.x;
    xH.y = xp2.y;
    xH.variance = [];
    xH.variance.push(xp1.variance[0] + xp2.variance[0]) / 2;
    xH.variance.push(xp1.variance[1] + xp2.variance[1]) / 2;

    return xH;
}

function mutate(xP, r,xl,xu,yl,yu) {

    if( (xP.x + r[0] < xl)
        || (xP.x + r[0] > xu) )
        xP.x = xP.x - r[0];        

    if( (xP.y + r[1] < yl)
        || (xP.y + r[1] > yu) )
        xP.y = xP.y - r[1];

    let xH = { "x": xP.x + r[0], "y": xP.y + r[1] };

    if(xP.variance)
        xH.variance = xP.variance;

    return xH;
}


const C = 0.817;

function OpOAdaptative(Ne, ti, variance){

    phi = Ne / ti;

    if(phi < 1/5)
        variance = Math.pow(C,2) * variance;
    else //if(phi > 1/5)
        variance = variance / Math.pow(C,2);

    return variance;
}

function one_one(f, std, generations, xl, xu, yl, yu,isAdaptative, memoryFunction) {

    let xP = getRandomParent(xl, xu, yl, yu, memoryFunction);
    let lastXP = xP;

    let iter_generations = 0;

    let Ne = 0;

    do {

        //eval xP
        xP.z = f(xP.x, xP.y);
        console.log("Eval: " + xP.x + ", " + xP.y + " = " + xP.z);

        r = N(0, std, 2);
        let xH = mutate(xP, r,xl,xu,yl,yu);

        if(xH.x > xu)
            console.log("WARNING: x val outside of scope");

        if(xH.y > yu)
            console.log("WARNING: y val outside of scope");

        if (f(xH.x, xH.y) < f(xP.x, xP.y)) {

            if (memoryFunction)
                memoryFunction([xH,xP]);

            lastXP = xP;

            xP = xH;

            Ne++;

        }

        if(isAdaptative)
            std = OpOAdaptative(Ne,iter_generations,std);

        iter_generations++;
    } while (iter_generations < generations)

    //eval xP
    xP.z = f(xP.x, xP.y);
    console.log("Final Eval: " + xP.x + ", " + xP.y + " = " + xP.z);


    if (memoryFunction)
        memoryFunction([xP,lastXP]);

    return [xP, lastXP];
}

function deleteWorst(population,xH,f){

    population.push(xH);

    let worstIndex=0;
    for(let i = 0;i<population.length;i++){
        population[i].z = f(population[i].x,population[i].y);
        if(population[i].z > population[worstIndex].z)
            worstIndex = i;
    }

    population.splice(worstIndex,1);
    return population;
}


function selectBests(population,f,max){

    for(let i = 0; i < population.length;i++)
        population[i].z = f(population[i].x,population[i].y);

    population.sort(function(a,b){
        return a.z < b.z;
    });

    population.splice(max,population.length);

    return population;
}


function m_one(f,std,generations,xl,xu,yl,yu,lambda,plusLambda,memoryFunction){

    let mu = 10;
    let xP = this.getRandomPopulation(mu,xl,xu,yl,yu,std);
    let iter_generations = 0;

    let xHi = new Array();

    do{

        for(let i = 0; i < lambda; i++){
            let xPr1 = selectRandomParent(xP,mu);
            let xPr2 = selectRandomParent(xP,mu,xPr1);

            let xH = combine(xPr1,xPr2);

            let r = N(0,Math.pow(xH.variance[0],2),1);
            r.push(N(0,Math.pow(xH.variance[1],2),1)[0]);

            xH = mutate(xH,r,xl,xu,yl,yu);

            xHi.push(xH);
        }


        if(lambda === 1)
            xP = deleteWorst(xP,xHi[0],f);
        else{
            if(plusLambda)
                xP = selectBests(xP.concat(xHi),f,mu);
            else{
                bxH =  selectBests(xHi,f,mu);
                xP.splice(xP.length-bxH.length,bxH.length);
                xP = xP.concat(bxH);
                
            }

        }

        if(memoryFunction)
            memoryFunction(xP);


        iter_generations++;
    }while(iter_generations < generations);

    return xP;

}

function getRandomInt(max) {
    max = Math.floor(max);
    let result =  Math.floor(Math.random() * (max)); //The maximum is exclusive and the minimum is inclusive
    console.log(result);

    return result;
  }
