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
    sleep(500);
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

function clickText(str, coordinate) {
    var btn = text(str);
    if (btn.exists()) {
        log(btn.findOnce());
        btn.findOnce().click();
    } else {
        click(coordinate[0], coordinate[1]);
    }
}