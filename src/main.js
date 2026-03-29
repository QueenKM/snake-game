import {
  GRID_SIZE,
  TICK_MS,
  createInitialState,
  queueDirection,
  restartGame,
  stepGame,
  togglePause,
} from "./game.js";

const boardElement = document.querySelector("#board");
const scoreElement = document.querySelector("#score");
const bestScoreElement = document.querySelector("#best-score");
const statusElement = document.querySelector("#status");
const pauseButton = document.querySelector("#pause-button");
const restartButton = document.querySelector("#restart-button");
const controlButtons = document.querySelectorAll("[data-direction]");

let state = hydrateBestScore(createInitialState());

buildBoard(boardElement);
render();

const tick = window.setInterval(() => {
  const nextState = stepGame(state);
  if (nextState !== state) {
    state = nextState;
    persistBestScore(state.bestScore);
    render();
  }
}, TICK_MS);

document.addEventListener("keydown", (event) => {
  const direction = getDirectionFromKey(event.key);

  if (direction) {
    event.preventDefault();
    state = queueDirection(state, direction);
    return;
  }

  if (event.key === " ") {
    event.preventDefault();
    state = togglePause(state);
    render();
  }

  if (event.key === "Enter" && state.isGameOver) {
    event.preventDefault();
    state = restartGame(state);
    render();
  }
});

pauseButton.addEventListener("click", () => {
  state = togglePause(state);
  render();
});

restartButton.addEventListener("click", () => {
  state = restartGame(state);
  render();
});

controlButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state = queueDirection(state, button.dataset.direction);
  });
});

window.addEventListener("beforeunload", () => {
  window.clearInterval(tick);
});

function buildBoard(container) {
  const cells = [];

  for (let index = 0; index < GRID_SIZE * GRID_SIZE; index += 1) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.setAttribute("role", "gridcell");
    cells.push(cell);
  }

  container.replaceChildren(...cells);
}

function render() {
  const cells = boardElement.children;
  const snakeLookup = new Map(
    state.snake.map((segment, index) => [`${segment.x},${segment.y}`, index])
  );

  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const cell = cells[y * GRID_SIZE + x];
      const key = `${x},${y}`;
      const snakeIndex = snakeLookup.get(key);

      cell.className = "cell";

      if (snakeIndex === 0) {
        cell.classList.add("snake", "head");
      } else if (snakeIndex !== undefined) {
        cell.classList.add("snake");
      } else if (state.food && state.food.x === x && state.food.y === y) {
        cell.classList.add("food");
      }
    }
  }

  scoreElement.textContent = String(state.score);
  bestScoreElement.textContent = String(state.bestScore);
  statusElement.textContent = getStatusText(state);
  pauseButton.textContent = state.isPaused ? "Resume" : "Pause";

  persistBestScore(state.bestScore);
}

function getDirectionFromKey(key) {
  switch (key) {
    case "ArrowUp":
    case "w":
    case "W":
      return "up";
    case "ArrowDown":
    case "s":
    case "S":
      return "down";
    case "ArrowLeft":
    case "a":
    case "A":
      return "left";
    case "ArrowRight":
    case "d":
    case "D":
      return "right";
    default:
      return null;
  }
}

function getStatusText(currentState) {
  if (currentState.isGameOver) {
    return "Game Over";
  }

  if (currentState.isPaused) {
    return "Paused";
  }

  return "Playing";
}

function hydrateBestScore(initialState) {
  const savedScore = window.localStorage.getItem("snake-best-score");
  const bestScore = Number.parseInt(savedScore ?? "0", 10);

  if (Number.isNaN(bestScore)) {
    return initialState;
  }

  return {
    ...initialState,
    bestScore,
  };
}

function persistBestScore(bestScore) {
  window.localStorage.setItem("snake-best-score", String(bestScore));
}
