const path = require('path')
const fs = require('fs')

function View (name, options) {
  const opts = options || {}
  this.defaultEngine = opts.defaultEngine
  this.root = opts.root

  this.ext = path.extname(name)
  this.name = name

  let fileName = name
  if (!this.ext) {
    this.ext = this.defaultEngine[0] === '.' ? this.defaultEngine : '.' + this.defaultEngine

    fileName += this.ext
  }

  this.engine = opts.engines[this.ext]
  this.path = this.lookup(fileName)
}

function tryStat(path) {
  try {
    return fs.statSync(path);
  } catch (e) {
    return undefined;
  }
}

View.prototype.resolve = function resolve (dir, file) {
  const ext = this.ext

  // <path>.<ext>
  const p = path.join(dir, file)
  const stat = tryStat(p)

  if (stat && stat.isFile()) {
    return p
  }

  // <path>/index.<ext>
  p = path.join(dir, path.basename(file, ext), 'index' + ext)
  stat = tryStat(p)

  if (stat && stat.isFile()) {
    return p
  }
}

View.prototype.lookup = function lookup (name) {
  let p
  let roots = [].concat(this.root)

  for (let i=0; i< roots.length && !p; i++) {
    const root = roots[i]

    const loc = path.resolve(root, name)
    const dir = path.dirname(loc)
    const file = path.basename(loc)

    p = this.resolve(dir, file)
  }

  return p
}

View.prototype.render = function render(options, callback) {
  this.engine(this.path, options, callback)
}
 
module.exports = View