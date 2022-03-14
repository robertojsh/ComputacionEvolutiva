let currentData;
let CARDINALITY = 100;
let memory = new Array();

$(document).ready(function () {
    $("input[type=radio][name=functionSelected]").change(function () {
        selectGraph();
    });

    selectGraph();
});

function selectGraph() {

    let optFunction = $("input[type=radio][name=functionSelected]:checked");

    let generations = 100;

    let xl = -2;
    let xu = 2;
    let yl = -2;
    let yu = 2;

    if (optFunction[0].value == "rastrigin" ||
        optFunction[0].value == "dropwave") {

        xl = -5;
        xu = 5;
        yl = -5;
        yu = 5;

    }

    setParams(xl, xu, yl, yu, generations);
    updateParams();

}

function updateParams() {

    let xl = parseInt($("#xl").val());
    let yl = parseInt($("#yl").val());
    let xu = parseInt($("#xu").val());
    let yu = parseInt($("#yu").val());
    let generations = parseInt($("#generations").val());


    let optFunction = $("input[type=radio][name=functionSelected]:checked");

    let f = fe;
    if (optFunction[0].value == "functionTwo")
        f = _f;
    else if (optFunction[0].value == "rastrigin")
        f = f_rastrigin;
    else if (optFunction[0].value == "dropwave")
        f = f_dropwave


    updateResults(generations, f, xl, xu, yl, yu);

}

function generateVz(f, vx, vy) {
    let vz = new Array(CARDINALITY);
    for (let i = 0; i < CARDINALITY; i++) {
        vz[i] = new Array();
        for (let j = 0; j < CARDINALITY; j++){
            vz[i][j] = f(vx[i], vy[j]);
            //if(vx[i] < .3 && vy[j] < .3)
                //console.log("arr Eval: " + vx[i] + ", " + vy[j] + " = "  + vz[i][j]);
        }
    }
    //console.log(vz);
    return vz;
}

function setParams(xl, xu, yl, yu, generations) {
    $("#xl").val(xl);
    $("#yl").val(yl);
    $("#xu").val(xu);
    $("#yu").val(yu);
    $("#generations").val(generations);

}

function updateResults(generations, f, xl, xu, yl, yu) {

    memory = new Array();
    //let results = one_one(f, .02, generations, xl, xu, yl, yu,false, addMemory);
    let results = m_one(f, .02, generations, xl, xu, yl, yu, addMemory);

    let data2 = makeDataFromResults(results);

    $("#divGraph").show();

    let data = {};
    data.vx = makeArrRanged(xl, xu, CARDINALITY,data2.vx[0]);
    data.vy = makeArrRanged(yl, yu, CARDINALITY,data2.vy[0]);
    data.vz = generateVz(f, data.vx, data.vy);

    draw(data.vx, data.vy, data.vz, data2.vx, data2.vy, data2.vz);
    $("#txtGen").val(generations);
}

function makeDataFromResults(results) {
    let vx2 = new Array();
    let vy2 = new Array();
    let vz2 = new Array();

    for (let i = 0; i < results.length; i++) {
        vx2.push(results[i].x);
        vy2.push(results[i].y);
        vz2.push(results[i].z);
    }

    return { vx: vx2, vy: vy2, vz: vz2 };
}

function addMemory(g) {
    memory.push(g);
}

function updateGeneration() {
    let genData = makeDataFromResults(memory[parseInt($("#txtGen").val()) - 1]);
    draw(currentData.x, currentData.y, currentData.z, genData.vx, genData.vy, genData.vz);
}

function back() {
    let gen = parseInt($("#txtGen").val());
    gen--;
    if (gen > 0)
        $("#txtGen").val(gen);

    updateGeneration();
}

function forward() {
    let gen = parseInt($("#txtGen").val());
    gen++;
    if (history && gen <= memory.length)
        $("#txtGen").val(gen);

    updateGeneration();
}

function draw(vx, vy, vz, vx2, vy2, vz3) {

    console.log(vx);
    console.log(vy);

    console.log(vx2);
    console.log(vy2);

    currentData = {
        name: 'Space',
        uirevision:'true',
        x: vx,
        y: vy,
        z: vz,
        type: 'surface',
        colorscale: 'Earth',
        contours: {
            z: {
                show: true,
                usecolormap: true,
                highlightcolor: "#42f462",
                project: { z: true }
            }
        }
    };



    let data2 = {
        name: 'GA Point',
        x: vx2,
        y: vy2,
        z: vz3,
        mode: 'markers',
        marker: {
            size: 12,
            line: {
                color: 'rgba(217, 217, 217, 0.14)',
                width: 0.5
            },
            opacity: 0.8
        },
        type: 'scatter3d'
    }

    var layout = {
        title: '',
        autosize: true,
        width: 900,
        height: 700,
        margin: {
            l: 65,
            r: 50,
            b: 65,
            t: 90,
        }
    };

    Plotly.newPlot(document.getElementById("plot"), [currentData, data2], layout);

}
