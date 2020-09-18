import Task, { debug } from "./Task";
import { ShowMessage } from "../utils/log";
import { endApp, launchOpenApp, clickText } from "../utils/appUtils";


class GoldCoins extends Task {
    constructor() {
        super();
        /**
         * 任务页Activity 默认淘金币页
         * @type {string}
         */
        this.Tasks_Activity = "com.taobao.browser.exbrowser.BrowserUpperActivity";
        this.Home_Activity = "com.taobao.tao.TBMainActivity";
        this.Coins_Activity = "com.taobao.browser.BrowserActivity";
    }

    checkAndGoActivity() {
        let _this = this;
        sleep(4000);
        if (isOnCorrectPage()) return;
        log(currentActivity())
        switch (currentActivity()) {
            case this.Home_Activity:
                ShowMessage("在主页，准备跳至淘金币页...");
                clickText("领淘金币", [540, 960]);
                sleep(3000);
                ShowMessage("已跳至淘金币页！");
            case this.Coins_Activity:
                ShowMessage("在淘金币页，准备跳至任务页...");
                clickText("赚金币", [0, 0], "android.widget.Button");
                ShowMessage("已跳至任务页！");
                break;
            default:
                endApp(this.packageName)
                launchOpenApp(this.packageName)
                break;
        }
        if (!isOnCorrectPage()) {
            ShowMessage("无法跳至任务页！");
            endApp(this.packageName);
            this.checkAndGoActivity();
        }

        function isOnCorrectPage() {
            return _this.Tasks_Activity === currentActivity()
        }
    }

    getTaskList() {
        return className("android.widget.ListView").depth(9).findOnce();
    }

    getSubtask(ActionsList, index) {
        let taskBtn, taskName, taskText;
        let Action = ActionsList.child(index);
        taskBtn = Action.child(1);
        taskName = Action.child(0).child(0).text();
        taskName = taskName.substring(0, taskName.length - 5);
        taskText = Action.child(0).child(1).text();
        return { taskBtn, taskName, taskText }
    }

    doTask(taskBtn, taskText, taskName, repeatCallback) {
        if (taskBtn.text() === "已完成") {
            ShowMessage(`【${taskName}】已完成`);
            repeatCallback();
            return;
        }
        ShowMessage(`执行【${taskName}(${taskBtn.text()})】任务`);
        if (/.*(逛|浏览)?\d+[s|秒](立得)?.*/.test(taskText)) {
            this.PerformVisit(taskBtn, taskName);
        } else {
            switch (taskName) {
                case "看免费小说领能量":
                case "签到领取话费充值金":
                case "签到领话费充值金":
                case "逛好店领一大波金币":
                    this.PerformVisit(taskBtn, taskName);
                    break;
                case "逛农场领免费水果":
                    this.PerformClick(taskBtn, taskName);
                    break;
                case "淘宝人生逛街领能量":
                    this.PerformLifeClick(taskBtn, taskName);
                    break;
                default:
                    repeatCallback();
            }
        }
    }

    collectReward() {
        this.go_back();
        sleep(1500);
        let btn = className("android.widget.Button").depth(10).textMatches(/.*(领取)?淘?金币.*/).drawingOrder(0).clickable(true).longClickable(false);
        if (btn.find().length > 1)
            btn.findOne().click();
        sleep(1500);
    }

    PerformClick(taskBtn, taskName) {
        // todo 逛农场领免费水果，没写
        this.go_back();
        // 防止淘宝骚操作，若返回主界面，尝试重新进入活动界面
        this.checkAndGoActivity();
    }

    PerformLifeClick(taskBtn, taskName) {
        // todo 淘宝人生逛街领能量，没写
        this.go_back();
        // 防止淘宝骚操作，若返回主界面，尝试重新进入活动界面
        this.checkAndGoActivity();
    }

}

export default GoldCoins
