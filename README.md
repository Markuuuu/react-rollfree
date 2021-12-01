# react-rollfree
# 适配react好用的滚动组件
# 配置
###
* @animationDirection boolean --滚动方向，默认从下到上，从左到右
* @animationTime number --过场时间 单位：S
* @bigNum string --默认100，支持大数据量动态更新，防止内存过大
* @children [<jsx>] --滚动组件，支持隐式传入
* @childrenUpdateModel string --数据更新后更新列表时机，'now'立即更新，'later'跑完更新
* @contextHeight number  --单条滚动组件height
* @contextWidth number  --单条滚动组件width
* @endWithNum number --结尾空置滚动单位数量
* @height number --滚动外框height
* @horizontal boolean --横纵向滚动
* @pauseWithHover boolean --默认开启，鼠标hover组件滚动停止
* @showBorder boolean --是否显示辅助设计边界
* @width number --滚动外框width
###

# 使用方式
###
import RollFree from 'react-rollfree';

<RollFree></RollFree>
###

# 工程目录
```
├── dist                                     // 打包及发布目录
├── lib                                      // 源码目录
│   ├── index.js                             // 主要代码
│   └── utils.js                             // 工具
├── README.md                                // 说明
├── package-lock.json                        // 依赖锁定
├── package.json                             // 工程配置
├── .stylelintrc.js                          // stylelint配置
├── webpack.dev.config.js                    // webpack for dev配置
└── webpack.prod.config.js                   // webpack for prod配置
```

## 安装
npm install react-rollfree

### 分支说明
(说明主分支、开发分支或其他分支作用)

|      分支     |       说明      |
| ------------ | --------------- |
| master       | 工程主分支        |


## 最新更新日志
v 1.0.4     --更新动画
