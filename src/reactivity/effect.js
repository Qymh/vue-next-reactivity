// 回调函数集合
export const targetMap = new WeakMap();

// 当前激活的回调函数
export let activeEffect;

// 回调函数
export function effect(fn, options = {}) {
  const effectFn = () => {
    // 设置当前激活的回调函数
    activeEffect = effectFn;
    // 执行fn收集回调函数
    let val = fn();
    // 制空回调函数
    activeEffect = '';
    return val;
  };
  // options配置
  effectFn.options = options;
  // 默认第一次执行函数
  if (!options.lazy) {
    effectFn();
  }
  return effectFn;
}

// 收集回调函数
export function track(target, key) {
  // 没有激活的回调函数 直接退出不收集
  if (!activeEffect) {
    return;
  }
  // 通过对象获取每个对象的map
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    // 当对象被第一次收集时 我们需要添加一个map集合
    targetMap.set(target, (depsMap = new Map()));
  }
  // 获取对象下各个属性的回调函数集合
  let dep = depsMap.get(key);
  if (!dep) {
    // 当对象属性第一次收集时 我们需要添加一个set集合
    depsMap.set(key, (dep = new Set()));
  }
  // 这里添加回调函数
  dep.add(activeEffect);
}

// 触发回调函数
export function trigger(target, key, type) {
  // 获取对象的map
  const depsMap = targetMap.get(target);
  if (depsMap) {
    // 获取对应各个属性的回调函数集合
    let deps = depsMap.get(key);
    // 当数组新增属性的时候 直接获取length上存储的回调函数
    if (type === 'add' && Array.isArray(target)) {
      deps = depsMap.get('length');
    }
    if (deps) {
      // 触发回调函数
      deps.forEach((v) => {
        // 特殊指定回调函数存放在了schedular中
        if (v.options.schedular) {
          v.options.schedular();
        }
        // 当没有特意指定回调函数则直接触发
        else if (v) {
          v();
        }
      });
    }
  }
}
