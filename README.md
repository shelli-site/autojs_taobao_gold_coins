为了达到复用，改用ES6语法编写，通过babel插件编译成ES5语法。

## Task.js 核心流程
```flow {align="center"}
# 下面是赋值语句
init=>start: 初始化
checkAndGoActivity=>operation: 进入指定活动界面|past
performTasks=>operation: 执行日常任务
TaskerDone=>condition: 日常任务
是否全部完成?
collectReward=>operation: 领取金币
end=>end: 结束|

# 下面是连接语句
init->checkAndGoActivity->performTasks->TaskerDone
TaskerDone(yes)->collectReward->end
TaskerDone(no)->performTasks
```

