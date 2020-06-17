import { watch, reactive } from './reactivity';

const test = reactive([1, 2, 3]);

watch(
  () => test,
  (val) => {
    console.log(val); // 没有触发
  },
  {
    deep: true,
  }
);

test[3] = 4;
