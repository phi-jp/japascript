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
            if (script.type == "text/japascript") {
                if (script.src) {
                    _load(script.src, function(data) {
                        var code = _parse(data);
                        eval(code);
                    });
                }
                else {
                    var code = _parse(script.innerText);
                    eval(code);
                }
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
            var ma = null;
            var indent = line.match(/^[　]*/)[0].length;

            if (/^[＃#]/.test(line)) {
                // コメント
            }
            else if (/[=＝は]/.test(line)) {
                var d = line.split(/[=＝は]/);
                var key = d[0];
                var value = d[1];
                tasks.push({
                    type: "variable",
                    indent: indent,
                    data: {
                        key: key,
                        value: value,
                    }
                });
            }
            else if (/[（]/.test(line)) {
                var name = line.split(/[（]/)[0];
                var arg = line.match(/（(.*)）/)[1];
                tasks.push({
                    type: "exec",
                    indent: indent,
                    data: {
                        name: name.trim(),
                        arg: arg,
                    },
                });
            }
            else if (/くりかえし/.test(line)) {
                var count = line.match(/([０-９]+)かい/)[1];
                tasks.push({
                    type: "for",
                    indent: indent,
                    data: {
                        count: count
                    }
                });
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

        var toMethod = function(v) {
            return {
                "見る": "alert",
                "警告": "alert",
                "ログ": "console.log",
                "書く": "document.write",
                "かく": "document.write",
            }[v];
        };

        console.log("tasks", tasks);


        var codes = [];
        var prevTask = null;

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

                str = "{name}({arg});".format({
                    name: toMethod(d.name),
                    arg: toVariable(d.arg),
                });
            }
            else if (task.type == 'for') {
                var d = task.data;
                var count = toVariable(d.count);

                str = "for(var カウンタ=0; カウンタ<{0}; ++カウンタ)".format(count);
            }

            // インデント
            for (var i=0,len=task.indent; i<len; ++i) {
                str = '    ' + str;
                console.log("hoge");
            }

            // インデントによる括弧
            if (prevTask) {
                // 字上げ
                if (task.indent > prevTask.indent) {
                    codes.push(_indent(prevTask.indent) + '{');
                }
                // 字下げ
                else if (task.indent < prevTask.indent) {
                    codes.push(_indent(task.indent) + '}');
//                    codes.push('}');
                }
            }

            // 追加
            codes.push(str);

            // 保持
            prevTask = task;
        });
        
        // インデント調整
        for (var i=prevTask.indent; i>0; --i) {
            codes.push(_indent(i-1) + '}')
        }

        var code = codes.join('\n');

        console.log('-----------');
        console.log(code);
        console.log('-----------');

        return code;
    };

    var _indent = function(indent, format) {
        format = format || '    ';

        var str = '';
        for (var i=0; i<indent; ++i) {
            str += format;
        }

        return str;
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
