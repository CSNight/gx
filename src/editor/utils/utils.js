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

export function objDiff(ob1, ob2, res) {
    for (let key in ob1) {
        let diff = false;
        let val1 = ob1[key]
        if (val1 || ob2[key]) {
            if (val1 instanceof Object) {
                let ch = objDiff(val1, ob2[key], {});
                if (Object.keys(ch).length > 0) {
                    res[key] = ch;
                }
            } else {
                if (key === 'fill' || key === 'stroke') {
                    diff = val1.toUpperCase() !== ob2[key].toUpperCase()
                } else {
                    diff = val1 !== ob2[key]
                }
            }
        } else if (!val1 && !ob2[key]) {
            diff = false
        } else {
            diff = true;
        }
        if (diff) {
            res[key] = val1;
        }
    }
    return res;
}

export function guid2() {
    /**
     * @return {string}
     */
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16)
            .substring(1);
    }

    return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
}