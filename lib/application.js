const http = require('http')
const Router = require('./router')
const METHODS = require('./methods')
const middleware = require('./middleware/init')

function Application() {
}

Application.prototype.lazyrouter = function () {
  if (!this._router) {
    this._router = new Router()
    this._router.use(middleware.init)
  }
}


Application.prototype.listen = function(port, cb) {
  var server = http.createServer((req, res) => {
    this.handle(req, res)
  })

  return server.listen.apply(server, arguments)
}

Application.prototype.handle = function (req, res) {

  var done = function finalHandler(err) {
    res.writeHead(404, {'Content-Type': 'text/plain'})

    if (err) {
      res.end('404: ' + err)
    } else {
      var msg = 'Cannot' + req.method + ' ' + req.url
      res.end(msg)
    }
  }

  router = this._router
  if (router) {
    this._router.handle(req, res, done)
  } else {
    done()
  }
}

Application.prototype.use = function (fn) {
  let path = '/'
  this.lazyrouter()
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
    this.lazyrouter()
    this._router[method].call(this._router, path, handle)
    return this
  }
})

module.exports = Application