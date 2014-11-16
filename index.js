/* jshint browser: true, devel: true */
/* global toast, prettyPrintOne, CodeMirror, ace */

function basicMessage() {
    toast.alert("Why, hello there.");
}

function stickyMessage() {
    toast.info("You can click me to dismiss.", -1);
}

function dismissAction() {
    toast.success({
        message: 'Click me!',
        onclick: function(ev){
            toast.log('You did it.');
        }
    });
}

function multipleActions() {
    toast.info({
        message: 'Do you want to?',
        action: [{
            name: 'yes',
            onclick: function(){ 
                toast.success('you said yes :)');
            }
        },{
            name: 'no',
            onclick: function(){ 
                toast.error('you said no :('); 
            }
        }],
        timeout: -1
    });
}

function requiredActions() {
    var dismiss = toast.warning({
        message: 'You have to answer me.',
        dismissible: false,
        action: [{
            name: 'yes',
            onclick: function(){ 
                dismiss();
                toast.success('you said yes :)');
            }
        },{
            name: 'no',
            onclick: function(){
                dismiss();
                toast.error('you said no :('); 
            }
        }]
    });
}

function nonDismissibleMessage() {
    var dismiss = toast.warning({
        // these two properties are needed
        message: "You can't touch me.",
        dismissible: false,
        // these are extras, just for show
        onclick: function(){
            toast.success({
                message: "That won't work. Click me instead!",
                // this get's rid of that first one
                onclick: dismiss
            });
        }
    });
}

function customContent() {
    var root = document.createElement('div'),
        text = document.createElement('span'),
        textNode = document.createTextNode('Have some toast.'),
        img = document.createElement('img');
    // line
    img.src = 'lib/icon_4140.png';
    // line
    img.style.width = img.style.height = '2em';
    img.style.position = 'absolute';
    img.style.right = '1em';
    // line
    text.style.boxSizing = 'border-box';
    text.style.paddingRight = '2em';
    text.style.lineHeight = '2em';
    // line
    text.appendChild(textNode);
    root.appendChild(text);
    root.appendChild(img);
    // line
    toast.alert({
        action: { dom: root }
    });
}

// https://gist.github.com/catdad/11239214
var forEach = function(obj, cb, context){
    /* jshint -W030 */
    // check for a native forEach function
    var native = [].forEach,
        hasProp = Object.prototype.hasOwnProperty;
    
    // if there is a native function, use it
    if (native && obj.forEach === native) {
        //don't bother if there is no function
        cb && obj.forEach(cb, context);
    }
    // if the object is array-like
    else if (obj.length === +obj.length) {
        // loop though all values
        for (var i = 0, length = obj.length; i < length; i++) {
            // call the function with the context and native-like arguments
            cb && cb.call(context, obj[i], i, obj);
        }
    }
    // it's an object, use the keys
    else {
        // loop through all keys
        for (var name in obj){
            // call the function with context and native-like arguments
            if (hasProp.call(obj, name)) {
                cb && cb.call(context, obj[name], name, obj);
            }
        }
    }
    /* jshint +W030 */
};

var examples = {
    basicMessage: basicMessage,
    stickyMessage: stickyMessage,
    dismissAction: dismissAction,
    multipleActions: multipleActions,
    requiredActions: requiredActions,
    nonDismissibleMessage: nonDismissibleMessage,
    customContent: customContent
};

// try using CodeMirror
// boxes came out looking terrible, themes did not take
// I don't feel like figuring this one out again
//var mirrors = _.map(examples, function(func, name){
//    var el = document.getElementById(name),
//        funcString = func.toString(),
//        funcBody = funcString.substring(funcString.indexOf("{") + 1, funcString.lastIndexOf("}"));
//
//    while(el.firstChild) {
//        el.removeChild(el.firstChild);
//    }
//
//    return CodeMirror(el, {
//        value: funcBody,
//        mode: "javascript",
//        readOnly: true
//    });
//});

// try using ace editor (automatic beautification?)
// needs a defined height on the parent div
//var editors = _.map(examples, function(func, name){
//    var el = document.getElementById(name),
//        funcString = func.toString(),
//        funcBody = funcString.substring(funcString.indexOf("{") + 1, funcString.lastIndexOf("}"));
//
//    while(el.firstChild) {
//        el.removeChild(el.firstChild);
//    }
//    
//    var text = document.createTextNode(funcBody);
//    el.appendChild(text);
//    
//    var editor = ace.edit(name);
//    editor.setTheme("ace/theme/monokai");
//    editor.getSession().setMode("ace/mode/javascript");
//    editor.setReadOnly(true);
//    //editor.setValue(funcBody);
//    
//    var lines = editor.session.getLength();
//    console.log(name, lines);
//    
//    return editor;
//});

forEach(examples, function(func, name){
    var el = document.getElementById(name),
        funcString = func.toString(),
        funcBody = funcString.substring(funcString.indexOf("{") + 1, funcString.lastIndexOf("}"));

    // remove new lines -- this is how the code will be on GitHub
    funcBody = funcBody.replace(/\n|\r/g, '');
    
    funcBody = funcBody
        // 2 or more spaces is an indent, so this needs to be on the next line
        .replace(/\s{2,}/g, function(val){ return '\n' + val; })
        // replace "// line" tokens
        .replace(/\/\/ line/g, '')
        // remove exactly one code indentation
        .replace(/\n {4}/g, '\n');
    
    el.innerHTML = '<pre class="prettyprint">' + prettyPrintOne(funcBody.trim(), 'javascript') + '</pre>';
});