"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.width = exports.height = exports.debug = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _log = require("../utils/log");

var _appUtils = require("../utils/appUtils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = exports.debug = false;
// 获取设备屏幕信息
var height = exports.height = device.height;
var width = exports.width = device.width;

var Task = function () {
    function Task() {
        _classCallCheck(this, Task);

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


    _createClass(Task, [{
        key: "run",
        value: function run() {
            this.init();
            this.checkAndGoActivity();
            while (this.performTasks()) {}
            this.collectReward();
            this.end();
        }

        /**
         * 初始化
         */

    }, {
        key: "init",
        value: function init() {
            (0, _appUtils.launchOpenApp)(this.packageName);
        }

        /**
         * 进入指定活动界面 子类实现
         */

    }, {
        key: "checkAndGoActivity",
        value: function checkAndGoActivity() {
            throw new Error("请实现[checkAndGoActivity]方法");
        }

        /**
         * 执行任务
         */

    }, {
        key: "performTasks",
        value: function performTasks() {
            if (debug) (0, _log.ShowMessage)("执行任务");
            log("\u83B7\u53D6\u4EFB\u52A1\u5217\u8868");
            var ActionsList = this.getTaskList();
            // hasTask 是否还有可完成任务
            // recaptureTask 是否重新获取任务列表
            var hasTask = false,
                recaptureTask = true;
            if (ActionsList) {
                var taskCounts = this.getTaskCounts(ActionsList);
                if (debug) (0, _log.ShowMessage)("已获取" + taskCounts + "个任务");
                for (var i = 0; recaptureTask && i < taskCounts; ++i) {
                    recaptureTask = false;

                    var _getSubtask = this.getSubtask(ActionsList, i),
                        taskBtn = _getSubtask.taskBtn,
                        taskText = _getSubtask.taskText,
                        taskName = _getSubtask.taskName;

                    if (taskBtn.text() === "领取奖励") {
                        taskBtn.click();
                        sleep(1000);
                    } else if (this.CompletedTaskList.indexOf(taskName) !== -1) {
                        recaptureTask = true;
                        continue;
                    } else {
                        if (debug) (0, _log.ShowMessage)(taskName + " " + taskText + " " + taskBtn.text());
                        this.doTask(taskBtn, taskText, taskName, function () {
                            recaptureTask = true;
                        });
                    }
                    this.CompletedTaskList.push(taskName);
                }
            }
            log("=======已完成任务列表=======");
            this.CompletedTaskList.forEach(function (task, i) {
                return log(i + " - [" + task + "]");
            });
            log("==========================");
            if (!recaptureTask) {
                log("所有任务已完成");
                hasTask = true;
            }
            return hasTask;
        }

        /**
         * 领取奖励
         */

    }, {
        key: "collectReward",
        value: function collectReward() {
            log("\u9886\u53D6\u5956\u52B1\u3002");
        }

        /**
         * 结束
         */

    }, {
        key: "end",
        value: function end() {
            log("\u4EFB\u52A1\u7ED3\u675F\uFF0C\u5173\u95ED\u5E94\u7528\u3002");
            (0, _appUtils.endApp)(this.packageName);
        }

        /**
         * 获取任务列表
         * @returns {*[]}
         */

    }, {
        key: "getTaskList",
        value: function getTaskList() {
            throw new Error("请实现[getTaskList]方法");
        }

        /**
         * 获取任务个数
         * @param ActionsList
         * @returns {*}
         */

    }, {
        key: "getTaskCounts",
        value: function getTaskCounts(ActionsList) {
            return ActionsList.childCount();
        }

        /**
         * 获取子任务
         * @param ActionsList
         * @param index
         * @returns {{taskBtn: *, taskName: *, taskText: *}}
         */

    }, {
        key: "getSubtask",
        value: function getSubtask(ActionsList, index) {
            throw new Error("请实现[getSubtask]方法");
        }

        /**
         * 任务执行分支逻辑
         * @param taskBtn
         * @param taskText
         * @param taskName
         * @param repeatCallback
         */

    }, {
        key: "doTask",
        value: function doTask(taskBtn, taskText, taskName, repeatCallback) {
            throw new Error("请实现[doTask]方法");
        }

        /**
         * 滑动浏览
         * @param taskBtn
         * @param taskName
         * @param timeout
         * @constructor
         */

    }, {
        key: "PerformVisit",
        value: function PerformVisit(taskBtn, taskName) {
            var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10000;

            if (!taskBtn) return;
            var actionName = taskBtn.text();
            taskBtn.click();
            (0, _log.ShowMessage)("\u70B9\u51FB\u3010" + taskName + "\u3011");
            sleep(4000);
            gesture(1000, [width / 2, height - 400], [width / 2, 0], [width / 2, height - 400]);
            log("第一次滑动");
            sleep(2000);
            gesture(1000, [width / 2, height - 400], [width / 2, 0], [width / 2, height - 400]);
            log("第二次滑动");
            sleep(2000);
            gesture(1000, [width / 2, height - 400], [width / 2, 0], [width / 2, height - 400]);
            log("第三次滑动");
            // 鉴于前面操作需要一部分时间，这里减少一些
            this.WaitVisitFinished(timeout);
            this.go_back();
            // 防止淘宝骚操作，若返回主界面，尝试重新进入活动界面
            this.checkAndGoActivity();
            if (debug) (0, _log.ShowMessage)("\u5B8C\u6210\u3010" + actionName + "\u3011");
        }

        /**
         *  等待访问操作完成（通过搜索关键字）
         *
         * @param Timeout 超时值（默认为15s）
         */

    }, {
        key: "WaitVisitFinished",
        value: function WaitVisitFinished() {
            var Timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 15000;

            var Timer = 0;
            // 这个等待最多15s
            while (Timer <= 15000 && !descMatches("(.*)?任务已?完成(.*)?").exists() && !textMatches("(.*)?任务已?完成(.*)?").exists()) {
                sleep(500);
                Timer += 500;
            }
        }

        /**
         * 返回
         */

    }, {
        key: "go_back",
        value: function go_back() {
            var activity = currentActivity();
            back();
            sleep(1500);
            var _activity = currentActivity();
            if (activity === _activity) {
                var back_btns = textMatches(".*(返回|离开|淘宝).*").find();
                if (back_btns.nonEmpty()) {
                    if (back_btns.findOne(textMatches(".*(返回|离开).*")) != null) {
                        back_btns.findOne(textMatches(".*(返回|离开).*")).click();
                    } else if (back_btns.findOne(textMatches(".*淘宝.*")) != null) {
                        back_btns.findOne(textMatches(".*淘宝.*")).click();
                    }
                } else {
                    toast("没找到╭(╯^╰)╮");
                    (0, _appUtils.endApp)(this.packageName);
                    sleep(1000);
                    (0, _appUtils.launchOpenApp)(this.packageName);
                    sleep(1000);
                }
            } else {
                return;
            }
        }

        /**
         * 返回
         */

    }, {
        key: "go_back",
        value: function go_back() {
            var activity = currentActivity();
            back();
            sleep(1500);
            var _activity = currentActivity();
            if (activity === _activity) {
                var back_btns = textMatches(".*(返回|离开|淘宝).*").find();
                if (back_btns.nonEmpty()) {
                    if (back_btns.findOne(textMatches(".*(返回|离开).*")) != null) {
                        back_btns.findOne(textMatches(".*(返回|离开).*")).click();
                    } else if (back_btns.findOne(textMatches(".*淘宝.*")) != null) {
                        back_btns.findOne(textMatches(".*淘宝.*")).click();
                    }
                } else {
                    toast("没找到╭(╯^╰)╮");
                    (0, _appUtils.endApp)(this.packageName);
                    sleep(1000);
                    (0, _appUtils.launchOpenApp)(this.packageName);
                    sleep(1000);
                }
            } else {
                return;
            }
        }
    }]);

    return Task;
}();

exports.default = Task;