var g_analytics = "UA-3313586-2";

AddFuncOnLoad(fixLink);

function fixLink() {
    var o=document.getElementsByTagName('a');
 
    for(var i = 0; i < o.length; i++) {
        if(o[i].href.indexOf('http://www.liu.com.tw/download') >= 0) {
            //o[i].outerHTML = '<span class="a">' + o[i].innerHTML + '</span>';
            //o[i].href = 'http://boshiamy.com/download/' + o[i].href.substring(31, o[i].href.length);
        } else if(o[i].href.indexOf('index.html') >= 0) {
            o[i].href = './';
        }
    }
}

function AddFuncOnLoad(func) {
    if (window.addEventListener) {
        window.addEventListener('load', func, false);
    } else if (window.attachEvent) {
        window.attachEvent('onload', func);
    } else {
        window.onload = func;
    }
}
