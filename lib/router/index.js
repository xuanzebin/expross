const Layer = require('./layer')
const Route = require('./route')
const METHODS = require('../methods')
const url = require('url')

let proto = {}

proto.handle = function(req, res, done) {
  let self = this
  let method = req.method
  let idx = 0
  let stack = self.stack
  let slashAdded = false
  let removed = ''

  // 获取当前父路径
  let parentUrl = req.baseUrl || ''
  // 保存父路径
  req.baseUrl = parentUrl
  // 保存原始路径
  req.originalUrl = req.originalUrl || req.url

  function next(err) {
    var layerError = (err === 'route' ? null : err)

    if (slashAdded) {
      req.url = ''
      slashAdded = false
    }

    if (removed.length !== 0) {
      req.baseUrl = parentUrl
      req.url = removed + req.url
      removed = ''
    }

    if (layerError === 'router') {
      return done(null)
    }

    if (idx >= stack.length) {
      return done(layerError)
    }

    let path = url.parse(req.url).pathname
    var layer = stack[idx++] 

    if (layer.match(path)) {
      // 处理中间件
      if (!layer.route) {
        // 要移除的部分
        removed = layer.path

        // 设置当前路径
        req.url = req.url.substr(removed.length)
        if (req.url === '') {
          req.url = '/' + req.url
          slashAdded = true
        }

        // 设置当前路径的父路径
        req.baseUrl = parentUrl + removed

        if (layerError) {
          layer.handle_error(layerError, req, res, next)
        } else {
          // 调用处理函数
          layer.handle_request(req, res, next)
        }
      } else if (layer.route._handles_method(method)) {
        // 处理路由
        layer.handle_request(req, res, next)
      }
    } else {
      return next(layerError)
    }
  }

  next()
}

proto.route = function(path) {
  var route = new Route(path)

  var layer = new Layer(path, route.dispatch.bind(route))

  layer.route = route

  this.stack.push(layer)

  return route
}

proto.use = function (fn) {
  let path = '/'

  if (typeof fn !== 'function') {
    path = fn
    fn = arguments[1]
  }

  const layer = new Layer(path, fn)
  layer.route = undefined

  this.stack.push(layer)

  return this
}

METHODS.forEach(function(method) {
  method = method.toLowerCase()
  proto[method] = function (path, fn) {
    var route = this.route(path)
    route[method].call(route, fn)
  
    return this
  }
})

module.exports = function () {
  function router (req, res, next) {
    router.handle(req, res, next)
  }

  Object.setPrototypeOf(router, proto)

  router.stack = []

  return router
}