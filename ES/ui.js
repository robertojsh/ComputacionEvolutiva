let currentData;
let CARDINALITY = 100;
let memory = new Array();


const TYPE_A_3D = 'surface';
const TYPE_A_2D = 'contour';

const TYPE_B_3D = 'scatter3d';
const TYPE_B_2D = 'scatter';

let currentTypeA = TYPE_A_2D;
let currentTypeB = TYPE_B_2D;
let is2value = true;

$(document).ready(function () {
    $("input[type=radio][name=functionSelected]").change(function () {
        selectGraph();
    });

    $("#esVersion").change(function () {
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
    let variance = parseFloat($("#var2").val());

    if ($("#check3D")[0].checked) {
        currentTypeA = TYPE_A_3D;
        currentTypeB = TYPE_B_3D;
    } else {
        currentTypeA = TYPE_A_2D;
        currentTypeB = TYPE_B_2D;
    }

    let type_es = $("#esVersion").val();
    let isAdaptative = false;
    let lambda = 1;
    let plusLambda = false;

    switch (type_es) {
        case "1+1-ES":
            isAdaptative = false;
            is2value = true;
            break;
        case "1+1-ES-Adap":
            isAdaptative = true;
            is2value = true;
            break;
        case "m+l-ES":
            lambda = 2;
            plusLambda = true;
            is2value = false;
            break;
        case "m_l-ES":
            lambda = 2;
            plusLambda = false;
            is2value = false;
            break;

    }


    let optFunction = $("input[type=radio][name=functionSelected]:checked");

    let f = fe;
    if (optFunction[0].value == "functionTwo")
        f = _f;
    else if (optFunction[0].value == "rastrigin")
        f = f_rastrigin;
    else if (optFunction[0].value == "dropwave")
        f = f_dropwave


    updateResults(generations, f, xl, xu, yl, yu, type_es, isAdaptative, lambda, plusLambda, variance);

}

function generateVz(f, vx, vy) {
    let vz = new Array(CARDINALITY);
    for (let i = 0; i < CARDINALITY; i++) {
        vz[i] = new Array();
        for (let j = 0; j < CARDINALITY; j++) {
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
    $("#var2").val(.2);

}

function updateResults(generations, f, xl, xu, yl, yu, type_es, isAdaptative, lambda, plusLambda, variance) {

    memory = new Array();
    let results = [];
    if (type_es == "1+1-ES" || type_es == "1+1-ES-Adap")
        results = one_one(f, variance, generations, xl, xu, yl, yu, isAdaptative, addMemory);
    else
        results = m_one(f, variance, generations, xl, xu, yl, yu, lambda, plusLambda, addMemory);

    let data2 = makeDataFromResults(results);

    $("#divGraph").show();

    let data = {};
    data.vx = makeArrRanged(xl, xu, CARDINALITY, data2.vx[0]);
    data.vy = makeArrRanged(yl, yu, CARDINALITY, data2.vy[0]);
    data.vz = generateVz(f, data.vx, data.vy);

    draw(data.vx, data.vy, data.vz, data2.vx, data2.vy, data2.vz);
    $("#txtGen").val(memory.length);
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

    let wholeData = [];

    currentData = {
        name: 'Space',
        uirevision: true,
        x: vx,
        y: vy,
        z: vz,
        type: currentTypeA,
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

    wholeData.push(currentData);

    if (is2value) {
        let data2 = {
            name: 'ES Point',
            uirevision: true,
            x: [vx2[0]],
            y: [vy2[0]],
            z: [vz3[0]],
            mode: 'markers',
            marker: {
                size: 12,
                line: {
                    color: 'rgba(255, 0, 0, 0.14)',
                    width: 0.5
                },
                opacity: 0.8
            },
            type: currentTypeB
        }

        let data3 = {
            name: 'ES Point',
            uirevision: true,
            x: [vx2[1]],
            y: [vy2[1]],
            z: [vz3[1]],
            mode: 'markers',
            marker: {
                size: 12,
                line: {
                    color: 'rgba(0, 0, 255, 0.14)',
                    width: 0.5
                },
                opacity: 0.8
            },
            type: currentTypeB
        }

        wholeData.push(data2);
        wholeData.push(data3);
    } else {
        let data2 = {
            name: 'ES Point',
            uirevision: true,
            x: vx2,
            y: vy2,
            z: vz3,
            mode: 'markers',
            marker: {
                size: 12,
                line: {
                    color: 'rgba(255, 0, 0, 0.14)',
                    width: 0.5
                },
                opacity: 0.8
            },
            type: currentTypeB
        }

        wholeData.push(data2);
    }

    var layout = {
        title: '',
        autosize: true,
        uirevision: true,
        width: 900,
        height: 700,
        margin: {
            l: 65,
            r: 50,
            b: 65,
            t: 90,
        }
    };

    Plotly.react(document.getElementById("plot"), wholeData, layout);

}
