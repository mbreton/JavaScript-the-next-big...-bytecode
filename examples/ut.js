// Source
function A() {}
A.prototype.plus = function (arg1, arg2) {
    return arg1 + arg2;
};

function B(a) {this.a = a;}
B.prototype.plusCaller = function (arg1, arg2) {
    return this.a.plus(arg1, arg2);
};

// Test
test("Unit test", function () {
    var dirtyMockA = {
        plus: function (arg1, arg2) {
            if (arg1 == 1 && arg2 == 1) {
                return 2;
            }
        }
    };

    var b = new B(dirtyMockA);
    equal(b.plusCaller(1, 1), 2);
});