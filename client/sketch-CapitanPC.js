


//Map and Tank

let mapImg = new Image();
mapImg.src = '/client/resources/tutorial5.png';

//CANVAS

let WIDTH = 1520;
let HEIGHT = 855;
let CANVAS_WIDTH = 1520;
let CANVAS_HEIGHT = 855;

let initCanvas = false;

let clientAngle = 0;


let canvas = document.getElementById('canvas')
var ctx = canvas.getContext("2d");


let canvasUi = document.getElementById("canvas-ui");
let ctxUi = canvasUi.getContext("2d");
ctxUi.font = '30px Ubuntu';
ctx.font = '20px Ubuntu';





//STATS

let lastScore = null;
let showUpgrades = false;
let showUpgradesCounter = 0;

let drawUserStats = function () {

    if(loginState) return;

    //Draw username
    ctxUi.font = '35px Ubuntu';
    ctxUi.fillStyle = 'white';
    ctxUi.textAlign = 'center'
    ctxUi.fillText(Player.list[selfId].username, WIDTH / 2, HEIGHT - 112);
    ctxUi.strokeStyle = 'black';
    ctxUi.lineWidth = 2;
    ctxUi.strokeText(Player.list[selfId].username, WIDTH / 2, HEIGHT - 112)

}


// RESIZE LOGIC

let resizeCanvas = function () {

    //if(!selfId) return;

    CANVAS_WIDTH = window.innerWidth;
    CANVAS_HEIGHT = window.innerHeight;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    canvasUi.width = WIDTH;
    canvasUi.height = HEIGHT;

    //Keeping the ratio
    let ratio = 16 / 9;
    if (CANVAS_WIDTH / ratio > CANVAS_HEIGHT) {
        CANVAS_WIDTH = CANVAS_HEIGHT * ratio;
    } else {
        CANVAS_HEIGHT = CANVAS_WIDTH / ratio;
    }

    canvas.style.width = `${CANVAS_WIDTH}px`;
    canvas.style.height = `${CANVAS_HEIGHT}px`;

    canvasUi.style.width = `${CANVAS_WIDTH}px`;
    canvasUi.style.height = `${CANVAS_HEIGHT}px`;


    
    drawUserStats();
    drawScore(true);
    
    


}

window.addEventListener('resize', function () {
    resizeCanvas();
})

//Init
let initGame = setInterval(function(){
    if(selfId){
        console.log('got id')
        clearInterval(initGame);
        initCanvas = true;
        WIDTH += 16 * Player.list[selfId].fov;
        HEIGHT += 9 * Player.list[selfId].fov;
        resizeCanvas();
    }
},20)


//Main Loop
setInterval(function () {

    if(!initCanvas) return;

    ctx.clearRect(0, 0, WIDTH, HEIGHT)

    drawMap();

    drawScore();


    for(let i in Player.list) {
        Player.list[i].show();
    }

    for(let i in Bullet.list) {
        Bullet.list[i].show();
    }

    displayUpgrades();

}, 18)


document.onkeydown = function (event) {


    //Enter username
    if(event.keyCode === 13 && loginState) {
        let username_text = document.getElementById('username').value;
        if(username_text.length <= 2) return;
        socket.emit('logIn', {username: username_text});
    }

    if(!selfId){
        return;
    }

    myPlayer = Player.list[selfId];

    if(event.keyCode === 68)
        socket.emit('keyPress', {inputId: 'right', state: true});      
    else if(event.keyCode === 65)    
        socket.emit('keyPress', {inputId: 'left', state: true});    
    else if(event.keyCode === 83)    
        socket.emit('keyPress', {inputId: 'down', state: true})
    else if(event.keyCode === 87)    
        socket.emit('keyPress', {inputId: 'up', state: true});
    else if(event.keyCode === 69) {
        myPlayer.autoFire = !myPlayer.autoFire;
        socket.emit('keyPress', {inputId: 'autoFire', state: myPlayer.autoFire});
    }        
    else if(event.keyCode === 67) {
        myPlayer.autoSpin = !myPlayer.autoSpin;
        socket.emit('keyPress', {inputId: 'autoSpin', state: myPlayer.autoSpin }); 
    }
        
    
}

document.onkeyup = function (event) {

    if(!selfId){
        return;
    }

    if(event.keyCode === 68)
        socket.emit('keyPress', {inputId: 'right', state: false});
    else if(event.keyCode === 65)    
        socket.emit('keyPress', {inputId: 'left', state: false});    
    else if(event.keyCode === 83)    
        socket.emit('keyPress', {inputId: 'down', state: false})
    else if(event.keyCode === 87)    
        socket.emit('keyPress', {inputId: 'up', state: false});

}

document.onmousedown = function (event) {
    if(!selfId){
        return;
    }

    socket.emit('keyPress', {inputId: 'attack', state: true});
}

document.onmouseup = function (event) {
    if(!selfId){
        return;
    }

    socket.emit('keyPress', {inputId: 'attack', state: false});
}

document.onmousemove = function (event) {

    if(!selfId ) {
        return;
    }

    if(Player.list[selfId].autoSpin) return;
    


    //if (!tank.autoSpin) {
    let angle = Math.atan2((-CANVAS_HEIGHT / 2 + event.clientY), (-CANVAS_WIDTH / 2 + event.clientX));
    //}
    clientAngle = angle;

    Player.list[selfId].mouseAngle = angle;

    socket.emit('keyPress', {inputId: 'mouseAngle', state: angle});


}

document.oncontextmenu = function(event) {
    event.preventDefault();
}


function drawMap() {
    let x = WIDTH / 2 - Player.list[selfId].x;
    let y = HEIGHT / 2 - Player.list[selfId].y;

    ctx.drawImage(mapImg, 0, 0, mapImg.width, mapImg.height, x, y, mapImg.width, mapImg.height)
}

function drawMiniMap() {

}


function drawScore(resizing) {


    if(!selfId) return;

    if (lastScore === Player.list[selfId].score && !resizing) return;

    let myTank = Player.list[selfId];

    lastScore = myTank.score;

    if (lastScore >= lvlScore[myTank.lvl]) {
        myTank.lvl++;
        if (myTank.lvl % 1 === 0) {
            myTank.upgradePoints += 2;
            showUpgrades = true;
        }
    }

    //Clearing
    ctxUi.clearRect(WIDTH / 2 - 160, HEIGHT - 102, 320, 38);

    //Score bg
    ctxUi.fillStyle = lvl_bg_color;
    roundRect(ctxUi, WIDTH / 2 - 125, HEIGHT - 102, 250, 15, 8, true, false);

    //Score txt
    ctxUi.font = '13px Ubuntu';
    ctxUi.fillStyle = 'white';
    ctxUi.fillText(`Score: ${myTank.score}`, WIDTH / 2, HEIGHT - 90);
    ctxUi.strokeStyle = 'black';
    ctxUi.lineWidth = 0.5;
    ctxUi.strokeText(`Score: ${myTank.score}`, WIDTH / 2, HEIGHT - 90)

    //lvl bg
    ctxUi.fillStyle = lvl_bg_color;
    roundRect(ctxUi, WIDTH / 2 - 160, HEIGHT - 84, 320, 20, 11, true, false);

    //dynamic lvl bg
    ctxUi.fillStyle = lvl_color;

    let maxLength = 317;

    let maxScore = lvlScore[myTank.lvl];
    let previusMaxScore = lvlScore[myTank.lvl - 1];

    let myScoreDif = myTank.score - lvlScore[myTank.lvl - 1];

    let length = (myScoreDif / (maxScore - previusMaxScore)) * maxLength;

    if (length < 15) {
        length = 15;
    }

    roundRect(ctxUi, WIDTH / 2 - 159, HEIGHT - 82, length, 16, 10, true, false);

    //lvl txt
    ctxUi.font = '14px Ubuntu';
    ctxUi.fillStyle = 'white';
    ctxUi.fillText(`Lvl ${myTank.lvl} ${myTank.class}`, WIDTH / 2, HEIGHT - 70);
    ctxUi.strokeStyle = 'black';
    ctxUi.lineWidth = 0.7;
    ctxUi.strokeText(`Lvl ${myTank.lvl} ${myTank.class}`, WIDTH / 2, HEIGHT - 70);

    
    

}

let lastUpgrade = null;

function displayUpgrades(resizing) {

    if(!selfId) return;

    let tank = Player.list[selfId];

    if(tank.upgradePoints !== lastUpgrade) {
        ctxUi.clearRect(35, HEIGHT - 315, 335, 290);
        showUpgradesCounter = 0;
    }

    if (showUpgradesCounter > 300) {
        showUpgrades = false;
        showUpgradesCounter = 0;
        ctxUi.clearRect(35, HEIGHT - 315, 335, 290);
        return;      
    }

    if (showUpgrades) {

        lastUpgrade = tank.upgradePoints;

        showUpgradesCounter++;
        
        ctxUi.save();

        ctxUi.translate(355,  HEIGHT - 290);
    
        ctxUi.rotate( - Math.PI / 6)

        //Upgrade points
        ctxUi.fillStyle = 'white';
        ctxUi.font = '25px Ubuntu';
        ctxUi.fillText(`x${tank.upgradePoints}`, 0, 0)
        ctxUi.strokeStyle = 'black';
        ctxUi.lineWidth = 1;
        ctxUi.strokeText(`x${tank.upgradePoints}`, 0, 0);

        ctxUi.restore();

        
        let y;

        for(let i in upg_color_list) {

            

            y = HEIGHT - (9 - i) * 32;

            //Color rect
            ctxUi.fillStyle = upg_color_list[i].color;
            ctxUi.strokeStyle = upg_color;
            ctxUi.lineWidth = 2;
            roundRect(ctxUi, 270, y - 30, 60, 25, 15, true, true);

            //Background
            
            ctxUi.fillStyle = upg_color;
            roundRect2(ctxUi, 40, y - 30, 260, 25, 15, true, true);

            //Star
            ctxUi.fillStyle = upg_color;
            ctxUi.fillRect(300, y - 30 + 10, 15, 5);
            ctxUi.fillRect(305, y - 30 + 5, 5, 15);

            //Text
            ctxUi.fillStyle = 'white';
            ctxUi.font = '14px Ubuntu';
            ctxUi.fillText(upg_color_list[i].text, 360 / 2, y - 14);
            ctxUi.fillText(`[${i}]`, 267, y - 14);

            

        
        }
    
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = {
            tl: radius,
            tr: radius,
            br: radius,
            bl: radius
        };
    } else {
        var defaultRadius = {
            tl: 0,
            tr: 0,
            br: 0,
            bl: 0
        };
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }

}

function roundRect2(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = {
            tl: radius,
            tr: radius,
            br: radius,
            bl: radius
        };
    } else {
        var defaultRadius = {
            tl: 0,
            tr: 0,
            br: 0,
            bl: 0
        };
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }

    ctx.save();

    ctx.translate(x + width / 2, y + height / 2);

    ctx.rotate(Math.PI)

    //x -> - width / 2
    //y -> - height / 2

    ctx.beginPath();
    ctx.moveTo(- width / 2 + radius.tl, - height / 2);
    ctx.lineTo(width / 2 - radius.tr, - height / 2);
    ctx.quadraticCurveTo(width / 2, - height / 2, width / 2, -height / 2 + radius.tr);
    ctx.lineTo(width / 2, height / 2 - radius.br);
    ctx.quadraticCurveTo(width / 2, height / 2, width / 2 - radius.br, height / 2);
    ctx.lineTo(-width / 2 + radius.bl, height / 2);
    
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }

    ctx.restore();


}

function sortedIndex(array, value) {
	var low = 0,
		high = array.length;

	while (low < high) {
		var mid = low + high >>> 1;
		if (array[mid] < value) low = mid + 1;
		else high = mid;
	}
	return low;
}

function isInRanking(player) {
    for(let i in ranking) {
        if(ranking[i].id = player.id) return true;
    }
    return false;
}