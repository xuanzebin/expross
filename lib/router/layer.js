function Layer(path, fn) {
  this.handle = fn
  this.path = path
  this.name = fn.name || '<anonymous>'
}

Layer.prototype.handle_request = function(req, res, next) {
  var fn = this.handle

  try {
    fn(req, res, next)
  } catch (err) {
    next(err)
  }
}

Layer.prototype.match = function(path) {
  if (path === this.path || path === '*') {
    return true
  }

  return false
}

Layer.prototype.handle_error = function (error, req, res, next) {
  var fn = this.handle

  if (fn.length !== 4) {
    return next(error)
  }

  try {
    fn(error, req, res, next)
  } catch (err) {
    next(err)
  }
}

module.exports = Layer