var express = require('express');
var router = express.Router();
var Board = require('./tictactoe');

// Handle tic tac toe move request here
// return in json
router.post('/engine', function(req, res, next) {
    var b = new Board(req.body.squares, req.body.nextPlayer);
    try {
      b.makeMove();
      var data = {squares: b.squares, nextPlayer: b.nextPlayer};
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
    }
});

module.exports = router;