var Utils = require("./common/utils.js");
var ShowMessage = Utils.ShowMessage;
var endApp = Utils.endApp;
var Taobao = require("./taobao/taobao.js");
var IsOnTaobao = Taobao.IsOnTaobao;
var IsOnDailyTaskSheet = Taobao.IsOnDailyTaskSheet;
var HomeP_to_CoinsP = Taobao.HomeP_to_CoinsP;
var CoinsP_to_TasksP = Taobao.CoinsP_to_TasksP;
var OneKeyCollection = Taobao.OneKeyCollection;

var Unlock = require("./common/Unlock.js");
var unlock = new Unlock();

var debug = false;

// 应用名
var appName = "手机淘宝";
// 首页
var Home_Activity = "com.taobao.tao.TBMainActivity";
// 金币页
var Coins_Activity = "com.taobao.browser.BrowserActivity";
// 获取设备屏幕信息
var height = device.height;
var width = device.width;

function TB() {
    this.run = function () {
        Init();
        CheckAndGoActivity();
        while (PerformDailyTasksAction());
        PerformCollectCoinsActions();
        End();
    }
}

/**
 * @brief 初始化
 */
function Init() {
    unlock.unlock();
    ShowMessage(
        "欢迎来到领淘金币脚本\n" +
        "设备宽: " + width + "\n" +
        "设备高: " + height + "\n" +
        "手机型号: " + device.model + "\n" +
        "安卓版本: " + device.release + "\n" +
        "脚本版本: " + "20200816.U1");
    if (!IsOnTaobao()) {
        ShowMessage("打开" + appName)
        launchApp(appName);
        sleep(3000);
        back();
    }
    log("Taobao checking finished");
}

/**
 * @brief 进入指定活动界面
 */
function CheckAndGoActivity() {
    sleep(4000);
    if (IsOnDailyTaskSheet()) return;
    switch (currentActivity()) {
        case Home_Activity:
            ShowMessage("在主页，准备跳至淘金币页...");
            HomeP_to_CoinsP();
            sleep(3000);
            ShowMessage("已跳至淘金币页！");
        case Coins_Activity:
            ShowMessage("在淘金币页，准备跳至任务页...");
            CoinsP_to_TasksP();
            ShowMessage("已跳至任务页！");
            break;
        default:
            restartApp();
            break;
    }
    log(currentActivity());
    if (!IsOnDailyTaskSheet()) {
        ShowMessage("无法跳至任务页！");
        restartApp();
        CheckAndGoActivity();
    }
}

/**
 * @brief 执行日常任务
 */
function PerformDailyTasksAction() {
    if (debug) ShowMessage("执行日常任务");
    if ("undefined" == typeof ActList) {
        ActList = new Array();
    }
    var ActionsList = className("android.widget.ListView").depth(9).findOnce();
    var retVal = false;
    if (ActionsList) {
        var NBChild = ActionsList.childCount();
        if (debug) ShowMessage("已获取" + NBChild + "个任务")
        var incFlag = true;
        for (var i = 0; incFlag && i < NBChild; ++i) {
            incFlag = false;
            var ActionContext = ActionsList.child(i);
            var ActBtn = ActionContext.child(1);
            var ActText = ActionContext.child(0).child(1).text();
            var ActLabel = ActionContext.child(0).child(0).text();
            ActLabel = ActLabel.substring(0, ActLabel.length - 5);
            if (ActBtn.text() == "领取奖励") {
                ActBtn.click();
                sleep(1000)
            } else if (ActList.indexOf(ActLabel) != -1) {
                incFlag = true;
                continue;
            } else {
                if (debug) ShowMessage(ActLabel + " " + ActText + " " + ActBtn.text())
                doTaskAndVisit(ActText, ActLabel, ActBtn, () => { incFlag = true; });
            }
            ActList.push(ActLabel);
        }
    }
    if (!incFlag) retVal = true;
    return retVal;
}

/**
 * @brief 领取金币
 */
function PerformCollectCoinsActions() {
    ShowMessage("任务已完成，领取金币...")
    go_back();
    if (currentActivity() == Home_Activity) {
        ShowMessage("在主页，准备跳至淘金币页...");
        HomeP_to_CoinsP();
        sleep(3000);
        ShowMessage("已跳至淘金币页！");
    }
    if (currentActivity() == Coins_Activity) {
        CollectCoins();
    }

    function CollectCoins() {
        var btn1 = textMatches(".*购后返.*")
        if (btn1.exists()) {
            btn1.findOnce().click();
        }
        sleep(1500);
        var btn2 = textMatches(".*领取?(金币)?.*")
        if (btn2.exists()) {
            btn2.findOnce().click();
        } else {
            click(567, 742);
        }
    }
}

/**
 * @brief 结束
 */
function End() {
    // 保存截图
    endApp("com.taobao.taobao");
    ShowMessage("结束")
}

/**
 * @brief 执行访问动作
 * 
 * @param ActBtn 访问动作的触发按钮
 * @param ActLabel 访问动作的名字
 */
function PerformVisit(ActBtn, ActLabel) {
    if (!ActBtn) return;
    var actionName = ActBtn.text();
    ActBtn.click();
    ShowMessage("点击" + ActLabel);
    sleep(2000);
    swipe(width / 2, height - 400, width / 2, 0, 1000);
    sleep(2000);
    swipe(width / 2, height - 400, width / 2, 0, 1000);
    sleep(2000);
    swipe(width / 2, height - 400, width / 2, 0, 1000);
    // 鉴于前面操作需要一部分时间，这里减少一些
    WaitVisitFinished(10000);
    go_back();
    // 防止淘宝骚操作，若返回主界面，尝试重新进入活动界面
    CheckAndGoActivity();
    if (debug) ShowMessage("完成" + actionName);
}

function PerformClick(ActBtn, ActLabel) {
    if (!ActBtn) return;
    var actionName = ActBtn.text();
    ActBtn.click();
    ShowMessage("点击" + ActLabel);
    click(width / 2, 1700);
    sleep(2000);
    go_back();
    // 防止淘宝骚操作，若返回主界面，尝试重新进入活动界面
    CheckAndGoActivity();
    if (debug) ShowMessage("完成" + actionName);
}

function PerformLifeClick(ActBtn, ActLabel) {
    if (!ActBtn) return;
    var actionName = ActBtn.text();
    ActBtn.click();
    ShowMessage("点击" + ActLabel);
    click(width / 2, 1430);
    sleep(2000);
    go_back();
    // 防止淘宝骚操作，若返回主界面，尝试重新进入活动界面
    CheckAndGoActivity();
    if (debug) ShowMessage("完成" + actionName);
}

/**
 * 返回
 */
function go_back() {
    var activity = currentActivity();
    back();
    sleep(1500);
    var _activity = currentActivity();
    if (activity == _activity) {
        var back_btns = textMatches(".*(返回|离开|淘宝).*").find();
        if (back_btns.nonEmpty()) {
            if (back_btns.findOne(textMatches(".*(返回|离开).*")) != null) {
                back_btns.findOne(textMatches(".*(返回|离开).*")).click();
            } else if (back_btns.findOne(textMatches(".*淘宝.*")) != null) {
                back_btns.findOne(textMatches(".*淘宝.*")).click();
            }
        } else {
            toast("没找到╭(╯^╰)╮");
            restartApp();
        }
    } else {
        return
    }
}

/**
 * @brief 等待访问操作完成（通过搜索关键字）
 * 
 * @param Timeout 超时值（默认为15s）
 */
function WaitVisitFinished(Timeout) {
    if (!Timeout) Timeout = 15000;

    var Timer = 0
    // 这个等待最多15s
    while (
        Timer <= 15000 &&
        !descMatches("(.*)?任务已?完成(.*)?").exists() &&
        !textMatches("(.*)?任务已?完成(.*)?").exists()
    ) {
        sleep(500);
        Timer += 500;
    }
}

/**
 * @brief 重启APP
 */
function restartApp() {
    endApp("com.taobao.taobao");
    sleep(1000);
    launchApp(appName);
    sleep(1000);
}

function doTaskAndVisit(ActText, ActLabel, ActBtn, repeatCallback) {
    if (ActBtn.text() == "已完成") {
        ShowMessage("【" + ActLabel + "】 已完成");
        repeatCallback();
    }
    ShowMessage("执行 【" + ActLabel + "】 任务")
    if (/.*(逛|浏览)?\d+[s|秒](立得)?.*/.test(ActText)) {
        PerformVisit(ActBtn, ActLabel);
    } else {
        switch (ActLabel) {
            case "看免费小说领能量":
            case "签到领取话费充值金":
            case "逛好店领一大波金币":
                PerformVisit(ActBtn, ActLabel);
                break;
            case "逛农场领免费水果":
                PerformClick(ActBtn, ActLabel);
                break;
            case "淘宝人生逛街领能量":
                PerformLifeClick(ActBtn, ActLabel);
                break;
        }
    }
}
module.exports = TB
