// initial conditions
var turn = 0;
var computerTurn = false;
var gameOver = true;
var humanArr;
var twoSpotArr;
var oneSpotArr;

// jquery objects
$span = $('span');
$button = $('button');

var $1 = $('.top.left');
var $2 = $('.top.center');
var $3 = $('.top.right');
var $4 = $('.middle.left');
var $5 = $('.middle.center');
var $6 = $('.middle.right');
var $7 = $('.bottom.left');
var $8 = $('.bottom.center');
var $9 = $('.bottom.right');

// array of win situations
var winSpots = [
	[$1,$2,$3],
	[$4,$5,$6],
	[$7,$8,$9],
	[$1,$4,$7],
	[$2,$5,$8],
	[$3,$6,$9],
	[$1,$5,$9],
	[$3,$5,$7]
];
// will hold clone of winSpots array plus modification seen later. set with setArrProp function
var winSpotsHuman;
var winSpotsComp;

// clones the winSpots array because slice method only copies a reference
function cloneSpotsArr(arr) {
	var newArr = [];
	for (var i=0; i<arr.length; i++) {
		newArr[i] = [];
		for (var j=0; j<arr[i].length; j++) {
			newArr[i][j] = arr[i][j];
		}
	}
	return newArr;
}

// checks a line to see if there are 3 X's or 3 O's in a row
function checkWin(spot1, spot2, spot3) {
	var line = spot1.text() + spot2.text() + spot3.text();
	return line == 'XXX' || line == 'OOO';
}

// checks all possible lines
function checkAll() {
	for (var i=0; i<winSpots.length; i++) {
		var win = checkWin.apply(null, winSpots[i]);
		if (win) {
			return winSpots[i][0].text();
		}
	}
	return false;
}

// checks if there is a winner
function gameCheck() {
	if (checkAll()) {
		alert(checkAll() + ' wins');
		return reset();
	}
	if (turn == 9) {
		alert('Tie game');
		return reset();
	}
	return false;
}

// set array properties for the user and the computer
function setArrProp(symbol) {
	if (symbol == 'X') {
		humanArr = ['XX ', 'X X', ' XX'];
		twoSpotArr = ['OO ', 'O O', ' OO'];
		oneSpotArr = ['O  ', ' O ', '  O'];		
	} else {
		humanArr = ['OO ', 'O O', ' OO'];
		twoSpotArr = ['XX ', 'X X', ' XX'];
		oneSpotArr = ['X  ', ' X ', '  X'];	
	}
	winSpotsHuman = cloneSpotsArr(winSpots);
	winSpotsHuman.forEach(function(arr) {
		arr.push(humanArr);
	});
	winSpotsComp = cloneSpotsArr(winSpots);
	winSpotsComp.forEach(function(arr) {
		arr.push(twoSpotArr);
	});
}

// checks if there is a line that has a win opportunity and returns that spot. uses winSpotsHuman or winSpotsComp array as arguments
function twoSpotCheck(spot1, spot2, spot3, arr) {
	var line = spot1.text() + spot2.text() + spot3.text();
	for (var i=0; i<arr.length; i++) {
		if (line == arr[i]) {
			var spotIndex = arr[i].indexOf(' ');
			if (spotIndex == 0) {
				return spot1;
			} else if (spotIndex == 1) {
				return spot2;
			} else {
				return spot3;
			}
		}
	}
	return false;
}

// checks for a line with one spot filled in and randomly returns one of the other two empty spots
function oneSpotCheck(spot1,spot2,spot3) {
	var spotsArr = [spot1,spot2,spot3];
	var line = spot1.text() + spot2.text() + spot3.text();
	for (var i=0; i<oneSpotArr.length; i++) {
		if (line == oneSpotArr[i]) {
			var randomNum = Math.floor(Math.random()*2);
			if (i == 0) {
				spotsArr = spotsArr.slice(1);
			} else if (i == 1) {
				spotsArr = [spotsArr[0], spotsArr[2]];
			} else {
				spotsArr = spotsArr.slice(0,2);
			}
			return spotsArr[randomNum];
		}
	}
	return false;
}

// resets game to initial conditions
function reset() {
	$span.removeClass('filled');
	$span.text(' ');
	$button.removeClass('active');
	turn = 0;
	computerTurn = false;
	gameOver = true;
	return true;
}

function smarterSpot() {
	var spot;
	for (var i=0; i<winSpotsComp.length; i++) {
		spot = twoSpotCheck.apply(null, winSpotsComp[i]);
		if (spot) {
			return spot;
		}
	}
	for (var i=0; i<winSpotsHuman.length; i++) {
		spot = twoSpotCheck.apply(null, winSpotsHuman[i]);
		if (spot) {
			return spot;
		}
	}
	for (var i=0; i<oneSpotArr.length; i++) {
		spot = oneSpotCheck.apply(null, winSpots[i]);
		if (spot) {
			return spot;
		}
	}
	return false;
}

function randomSpot() {
	var $unfilled = $('span:not(.filled)'); // these are empty spans
	var length = $unfilled.length;
	var $randomSpot = $unfilled.eq(Math.floor(Math.random()*length));
	return $randomSpot;
}

// action computer takes
function computerAction() {
	computerTurn = !computerTurn;
	setTimeout(function() {
		var $spot;
		if (smarterSpot()) {
			$spot = smarterSpot();
		} else {
			$spot = randomSpot();
		}
		$spot.addClass('filled');
		if (turn%2 == 0) {
			$spot.text('X');
		} else {
			$spot.text('O');
		}
		turn++;
		computerTurn = !computerTurn;
		gameCheck();
		
	}, 1000);
}

$button.on('click', function() {
	$this = $(this);
	if (gameOver) {
		$this.addClass('active');
		gameOver = false;
		if ($this.text() == 'O') {
			setArrProp('O');
			computerAction();
		} else {
			setArrProp('X');
		}
	}	
});

$span.on('click', function() {
	if (computerTurn || gameOver) return false;
	$this = $(this);
	if ($this.hasClass('filled')) return false;
	$this.addClass('filled');
	if (turn%2 == 0) {
		$this.text('X');
	} else {
		$this.text('O');
	}
	turn++;
	if (!gameCheck()) {
		computerAction();
	}
});

