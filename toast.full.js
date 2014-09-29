/*! tiny.toast 2014-09-28 */
/* jshint browser: true, -W030 */

!function (window, document) {
    //create CSS
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    var css = '.t-wrap{position:fixed;bottom:0;text-align:center;font-family:sans-serif;width:100%}@media all and (min-width:0){.t-wrap{width:auto;display:inline-block;left:50%;transform:translate(-50%,0);transform:translate3d(-50%,0,0)}}.t-wrap .t-toast{width:15em;margin:.6em auto;padding:.5em .3em;border-radius:2em;color:#eee;box-shadow:0 4px 0 -1px rgba(0,0,0,.2);will-change:opacity,height;-webkit-animation:enter 500ms ease-out;animation:enter 500ms ease-out}.t-toast.t-gray{background:#777;background:rgba(119,119,119,.9)}.t-toast.t-red{background:#D85955;background:rgba(216,89,85,.9)}.t-toast.t-blue{background:#4374AD;background:rgba(67,116,173,.9)}.t-toast.t-green{background:#75AD44;background:rgba(117,173,68,.9)}.t-toast.t-orange{background:#D89B55;background:rgba(216,133,73,.9)}.t-toast.t-exit{-webkit-animation:exit 500ms ease-in;animation:exit 500ms ease-in}@-webkit-keyframes enter{from{opacity:0;max-height:0}to{opacity:1;max-height:2em}}@keyframes enter{from{opacity:0;max-height:0}to{opacity:1;max-height:2em}}@-webkit-keyframes exit{from{opacity:1;max-height:2em}to{opacity:0;max-height:0}}@keyframes exit{from{opacity:1;max-height:2em}to{opacity:0;max-height:0}}@media screen and (max-width:16em){.t-wrap .t-toast{width:90%}}';
    
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
    
    function remove(node) {
        function removeDom(){
            node.parentElement.removeChild(node);
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
    
    function toaster(type) {
        //keep track of toast DOMs
        var Instance = function(msg){
            var that = this;
            
            this.count = 0;
            this.dom = document.createElement('div');
            this.textNode = undefined;
            this.autoRemove = undefined;
            this.remove = function(){
                clearTimeout(that.autoRemove);
                delete tracker[msg];
                
//                isInPage(that.dom) && toastDOM.removeChild(that.dom);
                isInPage(that.dom) && remove(that.dom);
            };
            
            //add remove function directly to dom element
            this.dom.removeToast = this.remove;
            
            //add classname
            this.dom.className = type + ' t-toast';
            
            //automatically insert into the DOM
            toastDOM.appendChild(this.dom);
            
            //create the instance tracker
            !!toastr.group && (tracker[msg] = this);
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
		var children = toastDOM.children;
        for (var i = 0, l = children.length; i < l; i++) {
            (children[i].removeToast) ? 
                children[i].removeToast() : 
                remove(children[i].removeToast);
        }
	}

    var toastr = window.toastr = {
        timeout: 4000,
        group: false,
		clear: clearAll,
        log: toaster('t-gray'),
        error: toaster('t-red'),
        info: toaster('t-blue'),
        success: toaster('t-green'),
        warning: toaster('t-orange')
    };
}(window, document);
