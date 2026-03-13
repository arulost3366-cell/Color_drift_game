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

document.getElementById("targetColor").innerText = colors[targetIndex].toUpperCase()

function random(min,max){
return Math.random()*(max-min)+min
}

class Bubble{

constructor(){
this.x=random(50,canvas.width-50)
this.y=random(50,canvas.height-50)
this.radius=random(20,30)
this.color=colors[Math.floor(Math.random()*colors.length)]
this.vx=random(-0.5,0.5)
this.vy=random(-0.5,0.5)
}

move(){
this.x+=this.vx
this.y+=this.vy

if(this.x<0||this.x>canvas.width)this.vx*=-1
if(this.y<0||this.y>canvas.height)this.vy*=-1
}

draw(){
ctx.beginPath()
ctx.arc(this.x,this.y,this.radius,0,Math.PI*2)
ctx.fillStyle=this.color
ctx.shadowBlur=20
ctx.shadowColor=this.color
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
this.life=40
}

update(){
this.x+=this.vx
this.y+=this.vy
this.life--
}

draw(){
ctx.fillStyle=this.color
ctx.beginPath()
ctx.arc(this.x,this.y,4,0,Math.PI*2)
ctx.fill()
}

}

for(let i=0;i<8;i++){
bubbles.push(new Bubble())
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
}
else{
score--
}

document.getElementById("score").innerText=score

for(let i=0;i<15;i++){
particles.push(new Particle(b.x,b.y,b.color))
}

bubbles.splice(index,1)
bubbles.push(new Bubble())

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

function changeTarget(){

targetIndex++

if(targetIndex>=colors.length)targetIndex=colors.length-1

let newColor=colors[targetIndex]

document.getElementById("targetColor").innerText=newColor.toUpperCase()

let notice=document.getElementById("colorChange")

notice.innerText="NEW TARGET: "+newColor.toUpperCase()
notice.style.color=newColor
notice.style.animation="none"
notice.offsetHeight
notice.style.animation="fade 2s"

}

setInterval(changeTarget,60000)
