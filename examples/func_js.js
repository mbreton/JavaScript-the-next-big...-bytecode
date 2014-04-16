_.chain([1, 2, 3, 200])
    .filter(function (num) { return num % 2 === 0;})
    .tap(alert) // (alerted [2, 200])
    .map(function (num) { return num * num })
    .value(); // [4,40000]