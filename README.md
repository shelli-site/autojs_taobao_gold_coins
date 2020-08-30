
##### 主流程
```flow {align="center"}
# 下面是赋值语句
Init=>start: 初始化
CheckAndGoActivity=>operation: 进入指定活动界面|past
PerformTaskerActions=>operation: 执行日常任务
TaskerDone=>condition: 日常任务
是否全部完成?
PerformCollectCoinsActions=>operation: 领取金币
End=>end: 结束|

# 下面是连接语句
Init->CheckAndGoActivity->PerformTaskerActions->TaskerDone
TaskerDone(yes)->PerformCollectCoinsActions->End
TaskerDone(no)->PerformTaskerActions
```

