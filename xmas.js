class Xmas {
    constructor($canvas, options) {
        this.ctx = $canvas.getContext('2d'); 
        this.snowFlakes = []
        this.options = {
            nFlakes: 100,
            fillColor: 'darkblue',
            speed: 1.0,
            minIterations: 3,
            maxIterations: 5,
            ...options }
        this.width = $canvas.width;
        this.height = $canvas.height;
        this.start();
    }
    
    draw() {
        const snowFlakes = this.snowFlakes;
        const ctx = this.ctx;
        ctx.fillStyle = this.options.fillColor;
        ctx.fillRect(0, 0, $canvas.width, $canvas.height);
        for (var i = 0; i < snowFlakes.length; i++) {
            snowFlakes[i].draw(ctx);
        }
    }

    update() {
        const snowFlakes = this.snowFlakes;
        for (var i = 0; i < snowFlakes.length; i++) {
            snowFlakes[i].update();
            if (snowFlakes[i].y > $canvas.height) {
                snowFlakes.splice(i, 1);
                i--;
            }
        }
        if (snowFlakes.length < this.options.nFlakes) {
            snowFlakes.push(new Snowflake(this.width, this.height, this.options));
        }
    }

    start() {
        if (this.run) return;
        this.run = true;
        this.loop();
    }

    stop() {
        this.run = false;
    }

    loop() {
        if (!this.run) return;
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}

class Snowflake {
    constructor(width, height, options) {
        this.x = Math.random() * width;
        this.y = 0;
        this.angle = Math.random() * 2 * Math.PI;
        this.scale = Math.pow(Math.random(),4)*width/20+width/100;
        this.options = options;
        const minIterations = options.minIterations || 3;
        const maxIterations = options.maxIterations || 5;
        this.iterations = minIterations+Math.floor(Math.random() * (maxIterations - minIterations + 1));
        // random white-ish color   
        this.color = 'rgb(' + Math.round(256 - Math.random() * 128) + ',' + Math.round(256-Math.random() * 32) + ',' + Math.round(256 - Math.random() * 8) + ')';
        //this.color = 'white'
        this.angleSpeed = (Math.random()-0.5) * 0.05;
        const sprite = document.createElement('canvas');
        sprite.width = 2 * this.scale;
        sprite.height = 2 * this.scale;
        this.drawSprite(sprite.getContext('2d'));
        this.sprite = sprite;
    }

    drawSprite(ctx) {
        ctx.save();
        ctx.translate(0, this.scale);
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

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.drawImage(this.sprite, -this.scale/2, -this.scale/2);
        ctx.restore();
    }

    update(speed = 1) {
        this.angle += this.angleSpeed;
        this.y += this.options.speed * 0.05 * this.scale;
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