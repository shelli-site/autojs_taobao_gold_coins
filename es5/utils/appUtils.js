"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.endApp = endApp;
exports.launchOpenApp = launchOpenApp;
exports.clickText = clickText;

var _log = require("./log");

/**
 * 关闭APP
 * @param packageName
 */
function endApp(packageName) {
    openAppSetting(packageName);
    sleep(2500);
    click(360, 2280);
    sleep(1000);
    clickText("确定", [800, 2250]);
    back();
}

/**
 * 检查打开APP
 */
function launchOpenApp(packageName) {
    var onPackage = currentPackage() === packageName;
    if (!onPackage) {
        (0, _log.ShowMessage)("打开" + packageName);
        launch(packageName);
        sleep(3000);
        back();
    }
}

function clickText(str) {
    var coordinate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0];
    var class_name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

    var reg = str instanceof RegExp ? str : new RegExp(".*" + str + ".*");
    var btn = class_name ? className(class_name).textMatches(reg) : textMatches(reg);
    if (btn.exists()) {
        log("\u70B9\u51FB\u3010" + reg + "\u3011\u6309\u94AE");
        btn.findOnce().click();
        sleep(2000);
    } else {
        log("没有找到按钮，点击传入坐标");
        click(coordinate[0], coordinate[1]);
    }
}