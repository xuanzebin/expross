const request = require('../request')
const response = require('../response')

module.exports.init = function expressInit (req, res, next) {
  // request文件可能用到res对象
  req.res = res

  // 同理，response文件可能用到req对象
  res.req = req

  // 修改原始req以及res的原型
  Object.setPrototypeOf(req, request)
  Object.setPrototypeOf(res, response)

  // 继续执行下一个中间件
  next()
}