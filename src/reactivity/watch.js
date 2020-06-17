import { effect } from './effect';
import { isPlainObject } from './utils';

// 深度遍历值
function traverse(value) {
  // 处理对象
  if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key]);
    }
  }
  // 处理数组
  else if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i]);
    }
  }
  return value;
}

export function watch(fn, cb, options = {}) {
  let oldValue;
  let getters = fn;
  // 当存在deep属性的时候 深度遍历值
  if (options.deep) {
    getters = () => traverse(fn());
  }
  const runner = effect(getters, {
    schedular: () => {
      // 当这个依赖执行的时候 获取到的是新值
      let newValue = runner();
      // 触发回调函数
      cb(newValue, oldValue);
      // 新值赋值给旧值
      oldValue = newValue;
    },
    // 第一次不用执行
    lazy: true,
  });
  // 读取值并收集回调函数
  oldValue = runner();
}
