var md5 = require('md5.js');
var ksort = require('ksort.js');
function getSign(data_arr){
    var token='s34Jsdkj8[*sd5Gf';
    var str=assemble(data_arr);
    return (md5.md5((((md5.md5(str).toUpperCase()))+token))).toUpperCase();

}
function assemble(data_arr)
{
    var that=this;
    var data=data_arr;
    ksort(data);
    var sign = '';
    for(var i in data){
        if(!data[i])continue;
        sign+=i+(data[i].constructor==Array?that.assemble(data[i]):data[i]);
    }
    return sign;
}
module.exports.getSign = getSign
