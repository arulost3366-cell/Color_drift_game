const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let bubbles=[]
let particles=[]

let score=0
let timeLeft=300

const colors=["blue","green","yellow","red","purple"]
let targetIndex=0

updateTargetUI()

function random(min,max){
return Math.random()*(max-min)+min
}

class Bubble{

constructor(forceColor=null){
this.x=random(80,canvas.width-80)
this.y=random(80,canvas.height-80)
this.radius=random(22,28)

this.color = forceColor ? forceColor :
colors[Math.floor(Math.random()*colors.length)]

this.vx=random(-0.4,0.4)
this.vy=random(-0.4,0.4)
}

move(){

this.x+=this.vx
this.y+=this.vy

if(this.x<40||this.x>canvas.width-40)this.vx*=-1
if(this.y<40||this.y>canvas.height-40)this.vy*=-1

}

draw(){

ctx.beginPath()
ctx.arc(this.x,this.y,this.radius,0,Math.PI*2)

ctx.fillStyle=this.color
ctx.shadowBlur=6
ctx.shadowColor="rgba(0,0,0,0.15)"

ctx.fill()

ctx.shadowBlur=0

}

}

class Particle{

constructor(x,y,color){
this.x=x
this.y=y
this.color=color
this.vx=random(-3,3)
this.vy=random(-3,3)
this.life=35
}

update(){
this.x+=this.vx
this.y+=this.vy
this.life--
}

draw(){

ctx.globalAlpha=this.life/35

ctx.fillStyle=this.color
ctx.beginPath()
ctx.arc(this.x,this.y,4,0,Math.PI*2)
ctx.fill()

ctx.globalAlpha=1

}

}

function spawnBubble(){

let targetColor = colors[targetIndex]

let chance = Math.random()

if(chance < 0.25){
bubbles.push(new Bubble(targetColor))
}else{
bubbles.push(new Bubble())
}

}

for(let i=0;i<8;i++){
spawnBubble()
}

canvas.addEventListener("click",function(e){

let mx=e.clientX
let my=e.clientY

bubbles.forEach((b,index)=>{

let dx=mx-b.x
let dy=my-b.y
let dist=Math.sqrt(dx*dx+dy*dy)

if(dist<b.radius){

if(b.color===colors[targetIndex]){

score++

for(let i=0;i<12;i++){
particles.push(new Particle(b.x,b.y,b.color))
}

}else{

score--

for(let i=0;i<12;i++){
particles.push(new Particle(b.x,b.y,"black"))
}

}

document.getElementById("score").innerText=score

bubbles.splice(index,1)

spawnBubble()

}

})

})

function update(){

ctx.clearRect(0,0,canvas.width,canvas.height)

bubbles.forEach(b=>{
b.move()
b.draw()
})

particles.forEach((p,index)=>{
p.update()
p.draw()
if(p.life<=0)particles.splice(index,1)
})

requestAnimationFrame(update)

}

update()

function updateTimer(){

timeLeft--

let min=Math.floor(timeLeft/60)
let sec=timeLeft%60

document.getElementById("time").innerText=
min+":"+(sec<10?"0":"")+sec

if(timeLeft<=0){
alert("Training finished")
}

}

setInterval(updateTimer,1000)

function updateTargetUI(){

let color=colors[targetIndex]

let target=document.getElementById("targetColor")

target.innerText=color.toUpperCase()
target.style.color=color

}

function changeTarget(){

targetIndex++

if(targetIndex>=colors.length){
targetIndex=0
}

updateTargetUI()

let notice=document.getElementById("colorChange")

let color=colors[targetIndex]

notice.innerText="NEW TARGET: "+color.toUpperCase()
notice.style.color=color

notice.style.animation="none"
notice.offsetHeight
notice.style.animation="fade 2s"

}

setInterval(changeTarget,60000)
