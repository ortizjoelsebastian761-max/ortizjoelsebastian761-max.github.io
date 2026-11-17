// ====== PEGA AQUÍ EL LINK DE YOUTUBE ======
const VIDEO_URL="https://youtu.be/O4FVPd8oO1Y?si=h4M768pJAgF0USD2";
// ==========================================
const TABS=[["inicio","Inicio"],["intro","Introducción"],["conceptos","Conceptos"],["modelo","M/M/1"],["video","Video"],["juego1","Juego 1"],["juego2","Quiz"],["refs","Créditos"]];
const nav=document.getElementById("nav");
TABS.forEach(([id,t])=>{const b=document.createElement("button");b.textContent=t;b.dataset.id=id;b.onclick=()=>go(id);nav.appendChild(b)});
function go(id){document.querySelectorAll("section").forEach(s=>s.classList.toggle("on",s.id===id));
 nav.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.dataset.id===id));window.scrollTo(0,0)}
go("inicio");

// Video
(function(){const m=VIDEO_URL.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);const box=document.getElementById("vbox");
 if(m){box.innerHTML='<iframe src="https://www.youtube.com/embed/'+m[1]+'" allowfullscreen title="Video"></iframe>';
  document.getElementById("vlink").innerHTML='<a class="btn" style="display:inline-block;text-decoration:none" href="'+VIDEO_URL+'" target="_blank" rel="noopener">▶ Ver el video en YouTube</a> <span style="color:var(--mu)">(si el video no se muestra arriba, usa este botón)</span>'}
 else box.textContent="Aquí irá el video de YouTube"})();

// Calculadora
function calc(){const l=+document.getElementById("lam").value,u=+document.getElementById("mu").value,r=document.getElementById("res");
 if(!(l>0&&u>0)){r.textContent="Ingresa valores positivos.";return}
 if(l>=u){r.innerHTML="⚠️ El sistema es inestable (λ ≥ μ): la fila crece sin límite.";return}
 const p=l/u,L=p/(1-p),Lq=p*p/(1-p),W=1/(u-l),Wq=p/(u-l),f=x=>x.toFixed(3);
 r.innerHTML='<div class="wrap"><table><tr><th>ρ</th><th>P0</th><th>L</th><th>Lq</th><th>W (h)</th><th>Wq (h)</th></tr><tr><td>'+f(p)+'</td><td>'+f(1-p)+'</td><td>'+f(L)+'</td><td>'+f(Lq)+'</td><td>'+f(W)+'</td><td>'+f(Wq)+'</td></tr></table></div><p>El servidor está ocupado el '+(p*100).toFixed(1)+'% del tiempo y cada cliente pasa en promedio '+(W*60).toFixed(1)+' minutos en el sistema.</p>'}
calc();

// Juego 1
let G=null;const $=id=>document.getElementById(id);
const DIF={f:{r:.04,p:1.3},m:{r:.055,p:1},d:{r:.085,p:.8}};
const TY={n:{e:"🧑",p:10,ok:10,bad:5},i:{e:"😠",p:6,ok:15,bad:8},v:{e:"👑",p:12,ok:25,bad:15}};
function start(){if(G&&G.iv)clearInterval(G.iv);
 const d=DIF[$("gd").value],n=+$("gn").value;
 G={d,q:[],c:Array.from({length:4},(_,i)=>({on:i<n,rem:0,e:"",pts:0,ext:0,xt:false})),t:45,s:0,lost:0,served:0,arr:0,wait:0,vip:0,extra:false,paused:false};
 $("gend").textContent="";draw();G.iv=setInterval(tick,100)}
function tick(){if(G.paused)return;G.t-=.1;
 if(Math.random()<G.d.r){const x=Math.random(),k=x<.2?"v":x<.45?"i":"n",b=TY[k].p*G.d.p;G.q.push({k,p:b,m:b,w:0});G.arr++}
 const keep=[];G.q.forEach(c=>{c.p-=.1;c.w+=.1;if(c.p>0)keep.push(c);else{G.lost++;G.s-=TY[c.k].bad}});G.q=keep;
 G.c.forEach(c=>{if(c.rem>0){c.rem-=.1;if(c.rem<=0){c.rem=0;G.s+=c.pts;G.served++;c.e=""}}
  if(c.xt){c.ext-=.1;if(c.ext<=0&&c.rem<=0){c.on=false;c.xt=false}}});
 draw();if(G.t<=0)end()}
function serve(i,idx){const c=G.c[i];if(c.rem>0||!G.q[idx])return;
 const cl=G.q.splice(idx,1)[0];c.rem=2.5+Math.random()*2;c.e=TY[cl.k].e;c.pts=TY[cl.k].ok;G.wait+=cl.w;if(cl.k==="v")G.vip++;draw()}
function call(i){if(!G||G.t<=0||G.paused)return;serve(i,0)}
function pick(idx){if(!G||G.t<=0||G.paused)return;const i=G.c.findIndex(c=>c.on&&c.rem<=0);if(i>=0)serve(i,idx)}
function pause(){if(G&&G.t>0)G.paused=!G.paused}
function extra(){if(!G||G.extra||G.t<=0)return;G.extra=true;G.s-=20;const c=G.c.find(c=>!c.on);if(c){c.on=true;c.xt=true;c.ext=12}draw()}
function draw(){if(!G)return;$("gt").textContent=Math.max(0,Math.ceil(G.t));$("gs").textContent=G.s;$("gl").textContent=G.lost;$("gf").textContent=G.q.length;
 $("gq").innerHTML=G.q.length?G.q.map((c,i)=>'<button class="cl" onpointerdown="pick('+i+')">'+TY[c.k].e+'<i style="width:'+Math.max(0,c.p/c.m*100)+'%;background:'+(c.p/c.m<.35?'var(--bad)':'var(--g)')+'"></i></button>').join(""):'<span style="color:var(--mu)">Fila vacía</span>';
 $("gc").innerHTML=G.c.map((c,i)=>c.on?'<div class="caja"><b>'+(c.rem>0?c.e+' '+c.rem.toFixed(1)+'s':'😴')+'</b><button class="btn alt" onpointerdown="call('+i+')">Llamar</button></div>':'').join("");
 $("gx").disabled=G.extra}
function end(){clearInterval(G.iv);const lam=(G.arr/45*60).toFixed(1),mu=(G.served/45*60).toFixed(1),w=G.served?(G.wait/G.served).toFixed(1):"0";
 const r=G.s>=150?"🏆 ¡Gerente de banco!":G.s>=70?"👍 Buen cajero":"💪 Sigue practicando";
 $("gend").innerHTML='<h3>¡Tiempo! '+r+'</h3><p>Puntaje final: <b>'+G.s+'</b>.</p><div class="wrap"><table><tr><th>Llegadas</th><th>λ observada</th><th>Atendidos</th><th>μ efectiva</th><th>Espera promedio</th><th>Perdidos</th><th>VIP atendidos</th></tr><tr><td>'+G.arr+'</td><td>'+lam+'/min</td><td>'+G.served+'</td><td>'+mu+'/min</td><td>'+w+' s</td><td>'+G.lost+'</td><td>'+G.vip+'</td></tr></table></div><p>Cuando λ se acerca o supera la capacidad total de las cajas, la fila crece y los clientes se van. Prueba con más cajas o usando la caja extra en el momento justo.</p>'}
draw();

// Quiz
const Q=[
["¿Quién es considerado el padre de la teoría de colas?",["A. A. K. Erlang","B. Isaac Newton","C. Alan Turing"],0],
["En la notación M/M/1, ¿qué indica el 1?",["Un tipo de cliente","Un servidor","Una cola de capacidad 1"],1],
["Si λ = 6 y μ = 8 por hora, ¿cuánto vale la utilización ρ?",["0,75","1,33","0,25"],0],
["¿Qué disciplina atiende primero a quien llegó primero?",["LIFO","FIFO","PRI"],1],
["¿Qué pasa si λ ≥ μ en un M/M/1?",["La fila se vacía","Nada especial","La fila crece sin límite"],2],
["La Ley de Little establece que:",["L = λ·W","ρ = L + W","W = λ·μ"],0],
["¿Qué representa μ?",["Tasa media de llegadas","Tasa media de servicio de un servidor","Número de servidores"],1],
["Con λ = 4 y μ = 5 por hora, ¿cuántos clientes hay en promedio en el sistema (L)?",["0,8","4","5"],1],
["¿Qué significa la primera M de M/M/1?",["Máxima","Markoviana (llegadas de Poisson)","Media"],1],
["¿Cuál es un ejemplo de disciplina por prioridad?",["La fila de un banco","Urgencias de un hospital","Una pila de platos"],1],
["Si ρ = 0,9, ¿qué porcentaje del tiempo está ocupado el servidor?",["10%","90%","0,9%"],1],
["Si L = 3 clientes y λ = 6 por hora, ¿cuánto vale W según Little?",["0,5 horas","2 horas","18 horas"],0]];
let qi=0,qs=0;
function showQ(){const box=$("quiz");
 if(qi>=Q.length){box.innerHTML='<h3>Resultado: '+qs+' / '+Q.length+'</h3><p>'+(qs>=10?"¡Excelente, dominas el tema!":qs>=6?"Buen trabajo, repasa los conceptos y vuelve a intentarlo.":"Te sugiero releer las secciones y probar otra vez.")+'</p><button class="btn" onclick="qi=0;qs=0;showQ()">Reintentar</button>';return}
 const [t,o]=Q[qi];box.innerHTML='<p><b>Pregunta '+(qi+1)+' de '+Q.length+'</b></p><h3>'+t+'</h3>'+o.map((x,i)=>'<button class="opt" onclick="ans('+i+')">'+x+'</button>').join("")+'<div id="fb"></div>'}
function ans(i){const c=Q[qi][2],b=document.querySelectorAll(".opt");if(b[0].disabled)return;
 b.forEach((x,k)=>{x.disabled=true;if(k===c)x.classList.add("ok")});
 if(i===c)qs++;else b[i].classList.add("no");
 $("fb").innerHTML='<p>'+(i===c?"✅ ¡Correcto!":"❌ Incorrecto.")+'</p><button class="btn" onclick="qi++;showQ()">Siguiente →</button>'}
showQ();
