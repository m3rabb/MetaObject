// UNTESTED
function WrapFunc(OriginalFunc) {
  return function $wrappedOutsideFunc(...args) {
    const receiver =
      (this != null && this[SECRET] === INNER) ? this[RIND] : this
    return OriginalFunc.apply(receiver, args)
  }
}

// UNTESTED
function Wrap_initFrom_(OriginalFunc) {
  if (OriginalFunc.length < 4) {
    return function $_initFrom_3(_source, visited, exceptSelector_) {
      const receiver =
        (this != null && this[SECRET] === INNER) ? this[RIND] : this
      const source = (_source != null && _source[SECRET] === INNER) ?
        _source[RIND] : _source
      return OriginalFunc.apply(receiver, source, visited, exceptSelector_)
    }
  }
  return function $_initFrom_4(_source, visited, exceptSelector_, asImmutable) {
    const receiver =
      (this != null && this[SECRET] === INNER) ? this[RIND] : this
    const source = (_source != null && _source[SECRET] === INNER) ?
      _source[RIND] : _source
    return OriginalFunc.apply(
      receiver, source, visited, exceptSelector_, asImmutable)
  }
}
