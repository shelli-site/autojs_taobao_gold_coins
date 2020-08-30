// 任务页Activity
var Tasks_Activity = "com.taobao.browser.exbrowser.BrowserUpperActivity";
/**
 * @brief 检查是否在淘宝上
 */
function IsOnTaobao() {

    var retval = currentPackage() === "com.taobao.taobao";
    log("call -> 检查是否在淘宝上 -> " + retval);
    return retval;
}

/**
 * @brief 检查是否在任务页上
 */
function IsOnDailyTaskSheet() {
    var retval = Tasks_Activity === currentActivity();
    log("call -> 检查是否在任务页上 -> " + retval);
    return retval;
}

/**
 * @brief 首页跳至淘金币页
 */
function HomeP_to_CoinsP() {
    if (text("领淘金币").exists()) {
        text("领淘金币").findOnce().click();
    } else {
        click(540, 960);
    }
}

/**
 * @brief 淘金币页跳至任务页
 */
function CoinsP_to_TasksP() {
    var btn = className("android.widget.Button").text("赚金币");
    if (btn.exists()) {
        btn.findOnce().click();
    }
}


/**
 * @brief 一键领取任务奖励
 */
function OneKeyCollection() {
    var btn = className("android.widget.Button").text("一键领取")
    if (btn.exists()) {
        btn.findOnce().click();
    } else {
        click(945, 790);
    }
}

module.exports = {
    IsOnTaobao: IsOnTaobao,
    IsOnDailyTaskSheet: IsOnDailyTaskSheet,
    HomeP_to_CoinsP: HomeP_to_CoinsP,
    CoinsP_to_TasksP: CoinsP_to_TasksP,
    OneKeyCollection: OneKeyCollection,
};
