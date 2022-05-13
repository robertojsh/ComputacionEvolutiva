class GA {

    constructor(N,generations, f, pm,boundariesArray, compareFunction, constraintList) {
        this.N = N;
        this.generations = generations;
        this.f = f;
        this.pm = pm;
        
        this.boundariesArray = boundariesArray;

        this.compareFunction = compareFunction;
        this.constraintList = constraintList;
        
    }

    generatePopulation(population_size, xl, xu) {
        let population = [];

        for (let i = 0; i < population_size; i++) {

            let g = new Gene();

            for(let j=0;j < xl.length; j++)
                g.position.push(xl[j] + (xu[j] - xl[j]) * Math.random());

            population.push(g);
        }

        return population;
    }

    evalFitness(gene, f) {
        gene.z = f(gene.position[0],gene.position[1],gene.position[2]);

        if(gene.z < best.z
            && gene.z > 0
            && this.isFeasible(gene)){
            best = { d :gene.position[0], D: gene.position[1], N : gene.position[2] , z: gene.z };
            report("d = " +best.d + ", D = " + best.D + ", N =   " + best.N +  " W = " + best.z);
        }

        if(gene.z < 0) {
            gene.fitness = 1 + Math.abs(gene.z);
        }
        else {
            gene.fitness = 1 / (1 + gene.z);
        }
        return gene.fitness;
    }

    evalFitnessAll(population, f) {
        for (let i = 0; i < population.length; i++)
            this.evalFitness(population[i], f);
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
        let op = getRandomNumber(1,p1.position.length,true);

        for(let i=0;i<op;i++){
            c1.position[i] = p2.position[i];
            c2.position[i] = p1.position[i]; 
        }

        return [c1,c2];
    }

    mutate(population,pm,xl,xu,yl,yu){

        for(let i=0; i<population.length; i++){

            for(let j=0;j<population[i].position.length;j++){
                let r = Math.random();
                if(r > pm)
                    population[i].position[j] = (xl[j] + (xu[j] - xl[j]) * Math.random());
            }
        
        }
    }

    isFeasible(bacteria){

        if(bacteria.fitness < 0)
            return false;

        let N = bacteria.position[2];
        let D = bacteria.position[1];
        let d = bacteria.position[0];
        
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
        let N = bacteria.position[2];
        let D = bacteria.position[1];
        let d = bacteria.position[0];
        
        let g1_val = g1(N,D,d);
        let g2_val = g2(D,d);
        let g3_val = g3(N,D,d);
        let g4_val = g4(D,d);

        return Math.max(0,g1_val) + Math.max(0,g2_val) + Math.max(0,g3_val) + Math.max(0,g4_val);
    }


    exec() {

        let total_population = N;
        let iter_generations = 0;

        let population = this.generatePopulation(total_population, xl, xu);

        do {

            this.evalFitnessAll(population,f);

            if(updateFunction) {
                updateFunction(iter_generations,population);
            }

            let children = [];

            while(children.length < population.length){
                let p1 = this.tournamentSelection(population);
                let p2 = this.tournamentSelection(population,p1);

                let offspring = this.offspring(p1,p2);

                children.push(offspring[0]);
                children.push(offspring[1]);
            }

            this.mutate(children,pm,xl,xu);

            population = children;

            iter_generations++;
        }
        while (iter_generations < generations);

        this.evalFitnessAll(population,f);

        return population;
    }
}

class Gene {
    constructor() {
        this.position = new Array();        
        this.z = 0;
        this.fitness = Infinity;
        this.relativeFitness=0;
    }

    same(g) {        

        for(let i=0;i<this.position.length;i++){
            if(this.position[i] != g.position[i])
                return false;
        }

        return true;
    }
}


best = { x: Infinity, y: Infinity, z : Infinity};
