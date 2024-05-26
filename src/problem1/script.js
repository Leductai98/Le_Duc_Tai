var sum_to_n_a = function (n) {
  let sum = 0;
  let i = 1;
  while (i <= n) {
    sum += i;
    i++;
  }
  return sum;
};

var sum_to_n_b = function (n) {
  return (n * (n + 1)) / 2;
};

var sum_to_n_c = function (n) {
  return Array(n)
    .fill(null)
    .reduce((total, currentValue, currentIndex) => {
      return total + currentIndex;
    }, n);
};
console.log(sum_to_n_a(987));
console.log(sum_to_n_b(987));
console.log(sum_to_n_c(987));
