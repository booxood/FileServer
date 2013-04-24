/**
 * Created by JetBrains WebStorm.
 * User: Administrator
 * Date: 12-12-24
 * Time: 下午8:57
 * To change this template use File | Settings | File Templates.
 */
exports.Expires = {
    fileMatch: /^(gif|png|jpg|js|css)$/ig,
    maxAge: 60*60*24*365
};

exports.Compress = {
    match: /css|js|html/ig
};

exports.Welcome = {
    file: 'index.html'
}