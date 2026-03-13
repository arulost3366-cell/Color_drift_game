const playArea = document.getElementById("playArea")

const colors=["blue","yellow","red"]

const MAX_BALLS=18
const START_BALLS=12

let balls=[]
let score=0
let time=300

const rules=["color","size"]
let ruleIndex=0
let currentRule=rules[0]

function random(min,max){
return Math.random()*(max-min)+min
}

class Ball{

constructor(){

this.color=colors[Math.floor(Math.random()*colors.length)]
this.size=Math.random()>0.5?"big":"small"

this.el=document.createElement("div")
this.el.className="ball "+this.color

let s=this.size==="big"?50:35

this.el.style.width=s+"px"
this.el.style.height=s+"px"

this.x=random(40,820)
this.y=random(40,420)

this.vx=random(-0.3,0.3)
this.vy=random(-0.3,0.3)

this.el.style.left=this.x+"px"
this.el.style.top=this.y+"px"

this.el.dataset.color=this.color
this.el.dataset.size=this.size

this.el.draggable=true

playArea.appendChild(this.el)

this.el.addEventListener("dragstart",e=>{
e.dataTransfer.setData("color",this.color)
e.dataTransfer.setData("size",this.size)
this.dragged=this
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

function spawnBall(){

if(balls.length>=MAX_BALLS)return

let b=new Ball()
balls.push(b)

}

for(let i=0;i<START_BALLS;i++){
spawnBall()
}

function animate(){

balls.forEach(b=>b.move())

requestAnimationFrame(animate)

}

animate()

const bins=document.querySelectorAll(".bin")

bins.forEach(bin=>{

bin.addEventListener("dragover",e=>e.preventDefault())

bin.addEventListener("drop",e=>{

e.preventDefault()

let color=e.dataTransfer.getData("color")
let size=e.dataTransfer.getData("size")

let correct=false

if(currentRule==="color"){
correct=color===bin.dataset.color
}

if(currentRule==="size"){
correct=size==="big"
}

if(correct){

score++
document.getElementById("score").innerText=score

explode(e.clientX,e.clientY,color)

spawnBall()

}else{

score--
document.getElementById("score").innerText=score

bin.classList.add("shake")

setTimeout(()=>bin.classList.remove("shake"),400)

}

})

})

function explode(x,y,color){

for(let i=0;i<20;i++){

let p=document.createElement("div")

p.className="particle"
p.style.background=color

p.style.left=x+"px"
p.style.top=y+"px"

p.style.setProperty("--x",random(-60,60)+"px")
p.style.setProperty("--y",random(-60,60)+"px")

playArea.appendChild(p)

setTimeout(()=>p.remove(),600)

}

}

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

function changeRule(){

ruleIndex++

if(ruleIndex>=rules.length){
ruleIndex=0
}

currentRule=rules[ruleIndex]

document.getElementById("rule").innerText=currentRule.toUpperCase()

}

setInterval(changeRule,30000)
