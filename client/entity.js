class Player {

    constructor(initPack) {


        //Identifier
        this.id = initPack.id;
        this.username = initPack.username;

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
        

        this.upgradePoints = 0;

        this.autoFire = false;
        this.autoSpin = false;

        //Habilities
        this.hpMax = initPack.hpMax;
        this.hp = this.hpMax;
        this.reload = 2;
        this.movementSpeed = 2;
        this.bodyDamage = 7;
        this.regen = 3 / 500;
        this.fov = initPack.fov;

        Player.list[this.id] = this;
    }

    show() {


        if (this.hp <= 0) {
            ctxUi.clearRect(x - 100, y - 72, 200, 42)
        }

        let x = this.x - Player.list[selfId].x + WIDTH / 2;
        let y = this.y - Player.list[selfId].y + HEIGHT / 2;



        ctx.save();

        ctx.translate(x, y);


        //Torreta
        if (this.id == selfId && !this.autoSpin) {
            ctx.rotate(clientAngle - Math.PI / 2);
        }
        else {
            ctx.rotate(this.mouseAngle - Math.PI / 2);
        }


        ctx.fillStyle = torret_color;
        ctx.lineWidth = 3;

        ctx.fillRect(-torret_width / 2, 0, torret_width, torret_height);
        ctx.strokeStyle = torret_border_color;
        ctx.strokeRect(-torret_width / 2, 0, torret_width, torret_height)

        ctx.restore();



        if (this.hp < this.hpMax) {

            let rectWidth = 60;
            let hpWidth = rectWidth * (this.hp / this.hpMax);
            if (hpWidth < 5) {
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
        if (this.id == selfId) {
            ctx.fillStyle = blue;
            ctx.strokeStyle = blue_border;
        }
        else {
            ctx.fillStyle = red;
            ctx.strokeStyle = red_border;
        }
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.arc(x, y, this.r, 0, 2 * Math.PI);
        ctx.fill();
        //Tank border

        ctx.stroke();



        //Draw username
        ctx.font = '25px Ubuntu';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.textAlign = 'center';
        ctx.lineWidth = 1.2;
        if (this.id !== selfId) {
            ctx.fillText(this.username, x, y - 60);
            ctx.strokeText(this.username, x, y - 60);
            ctx.font = '20px Ubuntu';
            ctx.lineWidth = 1.0;
            ctx.fillText(this.score, x, y - 35);
            ctx.strokeText(this.score, x, y - 35);
        }


    }

}





Player.list = {};



class Bullet {

    constructor(initPack) {

        this.speed = 15;

        this.x = initPack.x;
        this.y = initPack.y;

        this.r = initPack.r;
        this.parent = initPack.parent;

        this.timer = 0;
        this.toRemove = 0;

        this.id = initPack.id;

        this.damage = 5;
        this.penetration = 5;

        Bullet.list[this.id] = this;

    }

    show() {

        let x = this.x - Player.list[selfId].x + WIDTH / 2;
        let y = this.y - Player.list[selfId].y + HEIGHT / 2;

        if (this.parent == selfId) {
            ctx.fillStyle = blue;
            ctx.strokeStyle = blue_border;
        }
        else {
            ctx.fillStyle = red;
            ctx.strokeStyle = red_border;
        }

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.arc(x, y, this.r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();


    }




}

Bullet.list = {}

//**********************SQUARE****************************/

class Square {


    constructor(initPack) {

        this.x = initPack.x;
        this.y = initPack.y;
        this.r = initPack.r;

        this.bodyDamage = 2;
        this.id = Math.random();

        this.angle = 0;

        this.regen = 5 / 500;

        Square.list[this.id] = this;


    }

    show() {

        if (this.hp < this.hpMax) {
            this.hp += this.regen;
        }

        //Draw square

        let x = this.x - Tank.list[selfId].x + WIDTH / 2;
        let y = this.y - Tank.list[selfId].y + HEIGHT / 2;

        this.angle += 0.005;

        ctx.fillStyle = greensqr;
        ctx.lineWidth = 3;

        ctx.save();

        ctx.translate(x + this.r / 2, y + this.r / 2);

        ctx.rotate(this.angle)

        ctx.fillRect(- this.r / 2, - this.r / 2, this.r, this.r);
        ctx.strokeStyle = greensqr_border;
        ctx.strokeRect(- this.r / 2, - this.r / 2, this.r, this.r);

        ctx.restore();

        //Draw hp

        if (this.hp < this.hpMax) {

            //Hp

            let rectWidth = 50;
            let hpWidth = rectWidth * (this.hp / this.hpMax);

            //Fixed
            ctx.lineWidth = 3;
            ctx.strokeStyle = hp_bg;
            ctx.fillStyle = hp_bg;
            roundRect(ctx, x - rectWidth / 5, y + this.r + 10, rectWidth, 5, 3, true, true)

            //Variable

            ctx.fillStyle = hp_color;
            roundRect(ctx, x - rectWidth / 5, y + this.r + 10, hpWidth, 5, 3, true, false)
        }


    }


}


Square.list = {};


