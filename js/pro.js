/* Shapo Digital — pro motion layer */
(function(){
  // scroll progress
  var bar=document.querySelector('.scroll-progress');
  function prog(){
    var h=document.documentElement;
    var sc=(h.scrollTop)/(h.scrollHeight-h.clientHeight);
    if(bar) bar.style.width=(sc*100)+'%';
    var nav=document.querySelector('.navbar');
    if(nav) nav.classList.toggle('scrolled', h.scrollTop>40);
  }
  document.addEventListener('scroll',prog,{passive:true}); prog();

  // reveal on scroll
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:.16,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.r').forEach(function(el){io.observe(el);});

  // tile spotlight follow
  document.querySelectorAll('.tile').forEach(function(t){
    t.addEventListener('mousemove',function(ev){
      var r=t.getBoundingClientRect();
      t.style.setProperty('--mx',((ev.clientX-r.left)/r.width*100)+'%');
      t.style.setProperty('--my',((ev.clientY-r.top)/r.height*100)+'%');
    });
  });

  // count up
  function animateCount(el){
    var target=parseFloat(el.getAttribute('data-count'))||0;
    var suffix=el.getAttribute('data-suffix')||'';
    var dur=1400, start=performance.now();
    function tick(now){
      var p=Math.min((now-start)/dur,1);
      var eased=1-Math.pow(1-p,3);
      var val=Math.round(target*eased);
      el.textContent=val+suffix;
      if(p<1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var cio=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ animateCount(e.target); cio.unobserve(e.target);} });
  },{threshold:.6});
  document.querySelectorAll('[data-count]').forEach(function(el){cio.observe(el);});
})();
