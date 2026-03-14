const playArea=document.getElementById("playArea")
const binsContainer=document.getElementById("bins")

let score=0
let time=300

const MAX_BALLS=7

const colorSets=[
["#ef4444","#3b82f6","#eab308"],
["#22c55e","#f97316","#ec4899"],
["#06b6d4","#a855f7","#facc15"]
]

const colorNames={
"#ef4444":"RED",
"#3b82f6":"BLUE",
"#eab308":"YELLOW",
"#22c55e":"GREEN",
"#f97316":"ORANGE",
"#ec4899":"PINK",
"#06b6d4":"CYAN",
"#a855f7":"PURPLE",
"#facc15":"GOLD"
}

let colorSet=colorSets[0]
let colorIndex=0
let balls=[]


/* ===== 控制游戏启动 ===== */

let gameStarted=false
let timerInterval=null

window.addEventListener("message",(event)=>{
if(event.data==="start_game"){
startGame()
}
})

function startGame(){

if(gameStarted) return

gameStarted=true

startTimer()

}

/* ===== 结束 ===== */


function random(min,max){
return Math.random()*(max-min)+min
}

class Ball{

constructor(){

this.color=colorSet[Math.floor(Math.random()*3)]

this.el=document.createElement("div")
this.el.className="ball ballSpawn"
this.el.style.background=this.color

this.x=random(80,780)
this.y=random(80,320)

this.vx=random(-0.25,0.25)
this.vy=random(-0.25,0.25)

this.dragging=false

this.update()

playArea.appendChild(this.el)

setTimeout(()=>{
this.el.classList.remove("ballSpawn")
},350)

this.enableDrag()

}

update(){
this.el.style.left=this.x+"px"
this.el.style.top=this.y+"px"
}

enableDrag(){

this.el.onmousedown=(e)=>{

this.dragging=true
this.el.style.zIndex=9999

let shiftX=e.clientX-this.x
let shiftY=e.clientY-this.y

const move=(e)=>{

this.x=e.clientX-shiftX
this.y=e.clientY-shiftY

this.update()

resolveCollisions()

highlightBins(e.clientX,e.clientY)

}

document.addEventListener("mousemove",move)

document.onmouseup=()=>{

document.removeEventListener("mousemove",move)

this.dragging=false
this.el.style.zIndex=100

removeHighlight()

checkDrop(this)

}

}

}

move(){

if(this.dragging)return

this.x+=this.vx
this.y+=this.vy

this.vx+=random(-0.01,0.01)
this.vy+=random(-0.01,0.01)

this.vx*=0.998
this.vy*=0.998

const maxY=340

if(this.x<0||this.x>840)this.vx*=-0.5
if(this.y<0)this.vy*=-0.5
if(this.y>maxY){
this.y=maxY
this.vy*=-0.3
}

this.update()

}

}

function resolveCollisions(){

for(let i=0;i<balls.length;i++){
for(let j=i+1;j<balls.length;j++){

let a=balls[i]
let b=balls[j]

let dx=a.x-b.x
let dy=a.y-b.y

let dist=Math.sqrt(dx*dx+dy*dy)

let minDist=48

if(dist<minDist){

let angle=Math.atan2(dy,dx)

let overlap=minDist-dist

let push=overlap*0.35

a.x+=Math.cos(angle)*push
a.y+=Math.sin(angle)*push

b.x-=Math.cos(angle)*push
b.y-=Math.sin(angle)*push

a.el.style.transform="scale(1.08)"
b.el.style.transform="scale(1.08)"

setTimeout(()=>{
a.el.style.transform="scale(1)"
b.el.style.transform="scale(1)"
},80)

}

}
}

}

function spawnBall(){

if(balls.length>=MAX_BALLS)return

let b=new Ball()
balls.push(b)

}

function spawnInitial(){
for(let i=0;i<6;i++)spawnBall()
}

spawnInitial()

function animate(){

balls.forEach(b=>b.move())

resolveCollisions()

requestAnimationFrame(animate)

}

animate()

function updateBins(){

binsContainer.innerHTML=""

colorSet.forEach(c=>{

let bin=document.createElement("div")

bin.className="bin"
bin.style.background=c
bin.dataset.color=c
bin.innerText=colorNames[c]

binsContainer.appendChild(bin)

})

}

updateBins()

function highlightBins(x,y){

document.querySelectorAll(".bin").forEach(bin=>{

let rect=bin.getBoundingClientRect()

if(x>rect.left&&x<rect.right&&y>rect.top&&y<rect.bottom){
bin.classList.add("active")
}else{
bin.classList.remove("active")
}

})

}

function removeHighlight(){
document.querySelectorAll(".bin").forEach(b=>b.classList.remove("active"))
}

function explode(x,y,color){

let playRect=playArea.getBoundingClientRect()

for(let i=0;i<18;i++){

let p=document.createElement("div")
p.className="particle"
p.style.background=color

let size=4+Math.random()*4

p.style.width=size+"px"
p.style.height=size+"px"

p.style.left=(x-playRect.left)+"px"
p.style.top=(y-playRect.top)+"px"

p.style.setProperty("--x",(Math.random()*120-60)+"px")
p.style.setProperty("--y",(Math.random()*120-60)+"px")

playArea.appendChild(p)

setTimeout(()=>p.remove(),600)

}

}

function flashScore(){

let s=document.getElementById("score")

s.classList.add("scoreFlash")

setTimeout(()=>{
s.classList.remove("scoreFlash")
},350)

}

function checkDrop(ball){

let bins=document.querySelectorAll(".bin")
let rectBall=ball.el.getBoundingClientRect()

bins.forEach(bin=>{

let rect=bin.getBoundingClientRect()

if(rectBall.left<rect.right &&
rectBall.right>rect.left &&
rectBall.top<rect.bottom &&
rectBall.bottom>rect.top){

let correct=ball.color===bin.dataset.color

if(correct){

score++
document.getElementById("score").innerText=score

explode(rect.left+rect.width/2,rect.top+rect.height/2,ball.color)

let index=balls.indexOf(ball)
if(index!==-1)balls.splice(index,1)

ball.el.remove()

setTimeout(()=>{
spawnBall()
},60)

}else{

score--
document.getElementById("score").innerText=score

flashScore()

bin.classList.add("shake")

setTimeout(()=>bin.classList.remove("shake"),300)

}

}

})

}

function showTransition(text){

let overlay=document.createElement("div")
overlay.className="transitionOverlay"
overlay.innerText=text

document.querySelector(".game").appendChild(overlay)

setTimeout(()=>{
overlay.remove()
},2000)

}

function changeColors(){

showTransition("New Colors!")

setTimeout(()=>{

colorIndex++

if(colorIndex>=colorSets.length){
colorIndex=0
}

colorSet=colorSets[colorIndex]

balls.forEach(b=>b.el.remove())
balls=[]

updateBins()
spawnInitial()

},2000)

}

setInterval(changeColors,30000)



/* ===== 修复 timer ===== */

function timer(){

if(!gameStarted) return

time--

let m=Math.floor(time/60)
let s=time%60

document.getElementById("time").innerText=
m+":"+(s<10?"0":"")+s

}

function startTimer(){

if(timerInterval!==null) return

timerInterval=setInterval(timer,1000)

}
