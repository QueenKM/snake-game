export const GRID_SIZE = 16;
export const INITIAL_DIRECTION = "right";
export const TICK_MS = 140;

const DIRECTION_VECTORS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITES = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

export function createInitialState(random = Math.random) {
  const middle = Math.floor(GRID_SIZE / 2);
  const snake = [
    { x: middle, y: middle },
    { x: middle - 1, y: middle },
    { x: middle - 2, y: middle },
  ];

  return {
    snake,
    direction: INITIAL_DIRECTION,
    queuedDirection: INITIAL_DIRECTION,
    food: placeFood(snake, random),
    score: 0,
    bestScore: 0,
    isGameOver: false,
    isPaused: false,
  };
}

export function queueDirection(state, nextDirection) {
  if (!DIRECTION_VECTORS[nextDirection]) {
    return state;
  }

  if (OPPOSITES[state.direction] === nextDirection) {
    return state;
  }

  return {
    ...state,
    queuedDirection: nextDirection,
  };
}

export function stepGame(state, random = Math.random) {
  if (state.isGameOver || state.isPaused) {
    return state;
  }

  const direction = state.queuedDirection ?? state.direction;
  const vector = DIRECTION_VECTORS[direction];
  const currentHead = state.snake[0];
  const nextHead = {
    x: currentHead.x + vector.x,
    y: currentHead.y + vector.y,
  };
  const ateFood = positionsEqual(nextHead, state.food);
  const collisionBody = ateFood ? state.snake : state.snake.slice(0, -1);

  if (hitsBoundary(nextHead) || hitsSnake(nextHead, collisionBody)) {
    return {
      ...state,
      direction,
      queuedDirection: direction,
      isGameOver: true,
      bestScore: Math.max(state.bestScore, state.score),
    };
  }

  const nextSnake = [nextHead, ...state.snake];

  if (!ateFood) {
    nextSnake.pop();
  }

  const score = ateFood ? state.score + 1 : state.score;

  return {
    ...state,
    snake: nextSnake,
    direction,
    queuedDirection: direction,
    food: ateFood ? placeFood(nextSnake, random) : state.food,
    score,
    bestScore: Math.max(state.bestScore, score),
  };
}

export function togglePause(state) {
  if (state.isGameOver) {
    return state;
  }

  return {
    ...state,
    isPaused: !state.isPaused,
  };
}

export function restartGame(state, random = Math.random) {
  const freshState = createInitialState(random);
  return {
    ...freshState,
    bestScore: Math.max(state.bestScore, state.score),
  };
}

export function placeFood(snake, random = Math.random) {
  const occupied = new Set(snake.map((segment) => toKey(segment)));
  const freeCells = [];

  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const candidate = { x, y };
      if (!occupied.has(toKey(candidate))) {
        freeCells.push(candidate);
      }
    }
  }

  if (freeCells.length === 0) {
    return null;
  }

  const index = Math.floor(random() * freeCells.length);
  return freeCells[index];
}

export function positionsEqual(a, b) {
  return Boolean(a && b) && a.x === b.x && a.y === b.y;
}

function hitsBoundary(position) {
  return (
    position.x < 0 ||
    position.y < 0 ||
    position.x >= GRID_SIZE ||
    position.y >= GRID_SIZE
  );
}

function hitsSnake(head, snake) {
  return snake.some((segment) => positionsEqual(segment, head));
}

function toKey(position) {
  return `${position.x},${position.y}`;
}
