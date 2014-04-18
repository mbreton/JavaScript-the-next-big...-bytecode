document.body.onclick = function () {
    function DiagModule(stdlib) {
        "use asm"
    }

    var diag = DiagModule({ Math: Math }).diag;
    alert(diag(10, 100));
};
