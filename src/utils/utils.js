export function dateFormat(fmt, date) {
    let ret;
    let opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
    }
    return fmt;
}

export function getFileSize(size) {
    if (size < 0) {
        return "未知"
    }
    if (size < 1024) {
        return Number(size).toFixed(2) + "B"
    } else if (size >= 1024 && size < Math.pow(1024, 2)) {
        return Number(size / 1024.0).toFixed(2) + "KB"
    } else if (size >= Math.pow(1024, 2) && size < Math.pow(1024, 3)) {
        return Number(size / Math.pow(1024.0, 2)).toFixed(2) + "MB"
    } else {
        return Number(size / Math.pow(1024.0, 3)).toFixed(2) + "GB"
    }
}

export function parseSec(sec) {
    let d = Math.floor(sec / (60 * 60 * 24));
    let h = Math.floor((sec - (60 * 60 * 24 * d)) / 3600);
    let m = Math.floor((sec - 60 * 60 * 24 * d - 3600 * h) / 60);
    let s = Math.floor(sec - 60 * 60 * 24 * d - 3600 * h - 60 * m);
    let t = "";
    if (d > 0) {
        t += d + ":"
    }
    if (h > 0) {
        t += h + ":"
    }
    if (m > 0) {
        t += m + ":"
    }
    if (s > 0) {
        t += s
    }
    return t;
}

export function guid() {
    /**
     * @return {string}
     */
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16)
            .substring(1);
    }

    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-"
        + S4() + S4() + S4());
}

export function isNum(obj) {
    return obj === +obj
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
    return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
    if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
        ele.className = ele.className.replace(reg, ' ')
    }
}