/* jshint browser: true, devel: true */
/* global toast, _, prettyPrintOne, CodeMirror, ace */

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
    
    img.src = 'lib/icon_4140.png';
    
    img.style.width = img.style.height = '2em';
    img.style.position = 'absolute';
    img.style.right = '1em';
    
    text.style.boxSizing = 'border-box';
    text.style.paddingRight = '2em';
    text.style.lineHeight = '2em';
    
    text.appendChild(textNode);
    root.appendChild(text);
    root.appendChild(img);
    
    toast.alert({
        action: { dom: root }
    });
}

var examples = {
    basicMessage: basicMessage,
    stickyMessage: stickyMessage,
    dismissAction: dismissAction,
    multipleActions: multipleActions,
    requiredActions: requiredActions,
    nonDismissibleMessage: nonDismissibleMessage,
    customContent: customContent
};

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

_.forEach(examples, function(func, name){
    var el = document.getElementById(name),
        funcString = func.toString(),
        funcBody = funcString.substring(funcString.indexOf("{") + 1, funcString.lastIndexOf("}"));

    
    funcBody = funcBody.replace(/\n|\r/g, '').replace(/\s{2,}/g, function(val){ return '\n' + val; });
    
    console.log(funcBody);
    
    // remove exactly one code indentation
    funcBody = funcBody.replace(/\n {4}/g, '\n');
    
    
    el.innerHTML = '<pre class="prettyprint">' + prettyPrintOne(funcBody.trim(), 'javascript') + '</pre>';
});