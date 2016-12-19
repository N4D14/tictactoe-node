# TIC TAC TOE Game! Node.js + Webpack + React

## About

This is a simple Tic Tac Toe app which demonstrates a basic
Node.js + React + Webpack setup and the use of a server 
to decide the computer's game moves. Obviously (for something this simple)
the AI could easily be implemented in the client to produce a faster game. 
Purely for example purposes I've implemented it here as a server app (side benefit,
it is reusable). The human player is always 'X' and takes the first turn, the
AI (minimax algorithm) plays 'O' and goes second. The game engine (server) is not
limited to this setup, it can play either player, that was merely a choice for 
the front end.

## Environment setup

1. Make sure you have node (7.2.1 or later) installed (`brew install node`)
2. Install the node modules by running `npm install` in the top level tictactoe dir

## Run the web server

1. Make the webpack bundle

```npm run build```

2.    Run the express.js server

```npm start```
