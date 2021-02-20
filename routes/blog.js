const express = require('express');
const router = express.Router();
const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} = require('../controller/blog');
const {SuccessModel, ErrorModel} = require('../model/resModel');


// 这里的路由地址需要和父路由（app.js中注册）结合，路由隔离
// 按照之前方式每次都要重复写上父路由
router.get('/list', function (req, res, next) {
    // express通过json-api可以自动解析json为字符串返回
    // 同时还会设置返回头Content-type为json格式

    // 业务逻辑直接参考之前的内容
    let author = req.query.author || '';  // 这里的query在app.js由框架处理过了
    const keyword = req.query.keyword || '';

    /*if (req.query.isadmin) {
        // 管理员界面
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            // 未登录
            return loginCheckResult
        }
        // 强制查询自己的博客
        author = req.session.username
    }*/

    const result = getList(author, keyword);
    return result.then(listData => {
        // return new SuccessModel(listData)
        res.json(new SuccessModel(listData)); // 直接返回Model数据就行了，不需要return了
    });

});

module.exports = router;
