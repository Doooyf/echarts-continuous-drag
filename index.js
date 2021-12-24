/**
 * @name echarts连续拖动插件
 * @author Jyf
 * @date 2021-12-22
 *
 * 用于Echarts连续拖动功能插件，该插件依靠配置tooltip.trigger下的'axis'来做处理
 * 支持series data多维操作
 * 只支持Y轴，不支持多轴
 * 插件链式写法 drag.setOption(option).drag(myChart)
 * */
export default {
  myChart: null,
  option: {}, // Echarts的配置参数
  useOption: { seriesIndex: 0, yAxisIndex: 0 }, // 使用对象 https://echarts.apache.org/zh/api.html#echartsInstance.convertFromPixel
  force: false, // 是否强制
  animation: true, // 是否开启动画 关闭动画可增加流畅度
  step: 1, // 最大值更新步长
  /**
   * 设置Echarts配置
   * @param option
   * @return {this}
   */
  setOption(option) {
    this.option = option;
    return this;
  },
  /**
   * 设置使用对象配置
   * @param option
   * @return {this}
   */
  setUseOption(option = { seriesIndex: 0, yAxisIndex: 0 }) {
    this.useOption = option;
    return this;
  },
  /**
   * 设置是否强制配置
   * @param force
   * @return {this}
   */
  setForce(force = false) {
    this.force = force;
    return this;
  },
  /**
   * 动画设置
   * @param animation
   * @return {this}
   */
  setAnimation(animation = true) {
    this.animation = animation;
    return this;
  },
  /**
   * 最大值步长设置
   * @param step
   * @return {this}
   */
  setStepMax(step = 1) {
    this.step = Number(step) || 1;
    return this;
  },
  /**
   * 获取最大值
   *
   * @param data
   * @return {number}
   */
  getMax(data) {
    const t = typeof data[0];
    if (['string', 'number'].indexOf(t) > -1) {
      return Math.max(...data);
    }
    return Math.max(...data.map((i) => i[1]));
  },
  /**
   * main
   *
   * @param myChart echarts
   * @param func 回调函数
   * @return {function}
   */
  drag(myChart, func) {
    // 判断是否echarts
    if (myChart.id.substring(0, 8) !== `ec_${new Date().getTime().toString().substring(0, 5)}`) {
      console.error('本插件只适用于Echarts。');
      return false;
    }

    let canSetOption = false;
    // 判断axis
    if (this.option.tooltip.trigger !== 'axis') {
      if (!this.force) { // 不强制
        console.error('本插件需要tooltip触发类型请使用\'axis\'');
        return false;
      }
      // 强制添加axis操作
      this.option.tooltip.trigger = 'axis';
      canSetOption = true;
    }
    // 判断动画
    if (!this.animation) canSetOption = true;
    // 设置配置（前置）
    if (canSetOption) myChart.setOption(this.option);

    // 鼠标点击、拖动事件
    myChart.on('mousedown', (params) => {
      const { seriesIndex } = params;
      const { yAxisIndex } = myChart.getOption().series[seriesIndex];
      myChart.on('showTip', (params) => {
        const xy = myChart.convertFromPixel(this.useOption, [params.x, params.y]);
        const seriesVal = Number(xy[1].toFixed(2));
        const { data } = this.option.series[seriesIndex];

        // 判断多维数组 数组下标1为y轴
        const type = typeof data[params.dataIndex];
        if (['string', 'number'].indexOf(type) > -1) {
          data[params.dataIndex] = seriesVal;
        } else {
          data[params.dataIndex][1] = seriesVal;
        }

        // 非方法未固定max，强制修改动态
        let yAxis = this.option.yAxis;
        yAxis = yAxis[yAxisIndex] || yAxis;
        if (typeof yAxis.max !== 'function') yAxis.max = this.getMax(data) + this.step;

        myChart.setOption(this.option);
        return func(xy);
      });
    });

    // 鼠标抬起事件
    document.onmouseup = function () { // 监听鼠标up事件，关闭
      myChart.off('showTip');
    };
  },
};
