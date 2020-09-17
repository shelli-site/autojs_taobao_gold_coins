"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Task2 = require("./Task");

var _Task3 = _interopRequireDefault(_Task2);

var _log = require("../utils/log");

var _appUtils = require("../utils/appUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 获取设备屏幕信息
var height = device.height;
var width = device.width;

var GoldCoins = function (_Task) {
    _inherits(GoldCoins, _Task);

    function GoldCoins() {
        _classCallCheck(this, GoldCoins);

        /**
         * 任务页Activity 默认淘金币页
         * @type {string}
         */
        var _this2 = _possibleConstructorReturn(this, (GoldCoins.__proto__ || Object.getPrototypeOf(GoldCoins)).call(this));

        _this2.Tasks_Activity = "com.taobao.browser.exbrowser.BrowserUpperActivity";
        _this2.Home_Activity = "com.taobao.tao.TBMainActivity";
        _this2.Coins_Activity = "com.taobao.browser.BrowserActivity";
        return _this2;
    }

    _createClass(GoldCoins, [{
        key: "checkAndGoActivity",
        value: function checkAndGoActivity() {
            var _this = this;
            sleep(4000);
            if (isOnCorrectPage()) return;

            switch (currentActivity()) {
                case this.Home_Activity:
                    (0, _log.ShowMessage)("在主页，准备跳至淘金币页...");
                    this.HomeP_to_CoinsP();
                    sleep(3000);
                    (0, _log.ShowMessage)("已跳至淘金币页！");
                case this.Coins_Activity:
                    (0, _log.ShowMessage)("在淘金币页，准备跳至任务页...");
                    this.CoinsP_to_TasksP();
                    (0, _log.ShowMessage)("已跳至任务页！");
                    break;
                default:
                    (0, _appUtils.endApp)(this.packageName);
                    (0, _appUtils.launchOpenApp)(this.packageName);
                    break;
            }
            if (!isOnCorrectPage()) {
                (0, _log.ShowMessage)("无法跳至任务页！");
                (0, _appUtils.endApp)(this.packageName);
                this.checkAndGoActivity();
            }

            function isOnCorrectPage() {
                return _this.Tasks_Activity === currentActivity();
            }
        }
    }, {
        key: "getTaskList",
        value: function getTaskList() {
            return className("android.widget.ListView").depth(9).findOnce();
        }
    }, {
        key: "getSubtask",
        value: function getSubtask(ActionsList, index) {
            var taskBtn = void 0,
                taskName = void 0,
                taskText = void 0;
            var Action = ActionsList.child(index);
            taskBtn = Action.child(1);
            taskName = Action.child(0).child(0).text();
            taskName = taskName.substring(0, taskName.length - 5);
            taskText = Action.child(0).child(1).text();
            return { taskBtn: taskBtn, taskName: taskName, taskText: taskText };
        }
    }, {
        key: "doTask",
        value: function doTask(taskBtn, taskText, taskName, repeatCallback) {
            if (taskBtn.text() == "已完成") {
                (0, _log.ShowMessage)(taskName + " \u5DF2\u5B8C\u6210");
                repeatCallback();
            }
            (0, _log.ShowMessage)("\u6267\u884C " + taskName + " \u4EFB\u52A1");
            if (/.*(逛|浏览)?\d+[s|秒](立得)?.*/.test(taskText)) {
                this.PerformVisit(taskBtn, taskName);
            } else {
                switch (taskName) {
                    case "看免费小说领能量":
                    case "签到领取话费充值金":
                    case "逛好店领一大波金币":
                        this.PerformVisit(taskBtn, taskName);
                        break;
                    case "逛农场领免费水果":
                        this.PerformClick(taskBtn, taskName);
                        break;
                    case "淘宝人生逛街领能量":
                        this.PerformLifeClick(taskBtn, taskName);
                        break;
                }
            }
        }
    }, {
        key: "HomeP_to_CoinsP",
        value: function HomeP_to_CoinsP() {
            if (text("领淘金币").exists()) {
                text("领淘金币").findOnce().click();
            } else {
                click(540, 960);
            }
        }
    }, {
        key: "CoinsP_to_TasksP",
        value: function CoinsP_to_TasksP() {
            var btn = className("android.widget.Button").text("赚金币");
            if (btn.exists()) {
                btn.findOnce().click();
            }
        }
    }, {
        key: "PerformVisit",
        value: function PerformVisit(taskBtn, taskName) {
            if (!taskBtn) return;
            var actionName = taskBtn.text();
            taskBtn.click();
            (0, _log.ShowMessage)("点击" + taskName);
            sleep(2000);
            swipe(width / 2, height - 400, width / 2, 0, 1000);
            sleep(2000);
            swipe(width / 2, height - 400, width / 2, 0, 1000);
            sleep(2000);
            swipe(width / 2, height - 400, width / 2, 0, 1000);
            // 鉴于前面操作需要一部分时间，这里减少一些
            this.WaitVisitFinished(10000);
            this.go_back();
            // 防止淘宝骚操作，若返回主界面，尝试重新进入活动界面
            this.checkAndGoActivity();
            if (_Task2.debug) (0, _log.ShowMessage)("完成" + actionName);
        }
    }, {
        key: "PerformClick",
        value: function PerformClick(taskBtn, taskName) {
            this.go_back();
            // 防止淘宝骚操作，若返回主界面，尝试重新进入活动界面
            this.checkAndGoActivity();
        }
    }, {
        key: "PerformLifeClick",
        value: function PerformLifeClick(taskBtn, taskName) {
            this.go_back();
            // 防止淘宝骚操作，若返回主界面，尝试重新进入活动界面
            this.checkAndGoActivity();
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
    }]);

    return GoldCoins;
}(_Task3.default);

exports.default = GoldCoins;