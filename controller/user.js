const {exec, escape} = require('../db/mysql');
const {genPassword} = require('../utils/cryp');

const login = (username, password) => {
    username = escape(username);

    // 生成加密密码
    password = genPassword(password);
    password = escape(password);

    const sql = `
        select username, realname from users where username=${username} and password=${password}
    `;
    // 防止sql注入
    if (!username || !password) {
        return Promise.resolve({});
    }

    // 检查用户名和密码格式
    if (username.length < 3 || password.length < 6) {
        return Promise.resolve({});
    }
    // console.log('sql is', sql)
    return exec(sql).then(rows => {
        return rows[0] || {}
    })
};

module.exports = {
    login
};