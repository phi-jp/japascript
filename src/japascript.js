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
