// 获取原始类型
export function toPlain(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

// 是否是原生对象
export function isPlainObject(value) {
  return toPlain(value) === 'Object';
}
