
function main($canvas) {
    var ctx = $canvas.getContext('2d'); 
    var snowFlakes = []

    function draw() {
        ctx.fillStyle = 'darkblue';
        ctx.fillRect(0, 0, $canvas.width, $canvas.height);
        for (var i = 0; i < snowFlakes.length; i++) {
            snowFlakes[i].draw(ctx);
        }
    }

    function update() {
        for (var i = 0; i < snowFlakes.length; i++) {
            snowFlakes[i].update();
            if (snowFlakes[i].y > $canvas.height) {
                snowFlakes.splice(i, 1);
            }
        }
        if (snowFlakes.length < 100 && Math.random() < 0.1) {
            snowFlakes.push(new Snowflake($canvas.width, $canvas.height));
        }
    }

    function loop() {
        requestAnimationFrame(loop);
        update();
        draw();
    }

    loop(); 
}

class Snowflake {
    constructor(width, height) {
        this.x = Math.random() * width;
        this.y = 0;
        this.angle = Math.random() * 2 * Math.PI;
        this.scale = Math.pow(Math.random(),4)*width/20+width/100;
        this.iterations = 1+Math.round(Math.random() * 3);
        // random white-ish color   
        this.color = 'rgb(' + Math.round(256 - Math.random() * 64) + ',' + Math.round(256-Math.random() * 8) + ',' + Math.round(256 - Math.random() * 8) + ')';
        //this.color = 'white'
        this.angleSpeed = (Math.random()-0.5) * 0.05;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.translate(-0.5*this.scale, -0.3*this.scale);
        ctx.beginPath();
        this.kochIter(ctx, this.scale, this.iterations);
        ctx.rotate(2 * Math.PI / 3);
        this.kochIter(ctx, this.scale, this.iterations);
        ctx.rotate(2 * Math.PI / 3);
        this.kochIter(ctx, this.scale, this.iterations);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = 'blue';
        ctx.stroke();
        ctx.restore();
    }

    update() {
        this.angle += this.angleSpeed;
        this.y += 0.05 * this.scale;
    }

    kochIter(ctx, scale, iterations) {
        if (iterations === 0) {
            ctx.lineTo(scale, 0);
            ctx.translate(scale, 0);
        } else {
            this.kochIter(ctx, scale / 3, iterations - 1);
            ctx.rotate(-Math.PI / 3);
            this.kochIter(ctx, scale / 3, iterations - 1);
            ctx.rotate(2 * Math.PI / 3);
            this.kochIter(ctx, scale / 3, iterations - 1);
            ctx.rotate(-Math.PI / 3);
            this.kochIter(ctx, scale / 3, iterations - 1);
        }
    }
}