const playArea=document.getElementById("playArea")
const binsContainer=document.getElementById("bins")

let score=0
let time=300

const MAX_BALLS=12

const icons=["★","●","◆"]

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

let rule="color"
let colorSet=colorSets[0]
let colorIndex=0

let balls=[]

function random(min,max){
return Math.random()*(max-min)+min
}

class Ball{

constructor(){

this.color=colorSet[Math.floor(Math.random()*3)]
this.icon=icons[Math.floor(Math.random()*3)]

this.el=document.createElement("div")
this.el.className="ball"
this.el.style.background=this.color

if(rule==="icon"){
this.el.innerText=this.icon
}

this.x=random(40,820)
this.y=random(40,420)

this.vx=random(-.4,.4)
this.vy=random(-.4,.4)

this.dragging=false

this.update()

playArea.appendChild(this.el)

this.enableDrag()

}

update(){
this.el.style.left=this.x+"px"
this.el.style.top=this.y+"px"
}

enableDrag(){

this.el.onmousedown=(e)=>{

this.dragging=true

let shiftX=e.clientX-this.x
let shiftY=e.clientY-this.y

const move=(e)=>{

this.x=e.clientX-shiftX
this.y=e.clientY-shiftY

this.update()

}

document.addEventListener("mousemove",move)

document.onmouseup=()=>{

document.removeEventListener("mousemove",move)

this.dragging=false

checkDrop(this)

}

}

}

move(){

if(this.dragging) return

this.x+=this.vx
this.y+=this.vy

if(this.x<0||this.x>850) this.vx*=-1
if(this.y<0||this.y>450) this.vy*=-1

this.update()

}

}

function spawnBall(){

if(balls.length>=MAX_BALLS) return

let b=new Ball()

balls.push(b)

}

function spawnInitial(){

for(let i=0;i<10;i++) spawnBall()

}

spawnInitial()

function animate(){

balls.forEach(b=>b.move())

requestAnimationFrame(animate)

}

animate()

function updateBins(){

binsContainer.innerHTML=""

if(rule==="color"){

colorSet.forEach(c=>{

let bin=document.createElement("div")

bin.className="bin"
bin.style.background=c
bin.dataset.color=c

bin.innerText=colorNames[c]

binsContainer.appendChild(bin)

})

}

if(rule==="icon"){

icons.forEach(i=>{

let bin=document.createElement("div")

bin.className="bin"
bin.style.background="#444"
bin.dataset.icon=i

bin.innerText=i

binsContainer.appendChild(bin)

})

}

}

updateBins()

function explode(x,y,color){

for(let i=0;i<16;i++){

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

if(rule==="color") correct=ball.color===bin.dataset.color
if(rule==="icon") correct=ball.icon===bin.dataset.icon

if(correct){

score++
document.getElementById("score").innerText=score

explode(rect.left+60,rect.top+40,ball.color)

ball.el.remove()

balls.splice(balls.indexOf(ball),1)

spawnBall()

}else{

score--

bin.classList.add("shake")

setTimeout(()=>bin.classList.remove("shake"),300)

}

}

})

}

function clearBalls(){

balls.forEach(b=>b.el.remove())
balls=[]

}

function transition(){

let t=document.createElement("div")

t.className="transition"
t.innerText=rule==="color" ? "SORT BY ICON" : "SORT BY COLOR"

playArea.appendChild(t)

setTimeout(()=>t.remove(),2000)

}

function changeRule(){

transition()

setTimeout(()=>{

rule = rule==="color" ? "icon" : "color"

if(rule==="color"){

colorIndex++

if(colorIndex>=colorSets.length) colorIndex=0

colorSet=colorSets[colorIndex]

}

clearBalls()

updateBins()

spawnInitial()

document.getElementById("ruleLabel").innerText=
rule==="color"?"SORT BY COLOR":"SORT BY ICON"

},2000)

}

setInterval(changeRule,30000)

function timer(){

time--

let m=Math.floor(time/60)
let s=time%60

document.getElementById("time").innerText=
m+":"+(s<10?"0":"")+s

if(time<=0) alert("Game Over")

}

setInterval(timer,1000)
