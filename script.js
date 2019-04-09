(function () {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	var score = 0;
	var playing = false;
	var key = {
		right: false,
		left: false,
		up: false,
		down: false
	};

	var ship = {
		x: canvas.width / 2,
		y: canvas.height,
		lives: 3,
		hasLives: true,
		draw: function () {
			if (key.right) this.x += 5;
			else if (key.left) this.x -= 5;
			if (key.up) this.y -= 5;
			else if (key.down) this.y += 5;

			if (this.x < 40) this.x = 40;
			else if (this.x > canvas.width - 40) this.x = canvas.width - 40;
			if (this.y < 0) this.y = 0;
			else if (this.y > canvas.height - 60) this.y = canvas.height - 60;

			ctx.beginPath();
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x + 15, this.y + 15);
			ctx.lineTo(this.x + 25, this.y + 15);
			ctx.lineTo(this.x + 40, this.y);
			ctx.lineTo(this.x + 40, this.y + 60);
			ctx.lineTo(this.x + 25, this.y + 55);
			ctx.lineTo(this.x, this.y + 60);
			ctx.lineTo(this.x - 25, this.y + 55);
			ctx.lineTo(this.x - 40, this.y + 60);
			ctx.lineTo(this.x - 40, this.y);
			ctx.lineTo(this.x - 25, this.y + 15);
			ctx.lineTo(this.x - 15, this.y + 15);
			ctx.closePath();
			ctx.strokeStyle = '#fff';
			ctx.stroke();
			ctx.fillStyle = '#00f';
			ctx.fill();
		},
		collision: function () {
			for (var i = 0; i < enemy.all.length; i++) {
				if ((this.x - 40) <= (enemy.all[i][0] + 40) && (this.x + 40) >= (enemy.all[i][0] - 40) && this.y <= enemy.all[i][2] && (this.y + 60) >= enemy.all[i][2] - 60)
					this.checkLives();
			}
		},
		checkLives: function () {
			this.lives--;
			if (this.lives > 0) reset();
			else this.hasLives = false;
		}
	};

	var shooting = {
		maxShots: 3,
		shots: [],
		draw: function () {
			if (this.shots.length)
				for (var i = 0; i < this.shots.length; i++) {
					ctx.fillStyle = '#0f0';
					ctx.fillRect(this.shots[i][0], this.shots[i][1], this.shots[i][2], this.shots[i][3]);
				}
		},
		move: function () {
			for (var i = 0; i < this.shots.length; i++) {
				if (this.shots[i][1] > -11) this.shots[i][1] -= 10;
				else if (this.shots[i][1] < -10) this.shots.splice(i, 1);
			}
		}
	};

	var enemy = {
		x: 80,
		y: 60,
		speed: 2,
		max: 5,
		all: [],
		add: function () {
			for (var i = 0; i < this.max; i++) {
				this.all.push([this.x, this.speed, this.y]);
				this.x = this.x + 150;
			}
		},
		draw: function () {
			for (var i = 0; i < this.all.length; i++) {
				ctx.beginPath();
				ctx.moveTo(this.all[i][0], this.all[i][2]);
				ctx.lineTo(this.all[i][0] + 15, this.all[i][2] - 15);
				ctx.lineTo(this.all[i][0] + 25, this.all[i][2] - 15);
				ctx.lineTo(this.all[i][0] + 40, this.all[i][2]);
				ctx.lineTo(this.all[i][0] + 40, this.all[i][2] - 60);
				ctx.lineTo(this.all[i][0] + 25, this.all[i][2] - 55);
				ctx.lineTo(this.all[i][0], this.all[i][2] - 60);
				ctx.lineTo(this.all[i][0] - 25, this.all[i][2] - 55);
				ctx.lineTo(this.all[i][0] - 40, this.all[i][2] - 60);
				ctx.lineTo(this.all[i][0] - 40, this.all[i][2]);
				ctx.lineTo(this.all[i][0] - 25, this.all[i][2] - 15);
				ctx.lineTo(this.all[i][0] - 15, this.all[i][2] - 15);
				ctx.closePath();
				ctx.strokeStyle = '#fff';
				ctx.stroke();
				ctx.fillStyle = '#f00';
				ctx.fill();
			}
		},
		move: function () {
			for (var i = 0; i < this.all.length; i++) {
				if (this.all[i][2] < canvas.height + 40) this.all[i][2] += this.all[i][1];
				else if (this.all[i][2] > canvas.height) this.all[i][2] = 0;
			}
		},
		hit: function () {
			var remove = false;
			for (var x = 0; x < shooting.shots.length; x++) {
				for (var y = 0; y < enemy.all.length; y++) {
					if (shooting.shots[x][1] <= (this.all[y][2] - 10) && shooting.shots[x][1] >= (this.all[y][2] - 60) && shooting.shots[x][0] <= (this.all[y][0] + 40) && shooting.shots[x][0] >= (this.all[y][0] - 40)) {
						remove = true;
						this.all.splice(y, 1);
						score += 10;
						this.all.push([(Math.random() * 720) + 40, this.speed, -40]);
					}
				}
				if (remove == true) {
					shooting.shots.splice(x, 1);
					remove = false;
				}
			}
		}
	};

	var background = {
		starsMax: 100,
		stars: [],
		add: function () {
			for (var i = 0; i <= this.starsMax; i++) {
				var x = Math.floor(Math.random() * 800);
				var y = Math.floor(Math.random() * 800);
				var size = Math.random() * 2;
				this.stars.push([x, y, size]);
			}
		},
		draw: function () {
			for (var i = 0; i < this.stars.length; i++) {
				ctx.beginPath();
				ctx.arc(this.stars[i][0], this.stars[i][1], this.stars[i][2], 0, Math.PI * 2);
				ctx.fillStyle = '#fff';
				ctx.closePath();
				ctx.fill();
			}
		},
		move: function () {
			for (var i = 0; i < this.stars.length; i++) {
				this.stars[i][1] += 0.5;
				if (this.stars[i][1] > canvas.height + 5)
					this.stars[i][1] = -5;
			}
		}
	};

	function display() {
		if (!playing) {
			ctx.font = '90px VT323';
			ctx.strokeStyle = '#fff';
			ctx.strokeText('Shoot\'em All', 185, 200);
			ctx.font = '40px VT323';
			ctx.strokeText('Press SPACE to PLAY', 250, 250);
			ctx.font = '20px VT323';
			ctx.fillStyle = '#fff';
			ctx.fillText('Controls: ARROWS + SPACE', 305, 290);
			ctx.fillText('Game must be "focused"', 324, 320);
		}
		if (playing) {
			ctx.font = 'bold 20px VT323';
			ctx.fillStyle = '#fff';
			ctx.fillText('Score: ', 20, 30);
			ctx.fillText(score, 70, 30);
			ctx.fillText('Lives: ', 20, 55);
			ctx.fillText(ship.lives, 70, 55);
		}
		if (!ship.hasLives && playing) {
			setTimeout(function () {
				playing = false;
			}, 60000 / 60);
			ctx.strokeStyle = '#fff';
			ctx.font = '130px VT323';
			ctx.strokeText('Game Over', 160, canvas.height / 2);
			ctx.font = '40px VT323';
			ctx.strokeText('Your score: ', 280, canvas.height / 2 + 50);
			ctx.strokeText(score, 470, canvas.height / 2 + 50);
		}
	}

	function reset() {
		var enemyResetPosX = 100;
		ship.x = canvas.width / 2;
		ship.y = canvas.height - 100;
		for (var i = 0; i < enemy.all.length; i++) {
			enemy.all[i][0] = enemyResetPosX;
			enemy.all[i][2] = -40;
			enemyResetPosX += 150;
		}
	}

	function keyDown(e) {
		if (document.activeElement === canvas) {
			if (e.keyCode == 39) key.right = true;
			else if (e.keyCode == 37) key.left = true;
			if (e.keyCode == 38) key.up = true;
			else if (e.keyCode == 40) key.down = true;
			if (e.keyCode == 32 && shooting.shots.length < shooting.maxShots && ship.hasLives) {
				shooting.shots.push([ship.x - 1, ship.y - 25, 4, 20]);
			}
			if (!playing && e.keyCode == 32) {
				playing = true;
				ship.hasLives = true;
				ship.lives = 3;
				score = 0;
				reset();
			}
		}
	}

	function keyUp(e) {
		if (e.keyCode == 39) key.right = false;
		else if (e.keyCode == 37) key.left = false;
		if (e.keyCode == 38) key.up = false;
		else if (e.keyCode == 40) key.down = false;
	}

	document.addEventListener('keydown', keyDown, false);
	document.addEventListener('keyup', keyUp, false);

	function clear() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	background.add();
	enemy.add();

	function game() {
		clear();
		background.draw();
		background.move();
		if (ship.hasLives && playing) {
			enemy.hit();
			ship.collision();
			shooting.move();
			enemy.move();
			enemy.draw();
			ship.draw();
			shooting.draw();
		}
		display();
		requestAnimationFrame(game);
	}

	game();

})();