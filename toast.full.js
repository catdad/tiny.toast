/*! tiny.toast 2014-09-29 */
/* jshint browser: true, -W030 */

!function (window, document) {
    //create CSS
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    var css = '.t-wrap{position:fixed;bottom:0;text-align:center;font-family:sans-serif;width:100%}@media all and (min-width:0){.t-wrap{width:auto;display:inline-block;left:50%;transform:translate(-50%,0);transform:translate3d(-50%,0,0);transform-style:preserve-3d}}.t-wrap .t-toast{width:15em;margin:.6em auto;padding:.5em .3em;border-radius:2em;color:#eee;box-shadow:0 4px 0 -1px rgba(0,0,0,.2);will-change:opacity,height,margin;-webkit-animation:t-enter 500ms ease-out;animation:t-enter 500ms ease-out;transform-style:preserve-3d}.t-toast.t-gray{background:#777;background:rgba(119,119,119,.9)}.t-toast.t-red{background:#D85955;background:rgba(216,89,85,.9)}.t-toast.t-blue{background:#4374AD;background:rgba(67,116,173,.9)}.t-toast.t-green{background:#75AD44;background:rgba(117,173,68,.9)}.t-toast.t-orange{background:#D89B55;background:rgba(216,133,73,.9)}.t-toast.t-exit{-webkit-animation:t-exit 500ms ease-in;animation:t-exit 500ms ease-in}@-webkit-keyframes t-enter{from{opacity:0;max-height:0}to{opacity:1;max-height:2em}}@keyframes t-enter{from{opacity:0;max-height:0}to{opacity:1;max-height:2em}}@-webkit-keyframes t-exit{from{opacity:1;max-height:2em}to{opacity:0;max-height:0}}@keyframes t-exit{from{opacity:1;max-height:2em}to{opacity:0;max-height:0}}@media screen and (max-width:16em){.t-wrap .t-toast{width:90%}}';
    
    //insert CSS into the stylesheet and head
    (style.styleSheet) ? style.styleSheet.cssText = css : style.appendChild(document.createTextNode(css));
    //insert stylesheet into head
    head.appendChild(style);

    //generate DOM
    var toastDOM = document.createElement('div');
    toastDOM.className = 't-wrap';
    
    // https://gist.github.com/catdad/9399313
    var ready = function(){
		//insert toast DOM into body -- when ready
        document.body.appendChild(toastDOM);
	};
	var readyCheck = function(){ (document.readyState === 'complete') && ready(); };
	//check for when the document is ready
	if (document.addEventListener) document.addEventListener('readystatechange', readyCheck, false);
	else document.attachEvent('onreadystatechange', readyCheck);

    // check if animations are supported
    // we can reuse a div we already created earlier
    var animations = (function(style){
        return 'animation' in style || '-webkit-animation' in style;
    })(toastDOM.style /* document.createElement('div').style */);
    
    // helper
    function isInPage(node) {
        return (node === document.body) ? false : document.body.contains(node);
    }
    
    // helper - very simple forEach
    function arrForEach(arr, fn){
        for (var i = 0, l = arr.length; i < l; i++) {
            fn(arr[i], i, arr);
        }
    }
    
    // helper - animate DOM element exit
    // remove immediately if animations are not available
    function remove(node) {
        function removeDom(){
            // check if the node is still in the DOM
            isInPage(node) && node.parentElement.removeChild(node);
        }
            
        if (animations) {
            node.addEventListener('webkitAnimationEnd', removeDom, false);
            node.addEventListener('animationend', removeDom, false);
            
            // add animated class
            node.className += ' t-exit';
        } else {
            removeDom(node);  
        }
    }
    
    function toastOptions(args) {
        args = [].slice.call(args);
        var opts;
        
        // find the fist Object and assign it to opts
        arrForEach(args, function(el, i){
            if (!opts && typeof el === 'object') {
                opts = el;   
            }
        });
        
        opts = opts || {};
        
        // overwrite message parameter with 
        if (typeof args[0] === 'string') {
            opts.message = args[0];   
        }
        
        if (typeof args[1] === 'number') {
            opts.timeout === args[1];   
        }
        
        return opts;
    }
    
    // toast generator function
    function toaster(type) {
        //keep track of toast DOMs
        var Instance = function(msg){
            var that = this;
            
            that.count = 0;
            that.dom = document.createElement('div');
            //that.textNode = undefined;
            that.autoRemove = undefined;
            that.remove = function(){
                clearTimeout(that.autoRemove);
                delete tracker[msg];
                
                remove(that.dom);
            };
            
            //add remove function directly to dom element
            that.dom.removeToast = that.remove;
            
            //add classname
            that.dom.className = type + ' t-toast';
            
            //automatically insert into the DOM
            toastDOM.appendChild(that.dom);
            
            //create the instance tracker
            !!toastr.group && (tracker[msg] = that);
        };
        
        //an array to track multiple messages
        var tracker = [];
        
        //generate a toast function
        return function toast(msg, timeout) {
            //create toast element
            var prev = (!!toastr.group && tracker[msg]) ? tracker[msg] : new Instance(msg),
                div = prev.dom,
                text = (prev && ++prev.count > 1) ? msg + ' (x' + prev.count + ')' : msg,
                textNode = document.createTextNode(text);
            
            div.firstChild ? div.replaceChild(textNode, div.firstChild) : div.appendChild(textNode);
            
            //add remove options (unless indefinite requested)
			(timeout !== -1) && (clearTimeout(prev.autoRemove), prev.autoRemove = setTimeout(function () { 
                prev.remove();
            }, (+timeout || +toastr.timeout || 5000)));
            
            //create function to remove on click
            div.onclick = function () { 
                prev.remove();
            };
			
            //return a remove reference
			return div.onclick;
        };
    }
	
	function clearAll(){
		arrForEach(toastDOM.children, function(el){
            (el.removeToast) ? 
                el.removeToast() : 
                remove(el);
        });
	}

    var toastr = window.toastr = {
        timeout: 4000,
        group: true,
		clear: clearAll,
        log: toaster('t-gray'),
        error: toaster('t-red'),
        info: toaster('t-blue'),
        success: toaster('t-green'),
        warning: toaster('t-orange')
    };
}(window, document);
