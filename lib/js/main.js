var keyboard = {
    37: 'left', // go to the next slide when the ENTER key is pressed
    38: 'up', // do something custom when ESC is pressed
    39: 'right',
    40: 'down'
};
/*for (var i = 48; i < 91; i++){
    keyboard[i]=null
}*/

Reveal.initialize({
    controls: true,
    progress: true,
    history: true,
    center: true,
    keyboard: keyboard,
    slideNumber : true,

    //theme: 'devoxx2014',//Reveal.getQueryHash().theme, // available themes are in /css/theme
    transition: Reveal.getQueryHash().transition || 'default', // default/cube/page/concave/zoom/linear/fade/none

    //parallaxBackgroundImage: 'https://s3.amazonaws.com/media-p.slid.es/uploads/mathieubreton/images/308873/ground.png',
    //parallaxBackgroundSize: '1600px 3000px',

    // Parallax scrolling
    // parallaxBackgroundImage: 'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg',
    // parallaxBackgroundSize: '2100px 900px',

    minScale: 0.3,
    maxScale: 1.0,

    // Optional libraries used to extend on reveal.js
    dependencies: [
        { src: 'plugin/highlight/highlight.min.js', async: true, callback: function () {
            hljs.initHighlightingOnLoad();
        } },
        { src: 'lib/js/classList.js', condition: function () {
            return !document.body.classList;
        } },
        { src: 'plugin/markdown/marked.js', condition: function () {
            return !!document.querySelector('[data-markdown]');
        } },
        { src: 'plugin/markdown/markdown.js', condition: function () {
            return !!document.querySelector('[data-markdown]');
        } },
        { src: 'plugin/zoom-js/zoom.js', async: true, condition: function () {
            return !!document.body.classList;
        } },
        { src: 'socket.io/socket.io.js', async: true },
        { src: 'plugin/notes-server/client.js', async: true }
    ]
});


Reveal.addEventListener('ready', function (event) {
    buildJsTerminal();
    buildJavaJSChart();
    initCoffeeScriptCompiler();
    initTypeScriptCompiler();
    initLangCloud();
    initWrongPopup();
    initUtEditor();
});

var cloudBuilt = false;
function initLangCloud() {
    Reveal.addEventListener('slidechanged', function (event) {
        if (event.currentSlide.getAttribute('data-id') === "langs") {
            if (cloudBuilt) {
                TagCanvas.Resume('lang-cloud');
            }
            try {
                TagCanvas.Start('lang-cloud', 'lang-list', {
                    textColour: '#53b6bc',
                    textFont: 'Arial, Helvetica, sans-serif',
                    textHeight: 7,
                    interval: 25,
                    initial: [0.1, 0.1],
                    stretchX: 1.7,
                    noSelect: true,
                    outlineMethod: 'none',
                    reverse: true,
                    depth: 0.80,
                    minSpeed: 0.02,
                    maxSpeed: 0.05,
                    shadowOffset: [1, 1],
                    shadowBlur: true,
                    shuffleTags: true
                });
                cloudBuilt = true;
            } catch (e) {
                document.getElementById('lang-cloud').style.display = 'none';
            }
        } else if (event.currentSlide.getAttribute('data-id') !== "nb-langs" && cloudBuilt) {
            TagCanvas.Pause('lang-cloud');
        }
    });
}


function buildJsTerminal() {
    var isStoppingPropagation = false;
    var settings = {
        greetings: 'Javascript Console',
        completion: true,
        name: 'js_demo',
        width: "100%",
        prompt: 'js> ',
        keydown:function(event){
            if (isStoppingPropagation){
                event.stopImmediatePropagation();
            }
        },
        onBlur:function(){
            isStoppingPropagation = false;
        },
        onFocus:function(){
            isStoppingPropagation = true;
        }
    };


    function evaluator(command, term) {
        if (command !== '') {
            var result = window.eval(command);
            if (result != undefined) {
                term.echo(String(result));
            }
        }
    }

    var term = $('#js-terminal').terminal(evaluator, settings);
}

function buildJavaJSChart() {
    /*function data() {
     var sin = [],
     cos = [];

     for (var i = 0; i < 100; i++) {
     sin.push({x: i, y: Math.sin(i / 10)});
     cos.push({x: i, y: .5 * Math.cos(i / 10)});
     }

     return [
     {
     values: sin,
     key: 'Sine Wave',
     color: '#ff7f0e'
     },
     {
     values: cos,
     key: 'Cosine Wave',
     color: '#2ca02c'
     }
     ];
     }

     nv.addGraph(function () {
     var chart = nv.models.lineChart()
     .useInteractiveGuideline(true);

     chart.xAxis
     .axisLabel('Time (ms)')
     .tickFormat(d3.format(',r'));

     chart.yAxis
     .axisLabel('Voltage (v)')
     .tickFormat(d3.format('.02f'));

     d3.select('#chart svg')
     .datum(data())
     .transition().duration(500)
     .call(chart);

     nv.utils.windowResize(chart.update);

     return chart;
     });*/
}

function initCoffeeScriptCompiler() {
    var coffeeEditor = ace.edit('coffee-src');
    var jsRendering = ace.edit('coffee-dest');

    coffeeEditor.on('change', function () {
        var coffeeCode = coffeeEditor.getSession().getValue();
        setTimeout(function () {
            try {
                var jsCode = coffeeCode === "" ? "" : CoffeeScript.compile(coffeeCode);
                jsRendering.getSession().setValue(jsCode);
            } catch (e) {
                console.log(e.getMessage());
                jsRendering.getSession().setValue("");
            }
        }, 1);
    });
}

function initUtEditor() {
    var utEditor = ace.edit('ut-editor');
    var iframe = document.getElementById('utRenderer');

    iframe.onload = function () {
        console.log('iframe load');
        var utCode = utEditor.getSession().getValue();
        var script = iframe.contentWindow.document.getElementById('source');
        setTimeout(function(){
            try {
                script.innerHTML = utCode;
                iframe.contentWindow.QUnit.start();
            } catch(e){}
        },0);
    };

    function injectSourceInUtIframe() {
        iframe.contentWindow.location.reload();
     }
    injectSourceInUtIframe();
    utEditor.on('change', injectSourceInUtIframe);
}

function initTypeScriptCompiler() {

    //Minimal declaration file lib.d.ts
    var libfile = '/// <reference no-default-lib="true"/>\n' +
        'declare var NaN:number;\ndeclare var Infinity:number;\ndeclare function eval(x:string):any;\ndeclare function parseInt(s:string,radix?:number):number;\ndeclare function parseFloat(string:string):number;\ndeclare function isNaN(number:number):bool;\ndeclare function isFinite(number:number):bool;\ndeclare function decodeURI(encodedURI:string):string;\ndeclare function decodeURIComponent(encodedURIComponent:string):string;\ndeclare function encodeURI(uri:string):string;\ndeclare function encodeURIComponent(uriComponent:string):string;\ninterface PropertyDescriptor{\nconfigurable?:bool;\nenumerable?:bool;\nvalue?:any;\nwritable?:bool;\nget?():any;\nset?(v:any):void;\n}\ninterface PropertyDescriptorMap{\n[s:string]:PropertyDescriptor;\n}\ninterface Object{\ntoString():string;\ntoLocaleString():string;\nvalueOf():Object;\nhasOwnProperty(v:string):bool;\nisPrototypeOf(v:Object):bool;\npropertyIsEnumerable(v:string):bool;\n[s:string]:any;\n}\ndeclare var Object:{\nnew(value?:any):Object;\n():any;\n(value:any):any;\nprototype:Object;\ngetPrototypeOf(o:any):any;\ngetOwnPropertyDescriptor(o:any,p:string):PropertyDescriptor;\ngetOwnPropertyNames(o:any):string[];\ncreate(o:any,properties?:PropertyDescriptorMap):any;\ndefineProperty(o:any,p:string,attributes:PropertyDescriptor):any;\ndefineProperties(o:any,properties:PropertyDescriptorMap):any;\nseal(o:any):any;\nfreeze(o:any):any;\npreventExtensions(o:any):any;\nisSealed(o:any):bool;\nisFrozen(o:any):bool;\nisExtensible(o:any):bool;\nkeys(o:any):string[];\n}\ninterface Function{\napply(thisArg:any,...argArray:any[]):any;\ncall(thisArg:any,...argArray:any[]):any;\nbind(thisArg:any,...argArray:any[]):Function;\nprototype:any;\nlength:number;\n}\ndeclare var Function:{\nnew(...args:string[]):Function;\n(...args:string[]):Function;\nprototype:Function;\n}\ninterface IArguments{\n[index:number]:any;\nlength:number;\ncallee:Function;\n}\ninterface String{\ntoString():string;\ncharAt(pos:number):string;\ncharCodeAt(index:number):number;\nconcat(...strings:string[]):string;\nindexOf(searchString:string,position?:number):number;\nlastIndexOf(searchString:string,position?:number):number;\nlocaleCompare(that:string):number;\nmatch(regexp:string):string[];\nmatch(regexp:RegExp):string[];\nreplace(searchValue:string,replaceValue:string):string;\nreplace(searchValue:string,replaceValue:(substring:string,...args:any[])=>string):string;\nreplace(searchValue:RegExp,replaceValue:string):string;\nreplace(searchValue:RegExp,replaceValue:(substring:string,...args:any[])=>string):string;\nsearch(regexp:string):number;\nsearch(regexp:RegExp):number;\nslice(start:number,end?:number):string;\nsplit(seperator:string,limit?:number):string[];\nsplit(seperator:RegExp,limit?:number):string[];\nsubstring(start:number,end?:number):string;\ntoLowerCase():string;\ntoLocaleLowerCase():string;\ntoUpperCase():string;\ntoLocaleUpperCase():string;\ntrim():string;\nlength:number;\nsubstr(from:number,length?:number):string;\n}\ndeclare var String:{\nnew(value?:any):String;\n(value?:any):string;\nprototype:String;\nfromCharCode(...codes:number[]):string;\n}\ninterface Boolean{\n}\ndeclare var Boolean:{\nnew(value?:any):Boolean;\n(value?:any):bool;\nprototype:Boolean;\n}\ninterface Number{\ntoString(radix?:number):string;\ntoFixed(fractionDigits?:number):string;\ntoExponential(fractionDigits?:number):string;\ntoPrecision(precision:number):string;\n}\ndeclare var Number:{\nnew(value?:any):Number;\n(value?:any):number;\nprototype:Number;\nMAX_VALUE:number;\nMIN_VALUE:number;\nNaN:number;\nNEGATIVE_INFINITY:number;\nPOSITIVE_INFINITY:number;\n}\ninterface Math{\nE:number;\nLN10:number;\nLN2:number;\nLOG2E:number;\nLOG10E:number;\nPI:number;\nSQRT1_2:number;\nSQRT2:number;\nabs(x:number):number;\nacos(x:number):number;\nasin(x:number):number;\natan(x:number):number;\natan2(y:number,x:number):number;\nceil(x:number):number;\ncos(x:number):number;\nexp(x:number):number;\nfloor(x:number):number;\nlog(x:number):number;\nmax(...values:number[]):number;\nmin(...values:number[]):number;\npow(x:number,y:number):number;\nrandom():number;\nround(x:number):number;\nsin(x:number):number;\nsqrt(x:number):number;\ntan(x:number):number;\n}\ndeclare var Math:Math;\ninterface Date{\ntoString():string;\ntoDateString():string;\ntoTimeString():string;\ntoLocaleString():string;\ntoLocaleDateString():string;\ntoLocaleTimeString():string;\nvalueOf():number;\ngetTime():number;\ngetFullYear():number;\ngetUTCFullYear():number;\ngetMonth():number;\ngetUTCMonth():number;\ngetDate():number;\ngetUTCDate():number;\ngetDay():number;\ngetUTCDay():number;\ngetHours():number;\ngetUTCHours():number;\ngetMinutes():number;\ngetUTCMinutes():number;\ngetSeconds():number;\ngetUTCSeconds():number;\ngetMilliseconds():number;\ngetUTCMilliseconds():number;\ngetTimezoneOffset():number;\nsetTime(time:number):void;\nsetMilliseconds(ms:number):void;\nsetUTCMilliseconds(ms:number):void;\nsetSeconds(sec:number,ms?:number):void;\nsetUTCSeconds(sec:number,ms?:number):void;\nsetMinutes(min:number,sec?:number,ms?:number):void;\nsetUTCMinutes(min:number,sec?:number,ms?:number):void;\nsetHours(hours:number,min?:number,sec?:number,ms?:number):void;\nsetUTCHours(hours:number,min?:number,sec?:number,ms?:number):void;\nsetDate(date:number):void;\nsetUTCDate(date:number):void;\nsetMonth(month:number,date?:number):void;\nsetUTCMonth(month:number,date?:number):void;\nsetFullYear(year:number,month?:number,date?:number):void;\nsetUTCFullYear(year:number,month?:number,date?:number):void;\ntoUTCString():string;\ntoISOString():string;\ntoJSON(key?:any):string;\n}\ndeclare var Date:{\nnew():Date;\nnew(value:number):Date;\nnew(value:string):Date;\nnew(year:number,month:number,date?:number,hours?:number,minutes?:number,seconds?:number,ms?:number):Date;\n():string;\nprototype:Date;\nparse(s:string):number;\nUTC(year:number,month:number,date?:number,hours?:number,minutes?:number,seconds?:number,ms?:number):number;\nnow():number;\n}\ninterface RegExpExecArray{\n[index:number]:string;\nlength:number;\nindex:number;\ninput:string;\ntoString():string;\ntoLocaleString():string;\nconcat(...items:string[][]):string[];\njoin(seperator?:string):string;\npop():string;\npush(...items:string[]):void;\nreverse():string[];\nshift():string;\nslice(start:number,end?:number):string[];\nsort(compareFn?:(a:string,b:string)=>number):string[];\nsplice(start:number):string[];\nsplice(start:number,deleteCount:number,...items:string[]):string[];\nunshift(...items:string[]):number;\nindexOf(searchElement:string,fromIndex?:number):number;\nlastIndexOf(searchElement:string,fromIndex?:number):number;\nevery(callbackfn:(value:string,index:number,array:string[])=>bool,thisArg?:any):bool;\nsome(callbackfn:(value:string,index:number,array:string[])=>bool,thisArg?:any):bool;\nforEach(callbackfn:(value:string,index:number,array:string[])=>void,thisArg?:any):void;\nmap(callbackfn:(value:string,index:number,array:string[])=>any,thisArg?:any):any[];\nfilter(callbackfn:(value:string,index:number,array:string[])=>bool,thisArg?:any):string[];\nreduce(callbackfn:(previousValue:any,currentValue:any,currentIndex:number,array:string[])=>any,initialValue?:any):any;\nreduceRight(callbackfn:(previousValue:any,currentValue:any,currentIndex:number,array:string[])=>any,initialValue?:any):any;\n}\ninterface RegExp{\nexec(string:string):RegExpExecArray;\ntest(string:string):bool;\nsource:string;\nglobal:bool;\nignoreCase:bool;\nmultiline:bool;\nlastIndex:bool;\n}\ndeclare var RegExp:{\nnew(pattern:string,flags?:string):RegExp;\n(pattern:string,flags?:string):RegExp;\n}\ninterface Error{\nname:string;\nmessage:string;\n}\ndeclare var Error:{\nnew(message?:string):Error;\n(message?:string):Error;\nprototype:Error;\n}\ninterface JSON{\nparse(text:string,reviver?:(key:any,value:any)=>any):any;\nstringify(value:any):string;\nstringify(value:any,replacer:(key:string,value:any)=>any):string;\nstringify(value:any,replacer:any[]):string;\nstringify(value:any,replacer:(key:string,value:any)=>any,space:any):string;\nstringify(value:any,replacer:any[],space:any):string;\n}\ndeclare var JSON:JSON;\ninterface Array{\ntoString():string;\ntoLocaleString():string;\nconcat(...items:_element[][]):_element[];\njoin(seperator?:string):string;\npop():_element;\npush(...items:_element[]):void;\nreverse():_element[];\nshift():_element;\nslice(start:number,end?:number):_element[];\nsort(compareFn?:(a:_element,b:_element)=>number):_element[];\nsplice(start:number):_element[];\nsplice(start:number,deleteCount:number,...items:_element[]):_element[];\nunshift(...items:_element[]):number;\nindexOf(searchElement:_element,fromIndex?:number):number;\nlastIndexOf(searchElement:_element,fromIndex?:number):number;\nevery(callbackfn:(value:_element,index:number,array:_element[])=>bool,thisArg?:any):bool;\nsome(callbackfn:(value:_element,index:number,array:_element[])=>bool,thisArg?:any):bool;\nforEach(callbackfn:(value:_element,index:number,array:_element[])=>void,thisArg?:any):void;\nmap(callbackfn:(value:_element,index:number,array:_element[])=>any,thisArg?:any):any[];\nfilter(callbackfn:(value:_element,index:number,array:_element[])=>bool,thisArg?:any):_element[];\nreduce(callbackfn:(previousValue:any,currentValue:any,currentIndex:number,array:_element[])=>any,initialValue?:any):any;\nreduceRight(callbackfn:(previousValue:any,currentValue:any,currentIndex:number,array:_element[])=>any,initialValue?:any):any;\nlength:number;\n}\ndeclare var Array:{\nnew(...items:any[]):any[];\n(...items:any[]):any[];\nisArray(arg:any):bool;\nprototype:Array;\n}\ninterface Window{\nondragend:(ev:any)=>any;\nonkeydown:(ev:any)=>any;\nondragover:(ev:any)=>any;\nonkeyup:(ev:any)=>any;\nonreset:(ev:any)=>any;\nonmouseup:(ev:any)=>any;\nondragstart:(ev:any)=>any;\nondrag:(ev:any)=>any;\nonmouseover:(ev:any)=>any;\nondragleave:(ev:any)=>any;\nhistory:any;\nname:string;\nonafterprint:(ev:any)=>any;\nonpause:(ev:any)=>any;\nonbeforeprint:(ev:any)=>any;\ntop:Window;\nonmousedown:(ev:any)=>any;\nonseeked:(ev:any)=>any;\nopener:Window;\nonclick:(ev:any)=>any;\nonwaiting:(ev:any)=>any;\nononline:(ev:any)=>any;\nondurationchange:(ev:any)=>any;\nframes:Window;\nonblur:(ev:any)=>any;\nonemptied:(ev:any)=>any;\nonseeking:(ev:any)=>any;\noncanplay:(ev:any)=>any;\nonstalled:(ev:any)=>any;\nonmousemove:(ev:any)=>any;\nonoffline:(ev:any)=>any;\nlength:number;\nonbeforeunload:(ev:any)=>any;\nonratechange:(ev:any)=>any;\nonstorage:(ev:any)=>any;\nonloadstart:(ev:any)=>any;\nondragenter:(ev:any)=>any;\nonsubmit:(ev:any)=>any;\nself:Window;\nonprogress:(ev:any)=>any;\nondblclick:(ev:any)=>any;\noncontextmenu:(ev:any)=>any;\nonchange:(ev:any)=>any;\nonloadedmetadata:(ev:any)=>any;\nonplay:(ev:any)=>any;\nonerror:any;\nonplaying:(ev:any)=>any;\nparent:Window;\nlocation:any;\noncanplaythrough:(ev:any)=>any;\nonabort:(ev:any)=>any;\nonreadystatechange:(ev:any)=>any;\nonkeypress:(ev:any)=>any;\nframeElement:any;\nonloadeddata:(ev:any)=>any;\nonsuspend:(ev:any)=>any;\nwindow:Window;\nonfocus:(ev:any)=>any;\nonmessage:(ev:any)=>any;\nontimeupdate:(ev:any)=>any;\nonresize:(ev:any)=>any;\nnavigator:any;\nonselect:(ev:any)=>any;\nondrop:(ev:any)=>any;\nonmouseout:(ev:any)=>any;\nonended:(ev:any)=>any;\nonhashchange:(ev:any)=>any;\nonunload:(ev:any)=>any;\nonscroll:(ev:any)=>any;\nonmousewheel:(ev:any)=>any;\nonload:(ev:any)=>any;\nonvolumechange:(ev:any)=>any;\noninput:(ev:any)=>any;\nalert(message?:string):void;\nfocus():void;\nprint():void;\nprompt(message?:string,defaul?:string):string;\ntoString():string;\nopen(url?:string,target?:string,features?:string,replace?:bool):Window;\nclose():void;\nconfirm(message?:string):bool;\npostMessage(message:any,targetOrigin:string,ports?:any):void;\nshowModalDialog(url?:string,argument?:any,options?:any):any;\nblur():void;\ngetSelection():any;\n}\ndeclare var Window:{\nprototype:Window;\nnew():Window;\n}\ninterface Document{\ndoctype:any;\nxmlVersion:string;\nimplementation:any;\nxmlEncoding:string;\nxmlStandalone:bool;\ndocumentElement:any;\ninputEncoding:string;\nbody:any;\ncreateElement(tagName:string):any;\nadoptNode(source:any):any;\ncreateComment(data:string):any;\ncreateDocumentFragment():any;\ngetElementsByTagName(tagname:string):any;\ngetElementsByTagNameNS(namespaceURI:string,localName:string):any;\ncreateProcessingInstruction(target:string,data:string):any;\ncreateElementNS(namespaceURI:string,qualifiedName:string):any;\ncreateAttribute(name:string):any;\ncreateTextNode(data:string):any;\nimportNode(importedNode:any,deep:bool):any;\ncreateCDATASection(data:string):any;\ncreateAttributeNS(namespaceURI:string,qualifiedName:string):any;\ngetElementById(elementId:string):any;\n}\ndeclare var Document:{\nprototype:Document;\nnew():Document;\n}\ndeclare var ondragend:(ev:any)=>any;\ndeclare var onkeydown:(ev:any)=>any;\ndeclare var ondragover:(ev:any)=>any;\ndeclare var onkeyup:(ev:any)=>any;\ndeclare var onreset:(ev:any)=>any;\ndeclare var onmouseup:(ev:any)=>any;\ndeclare var ondragstart:(ev:any)=>any;\ndeclare var ondrag:(ev:any)=>any;\ndeclare var onmouseover:(ev:any)=>any;\ndeclare var ondragleave:(ev:any)=>any;\ndeclare var history:any;\ndeclare var name:string;\ndeclare var onafterprint:(ev:any)=>any;\ndeclare var onpause:(ev:any)=>any;\ndeclare var onbeforeprint:(ev:any)=>any;\ndeclare var top:Window;\ndeclare var onmousedown:(ev:any)=>any;\ndeclare var onseeked:(ev:any)=>any;\ndeclare var opener:Window;\ndeclare var onclick:(ev:any)=>any;\ndeclare var onwaiting:(ev:any)=>any;\ndeclare var ononline:(ev:any)=>any;\ndeclare var ondurationchange:(ev:any)=>any;\ndeclare var frames:Window;\ndeclare var onblur:(ev:any)=>any;\ndeclare var onemptied:(ev:any)=>any;\ndeclare var onseeking:(ev:any)=>any;\ndeclare var oncanplay:(ev:any)=>any;\ndeclare var onstalled:(ev:any)=>any;\ndeclare var onmousemove:(ev:any)=>any;\ndeclare var onoffline:(ev:any)=>any;\ndeclare var length:number;\ndeclare var onbeforeunload:(ev:any)=>any;\ndeclare var onratechange:(ev:any)=>any;\ndeclare var onstorage:(ev:any)=>any;\ndeclare var onloadstart:(ev:any)=>any;\ndeclare var ondragenter:(ev:any)=>any;\ndeclare var onsubmit:(ev:any)=>any;\ndeclare var self:Window;\ndeclare var onprogress:(ev:any)=>any;\ndeclare var ondblclick:(ev:any)=>any;\ndeclare var oncontextmenu:(ev:any)=>any;\ndeclare var onchange:(ev:any)=>any;\ndeclare var onloadedmetadata:(ev:any)=>any;\ndeclare var onplay:(ev:any)=>any;\ndeclare var onerror:any;\ndeclare var onplaying:(ev:any)=>any;\ndeclare var parent:Window;\ndeclare var location:any;\ndeclare var oncanplaythrough:(ev:any)=>any;\ndeclare var onabort:(ev:any)=>any;\ndeclare var onreadystatechange:(ev:any)=>any;\ndeclare var onkeypress:(ev:any)=>any;\ndeclare var frameElement:any;\ndeclare var onloadeddata:(ev:any)=>any;\ndeclare var onsuspend:(ev:any)=>any;\ndeclare var window:Window;\ndeclare var onfocus:(ev:any)=>any;\ndeclare var onmessage:(ev:any)=>any;\ndeclare var ontimeupdate:(ev:any)=>any;\ndeclare var onresize:(ev:any)=>any;\ndeclare var navigator:any;\ndeclare var onselect:(ev:any)=>any;\ndeclare var ondrop:(ev:any)=>any;\ndeclare var onmouseout:(ev:any)=>any;\ndeclare var onended:(ev:any)=>any;\ndeclare var onhashchange:(ev:any)=>any;\ndeclare var onunload:(ev:any)=>any;\ndeclare var onscroll:(ev:any)=>any;\ndeclare var onmousewheel:(ev:any)=>any;\ndeclare var onload:(ev:any)=>any;\ndeclare var onvolumechange:(ev:any)=>any;\ndeclare var oninput:(ev:any)=>any;\ndeclare function alert(message?:string):void;\ndeclare function focus():void;\ndeclare function print():void;\ndeclare function prompt(message?:string,defaul?:string):string;\ndeclare function toString():string;\ndeclare function open(url?:string,target?:string,features?:string,replace?:bool):Window;\ndeclare function close():void;\ndeclare function confirm(message?:string):bool;\ndeclare function postMessage(message:any,targetOrigin:string,ports?:any):void;\ndeclare function showModalDialog(url?:string,argument?:any,options?:any):any;\ndeclare function blur():void;\ndeclare function getSelection():any;\ndeclare function getComputedStyle(elt:any,pseudoElt?:string):any;\ndeclare function attachEvent(any:string,listener:any):bool;\ndeclare function detachEvent(any:string,listener:any):void;\ndeclare var status:string;\ndeclare var onmouseleave:(ev:any)=>any;\ndeclare var screenLeft:number;\ndeclare var offscreenBuffering:any;\ndeclare var maxConnectionsPerServer:number;\ndeclare var onmouseenter:(ev:any)=>any;\ndeclare var clipboardData:any;\ndeclare var defaultStatus:string;\ndeclare var clientInformation:any;\ndeclare var closed:bool;\ndeclare var onhelp:(ev:any)=>any;\ndeclare var external:any;\ndeclare var any:any;\ndeclare var onfocusout:(ev:any)=>any;\ndeclare var screenTop:number;\ndeclare var onfocusin:(ev:any)=>any;\ndeclare function showModelessDialog(url?:string,argument?:any,options?:any):Window;\ndeclare function navigate(url:string):void;\ndeclare function resizeBy(x?:number,y?:number):void;\ndeclare function item(index:any):any;\ndeclare function resizeTo(x?:number,y?:number):void;\ndeclare function createPopup(arguments?:any):any;\ndeclare function toStaticHTML(html:string):string;\ndeclare function execScript(code:string,language?:string):any;\ndeclare function msWriteProfilerMark(profilerMarkName:string):void;\ndeclare function moveTo(x?:number,y?:number):void;\ndeclare function moveBy(x?:number,y?:number):void;\ndeclare function showHelp(url:string,helpArg?:any,features?:string):void;\ndeclare var performance:any;\ndeclare var outerWidth:number;\ndeclare var pageXOffset:number;\ndeclare var innerWidth:number;\ndeclare var pageYOffset:number;\ndeclare var screenY:number;\ndeclare var outerHeight:number;\ndeclare var screen:any;\ndeclare var innerHeight:number;\ndeclare var screenX:number;\ndeclare function scroll(x?:number,y?:number):void;\ndeclare function scrollBy(x?:number,y?:number):void;\ndeclare function scrollTo(x?:number,y?:number):void;\ndeclare var styleMedia:any;\ndeclare var document:Document;\ndeclare function removeEventListener(type:string,listener:any,useCapture?:bool):void;\ndeclare function addEventListener(type:string,listener:any,useCapture?:bool):void;\ndeclare function dispatchEvent(evt:any):bool;\ndeclare var localStorage:any;\ndeclare var sessionStorage:any;\ndeclare function clearTimeout(handle:number):void;\ndeclare function setTimeout(expression:any,msec?:number,language?:any):number;\ndeclare function clearInterval(handle:number):void;\ndeclare function setInterval(expression:any,msec?:number,language?:any):number;\ndeclare var onpopstate:(ev:any)=>any;\ndeclare var applicationCache:any;\ndeclare function matchMedia(mediaQuery:string):any;\ndeclare var animationStartTime:number;\ndeclare function cancelAnimationFrame(handle:number):void;\ndeclare function requestAnimationFrame(callback:any):number;\ndeclare function btoa(rawString:string):string;\ndeclare function atob(encodedString:string):string;\ndeclare var indexedDB:any;\ndeclare var console:any;\ndeclare function importScripts(...urls:string[]):void;';

    function compileTypeScript(editor, renderer) {
        var tsCode = editor.getSession().getValue();
        setTimeout(function () {
            var outfile = {
                source: '',
                Write: function (s) {
                    this.source += s;
                },
                WriteLine: function (s) {
                    this.source += s + '\n';
                },
                Close: function () {
                }
            };
            var compiler = new TypeScript.TypeScriptCompiler(outfile);

            compiler.parser.errorRecovery = true;
            compiler.setErrorCallback(function (start, len, message, block) {
                console.log('Compilation error: ', message, '\n Code block: ', block, ' Start position: ', start, ' Length: ', len);
            });

            compiler.addUnit(libfile, 'lib.d.ts');
            compiler.addUnit(tsCode, '');
            compiler.typeCheck();
            compiler.emit(false, function createFile() {
                return outfile;
            });
            renderer.getSession().setValue('//Compiled TypeScript\n\n' + outfile.source);
        }, 0);
    }

    $('.editor.source[data-lang="typescript"]').each(function (idx, editorEl) {
        var typeScriptEditor = ace.edit(editorEl);
        var jsRenderer = ace.edit(editorEl.id + "-js");

        compileTypeScript(typeScriptEditor, jsRenderer);
        typeScriptEditor.on('change', function () {
            compileTypeScript(typeScriptEditor, jsRenderer);
        });
    });
}

function initWrongPopup() {
    var onSlideOnFragmentChange = function (event) {
        if (event && (event.fragment == $('#wrong-fragment')[0])) {
            $('<div id="wrong">FAUX</div>').appendTo('.reveal')
        } else {
            $('#wrong').remove();
        }
    };
    Reveal.addEventListener('slidechanged', onSlideOnFragmentChange);
    Reveal.addEventListener('fragmentshown', onSlideOnFragmentChange);
    Reveal.addEventListener('fragmenthidden', onSlideOnFragmentChange);
}