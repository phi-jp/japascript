/**
 * phi
 */

(function(np){

    // core
    np.ウィンドウ = window;
    np.警告 = alert;
    np.確認 = confirm;
    np.ドキュメント = document;
    np.ドキュメント.書く = document.write;
    
    
    // 配列
    np.配列 = Array;
    np.配列.原型    = Array.prototype;
    np.配列.連結    = Array.prototype.concat;
    np.配列.結合    = Array.prototype.join;
    np.配列.出す    = Array.prototype.pop;
    np.配列.入れる   = Array.prototype.push;
    np.配列.逆順    = Array.prototype.reverse;
    np.配列.移す    = Array.prototype.shift;
    np.配列.切り取る = Array.prototype.slice;
    np.配列.並び替え = Array.prototype.sort;

})(window);


(function(global) {

    var MAP = {
        "警告": "alert",
        "（": "(",
        "）": ")",
        "”": "\"",
        "；": ";",
    };

    this.japascript = function() {
        var each = Array.prototype.forEach;
        each.call(document.scripts, function(script) {
            if (script.type == "text/japascript" && script.src) {
                _load(script.src, function(data) {
                    var code = _parse(data);
                    eval(code);
                });
            }
            else {
                // var code = _convert(script.innerText);
                // eval(code);
            }
        });
    };

    var _parse = function(script) {
        var lines = script.split('\n');
        var tasks = [];

        for (var i=0,len=lines.length; i<len; ++i) {
            var line = lines[i];
            var j = 0;
            var str = '';
            var ch = '';
            while ((ch = line[j++]) != null) {
                if (/^[＃#]/.test(ch)) {
                    // コメント
                    break;
                }
                if (/[=＝は]/.test(ch)) {
                    var value = line.split(ch)[1];
                    tasks.push({
                        type: "variable",
                        data: {
                            key: str,
                            value: value,
                        },
                    });
                }
                else if (/[（]/.test(ch)) {
                    var arg = line.match(/（(.*)）/)[1];
                    tasks.push({
                        type: "exec",
                        data: {
                            name: str,
                            arg: arg,
                        },
                    });
                }
                else {
                    str += ch;
                }
            }
        }


        var toVariable = function(v) {
            var rst = '';
            if (v[0] == "「") {
                rst = v.replace(/[「」]/g, '"');
            }
            // 数値
            else if(/^[０-９]/.test(v)) {
                rst = v.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
                    return String.fromCharCode(s.charCodeAt(0)-0xFEE0);
                });
            }
            // 変数
            else {
                rst = v;
            }

            return rst;
        };

        console.log("tasks", tasks);


        var codes = [];

        tasks.forEach(function(task) {
            var str = '';
            if (task.type == 'variable') {
                var d = task.data;

                str = "var {key}={value};".format({
                    key: d.key,
                    value: toVariable(d.value),
                });
            }
            else if (task.type == 'exec') {
                var d = task.data;

                str = "console.log({arg})".format({
                    key: d.key,
                    arg: toVariable(d.arg),
                });
            }
            codes.push(str);
        });

        var code = codes.join('\n');

        console.log('-----------');
        console.log(code);
        console.log('-----------');

        return code;
    };

    var _convert = function(script) {

        var jpCode = script;

        for (var key in MAP) {
            var value = MAP[key];
            var re = new RegExp(key, "g");
            jpCode = jpCode.replace(re, value);
        }

        return jpCode;
    };

    var _load = function(path, fn) {
        console.log(path);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", path, true);
        xhr.send(null);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                fn(xhr.responseText);
            }
        };
    };

    String.prototype.format = function(arg) {
        // 置換ファンク
        var rep_fn = undefined;
        
        // オブジェクトの場合
        if (typeof arg == "object") {
            /** @ignore */
            rep_fn = function(m, k) { return arg[k]; }
        }
        // 複数引数だった場合
        else {
            var args = arguments;
            /** @ignore */
            rep_fn = function(m, k) { return args[ parseInt(k) ]; }
        }
        
        return this.replace( /\{(\w+)\}/g, rep_fn );
    };


})(this);
