// dataURL to blob
export function dataURLtoBlob(dataurl: any) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
}

// blob to dataURL
export function blobToDataURL(blob: Blob, callback: any) {
  var a = new FileReader();
  a.onload = function(e) {
    if (e == null) return
    if (e.target == null) return
    if (e.target.result == null) return
    callback(e.target.result)
  }
  a.readAsDataURL(blob);
}

//test:
// var blob = dataURLtoBlob('data:text/plain;base64,YWFhYWFhYQ==');
// blobToDataURL(blob, function(dataurl){
//   console.log(dataurl);
// });