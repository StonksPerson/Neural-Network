enemyData = {x:0, vx:0 , y:0, vy:0};
time = Date();
d_time = Date(0);
input_n = [0,0,0];
output_n = [0,0,0];
neurons = [];
n_rows = 3;
n_colums = 2;
currentNeuron = [];
size = 50;
d_size = Math.sqrt((2 * (size * size)));
max_speed = 10;
max_turn = 0.1;


function start() {
    setInterval(Tick,1);
}


function createNeurons() {
    for(c = 0; c < n_colums; n++){
        for(r = 0; r < n_rows; r++){
            if(c == 0){
                for(i = 0; i < 3; i++){
                }
            }else{

            }
        }
    }
}

function Tick(){
    time = Date.UTC;
    enemyAI();
}


function enemyAI(){

    enemyData.vx += ((Math.random() - 0.5) * max_turn);
    enemyData.vy += ((Math.random() - 0.5) * max_turn);


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


    document.getElementById("enemy").style.bottom = "calc(" + String((enemyData.y - size)) + "px" + " +" + " 50vh)";
    document.getElementById("enemy").style.left = "calc(" + String((enemyData.x - size)) + "px" + " +" + " 50vw)";
    document.getElementById("enemy").style.rotate = String(Math.atan(enemyData.vx / enemyData.vy) * 57.2958) + "deg";
    document.getElementById("enemy").style.width = String(100) + "px";
    document.getElementById("enemy").style.height = String(100) + "px";

}