/* Keep a real typed audio Blob in storage; never persist an object URL. ES5/iOS 12. */
(function(){
  'use strict';
  function type(name,declared){
    var ext=String(name||'').toLowerCase().split('.').pop();
    var types={mp3:'audio/mpeg',wav:'audio/wav',m4a:'audio/mp4',mp4:'audio/mp4',aac:'audio/aac',flac:'audio/flac',aif:'audio/aiff',aiff:'audio/aiff',ogg:'audio/ogg',opus:'audio/ogg',wma:'audio/x-ms-wma',ape:'audio/ape'};
    return types[ext]||(/^audio\//.test(declared||'')?declared:'application/octet-stream');
  }
  function restore(value,track){
    if(!value)throw new Error('未读到本机音乐副本；原歌曲记录保留');
    var mime=type(track&&track.name,track&&track.type||value.type);
    var blob=value.slice&&typeof value.size==='number'?value.slice(0,value.size,mime):new Blob([value],{type:mime});
    if(!blob.size)throw new Error('本机音乐副本为空；原歌曲记录保留');
    return blob;
  }
  function copy(file){
    return new Promise(function(resolve,reject){
      var reader=new FileReader();
      reader.onload=function(){resolve(new Blob([reader.result],{type:type(file.name,file.type)}));};
      reader.onerror=reader.onabort=function(){reject(new Error('无法读取音乐文件，请确认原文件已完整下载到手机'));};
      reader.readAsArrayBuffer(file);
    });
  }
  window.PodLocalAudio={type:type,restore:restore,copy:copy};
}());
