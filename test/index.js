const express = require('../lib/expross')
const app = express()
const router = express.Router()

// app.get('/', function(req, res, next) {
//   console.log('err')
//   next('route')
//   res.send('thi2rd');
// }).get('/1', function(req, res, next) {
//   next(new Error('error fuck'));
// }).get('/', function(req, res) {
//   res.send('third');
// });

// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!')
// })

// router.use(function (req, res, next) {
//   console.log('Time:', Date.now());
// });

// app.use(function(req, res, next) {
//   console.log('Time：', Date.now());
//   next();
// });

app.get('/', function(req, res, next) {
  throw new Error('hi')
  res.send('first');
});
app.use(function(err, req, res, next) {
  console.log(err, '123')
  res.send('error')
})


// router.use(function(req, res, next) {
//   console.log('Time: ', Date.now());
//   next();
// });

// router.use('/1', function(req, res, next) {
//   res.send('second');
// });

// app.use('/user', router);

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});