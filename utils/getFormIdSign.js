var md5 = require('../utils/md5.js');
var ksort = require('../utils/ksort.js');

function getFormIdSign(data_arr) {
  var token = 'gZfKOYaO39ecBFpy';
  var str = assembleFormId(data_arr);
  return (md5.md5((((md5.md5(str).toUpperCase())) + token))).toUpperCase();
}

function assembleFormId(data_arr) {
  var that = this;
  var data = data_arr;

  ksort(data);
  var sign = '';
  for (var i in data) {
    sign += i + (data[i].constructor == Array ? that.assembleFormId(data[i]) : data[i]);
  }
  return sign;
}

module.exports.getFormIdSign = getFormIdSign