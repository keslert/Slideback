let cache = {};
export function getImage(url) {
    if(!cache[url]) {
        get(url);
        cache[url] = { blob: false };
    }

    return cache[url].blob;
}

function get(url) {
    var xhr = new XMLHttpRequest();
    xhr.open( "GET", url, true );
    xhr.responseType = 'blob';

    xhr.onload = function( e ) {
        cache[url].blob = window.URL.createObjectURL(this.response);
    };

    xhr.send();
}