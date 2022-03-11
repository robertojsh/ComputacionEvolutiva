function _f(x, y) {
    return Math.pow((x - 2), 2) + Math.pow((y - 2), 2);
}

function f_rastrigin(x, y) {
    let A = 10;
    return A * 2 + Math.pow(x, 2) + Math.pow(y, 2) - (A * (Math.cos(2 * Math.PI * x) + Math.cos(2 * Math.PI * y)));
}

function f_dropwave(x,y){
    return (-1)*( (1 + Math.cos( 12 * Math.sqrt( Math.pow(x,2) + Math.pow(y,2) ) ) ) / (0.5 * ( Math.pow(x,2) + Math.pow(y,2) ) + 2 ) );
}

function _f2(x,y) {
    return x * Math.pow(Math.E, -1 * (Math.pow(x, 2) + Math.pow(y, 2)));
}
