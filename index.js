import './style.css';

let GAME_WON = false;
let current_position = 0;
let interval;
let TIME_INTERVAL = 2000;

function renderMessage(message) {
  console.log(message);
  document.querySelector('.message').innerText = message;
}

// returns a number 1-6
function throwDice() {
  if (!GAME_WON) {
    let number = parseInt(((Math.random() * 1000) % 6) + 1);
    console.log(number);
    play(number);
  } else {
    renderMessage('Game Already won, Call resetGame() to play Again :) ');
  }
}

function rareProbabilityCondition(chance) {
  return Math.random() < chance;
}

let board = [];
for (let i = 0; i < 100; i++) {
  // insert a + or -
  if (rareProbabilityCondition(0.2) && board[i - 1] == null) {
    let randomOffset = parseInt((Math.random() * 1000) % 30) + 1;
    let isPlus = Math.random() > 0.5;
    if (isPlus) {
      board[i] = (randomOffset % (99 - i)) + 1;
    } else {
      board[i] = -(randomOffset % i);
      board[i] == 0 && board[i] == -1;
    }
  } else {
    // do nothing
    board.push(null);
  }
}
board = board.map((i) => (i == 0 ? null : i));

function play(number) {
  if (current_position + number <= 99) {
    current_position += number;
    renderBoard(current_position);
    renderMessage(`player at  ${current_position} with number ${number} `);
    if (current_position == 99) {
      GAME_WON = true;
      renderMessage('you won');
      clearInterval(interval);
    } else {
      while (board[current_position] != null && current_position <= 99) {
        let prev_offset = board[current_position];
        current_position += board[current_position];
        renderMessage(
          `player jumped to ${current_position} with  ${prev_offset} offset `
        );
      }
    }
  } else {
    console.log('cant play this move');
  }
}

function startGame(autoplay = true) {
  if (autoplay) {
    interval = setInterval(function () {
      if (!GAME_WON) {
        throwDice();
      } else {
        clearInterval(interval);
      }
    }, TIME_INTERVAL);
    console.log(interval);
  } else {
    throwDice();
    renderMessage('throw dice again to move ahead');
  }
}

function resetGame() {
  current_position = 0;
  GAME_WON = false;
  renderMessage('Game Reset');
}

startGame();

// Markup

let boardNode = document.querySelector('.board');

function renderBoard(position = 0) {
  let markup = '';
  for (let i = 0; i < 100; i++) {
    if ((i + 1) % 10 == 1) {
      markup += `
    <div class="row">
    `;
    }
    markup += `
  <div class="block ${i + 1 == position && 'active'} ${
      board[i] > 0 && 'ladder'
    } ${board[i] < 0 && 'snake'} " >
    ${i + 1}
  </div>
  `;
    if ((i + 1) % 10 == 0) {
      markup += `
    </div>
    `;
    }
  }
  boardNode.innerHTML = markup;
}

renderBoard();
