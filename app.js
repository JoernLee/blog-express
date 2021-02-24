var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

// 导入是一个函数，直接把session库放进去初始化
const RedisStore = require('connect-redis')(session);

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// 引用我们写的路由
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(logger('dev',{
//     stream: process.stdout
// }));
const ENV = process.env.NODE_ENV;
if (ENV !== 'production') {
    // 开发/测试环境
    app.use(logger('dev'));
} else {
    // 线上 - 写入日志文件基于流
    const logFileName = path.join(__dirname, 'logs', 'access.log');
    const writeStream = fs.createWriteStream(logFileName, {
        flags: 'a'
    });
    app.use(logger('combined'), {
        stream: writeStream
    })
}

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// 把redis连接对象和store整合
// 操作store就是间接操作redis数据库了,然后丢给session使用
const redisClient = require('./db/redis');
const sessionStore = new RedisStore({
    // 配置
    client: redisClient
});
// 解析路由之前处理session - 后续就能拿到session值了
app.use(session({
    secret: 'WJiol_#23123_', // 加密时的密钥 - session密码
    cookie: {
        path: '/', // 这个是默认配置，写不写无所谓
        httpOnly: true, // 也是默认配置
        maxAge: 24 * 60 * 60 * 1000 //失效时间 代替之前的expires
    },
    store: sessionStore // 在这里其实session就和redis关联了，后续不需要单独操作session进redis了
}));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// 注册我们自己的路由
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
