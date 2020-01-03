const express = require('../lib/expross')
const app = express()

app.get('/', function(req, res, next) {
  next('route');
}).put('/', function(req, res, next) {
  next(new Error('error fuck'));
}).get('/', function(req, res) {
  res.send('third');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})