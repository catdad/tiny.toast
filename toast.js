(function () {
    //create CSS
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    var css = ".t-wrap{ position: fixed; bottom: 0; width: 100%; text-align: center; }";
    css += ".t-wrap .t-toast{ width: 15em; margin: .5em auto; padding: .3em; border: 2px solid; border-radius: 2em; color: #eee; box-shadow: 0 0 30px -6px black; }";
    css += ".t-toast.t-gray{ background: #777; background: rgba(119,119,119,.9); border-color: #333; }";
    css += ".t-toast.t-red{ background: #D85955; background: rgba(216,89,85,.9); border-color: #562422; }";
    css += ".t-toast.t-blue{ background: #4374AD; background: rgba(67,116,173,.9); border-color: #16273A; }";
    css += ".t-toast.t-green{ background: #75AD44; background: rgba(117,173,68,.9); border-color: #2F451B; }";
    css += ".t-toast.t-orange{ background: #D89B55; background: rgba(216,133,73,.9); border-color: #624E02; }";
    css += "@media screen and (max-width: 16em){ .t-wrap .t-toast{ width: 90%; } }";

    //insert CSS into the stylesheet and head
    (style.styleSheet) ? style.styleSheet.cssText = css : style.appendChild(document.createTextNode(css));
    //insert stylesheet into head
    head.appendChild(style);

    //generate DOM
    var toastDOM = document.createElement('div');
    toastDOM.className = 't-wrap';
    //insert toast DOM into body
    document.body.appendChild(toastDOM);

    function toaster(type) {
        //generate a toast function
        return function toast(msg, timeout) {
            //create toast element
            var div = document.createElement('div');
            div.className = type + ' t-toast';
            div.innerHTML = msg;
            toastDOM.appendChild(div);
            //add remove options
            var autoRemove = setTimeout(function () { toastDOM.removeChild(div); }, (+timeout || +toastr.timeout || 5000));
            div.onclick = function () { clearTimeout(autoRemove); toastDOM.removeChild(div); }
        }
    }

    var toastr = window.toastr = {
        timeout: 4000,
        log: toaster('t-gray'),
        error: toaster('t-red'),
        info: toaster('t-blue'),
        success: toaster('t-green'),
        warning: toaster('t-orange')
    };
})();
