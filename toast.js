/* jshint browser: true, -W030 */

!function (window, document) {
    //create CSS
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    var css = "{{csscode}}";
    
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
