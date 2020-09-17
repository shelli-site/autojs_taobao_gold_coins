import {ShowMessage} from "../utils/log";
import {endApp, launchOpenApp} from "../utils/appUtils";

export const debug = false;
// 获取设备屏幕信息
export const height = device.height;
export const width = device.width;

class Task {


    constructor() {
        this.packageName = "com.taobao.taobao";
        /**
         *
         * @type {*[]}
         */
        this.CompletedTaskList = [];
    }

    /**
     * 执行任务
     */
    run() {
        this.init();
        this.checkAndGoActivity();
        while (this.performTasks()) {
        }
        this.collectReward();
        this.end();
    }

    /**
     * 初始化
     */
    init() {
        launchOpenApp(this.packageName)
    }

    /**
     * 进入指定活动界面 子类实现
     */
    checkAndGoActivity() {
        throw new Error("请实现[checkAndGoActivity]方法");
    }

    /**
     * 执行任务
     */
    performTasks() {
        if (debug) ShowMessage("执行任务");
        log(`获取任务列表`)
        let ActionsList = this.getTaskList()
        // hasTask 是否还有可完成任务
        // recaptureTask 是否重新获取任务列表
        let hasTask = false, recaptureTask = true;
        if (ActionsList) {
            let taskCounts = this.getTaskCounts(ActionsList);
            if (debug) ShowMessage("已获取" + taskCounts + "个任务")
            for (let i = 0; recaptureTask && i < taskCounts; ++i) {
                recaptureTask = false;
                let {taskBtn, taskText, taskName} = this.getSubtask(ActionsList, i);
                if (taskBtn.text() === "领取奖励") {
                    taskBtn.click();
                    sleep(1000)
                } else if (this.CompletedTaskList.indexOf(taskName) !== -1) {
                    recaptureTask = true;
                    continue;
                } else {
                    if (debug) ShowMessage(`${taskName} ${taskText} ${taskBtn.text()}`)
                    this.doTask(taskBtn, taskText, taskName, () => {
                        recaptureTask = true;
                    });
                }
                this.CompletedTaskList.push(taskName);
            }
        }
        log("=======已完成任务列表=======")
        this.CompletedTaskList.forEach((task, i) => log(`${i} - [${task}]`))
        log("==========================")
        if (!recaptureTask) {
            log("所有任务已完成")
            hasTask = true;
        }
        return hasTask;
    }

    /**
     * 领取奖励
     */
    collectReward() {
        log(`领取奖励。`)
    }

    /**
     * 结束
     */
    end() {
        log(`任务结束，关闭应用。`)
        endApp(this.packageName)
    }

    /**
     * 获取任务列表
     * @returns {*[]}
     */
    getTaskList() {
        throw new Error("请实现[getTaskList]方法");
    }

    /**
     * 获取任务个数
     * @param ActionsList
     * @returns {*}
     */
    getTaskCounts(ActionsList) {
        return ActionsList.childCount();
    }

    /**
     * 获取子任务
     * @param ActionsList
     * @param index
     * @returns {{taskBtn: *, taskName: *, taskText: *}}
     */
    getSubtask(ActionsList, index) {
        throw new Error("请实现[getSubtask]方法");
    }

    /**
     * 任务执行分支逻辑
     * @param taskBtn
     * @param taskText
     * @param taskName
     * @param repeatCallback
     */
    doTask(taskBtn, taskText, taskName, repeatCallback) {
        throw new Error("请实现[doTask]方法");
    }

    /**
     * 滑动浏览
     * @param taskBtn
     * @param taskName
     * @param timeout
     * @constructor
     */
    PerformVisit(taskBtn, taskName, timeout = 10000) {
        if (!taskBtn) return;
        let actionName = taskBtn.text();
        taskBtn.click();
        ShowMessage(`点击【${taskName}】`);
        sleep(4000);
        gesture(1000, [width / 2, height - 400], [width / 2, 0], [width / 2, height - 400]);
        log("第一次滑动")
        sleep(2000);
        gesture(1000, [width / 2, height - 400], [width / 2, 0], [width / 2, height - 400]);
        log("第二次滑动")
        sleep(2000);
        gesture(1000, [width / 2, height - 400], [width / 2, 0], [width / 2, height - 400]);
        log("第三次滑动")
        // 鉴于前面操作需要一部分时间，这里减少一些
        this.WaitVisitFinished(timeout);
        this.go_back();
        // 防止淘宝骚操作，若返回主界面，尝试重新进入活动界面
        this.checkAndGoActivity();
        if (debug) ShowMessage(`完成【${actionName}】`);
    }

    /**
     *  等待访问操作完成（通过搜索关键字）
     *
     * @param Timeout 超时值（默认为15s）
     */
    WaitVisitFinished(Timeout = 15000) {
        let Timer = 0
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
}

export default Task;
