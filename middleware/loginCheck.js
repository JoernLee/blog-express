const {ErrorModel} = require('../model/resModel');

// 输出中间件函数 - 符合中间件函数格式
module.exports = (req, res, next) => {
    if (req.session.username) {
        // 已登录
        next();
        return;
    }
    res.json(
        new ErrorModel('未登录')
    );
};