import GoldCoins from "./GoldCoins";
import {ShowMessage} from "../utils/log";
import {clickText, endApp, launchOpenApp} from "../utils/appUtils";

class ShopTask extends GoldCoins {
    constructor() {
        super();
        this.Tasks_Activity = "com.taobao.weex.WXActivity"
    }

    checkAndGoActivity() {
        let _this = this;
        sleep(4000);
        if (isOnCorrectPage()) return;

        switch (currentActivity()) {
            case this.Home_Activity:
                ShowMessage("在主页，准备跳至淘金币页...");
                clickText("领淘金币", [540, 960]);
                sleep(3000);
                ShowMessage("已跳至淘金币页！");
            case this.Coins_Activity:
                ShowMessage("在淘金币页，准备跳至任务页...");
                className("android.view.View").depth(10).drawingOrder(0).find().get(1).child(0).click();
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

    getTaskCounts(ActionsList) {
        return ActionsList.length;
    }

    getTaskList() {
        let list = className("android.widget.FrameLayout").column(-1).depth(3).clickable(true).find();
        log(list.length)
        list = list.filter(s => s.childCount && (s.childCount() === 3))
        return list;
    }

    getSubtask(ActionsList, index) {
        let taskBtn, taskName, taskText;
        let Action = ActionsList[index];
        taskBtn = Action;
        taskName = Action.child(0).desc();
        taskText = "";
        return {taskBtn, taskName, taskText}
    }

    doTask(taskBtn, taskText, taskName, repeatCallback) {
        this.PerformVisit(taskBtn, taskName);
    }

    collectReward() {

    }
}

export default ShopTask;
