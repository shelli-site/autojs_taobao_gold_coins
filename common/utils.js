function ShowMessage(msg) {
    log(msg);
    sleep(1500);
    toast(msg);
    sleep(1500);
}

function endApp(packageName) {
    openAppSetting(packageName);
    sleep(2500);
    click(360, 2280);
    sleep(1000);
    clickText("确定", [800, 2250]);
    sleep(500);
    back();
}

function clickText(str, coordinate) {
    var btn = text(str);
    if (btn.exists()) {
        log(btn.findOnce())
        btn.findOnce().click();
    } else {
        click(coordinate[0], coordinate[1])
    }
}

module.exports = {
    ShowMessage: ShowMessage,
    endApp: endApp,
    clickText: clickText,
};