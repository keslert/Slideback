// import { RAL } from '../lib/ral.min';

// RAL.Queue.setMaxConnections(4);
// RAL.Queue.start();


let cache = {};
export function getImage(url) {
    if(!cache[url]) {
        get(url);
        cache[url] = { blob: false };
    }

    return cache[url].blob;
    // const remoteImage = new RAL.RemoteImage(url);
    // RAL.Queue.add(remoteImage);
    // return remoteImage.element;
}

function get(url) {
    var xhr = new XMLHttpRequest();
    xhr.open( "GET", url, true );
    xhr.responseType = 'blob';

    xhr.onload = function( e ) {
        // var arrayBufferView = new Uint8Array( this.response );
        // var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
        // debugger;
        // cache[url] = URL.createObjectURL( blob );
        cache[url].blob = window.URL.createObjectURL(this.response);
    };

    xhr.send();
}



// Simulate a call to Dropbox or other service that can
// return an image as an ArrayBuffer.


// Use JSFiddle logo as a sample image to avoid complicating
// this example with cross-domain issues.


// Ask for the result as an ArrayBuffer.


