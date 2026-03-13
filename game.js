let score = 0

const colors = ["blue","yellow","red"]

const ballsContainer = document.getElementById("balls")
const bins = document.querySelectorAll(".bin")

function createBall(){

let color = colors[Math.floor(Math.random()*colors.length)]

let ball = document.createElement("div")
ball.className = "ball " + color
ball.draggable = true
ball.dataset.color = color

ball.addEventListener("dragstart", dragStart)

ballsContainer.appendChild(ball)

}

function spawnBalls(){

for(let i=0;i<8;i++){
createBall()
}

}

function dragStart(e){

e.dataTransfer.setData("color", e.target.dataset.color)
e.dataTransfer.setData("id", e.target)

}

bins.forEach(bin=>{

bin.addEventListener("dragover", e=>{
e.preventDefault()
})

bin.addEventListener("drop", dropBall)

})

function dropBall(e){

e.preventDefault()

let color = e.dataTransfer.getData("color")

let dragged = document.querySelector(".ball."+color)

if(!dragged) return

if(color === e.currentTarget.dataset.color){

score++

document.getElementById("score").innerText = score

dragged.remove()

createBall()

}else{

dragged.style.transform = "scale(0.8)"

setTimeout(()=>{
dragged.style.transform="scale(1)"
},200)

}

}

spawnBalls()
