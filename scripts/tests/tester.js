"using strict";

function sum(x, y, z) {
  var a = arguments;
  return x + y + z;
}

var g = function (x, y, z) {
  nextIndex = g.length;
  arguments[nextIndex] = { what : "hello"};
  arguments.length = nextIndex + 1;
  // arguments._purse = { what : "hello"};
  sum.apply(null, arguments);

}
