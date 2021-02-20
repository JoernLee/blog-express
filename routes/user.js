var express = require('express');
var router = express.Router();

router.post('/login', function (req, res, next) {
    // 直接可以拿到解析好的body数据
    const {username, password} = req.body;
    res.json({
        errno: 0,
        data: {
            username,
            password
        }
    });
});

module.exports = router;
