import { effect } from './effect';

export function computed(fn) {
  // 变量被改变后此值才会为true 第一次进来时候为true
  let dirty = true;
  let value;
  // 设置下次读取变量需要更改
  function changeDirty() {
    dirty = true;
  }
  const runner = effect(fn, {
    // 回调函数
    schedular: changeDirty,
    // 第一次不用执行
    lazy: true,
  });
  return {
    get value() {
      // 设置为true表达下次读取需要重新获取
      if (dirty) {
        // 读取值
        value = runner();
        dirty = false;
      }
      return value;
    },
  };
}
