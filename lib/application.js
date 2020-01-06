const http = require('http')
const Router = require('./router')
const METHODS = require('./methods')

function Application() {
  this._router = new Router()
}


Application.prototype.listen = function(port, cb) {
  var server = http.createServer((req, res) => {
    this.handle(req, res)
  })

  return server.listen.apply(server, arguments)
}

Application.prototype.handle = function (req, res) {
  if (!res.send) {
    res.send = function (body) {
      res.writeHead(200, {'Content-Type': 'text/plain'})
      res.end(body)
    }
  }

  var done = function finalHandler(err) {
    res.writeHead(404, {'Content-Type': 'text/plain'})

    if (err) {
      res.end('404: ' + err)
    } else {
      var msg = 'Cannot' + req.method + ' ' + req.url
      res.end(msg)
    }
  }

  return this._router.handle(req, res, done)
}

Application.prototype.use = function (fn) {
  let path = '/'
  const router = this._router

  if (typeof fn !== 'function') {
    path = fn
    fn = arguments[1]
  }

  router.use(path,fn)

  return this
}

METHODS.forEach(function (method) {
  var method = method.toLowerCase()

  Application.prototype[method] = function (path, handle) {
    this._router[method].call(this._router, path, handle)
    return this
  }
})

module.exports = Application