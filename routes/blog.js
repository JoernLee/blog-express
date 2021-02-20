var express = require('express');
var router = express.Router();

// 这里的路由地址需要和父路由（app.js中注册）结合，路由隔离
// 按照之前方式每次都要重复写上父路由
router.get('/list', function (req, res, next) {
    // express通过json-api可以自动解析json为字符串返回
    // 同时还会设置返回头Content-type为json格式
    res.json({
        errno: 0,
        data: [1, 2, 3]
    });
});

module.exports = router;
