/* No scrollTo/fullscreen tricks: Safari must see an actual document swipe. */
(function(){
  'use strict';
  var stage=document.getElementById('immersive-stage');
  var tip=document.getElementById('immersive-tip');
  var scheduled=false;
  function fit(){
    scheduled=false;
    var height=window.innerHeight||document.documentElement.clientHeight;
    stage.style.height=height+'px';
    stage.className=(height-38<470?'compact':'')+(height-38<350?' short':'');
  }
  function schedule(){if(!scheduled){scheduled=true;window.requestAnimationFrame(fit);}}
  function explain(){tip.textContent=window.pageYOffset>15?'向下滑可展开工具栏 · 上滑可再次收起':'在这条空白区域上滑，尝试收起 Safari 工具栏';}
  window.addEventListener('resize',schedule);
  window.addEventListener('orientationchange',schedule);
  window.addEventListener('pageshow',schedule);
  window.addEventListener('scroll',function(){schedule();explain();},{passive:true});
  fit();explain();
}());
