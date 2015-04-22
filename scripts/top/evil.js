function NewTrampoline(P, R) {
  return function (s,a){return this==R?P[s].apply(P,a)}
}
function NewTrampoline(P, R) {
  return function (s,a){return this===R?A.C(P[s],P,a):E()}
}

  A   = Function.prototype.apply;
  A.C = Function.prototype.call;


function InstallEvilTrampoline(target) {
  var R = target
  var A = {};
  A.C = function (selector, pulp, args) {

  }
  target.__ = function (s,a){return this===R?A.C(P[s],P,a):E()};
}
