class GA {

    constructor(N,generations, f, pm,boundariesArray, compareFunction, constraintList) {
        this.N = N;
        this.generations = generations;
        this.f = f;
        this.pm = pm;
        
        this.boundariesArray = boundariesArray;

        this.compareFunction = compareFunction;
        this.constraintList = constraintList;
        this.generationList = new Array();

    }

    generatePopulation(population_size, boundariesArray) {
        let population = [];

        for (let i = 0; i < population_size; i++) {

            let g = new Gene(this.boundariesArray.length,this.f);

            for(let j=0;j < xl.length; j++)
                g.dimensionArray.push(boundariesArray[j].lower + (boundariesArray[j].upper - boundariesArray[j].lower) * Math.random());

            g.dimensionArray.push = Infinity;
            g.results = this.getFeasibilityResults(g.dimensionArray);
            population.push(g);
        }

        return population;
    }

    evalFitness(gene) {

        gene.dimensionArray[gene.dimensionArray.length-1] = this.f(...gene.dimensionArray);

        if(gene.dimensionArray[gene.dimensionArray.length-1] < 0) {
            gene.fitness = 1 + Math.abs(gene.z);
        }
        else {
            gene.fitness = 1 / (1 + gene.z);
        }
        return gene.fitness;
    }

    evalFitnessAll(population) {
        for (let i = 0; i < population.length; i++)
            this.evalFitness(population[i]);
    }

    tournamentSelection(population,exception){

        let sorted_population = Object.assign([], population);

        //Sort bacteria and chemotactic parameters C(i) in order of ascending cost j_health (higher means lower health)
        sorted_population.sort((a,b) => {


            let isFeasibleA = this.isFeasible(a);
            let isFeasibleB = this.isFeasible(b);

            //1. Between 2 Feasible solutions,the one with the highest fitness value wins
            if(isFeasibleA && isFeasibleB){
                if( a.fitness < b.fitness)
                    return -1;
                if(a.fitness > b.fitness)
                    return 1;
            }

            //2. If one solution is feasible and the other one is infeasible, the feasible wins
            if(isFeasibleA && !isFeasibleB)
                return -1;
            else if(isFeasibleB && !isFeasibleA)
                return 1;

            //3. If both are infeasible, the one with the lowest sum of constraint violation is preferred
            if(!isFeasibleA && !isFeasibleB){
                let computeConstraintsViolationA = this.computeConstraintsViolation(a);
                let computeConstraintsViolationB = this.computeConstraintsViolation(b);

                if(computeConstraintsViolationA < computeConstraintsViolationB)
                    return -1;
                if(computeConstraintsViolationB < computeConstraintsViolationA)
                    return 1;
            }

            return 0;
        });

        if(exception){
            if(!exception.same(sorted_population[0]))
                return sorted_population[0];
            else{
                for(let i=1;i<sorted_population.length;i++)
                    if(!exception.same(sorted_population[i]))
                        return sorted_population[i];
            }

            return population[population.length-1];
        }

        return sorted_population[0];

        
    }

    offspring(p1,p2){

        let c1 = Object.assign({}, p1);
        let c2 = Object.assign({}, p2);

        c1.same = p1.same;
        c2.same = p1.same;

        //offspring point
        let op = getRandomNumber(1,p1.dimensionArray.length,true);

        for(let i=0;i<op;i++){
            c1.dimensionArray[i] = p2.dimensionArray[i];
            c2.dimensionArray[i] = p1.dimensionArray[i]; 
        }

        return [c1,c2];
    }

    mutate(population,pm,boundariesArray){

        for(let i=0; i<population.length; i++){

            for(let j=0;j<population[i].dimensionArray.length;j++){
                let r = Math.random();
                if(r > pm)
                    population[i].dimensionArray[j] = (boundariesArray[j].lower + (boundariesArray[j].upper - boundariesArray[j].lower) * Math.random());
            }
        
        }
    }

    isFeasible(bacteria){

        if(bacteria.fitness < 0)
            return false;

        let N = bacteria.dimensionArray[2];
        let D = bacteria.dimensionArray[1];
        let d = bacteria.dimensionArray[0];
        
        let g1_val = g1(N,D,d);
        let g2_val = g2(D,d);
        let g3_val = g3(N,D,d);
        let g4_val = g4(D,d);

        if( g1_val <= 0
            && g2_val <= 0
            && g3_val <= 0
            && g4_val <= 0)
            return true;

        return false;
    }

    computeConstraintsViolation(bacteria){
        let N = bacteria.dimensionArray[2];
        let D = bacteria.dimensionArray[1];
        let d = bacteria.dimensionArray[0];
        
        let g1_val = g1(N,D,d);
        let g2_val = g2(D,d);
        let g3_val = g3(N,D,d);
        let g4_val = g4(D,d);

        return Math.max(0,g1_val) + Math.max(0,g2_val) + Math.max(0,g3_val) + Math.max(0,g4_val);
    }

    getFeasibilityResults(springDataArray) {
        let resultObject = {};
        let summation = 0;
        let isFeasible = true;
        let constrainFunction;
        let result;

        for (let i = 0; i < this.constraintList.length; i++) {
            constrainFunction = this.constraintList[i];
            result = constrainFunction(...springDataArray);
            if (result > 0) {
                isFeasible = false;
            }
            summation += Math.max(0, result);
            resultObject[constrainFunction.name] = result;
        }

        resultObject["isFeasible"] = isFeasible;
        resultObject["summation"] = summation;
        return resultObject;
    }

    logGeneration(population, time) {
        let generationObj = {
            values: population,
            bestSolutionIndex: 0,
            executionTime: time,
        };

        this.generationList.push(generationObj);
    }

    getAllGenerations(){
        return this.generationList;
    }

    exec() {

        let total_population = this.N;
        let iter_generations = 0;

        let population = this.generatePopulation(total_population, this.boundariesArray);

        do {
            let startTime = performance.now();

            this.evalFitnessAll(population);

            let children = [];

            while(children.length < population.length){
                let p1 = this.tournamentSelection(population);
                let p2 = this.tournamentSelection(population,p1);

                let offspring = this.offspring(p1,p2);

                children.push(offspring[0]);
                children.push(offspring[1]);
            }

            this.mutate(children,this.pm,this.boundariesArray);

            population = children;

            
            let endTime = performance.now();


            this.logGeneration(population, endTime - startTime);

            iter_generations++;
        }
        while (iter_generations < generations);

        this.evalFitnessAll(population);

        return population;
    }

    
}

class Gene {
    constructor(p,f) {
        this.dimensionArray = new Array();


        this.f = f;

        this.p = p;

        this.fitness = Infinity;
        this.relativeFitness=0;
    }

    same(g) {        

        for(let i=0;i<this.dimensionArray.length-1;i++){
            if(this.dimensionArray[i] != g.dimensionArray[i])
                return false;
        }

        return true;
    }
}

