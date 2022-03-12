function N(mean, std, D) {
    return Array(D).fill(0).map(() => {

        let r1 = Math.random();
        let r2 = Math.random();

        let z0 = Math.sqrt(-2.0 * Math.log(r1)) * Math.cos((Math.PI * 2) * r2);

        return z0 * std + mean;
    })
}


function getRandomParent(xl, xu, yl, yu) {
    let y = yl + (yu - yl) * Math.random();
    let x = xl + (xu - xl) * Math.random();

    return { "x": x, "y": y };
}

function mutate(xP, r) {
    return { "x": xP.x + r[0], "y": xP.y + r[1] }
}

function one_one(f, std, generations, xl, xu, yl, yu, memoryFunction) {

    let xP = getRandomParent(xl, yl, xu, yu, memoryFunction);
    let lastXP = xP;

    if (memoryFunction)
        memoryFunction(xP);

    let iter_generations = 0;
    do {

        //eval xP
        xP.z = f(xP.x, xP.y);

        r = N(0, std, 2);
        let xH = mutate(xP, r);

        if (f(xH.x, xH.y) < f(xP.x, xP.y)) {

            lastXP = xP;

            xP = xH;

            if (memoryFunction)
                memoryFunction(xP);

        }



        iter_generations++;
    } while (iter_generations < generations)

    //eval xP
    xP.z = f(xP.x, xP.y);

    return [xP, lastXP];
}