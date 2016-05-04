var finalhandler = require('finalhandler');
var Router       = require('router');

var router = Router()
router.get('/api/', function (req, res) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.end('API, Hello World!')
})

module.exports = router;
