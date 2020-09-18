import { ShowMessage } from "./log";


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

export function clickText(str, coordinate = [0, 0], class_name = undefined) {
    let reg = str instanceof RegExp ? str : new RegExp(`.*${str}.*`);
    let btn = class_name ? className(class_name).textMatches(reg) : textMatches(reg);
    if (btn.exists()) {
        log(`点击【${reg}】按钮(${btn.find().length})`)
        btn.findOnce().click();
        sleep(2000);
    } else {
        log("没有找到按钮，点击传入坐标")
        click(coordinate[0], coordinate[1])
    }
}
