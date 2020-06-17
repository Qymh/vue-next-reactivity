import { isPlainObject } from './utils';
import { track, trigger } from './effect';

// 本列只有数组和对象才能被观测
function canObserve(value) {
  return Array.isArray(value) || isPlainObject(value);
}

// 拦截数据
export function reactive(value) {
  // 不能监听的数值直接返回
  if (!canObserve(value)) {
    return;
  }
  const observe = new Proxy(value, {
    // 拦截读取
    get(target, key, receiver) {
      // 收集回调函数
      track(target, key);
      const res = Reflect.get(target, key, receiver);
      return canObserve(res) ? reactive(res) : res;
    },
    // 拦截设置
    set(target, key, newValue, receiver) {
      const hasOwn = target.hasOwnProperty(key);
      const oldValue = Reflect.get(target, key, receiver);
      const res = Reflect.set(target, key, newValue, receiver);
      if (hasOwn) {
        // 设置之前的属性
        trigger(target, key, 'set');
      } else if (oldValue !== newValue) {
        // 添加新的属性
        trigger(target, key, 'add');
      }
      return res;
    },
  });
  // 返回被观察的proxy实例
  return observe;
}
