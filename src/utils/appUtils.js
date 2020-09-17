import {ShowMessage} from "./log";


/**
 * 关闭APP
 * @param packageName
 */
export function endApp(packageName) {
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
export function launchOpenApp(packageName) {
    let onPackage = currentPackage() === packageName;
    if (!onPackage) {
        ShowMessage("打开" + packageName)
        launch(packageName);
        sleep(3000);
        back();
    }
}

export function clickText(str, coordinate) {
    var btn = text(str);
    if (btn.exists()) {
        log(btn.findOnce())
        btn.findOnce().click();
    } else {
        click(coordinate[0], coordinate[1])
    }
}
