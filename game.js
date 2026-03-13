const playArea = document.getElementById("playArea")
const binsContainer = document.getElementById("bins")

let score=0
let time=300

const MAX_BALLS=18
const START_BALLS=12

let balls=[]

/* ---------- RULE SYSTEM ---------- */

const colorSets=[
["#3b82f6","#ef4444","#eab308"],
["#22c55e","#f97316","#ec4899"],
["#06b6d4","#a855f7","#facc15"]
]

const shapes=["circle","triangle","diamond"]

const rules=["color","shape"]

let ruleIndex=0
let currentRule="color"
let colorSetIndex=0
let currentColors=colorSets[0]

function random(min,max){
return Math.random()*(max-min)+min
}

/* ---------- BALL ---------- */

class Ball{

constructor(){

this.color=currentColors[Math.floor(Math.random()*3)]
this.shape=shapes[Math.floor(Math.random()*3)]

this.el=document.createElement("div")
this.el.className="ball"

this.el.style.background=this.color

if(this.shape==="triangle"){
this.el.style.clipPath="polygon(50% 0%,0% 100%,100% 100%)"
}

if(this.shape==="diamond"){
this.el.style.transform="rotate(45deg)"
}

this.x=random(40,820)
this.y=random(40,420)

this.vx=random(-0.3,0.3)
this.vy=random(-0.3,0.3)

this.el.style.left=this.x+"px"
this.el.style.top=this.y+"px"

playArea.appendChild(this.el)

this.enableDrag()

}

enableDrag(){

let ball=this

this.el.addEventListener("mousedown",function(e){

let shiftX=e.clientX-ball.el.offsetLeft
let shiftY=e.clientY-ball.el.offsetTop

function moveAt(x,y){
ball.el.style.left=x-shiftX+"px"
ball.el.style.top=y-shiftY+"px"
}

function onMouseMove(e){
moveAt(e.clientX,e.clientY)
}

document.addEventListener("mousemove",onMouseMove)

document.addEventListener("mouseup",function(){

document.removeEventListener("mousemove",onMouseMove)

checkDrop(ball)

},{once:true})

})

}

move(){

this.x+=this.vx
this.y+=this.vy

if(this.x<0||this.x>850)this.vx*=-1
if(this.y<0||this.y>450)this.vy*=-1

this.el.style.left=this.x+"px"
this.el.style.top=this.y+"px"

}

}

/* ---------- SPAWN ---------- */

function spawnBall(){

if(balls.length>=MAX_BALLS) return

let b=new Ball()

balls.push(b)

}

for(let i=0;i<START_BALLS;i++){
spawnBall()
}

/* ---------- ANIMATION ---------- */

function animate(){

balls.forEach(b=>b.move())

requestAnimationFrame(animate)

}

animate()

/* ---------- BINS ---------- */

function updateBins(){

binsContainer.innerHTML=""

if(currentRule==="color"){

currentColors.forEach(c=>{

let bin=document.createElement("div")

bin.className="bin"
bin.style.background=c
bin.dataset.color=c

bin.innerText="COLOR"

binsContainer.appendChild(bin)

})

}

if(currentRule==="shape"){

shapes.forEach(s=>{

let bin=document.createElement("div")

bin.className="bin"
bin.style.background="#444"

bin.dataset.shape=s

bin.innerText=s.toUpperCase()

binsContainer.appendChild(bin)

})

}

}

updateBins()

/* ---------- DROP CHECK ---------- */

function checkDrop(ball){

let bins=document.querySelectorAll(".bin")

let rectBall=ball.el.getBoundingClientRect()

bins.forEach(bin=>{

let rect=bin.getBoundingClientRect()

if(
rectBall.left<rect.right &&
rectBall.right>rect.left &&
rectBall.top<rect.bottom &&
rectBall.bottom>rect.top
){

let correct=false

if(currentRule==="color"){
correct=ball.color===bin.dataset.color
}

if(currentRule==="shape"){
correct=ball.shape===bin.dataset.shape
}

if(correct){

score++
document.getElementById("score").innerText=score

explode(rect.left+60,rect.top+40,ball.color)

ball.el.remove()
balls.splice(balls.indexOf(ball),1)

spawnBall()

}else{

score--
document.getElementById("score").innerText=score

bin.classList.add("shake")

setTimeout(()=>bin.classList.remove("shake"),350)

}

}

})

}

/* ---------- PARTICLES ---------- */

function explode(x,y,color){

for(let i=0;i<18;i++){

let p=document.createElement("div")

p.className="particle"

p.style.background=color

p.style.left=x+"px"
p.style.top=y+"px"

p.style.setProperty("--x",(Math.random()*120-60)+"px")
p.style.setProperty("--y",(Math.random()*120-60)+"px")

playArea.appendChild(p)

setTimeout(()=>p.remove(),600)

}

}

/* ---------- RULE CHANGE ---------- */

function changeRule(){

ruleIndex++

if(ruleIndex>=rules.length){
ruleIndex=0
}

currentRule=rules[ruleIndex]

if(currentRule==="color"){

colorSetIndex++

if(colorSetIndex>=colorSets.length){
colorSetIndex=0
}

currentColors=colorSets[colorSetIndex]

}

document.getElementById("rule").innerText=currentRule.toUpperCase()

updateBins()

}

setInterval(changeRule,30000)

/* ---------- TIMER ---------- */

function updateTimer(){

time--

let m=Math.floor(time/60)
let s=time%60

document.getElementById("time").innerText=
m+":"+(s<10?"0":"")+s

if(time<=0){
alert("Game Over")
}

}

setInterval(updateTimer,1000)
