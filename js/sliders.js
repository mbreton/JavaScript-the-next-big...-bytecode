var root = document.getElementById('impress');
root.addEventListener('impress:stepenter',function(el){
    if (typeof  window[el.target.id] == "function"){
        window[el.target.id]();
    }
});

var wtf = function(){
    $('#js-terminal').terminal(function(command, term) {
        if (command !== '') {
            var result = window.eval(command);
            if (result != undefined) {
                term.echo(String(result));
            }
        }
    }, {
        greetings: 'Javascript Interpreter',
        name: 'js_demo',
        height: 480,
        width: 810,
        prompt: 'js> '
    });
}

var autocomplete = function(){
    $('#autocomplete_container').replaceWith('<iframe width="810" height="480" ' +
        'src="http://www.youtube.com/embed/oAuekVilLX0?autoplay=1"' +
        'auto_play="1"' +
        'frameborder="0">' +
        '</iframe>');
}

bad_building = function(){
    $('#bad_building').addClass('bad');
    setTimeout(function(){
        $('.fall').addClass('animated hinge');
    },1000);
};

coffeescript_lisible = function(){
    coffee_editor.focus();
};

languages = function(){
    setTimeout(function(){
        $('#list_lang').addClass('go-up')
    });
};

$(function(){
    coffee_editor = ace.edit("coffee_editor");
    var coffee_result = ace.edit("coffee_result");

    coffee_editor.setTheme("ace/theme/monokai");
    coffee_result.setTheme("ace/theme/monokai");
    coffee_editor.setFontSize(20);
    coffee_result.setFontSize(20);
    coffee_editor.getSession().setMode("ace/mode/coffee");
    coffee_result.getSession().setMode("ace/mode/javascript");

    coffee_editor.on('change',function(evt, edit){
        var coffeeCode = edit.getSession().getValue();
        try{
            var jsCode  = CoffeeScript.compile(coffeeCode);
            console.log(jsCode);
            coffee_result.getSession().setValue(jsCode);
        } catch (e){
            console.log('mache po')
        }
    });

    $('.editor').each(function(idx, el){
        var $el = $(el);
        var editor = ace.edit(el.id);
        editor.setFontSize(20);
        console.log(el.id);
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/"+$el.data('language'));
    });
});

/*var languages = function (){
    var fill = d3.scale.category20();

    d3.layout.cloud().size([1200, 600])
        .words(languages_list.map(function(d) {
                return {text: d, size: 10 + Math.random() * 90};
        }))
        .padding(5)
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .fontSize(function(d) { return d.size; })
        .on("end", draw)
        .start();

    function draw (words) {
        d3.select("#cloud").append("svg")
            .attr("width", 1200)
            .attr("height", 600)
            .append("g")
            .attr("transform", "translate(150,150)")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
    }
}*/