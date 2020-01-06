function Layer(path, fn) {
  this.handle = fn
  this.path = path
  this.name = fn.name || '<anonymous>'

  this.fast_star = (path === '*' ? true : false)
  if (!this.fast_star) {
    this.path = path
  }
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

  // 如果为*，匹配
  if (this.fast_star) {
    this.path = ''
    return true
  }

  // 如果是普通路由，从后匹配
  if (this.route && this.path === path.slice(-this.path.length)) {
    return true
  }

  if (!this.route) {
    // 不带路径的中间件
    if (this.path === '/') {
      this.path = ''
      return true
    }

    // 带路径的中间件
    if (this.path === path.slice(0, this.path.length)) {
      return true
    }
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