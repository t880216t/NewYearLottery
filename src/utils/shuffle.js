
/**
 * 随机洗牌算法
 *
 * @param {Array} arr
 */
export function shuffle(arr) {
  let randomIndex = 0;
  for (var i = 0; i < arr.length; i++) {
    randomIndex = Math.floor(Math.random() * (arr.length - i));
    let temp = arr[i];
    arr[i] = arr[randomIndex];
    arr[randomIndex] = temp;
  }
  return arr
}


/**
 * 获取随机id
 *
 * @param {Array} arr
 */
export function getRandomArray(arr, count) {
  var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}
