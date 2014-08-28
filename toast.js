/* jshint browser: true, -W030 */

!function (window, document) {
    //create CSS
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    var css = [".t-wrap{position:fixed;bottom:0;width:100%;text-align:center;}",
               ".t-wrap .t-toast{width:15em;margin:.5em auto;padding:.3em;border:2px solid;border-radius:2em;color:#eee;box-shadow:0 0 30px -6px black;}",
               ".t-toast.t-gray{background:#777;background:rgba(119,119,119,.9);border-color:#333;}",
               ".t-toast.t-red{background:#D85955;background:rgba(216,89,85,.9);border-color:#562422;}",
               ".t-toast.t-blue{background:#4374AD;background:rgba(67,116,173,.9);border-color:#16273A;}",
               ".t-toast.t-green{background:#75AD44;background:rgba(117,173,68,.9);border-color:#2F451B;}",
               ".t-toast.t-orange{background:#D89B55;background:rgba(216,133,73,.9);border-color:#624E02;}",
               "@media screen and (max-width: 16em){.t-wrap .t-toast{width: 90%;}}"].join(' ');

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

    function isInPage(node) {
        return (node === document.body) ? false : document.body.contains(node);
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
                isInPage(that.dom) && toastDOM.removeChild(that.dom);
                delete tracker[msg];
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
		while(toastDOM.firstChild) 
            (toastDOM.firstChild.removeToast) ? 
                toastDOM.firstChild.removeToast() : 
                toastDOM.removeChild(toastDOM.firstChild);
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
