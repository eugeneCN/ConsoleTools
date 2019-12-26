(function() {
  'use strict';

  // 创建构造函数
  function ConsoleTools(customConfig) {
    // 默认配置
    const config = { clean: true, timer: 500, onchange: function() {} };

    // 外部自定义配置
    this.config = Object.assign({}, config, customConfig);

    // 配置参数校验
    const { clean, timer, onchange } = this.config;
    if (!(typeof clean === 'boolean' &&
        typeof timer === 'number' &&
        typeof onchange === 'function')) {

      throw new Error('配置参数有误，请查阅文档！')
    }
  }

  // 修改原型
  ConsoleTools.prototype = {
    constructor: ConsoleTools,

    opened: function() {

      const { clean, timer, onchange } = this.config;

      const threshold = 160;

      const devtools = {
        isOpened: false,
        isOpening: false,
        orientation: undefined
      };

      const element = document.createElement('div');
      element.setAttribute('id', Date.now());
      this.element = element;
      
      // 利用了console打印日志的异步策略
      Object.defineProperty(element, 'id', {
        get() {
          const widthThreshold = window.outerWidth - window.innerWidth > threshold;
          const heightThreshold = window.outerHeight - window.innerHeight > threshold;
          const orientation = widthThreshold ? 'vertical' : heightThreshold ? 'horizontal' : 'fullscreen';

          if (!devtools.isOpening || devtools.orientation !== orientation) {
            onchange({ isOpened: true, orientation: orientation });
            devtools.orientation = orientation
            devtools.isOpening = true;
          }

          devtools.isOpened = true;
        }
      });

      // 检测开发者工具的状态，当状态改变时触发事件
      this.watchTools = setInterval(() => {

        devtools.isOpened = false;

        console.log(element)

        if (clean) console.clear()

        if (!devtools.isOpened && devtools.isOpening) {
          onchange({ isOpened: false, orientation: undefined });
          devtools.isOpening = false;
          devtools.orientation = undefined;
        }
      }, timer);
    },

    closed: function() {
      this.element = null
      window.clearInterval(this.watchTools)
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConsoleTools;
  } else {
    window.ConsoleTools = ConsoleTools;
  }
})();