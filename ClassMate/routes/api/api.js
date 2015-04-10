var express = require('express');
var router = express.Router();
var qr = require('qr-image');

/* GET qr image by subId */
router.get('/qr/:subId/', function(req, res) {
  	var code = qr.image(req.params.subId.toString(), { type: 'png' });
    res.type('png');
    code.pipe(res);
});

module.exports = router;