/* Optional native-control experiment. Never restart audio from a pause event. */
(function(){
  'use strict';
  if(!/(?:\?|&)system=1(?:&|$)/.test(window.location.search)||document.body.getAttribute('data-mode')!=='immersive')return;
  var audio=document.getElementById('audio');
  var report=document.getElementById('playback-report');
  var entries=[],startedAt=Date.now();
  var mode=window.ClassicPodSystemPlayback={enabled:true,started:false};
  document.body.className+=' system-playback';
  audio.controls=true;
  audio.preload='auto';
  audio.className='system-player';
  document.getElementById('system-player-label').hidden=false;
  document.getElementById('system-playback-details').hidden=false;
  function record(name){
    entries.push(Math.round((Date.now()-startedAt)/100)/10+'s '+name+' '+(document.hidden?'hidden':'visible')+' '+(audio.paused?'paused':'playing')+' t='+Math.round((audio.currentTime||0)*10)/10);
    if(entries.length>32)entries.shift();
    report.value='Classic Pod 0.6 system-controls\n'+(navigator.standalone===true?'standalone':'browser')+' · WebAudio disabled\n'+entries.join('\n');
  }
  ['play','playing','pause','waiting','stalled','ended','error','loadedmetadata'].forEach(function(name){audio.addEventListener(name,function(){if(name==='play')mode.started=true;record(name);});});
  document.addEventListener('visibilitychange',function(){record('visibilitychange');});
  ['pagehide','pageshow','blur','focus'].forEach(function(name){window.addEventListener(name,function(){record(name);});});
  document.getElementById('copy-playback-report').onclick=function(){
    report.focus();report.select();report.setSelectionRange(0,report.value.length);
    var copied=false;try{copied=document.execCommand('copy');}catch(e){}
    document.getElementById('copy-playback-state').textContent=copied?'已复制，可粘贴给我排查。':'请长按记录框，选择全选并复制。';
  };
  record('ready');
}());
