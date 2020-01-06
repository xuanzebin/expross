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

// app.get('/', function(req, res, next) {
//   // throw new Error('hi')
//   res.send('first');
// });
// app.use(function(err, req, res, next) {
//   console.log(err, '123')
//   res.send('error')
// })


// router.use(function(req, res, next) {
//   console.log('Time: ', Date.now());
//   next();
// });

// router.use('/1', function(req, res, next) {
//   res.send('second');
// });

// app.use('/user', router);

var fs = require('fs'); // 此模板引擎依赖 fs 模块
app.engine('ntl', function (filePath, options, callback) { // 定义模板引擎
  fs.readFile(filePath, function (err, content) {
    if (err) return callback(new Error(err));
    // 这是一个功能极其简单的模板引擎
    var rendered = content.toString().replace('#title#', '<title>'+ options.title +'</title>')
    .replace('#message#', '<h1>'+ options.message +'</h1>');
    return callback(null, rendered);
  });
});

app.set('views', './test/views'); // 指定视图所在的位置
app.set('view engine', 'ntl'); // 注册模板引擎


app.get('/', function(req, res, next) {
    res.render('index', { title: 'Hey', message: 'Hello there!'});
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});