function DiagModule(stdlib, foreign, heap) {
    "use asm";
    var sqrt = stdlib.Math.sqrt;
    function square(x) {
        x = +x;
        return +(x * x);
    }
    function diag(x, y) {
        x = +x;
        y = +y;
        return +sqrt(square(x) + square(y));
    }
    return { diag: diag };
}