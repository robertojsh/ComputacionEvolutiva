function draw(vx, vy, vz, vx2, vy2, vz3) {
    currentData = {
        name: 'Space',
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
