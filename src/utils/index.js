/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}
/**
 * 将数字转换成中文数字
 * @param {Object} num
 */
export function toChineseNum(num){
    if(!['number','string'].includes(typeof num)) return console.error('类型错误：应为number类型或者string类型');

    var newnum = String(num).match(/[0-9]/ig)
    if(newnum.length > 10) return console.error('位数过大，无法计算');

    var tmpnewchar = ''
    for(var i = 0;i < newnum.length; i++){
        switch (newnum[i]) {
            case "0": tmpnewchar += "零";break;
            case "1": tmpnewchar += "一"; break;
            case "2": tmpnewchar += "二"; break;
            case "3": tmpnewchar += "三"; break;
            case "4": tmpnewchar += "四"; break;
            case "5": tmpnewchar += "五"; break;
            case "6": tmpnewchar += "六"; break;
            case "7": tmpnewchar += "七"; break;
            case "8": tmpnewchar += "八"; break;
            case "9": tmpnewchar += "九"; break;
        }
        switch (newnum.length - i - 1) {
            case 0: tmpnewchar = tmpnewchar; break;
            case 1: if (newnum[i] != 0) tmpnewchar = tmpnewchar + "十"; break;
            case 2: if (newnum[i] != 0) tmpnewchar = tmpnewchar + "百"; break;
            case 3: if (newnum[i] != 0) tmpnewchar = tmpnewchar + "千"; break;
            case 4: tmpnewchar = tmpnewchar + "万"; break;
            case 5: if (newnum[i] != 0) tmpnewchar = tmpnewchar + "十"; break;
            case 6: if (newnum[i] != 0) tmpnewchar = tmpnewchar + "百"; break;
            case 7: if (newnum[i] != 0) tmpnewchar = tmpnewchar + "千"; break;
            case 8: tmpnewchar = tmpnewchar + "亿"; break;
            case 9: tmpnewchar = tmpnewchar + "十"; break;
        }
    }

    while (tmpnewchar.search("零零") != -1 || tmpnewchar.search("零亿") != -1 || tmpnewchar.search("亿万") != -1 || tmpnewchar.search("零万") != -1) {
        tmpnewchar = tmpnewchar.replace("零亿", "亿");
        tmpnewchar = tmpnewchar.replace("亿万", "亿");
        tmpnewchar = tmpnewchar.replace("零万", "万");
        tmpnewchar = tmpnewchar.replace("零零", "零");
    }

    if (tmpnewchar.indexOf("一十") == 0) {
        tmpnewchar = tmpnewchar.substr(1);
    }

    if (tmpnewchar.lastIndexOf("零") == tmpnewchar.length - 1) {
        tmpnewchar = tmpnewchar.substr(0, tmpnewchar.length - 1);
    }
    return tmpnewchar
}

export function  formatterStatus(status){
	//(0, “未打卡”), (1, “正常”), (2, “迟到”) , (3, “早退”) , (4, “旷工”) , (5, “病假”), (6, “事假”), (7, “外出”) , (8, “调休”) , (9, “休息”) , (10, “加班”)
	let text = ''
	switch (status){
	  case 0:
		text = '未打卡'
		break;
	  case 1:
		text = '正常'
		break;
	  case 2:
		text = '迟到'
		break;
	  case 3:
		text = '早退'
		break;
	  case 4:
		text = '旷工'
		break;
	  case 5:
		text = '病假'
		break;
	  case 6:
		text = '事假'
		break;
	  case 7:
		text = '外出'
		break;
	  case 8:
		text = '调休'
		break;
	  case 9:
		text = '休息'
		break;
	  case 9:
		text = '加班'
		break;
	  default:
		text = ''
		break;
	}
	return text
}
/**
 * 千位符
 * @param {Object} num
 */
export function toThousands(num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}

/**
 * @param {Function} fn 防抖函数
 * @param {Number} delay 延迟时间
 */
export function debounce(fn, delay) {
  var timer;
  return function () {
    var context = this;
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}
