var Layer = require('./layer')
var Route = require('./route')
var METHODS = require('../methods')

var Router = function() {
  this.stack = []
}

Router.prototype.handle = function(req, res, done) {
  var self = this
  var method = req.method
  var idx = 0
  var stack = self.stack

  function next(err) {
    var layerError = (err === 'route' ? null : err)

    if (layerError === 'router') {
      return done(null)
    }

    if (idx >= stack.length || layerError) {
      return done(layerError)
    }

    var layer = stack[idx++] 

    if (layer.match(req.url) && layer.route && layer.route._handles_method(method)) {
      return layer.handle_request(req, res, next)
    } else {
      return next(layerError)
    }
  }

  next()
}

Router.prototype.route = function(path) {
  var route = new Route(path)

  var layer = new Layer(path, route.dispatch.bind(route))

  layer.route = route

  this.stack.push(layer)

  return route
}

METHODS.forEach(function(method) {
  method = method.toLowerCase()
  Router.prototype[method] = function (path, fn) {
    var route = this.route(path)
    route[method].call(route, fn)
  
    return this
  }
})

module.exports = Router