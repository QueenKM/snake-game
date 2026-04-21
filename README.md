# Snake Game

A polished browser-based take on the classic Snake game, built as a lightweight static web app with vanilla JavaScript.

## Live Demo

Play it here: [queenkm.github.io/snake-game](https://queenkm.github.io/snake-game/)

## Overview

This project focuses on the core Snake gameplay loop:

- Grid-based movement
- Food spawning
- Snake growth
- Score tracking
- Game-over state
- Restart and pause controls

The implementation keeps the game logic separated from rendering so the behavior stays predictable and easy to extend.

## Features

- Keyboard controls with arrow keys and `WASD`
- On-screen controls for touch/mobile play
- Score and best-score tracking
- Pause / resume support
- Restart after game over
- Minimal UI with no external dependencies

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript (ES modules)

## Project Structure

```text
.
├── index.html
├── styles.css
└── src
    ├── game.js
    └── main.js
```

## Run Locally

You can run the project in either of these ways:

1. Open `index.html` directly in your browser.
2. Serve the repository root with any static file server and open the root page.

## Controls

- `Arrow keys` or `WASD`: Move
- `Space`: Pause / resume
- `Enter`: Restart after game over

## Manual Verification

- Confirm the snake moves correctly on the grid.
- Confirm eating food increases the score and grows the snake.
- Confirm food never appears on top of the snake.
- Confirm colliding with walls or the snake body ends the game.
- Confirm pause, resume, and restart all work as expected.
- Confirm the on-screen controls work on mobile or touch devices.

## Notes

This project was intentionally kept dependency-free and minimal so the core game loop stays easy to review and understand.
