
var game = new Object();

main();

function main() {
	//Init game's data
	initGame();

	//render loop;
	render();
}

function initGame() {
	game.row = Number(prompt("Number of rows"));
	game.col = Number(prompt("Number of columns"));

	game.snake = {
		direction: [3],
		pos: [{x: 0, y: 1}, {x: 0, y: 0}]
	};

	game.item = {x: 2, y: 2};
	game.playing = true;

	//Create UI table
	initTable(game.row, game.col);
}

function endGame() {
	game.playing = false;
	document.getElementById("result").innerHTML = "<br><h2>You lose!!! Your Score: " + game.snake.pos.length + "</h2>";
}

function updateGame() {
	const dx = [+0, +1, -1, +0];
	const dy = [-1, +0, +0, +1];

	if (game.snake.direction.length > 1) {
		game.snake.direction.shift();
	}

	direction = game.snake.direction[0];
	nextPos = {x: game.snake.pos[0].x + dx[direction], y: game.snake.pos[0].y + dy[direction]};
	if (!validPos(nextPos)) {
		endGame();
		return;
	}

	game.snake.pos.unshift(nextPos);
	if (!comparePos(nextPos, game.item)) {
		game.snake.pos.pop();
	} else {
		updateItem();
	}
}

function updateItem() {
	newItemPos = Math.floor(Math.random() * game.row*game.col);
	
	var newY = newItemPos % game.col;
	var newX = Math.floor((newItemPos - newY) / game.col);

	var newItem = {
		x: newX,
		y: newY
	};

	if (!comparePos(newItem, game.item)) {
		game.item = newItem;
	} else {
		updateItem();
	}
}
function updateDirection(code) {
	var tmp = code + game.snake.direction[game.snake.direction.length-1];
	if (tmp != code+code && tmp != 3) {
		game.snake.direction.push(code);
		//game.snake.direction[0] = code;
	}
}

document.addEventListener('keydown', (event) => {
	const keyName = event.key;

	var directCode;

	switch (keyName) {
		case 'ArrowLeft':
			directCode = 0;
			break;
		case 'ArrowDown':
			directCode = 1;
			break;
		case 'ArrowUp':
			directCode = 2;
			break;
		case 'ArrowRight':
			directCode = 3;
			break;
		default:
			directCode = -1;
	}

	if (directCode !== -1) {
		updateDirection(directCode);
	}
}, false);

function render() {
	document.getElementById("result").innerHTML = "<br>Item Position: (" + game.item.x + ", " + game.item.y + ")";
	
	var eid;

	//background
	for (var i = 0; i < game.row; i++) {
		for (var j = 0; j < game.col; j++) {
			eid = 'e' + i + 'x' + j;
			document.getElementById(eid).classList = "";
			document.getElementById(eid).classList.add("background");
		}
	}

	var snake = game.snake.pos;
	
	//snakeHead
	eid = 'e' + snake[0].x + 'x' + snake[0].y;
	document.getElementById(eid).classList = "snakeHead";

	//snakeBody
	for (var i = 1; i < snake.length; i++) {
		eid = 'e' + snake[i].x + 'x' + snake[i].y;
		document.getElementById(eid).classList = "snakeBody";
	}

	//item
	eid = 'e' + game.item.x + 'x' + game.item.y;
	document.getElementById(eid).classList = "item";

	updateGame();

	if (game.playing) {
		setTimeout(render, 100);
	}
}

function initTable(row, col) {

	var code = "";
	var boundaryCell = '<span class="boundary">b</span>';
	var boundaryLine = "";

	boundaryLine += '<div>';
	for (var j = 0; j < col+2; j++) {
		boundaryLine += boundaryCell;
	}
	boundaryLine += '</div>'

	code += boundaryLine;
	for (var i = 0; i < row; i++) {
		//code += '<div id="row' + i + '">';
		code += '<div>';
		code += boundaryCell;
		for (var j = 0; j < col; j++) {
			code += '<span class="background" id="e' + i + 'x' + j + '">' + '-' + '</span>';
		}
		code += boundaryCell;
		code += '</div>';
	}
	code += boundaryLine;

	document.getElementById("gameTable").innerHTML = code;
}

function validPos(position) {
	switch (true) {
		case position.x < 0: 
			return false;
		case position.x > game.row-1:
			return false;
		case position.y < 0: 
			return false;
		case position.y > game.col-1:
			return ;
	}
	var snake = game.snake.pos;
	for (var i = 0; i < snake.length; i++) {
		if (comparePos(position, snake[i])) {
			return false;
		}
	}
	return true;
}

function comparePos(pos1, pos2) {
	return pos1.x === pos2.x && pos1.y === pos2.y;
}
