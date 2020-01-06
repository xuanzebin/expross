const http = require('http')
const Router = require('./router')
const METHODS = require('./methods')
const middleware = require('./middleware/init')
const View = require('./view')

function Application() {
  this.settings = {}
  this.engines = {}
}

Application.prototype.render = function (name, options, callback) {
  const done = callback
  const engines = options.engines
  const opts = options

  view = new View(name, {
    defaultEngine: this.get('view engine'),
    root: this.get('views'),
    engines: this.engines
  })

  if (!view.path) {
    const err = new Error('Failed to lookup view "' + name + '"')
    return done(err)
  }

  try {
    view.render(opts, callback)
  } catch (err) {
    done(err)
  }
}

Application.prototype.set = function (setting, val) {
  if (arguments.length === 1) {
    return this.settings[setting]
  }

  this.settings[setting] = val
  return this
}

Application.prototype.engine = function (ext, fn) {
  const extension = ext[0] === '.' ? ext : '.' + ext

  this.engines[extension] = fn

  return this
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
  req.app = this

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
    if (method === 'get' && arguments.length === 1) {
      return this.set(path)
    }

    this.lazyrouter()
    this._router[method].call(this._router, path, handle)
    return this
  }
})

module.exports = Application