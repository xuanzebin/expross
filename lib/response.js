const http = require('http')

const res = Object.create(http.ServerResponse.prototype)

res.send = function (body) {
  this.writeHead(200, {'Content-Type': 'text/plain'})
  this.end(body)
}

res.render = function (name, options, callback) {
  const app = this.req.app
  let done = callback
  let opts = options || {}
  const self = this

  done = done || function (err, str) {
    if (err) {
      return req.next(err)
    }

    self.send(str)
  }

  app.render(name, opts, done)
}

module.exports = res