$(function(){
    // Call ace tranformer on each ".editor" elements
    $('.editor').each(function(idx, el){
        var $el = $(el);
        var editor = ace.edit(el.id);
        editor.setFontSize(20);
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/"+$el.data('language'));
    });

    var root = document.getElementById('impress');
    root.addEventListener('impress:stepenter',function(el){
        if (typeof  window[el.target.id+"_enter"] == "function"){
            window[el.target.id+"_enter"]();
        }
    });
    root.addEventListener('mpress:stepleave',function(el){
        if (typeof  window[el.target.id+"_leave"] == "function"){
            window[el.target.id+"_leave"]();
        }
    });
});

var wtf_enter = function(){
    var term = $('#js-terminal').terminal(function(command, term) {
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
    setTimeout(function(){
        term.exec('{} + {}');
        term.echo('^ is an empty string');
    },3000);

    setTimeout(function(){
        term.exec('new Array() == false');
        term.echo('weird ?');
    },9000);

    setTimeout(function(){
        term.exec('typeof null');
        term.echo('hum, hum ...');
    },15000);
}

var autocomplete_enter = function(){
    $('#autocomplete_container').replaceWith('<iframe width="810" height="480" ' +
        'src="http://www.youtube.com/embed/oAuekVilLX0?autoplay=1"' +
        'auto_play="1"' +
        'frameborder="0">' +
        '</iframe>');
}

var bad_building_enter = function(){
    $('#bad_building').addClass('bad');
    setTimeout(function(){
        $('.fall').addClass('animated hinge');
    },1000);
};

var coffeescript_lisible_enter = function(){

    var coffee_editor = ace.edit("coffee_editor");
    var coffee_result = ace.edit("coffee_result");

    coffee_editor.setTheme("ace/theme/monokai");
    coffee_result.setTheme("ace/theme/monokai");
    coffee_editor.setFontSize(20);
    coffee_result.setFontSize(20);
    coffee_editor.getSession().setMode("ace/mode/coffee");
    coffee_result.getSession().setMode("ace/mode/javascript");

    //coffee_editor.on('change',function(evt, edit){
        var coffeeCode = coffee_editor.getSession().getValue();
        try{
            var jsCode  = CoffeeScript.compile(coffeeCode);
            console.log(jsCode);
            coffee_result.getSession().setValue(jsCode);
        } catch (e){
            console.log('mache po')
        }
    //});
    //coffee_editor.focus();
};

var languages_enter = function(){
    setTimeout(function(){
        $('#list_lang').addClass('go-up')
    });
};