var enemyData = {x:0, vx:0 , y:0, vy:0}
const enemy = document.getElementById("enemy")
const network = document.getElementById("network")
var networkData = {x: 0, vx: 0, y: 0, vy: 0, rot: 0}
var time = Date()
var d_time = Date(0)
const input_n = 2
const output_n = 2
var neurons = []
const n_rows = 4
const n_colums = 2
var currentNeuron = []
const size = 50
const d_size = Math.sqrt((2 * (size * size)))
const max_speed = 10
const max_turn = 0.1
var started = false


if(started === false){
    started = true
    createNeurons()
    setInterval(Tick,1)
    document.getElementById("test").innerHTML = neurons[1];
    scrambleBrain()
}

function createNeurons() {

    for(i = 0; i < input_n; i++){
        neurons.push(0);
    }

    for(c = 0; c < n_colums; c++){
        for(r = 1; r < n_rows + 1; r++){
            if(c > 0){
                for(i = 0; i < n_rows; i++){
                    currentNeuron.push({ ref : (i + input_n + ((c - 1) * n_rows)), wt : 0})
                }
                neurons.push({ connections: currentNeuron, charge: 0})
                currentNeuron = []
            }else{
                for(i = 0; i < input_n; i ++){
                    currentNeuron.push({ ref : i, wt : 0})
                }
                neurons.push({ connections: currentNeuron, charge: 0})
                currentNeuron = []
            }
        }
    }


    for(o = 0; o < output_n; o++){
        for(i = 0; i < output_n; i ++){
            for(i = 0; i < n_rows; i++){
                currentNeuron.push({ ref : i + ((n_rows * (n_colums - 1)) + input_n), wt : 0})
            }
        }
    }

}

function scrambleBrain() {
    for(i = input_n; i < neurons.length - input_n; i++){
        for(s = 0; s < neurons[i].connections.length; s++){
            neurons[i].connections[s].wt = (Math.random());
        }
    }
}

function Tick() {
    time = Date.UTC;
    enemyAI()
    networkTick()
}

function networkTick() {
    neurons[0] = (Math.atan((networkData.y - enemyData.y)/(networkData.x - enemyData.x)));
    neurons[1] = Math.sqrt(((networkData.y - enemyData.y)^2) + ((networkData.x - enemyData.x)^2));

    for(i = input_n; i < neurons.length; i++){
        for(e = 0; e < neurons[i].connections.length; i++){
            neurons[i].charge += neurons[neurons[i].connections[e].ref].charge * neurons[i].connections[e].wt
        }
    }

    network.style.bottom = "calc(" + String((networkData.y - size)) + "px" + " +" + " 50vh)"
    network.style.left = "calc(" + String((networkData.x - size)) + "px" + " +" + " 50vw)"
    network.style.rotate = String(networkData.rot) + "deg"
    network.style.width = String(100) + "px"
    network.style.height = String(100) + "px"

}


function enemyAI(){

    enemyData.vx += ((Math.random() - 0.5) * max_turn)
    enemyData.vy += ((Math.random() - 0.5) * max_turn)


    if (Math.abs(enemyData.vx) > max_speed) {
        enemyData.vx = (enemyData.vx / enemyData.vx) * max_speed
    }

    if (Math.abs(enemyData.vy) > max_speed) {
        enemyData.vy = (enemyData.vy / enemyData.vy) * max_speed
    }

    if (Math.abs(enemyData.x + enemyData.vx) + d_size < window.innerWidth / 2) {
        enemyData.x += enemyData.vx
    } else {
        enemyData.vx = -enemyData.vx
    }

    if (Math.abs(enemyData.y + enemyData.vy) + d_size < window.innerHeight / 2) {
        enemyData.y += enemyData.vy
    } else {
        enemyData.vy = -enemyData.vy
    }


    enemy.style.bottom = "calc(" + String((enemyData.y - size)) + "px" + " +" + " 50vh)"
    enemy.style.left = "calc(" + String((enemyData.x - size)) + "px" + " +" + " 50vw)"
    enemy.style.rotate = String(Math.atan(enemyData.vx / enemyData.vy) * 57.2958) + "deg"
    enemy.style.width = String(100) + "px"
    enemy.style.height = String(100) + "px"

}