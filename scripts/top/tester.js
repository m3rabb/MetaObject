var over = {parent: 333}
var obj = Object.create(over)
obj.vis = 123
obj.invis = 456

var sym = Symbol("__selector")
obj[sym] = "sel"

var hidden = {
  writable    : true,
  enumerable  : false,
  configurable: true,
}
var syms

console.log(`local keys: ${Object.keys(obj)}`)
console.log(`all props: ${Object.getOwnPropertyNames(obj)}`)
syms = Object.getOwnPropertySymbols(obj).map(s => s.toString())
console.log(`symbols: ${syms}`)

Object.defineProperty(obj, "invis", hidden)
console.log(`local keys: ${Object.keys(obj)}`)
console.log(`all props: ${Object.getOwnPropertyNames(obj)}`)
syms = Object.getOwnPropertySymbols(obj).map(s => s.toString())
console.log(`symbols: ${syms}`)


Object.defineProperty(obj, sym, hidden)
console.log(`local keys: ${Object.keys(obj)}`)
console.log(`all props: ${Object.getOwnPropertyNames(obj)}`)
syms = Object.getOwnPropertySymbols(obj).map(s => s.toString())
console.log(`symbols: ${syms}`)


// var pulp = {abc: 123}
// var proxy_root = new Proxy(pulp, {
//     get(target, selector, rind) {
//         console.log('GET ' + selector);
//         return target[selector];
//     },
//
//     set(target, selector, value, rind) {
//       console.log(`SET ${selector} TO ${value}`);
//       rind[selector] = value;
//       return true
//     }
// })
//
// var r1 = Object.create(proxy_root);


// var o = {}
//
// o.new =
// o.type =


// function turn(turnNumber, turnsleft) {
//   console.log("This is turn number: " + turnNumber)
//   if (turnsleft) {
//     setTimeout(turn, 2000, turnNumber + 1, turnsleft - 1)
//   }
// }
//
// function takeTurns(turnCount) {
//   setTimeout(turn, 2000, 1, turnCount - 1)
//   console.log("Still going!")
//   console.log("Yet, more code!")
// }

//
// function turn(turnNumber) {
//   console.log("This is turn number: " + turnNumber)
// }
//
// function takeTurns(turnCount) {
//   var turnNumber = 1
//   while (turnNumber <= turnCount) {
//     var delay = turnNumber * 2000
//     setTimeout(turn, delay, turnNumber)
//     turnNumber += 1
//   }
// }
