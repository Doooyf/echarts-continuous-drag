# Echarts Continuous Drag 连续拖动工具

![build](https://img.shields.io/badge/vue-2.X-success.svg)
![version](https://img.shields.io/badge/ecDrag-0.01-success.svg)

> 用于Echarts连续拖动功能插件，该插件依靠配置tooltip.trigger下的'axis'来做处理
 
![avatar](./ecdrag.gif)

安装
```shell
npm i ecdrag
```

插件使用链式写法
```javascript
import drag from 'drag';

// use echarts do somethiong

// 需要带echarts的配置与初始化后的echarts
drag.setOption(option).drag(myChart);
```
配置项说明：
```javascript
// 设置Echarts配置
setOption(object)

// 设置使用对象配置 可参考echarts官方的坐标转换配置 https://echarts.apache.org/zh/api.html#echartsInstance.convertFromPixel
setUseOption(object)

// 设置强制使用tooltip.trigger的'axis'属性
setForce(boolean)

// 设置动画 关闭动画可增加流畅度
setAnimation(boolean)

// 设置最大值步长
setStepMax(number)
```

## License

[MIT](https://github.com/Doooyf/echarts-continuous-drag/blob/master/LICENSE)

Copyright (c) 2021-present JiangYongFu
