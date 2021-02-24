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
const loginCheck = require('../middleware/loginCheck');


// 这里的路由地址需要和父路由（app.js中注册）结合，路由隔离
// 按照之前方式每次都要重复写上父路由
router.get('/list', (req, res, next) => {
    // express通过json-api可以自动解析json为字符串返回
    // 同时还会设置返回头Content-type为json格式

    // 业务逻辑直接参考之前的内容
    let author = req.query.author || '';  // 这里的query在app.js由框架处理过了
    const keyword = req.query.keyword || '';

    if (req.query.isadmin) {
        console.log('is admin');
        // 管理员界面
        if (req.session.username === null) {
            console.error('is admin, but no login');
            // 未登录
            res.json(new ErrorModel('未登录'));
            return
        }
        // 强制查询自己的博客 - 现在有了session了
        author = req.session.username;
    }

    const result = getList(author, keyword);
    return result.then(listData => {
        // return new SuccessModel(listData)
        res.json(new SuccessModel(listData)); // 直接返回Model数据就行了，不需要return了
    });

});

router.get('/detail', (req, res, next) => {
    const result = getDetail(req.query.id);
    return result.then(data => {
        res.json(new SuccessModel(data));
    })
});

router.post('/new', loginCheck, (req, res, next) => {
    // 把原先的登录验证可以借助刚写的中间件
    req.body.author = req.session.username;
    const result = newBlog(req.body);
    return result.then(data => {
        res.json(new SuccessModel(data));
    })
});

router.post('/update', loginCheck, (req, res, next) => {
    // 把原先的登录验证可以借助刚写的中间件
    const result = updateBlog(req.query.id, req.body);
    return result.then(data => {
        if (data) {
            res.json(new SuccessModel(data));
        }else {
            res.json(new ErrorModel('更新博客失败'));
        }
    })
});

router.post('/del', loginCheck, (req, res, next) => {
    // 把原先的登录验证可以借助刚写的中间件
    const result = delBlog(req.query.id, req.session.username);
    return result.then(data => {
        if (data) {
            res.json(new SuccessModel());
        }else {
            res.json(new ErrorModel('删除博客失败'));
        }
    })
});

module.exports = router;
