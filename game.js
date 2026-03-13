const playArea = document.getElementById("playArea")

const colors = ["blue","yellow","red"]

let score = 0
let time = 300

function random(min,max){
return Math.random()*(max-min)+min
}

class Ball{

constructor(){

this.color = colors[Math.floor(Math.random()*colors.length)]

this.el = document.createElement("div")
this.el.className = "ball " + this.color
this.el.draggable = true

this.x = random(50,800)
this.y = random(50,400)

this.vx = random(-0.3,0.3)
this.vy = random(-0.3,0.3)

this.el.style.left = this.x+"px"
this.el.style.top = this.y+"px"

this.el.dataset.color = this.color

playArea.appendChild(this.el)

this.el.addEventListener("dragstart",e=>{
e.dataTransfer.setData("color",this.color)
e.dataTransfer.setData("id",this.el)
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

let balls=[]

function spawnBalls(){

for(let i=0;i<10;i++){
balls.push(new Ball())
}

}

spawnBalls()

function animate(){

balls.forEach(b=>{
b.move()
})

requestAnimationFrame(animate)

}

animate()

const bins = document.querySelectorAll(".bin")

bins.forEach(bin=>{

bin.addEventListener("dragover",e=>e.preventDefault())

bin.addEventListener("drop",e=>{

e.preventDefault()

let color = e.dataTransfer.getData("color")

if(color === bin.dataset.color){

score++

document.getElementById("score").innerText = score

spawnBalls()

}else{

score--

document.getElementById("score").innerText = score

bin.style.transform="scale(0.9)"

setTimeout(()=>{
bin.style.transform="scale(1)"
},200)

}

})

})

function updateTimer(){

time--

let m=Math.floor(time/60)
let s=time%60

document.getElementById("time").innerText =
m+":"+(s<10?"0":"")+s

if(time<=0){

alert("Time finished")

}

}

setInterval(updateTimer,1000)
