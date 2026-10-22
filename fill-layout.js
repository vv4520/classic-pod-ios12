/* Portrait fill / landscape fit. Layout only: do not touch audio, user playback choices, or the music library. */
(function(){
  'use strict';
  var stage=document.getElementById('classic-stage');
  var frame=document.getElementById('classic-frame');
  var device=document.getElementById('device');
  if(!stage||!frame||!device)return;
  var width=320,height=536,pending=false;
  function fit(){
    pending=false;
    var view=window.visualViewport;
    var w=view&&view.width?view.width:window.innerWidth;
    var h=view&&view.height?view.height:window.innerHeight;
    if(!(w>0&&h>0))return;
    var portrait=w<=h;
    var scale=Math.min(1,w/width,h/height);
    stage.className=portrait?'fill-portrait':'fit-landscape';
    stage.style.width=w+'px';
    stage.style.height=h+'px';
    frame.style.width=(portrait?w:width*scale)+'px';
    frame.style.height=(portrait?h:height*scale)+'px';
    device.style.transform=portrait?'none':'scale('+scale+')';
  }
  function schedule(){
    if(pending)return;
    pending=true;
    if(window.requestAnimationFrame)window.requestAnimationFrame(fit);
    else window.setTimeout(fit,16);
  }
  window.addEventListener('resize',schedule,false);
  window.addEventListener('orientationchange',schedule,false);
  window.addEventListener('pageshow',schedule,false);
  if(window.visualViewport)window.visualViewport.addEventListener('resize',schedule,false);
  fit();
}());
