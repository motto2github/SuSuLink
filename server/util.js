"use strict";
exports.__esModule = true;
var ResInfo = (function () {
    function ResInfo(code, msg, data) {
        if (code === void 0) { code = 0; }
        if (msg === void 0) { msg = 'fail'; }
        if (data === void 0) { data = null; }
        this.code = code;
        this.msg = msg;
        this.data = data;
    }
    ResInfo.prototype.set = function (code, msg, data) {
        this.code = code;
        this.msg = msg;
        if (data !== undefined) {
            this.data = data;
        }
        return this;
    };
    return ResInfo;
}());
exports.ResInfo = ResInfo;
