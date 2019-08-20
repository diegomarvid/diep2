class Player {

    constructor(initPack) {


        //Identifier
        this.id = initPack.id;

        //Position variables
        this.x = initPack.x;
        this.y = initPack.y;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.r = initPack.r;
        this.mouseAngle = 0;

        this.score = initPack.score;
        this.lvl = initPack.lvl;
        this.class = 'Tank';
        this.username = 'julianbox';

        this.upgradePoints = 0;

        //Habilities
        this.hpMax = initPack.hpMax;
        this.hp = this.hpMax;
        this.reload = 2;
        this.movementSpeed = 2;
        this.bodyDamage = 7;
        this.regen = 3 / 500;
        
        Player.list[this.id] = this;
    }

    show() {


        if(this.hp <= 0) {
            ctxUi.clearRect(x - 100 , y - 72, 200, 42)
        }

        let x = this.x - Player.list[selfId].x + WIDTH / 2;
        let y = this.y - Player.list[selfId].y + HEIGHT / 2;

        // ctxUi.clearRect(x - 100 , y - 72, 200, 42)
        // //ctxUi.strokeRect(x - 100 , y - 72, 200, 42)
        // //Draw username
        // ctxUi.font = '20px Lexend Exa';
        // ctxUi.fillStyle = 'black';
        // ctxUi.textAlign = 'center'
        // ctxUi.fillText(this.username, x, y - 50)


        ctx.save();

        ctx.translate(x, y);


        //Torreta
        if(this.id == selfId)
            ctx.rotate(clientAngle - Math.PI / 2);
        else
            ctx.rotate(this.mouseAngle - Math.PI / 2);

        ctx.fillStyle = torret_color;
        ctx.lineWidth = 3;

        ctx.fillRect(-torret_width / 2, 0, torret_width, torret_height);
        ctx.strokeStyle = torret_border_color;
        ctx.strokeRect(-torret_width / 2, 0, torret_width, torret_height)

        ctx.restore();

       

        if (this.hp <  this.hpMax) {

            let rectWidth = 60;
            let hpWidth = rectWidth * (this.hp / this.hpMax);
            if(hpWidth < 5) {
                hpWidth = 5;
            }
            //Adjust it to the left
            let xOffset = (rectWidth - hpWidth) / 2;

            //Draw HP
            //Fixed
            ctx.lineWidth = 1;
            ctx.strokeStyle = hp_bg;
            ctx.fillStyle = hp_bg;
            roundRect(ctx, x - hpWidth / 2 - xOffset, y + this.r + 10, rectWidth, 6, 3, true)

            //Variable

            ctx.fillStyle = hp_color;


            roundRect(ctx, x - hpWidth / 2 - xOffset, y + this.r + 10, hpWidth, 6, 3, true)
        }



        //Tank body
        ctx.fillStyle = blue;
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.arc(x, y, this.r, 0, 2 * Math.PI);
        ctx.fill();
        //Tank border
        ctx.strokeStyle = blue_border;
        ctx.stroke();







    }

}





Player.list = {};



class Bullet {

    constructor(initPack){
        
        this.speed = 15;

        this.x = initPack.x;
        this.y = initPack.y;

        this.r = initPack.r;

        this.timer = 0;
        this.toRemove = 0;

        this.id = initPack.id;

        this.damage = 5;
        this.penetration = 5;

        Bullet.list[this.id] = this;

    }

    show(){
        
        let x = this.x - Player.list[selfId].x + WIDTH / 2;
        let y = this.y - Player.list[selfId].y + HEIGHT / 2;
        
        ctx.fillStyle = blue;

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.arc(x, y, this.r ,0, 2* Math.PI);
        ctx.fill();
        ctx.strokeStyle = blue_border;
        ctx.stroke();


    }

  
    

}

Bullet.list = {}


