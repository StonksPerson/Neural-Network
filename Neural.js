var enemyData = {x:0, vx:0 , y:0, vy:0};
const enemy = document.getElementById("enemy");
// const network = document.getElementById("network");
// var networkData = {x: 0, y: 0, rot: 0, v: 0};
var time = 0;
var d_time = 0;
const input_n = 2;
const output_n = 2;
const n_rows = 4;
const n_colums = 2;
var currentNeuron = [];
const size = 50;
const d_size = Math.sqrt((2 * (size * size)));
const max_speed = 2;
const max_turn = 0.1;
started = true;
var networkData = [];
var savedNetwork = localStorage.getItem("best");
var bestAI = savedNetwork === null ? createNetwork(): createNetwork(JSON.parse(savedNetwork));
var bestScore = 0;
const bulkTrain = 5;
d_time = time;
for(var i = 0; i < bulkTrain; i++){
    networkData.push(bestAI.copy());
}
setInterval(Tick,1);

function newGen() {
    var currentBestScore = -10000000;
    var currentBestAi = {};

    for(var j = 0; j < networkData.length; j++){
        var score = networkData[j].network.score;
        if(currentBestScore < score){
            currentBestScore = score;
            currentBestAi = networkData[j];
        }
    }

    
    bestScore = currentBestScore;
    bestAI = currentBestAi;
    

    for(var n = 0; n < networkData.length; n++){
        if(networkData[n] != bestAI){
            networkData[n].delete();
        }
    }

    networkData = [bestAI];
    d_time = time;
    bestAI.network.x = 0;
    bestAI.network.y = 0;
    bestAI.network.v = 0;
    bestAI.network.rot = 0;
    bestAI.network.score = 0;
    for(var i = 0; i < bulkTrain - 1; i++){
        networkData.push(bestAI.copy());
    }

    localStorage.setItem("best", JSON.stringify(bestAI.network));

}

function createNetwork (baseNetwork) {

    var network = { neurons: [], x: 0, y: 0, rot: 0, v: 0, icon: null, gen: 0, score: 0 };
    createNeurons(network);
    createIcon(network);
    if(baseNetwork){
        for(var i = 2; i < baseNetwork.neurons.length; i++){
            for(var j = 0; j < baseNetwork.neurons[i].connections.length; j++){
                network.neurons[i].connections[j].wt = baseNetwork.neurons[i].connections[j].wt;
            }
        }
        network.gen = (baseNetwork.gen ?? 0) + 1;
        modifyWeights(network);
    }else {
        scrambleBrain(network);
    }
    
    return {
        setInput: function (input) {
            for(var i = 0; i < input.length; i++){
                network.neurons[i].charge = input[i];
            }
        },
        update: function(){

            for(var i = input_n; i < network.neurons.length; i++){
                network.neurons[i].charge = 0;
            }
    

            for(var i = input_n; i < network.neurons.length; i++){
                for(var e = 0; e < network.neurons[i].connections.length; e++){
                    network.neurons[i].charge += (network.neurons[(network.neurons[i].connections[e].ref)].charge * network.neurons[i].connections[e].wt);
                }
                network.neurons[i].charge = network.neurons[i].charge / network.neurons[i].connections.length;
            }
            
            network.v = network.neurons[network.neurons.length - output_n].charge * max_speed;
            network.v = Math.max(Math.min(network.v, max_speed), -max_speed);
            network.rot += network.neurons[network.neurons.length - output_n + 1].charge * max_turn;
            network.x = Math.max(Math.min((network.x + Math.cos(network.rot) * network.v), window.innerWidth / 2), -(window.innerWidth / 2));
            network.y = Math.max(Math.min((network.y + Math.sin(network.rot) * network.v), window.innerHeight / 2), -(window.innerHeight / 2));
            network.icon.style.bottom = "calc(" + String((network.y - size)) + "px" + " +" + " 50vh)";
            network.icon.style.left = "calc(" + String((network.x - size)) + "px" + " +" + " 50vw)";
            network.icon.style.rotate = String(-(network.rot * 57.2958 + 90)) + "deg";
            network.icon.style.width = String(100) + "px";
            network.icon.style.height = String(100) + "px";
        },
        delete: function(){
            network.icon.remove()
        },
        copy: function(){
            return(createNetwork(network))
        },
        calcScore: function(){
            network.score +=  1 - Math.abs((Math.atan2((network.y - enemyData.y), (network.x - enemyData.x)) - network.rot) / Math.PI);
            network.score += 1 - Math.sqrt(Math.pow(network.y - enemyData.y, 2) + Math.pow(network.x - enemyData.x, 2)) / Math.max(window.innerWidth, window.innerHeight);
        },
        network: network
    }
}

function modifyWeights(network) {
    for(var i = 2; i < network.neurons.length; i++){
        for(var j = 0; j < network.neurons[i].connections.length; j++){
            network.neurons[i].connections[j].wt += Math.max(Math.min((Math.random() - 0.5) / 10, 1), -1);
        }
    }
}

function createNeurons(network) {

    for(var i = 0; i < input_n; i++){
        network.neurons.push({charge: 0});
    }

    for(var c = 0; c < n_colums; c++){
        for(var r = 1; r < n_rows + 1; r++){
            if(c > 0){
                for(var i = 0; i < n_rows; i++){
                    currentNeuron.push({ ref : (i + input_n + ((c - 1) * n_rows)), wt : 0})
                }
                network.neurons.push({ connections: currentNeuron, charge: 0})
                currentNeuron = []
            }else{
                for(var i = 0; i < input_n; i ++){
                    currentNeuron.push({ ref : i, wt : 0})
                }
                network.neurons.push({ connections: currentNeuron, charge: 0})
                currentNeuron = []
            }
        }
    }

    for(var o = 0; o < output_n; o++){
        for(var e = 0; e < n_rows; e++){
            currentNeuron.push({ ref : e + ((n_rows * (n_colums - 1)) + input_n), wt : 0})
        }
        network.neurons.push({ connections: currentNeuron, charge: 0})
        currentNeuron = [];
    }

}

function scrambleBrain(network) {
    for(var i = input_n; i < network.neurons.length; i++){
        for(var s = 0; s < network.neurons[i].connections.length; s++){
            network.neurons[i].connections[s].wt += Math.floor(((Math.random() * 2) - 1) * 100) / 100;
        }
    }
}

function createIcon(network){
    var icon = document.createElement("div");
    icon.setAttribute("class", "network");
    document.body.appendChild(icon);
    network.icon = icon;
}

function Tick() {
    time = Date.now();
    if(time > d_time + 10000){
        newGen();
    }
    enemyAI()
    networkTick()
}

function networkTick() {
    for(var n = 0; n < networkData.length; n++){

        var input = [
            ((Math.atan2((networkData[n].network.y - enemyData.y), (networkData[n].network.x - enemyData.x)) - networkData[n].network.rot) / Math.PI),
            (Math.floor(Math.sqrt((Math.pow(networkData[n].network.y - enemyData.y, 2)) + Math.pow(networkData[n].network.x - enemyData.x, 2)) * 100) / 100) / Math.min(window.innerWidth, window.innerHeight)
        ];

        networkData[n].setInput(input);
        networkData[n].update();
        networkData[n].calcScore();
    }


}


function enemyAI(){

    enemyData.vx += ((Math.random() - 0.5) * max_turn)
    enemyData.vy += ((Math.random() - 0.5) * max_turn)


    if (Math.abs(enemyData.vx) > max_speed) {
        enemyData.vx = (enemyData.vx / enemyData.vx) * max_speed;
    }

    if (Math.abs(enemyData.vy) > max_speed) {
        enemyData.vy = (enemyData.vy / enemyData.vy) * max_speed;
    }

    if (Math.abs(enemyData.x + enemyData.vx) + d_size < window.innerWidth / 2) {
        enemyData.x += enemyData.vx;
    } else {
        enemyData.vx = -enemyData.vx;
    }

    if (Math.abs(enemyData.y + enemyData.vy) + d_size < window.innerHeight / 2) {
        enemyData.y += enemyData.vy;
    } else {
        enemyData.vy = -enemyData.vy;
    }


    enemy.style.bottom = "calc(" + String((enemyData.y - size)) + "px" + " +" + " 50vh)";
    enemy.style.left = "calc(" + String((enemyData.x - size)) + "px" + " +" + " 50vw)";
    enemy.style.rotate = String(Math.atan(enemyData.vx / enemyData.vy) * 57.2958) + "deg";
    enemy.style.width = String(100) + "px";
    enemy.style.height = String(100) + "px";
}