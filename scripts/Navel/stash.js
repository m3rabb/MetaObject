function NewStash(spec_) {
  var top, stash, selectors, next, selector, value

  top   = Object.prototype
  stash = SpawnFrom(null)
  if (spec_) {
    if (HandleInheritancePoisoning && spec_ instanceof Object) {
      selectors = _OwnKeysOf(spec_)
      index = selectors.length
      while (next--) {
        selector = selectors[next]
        value    = spec_[selector]
        if (value !== top[selector] || _HasOwn.call(spec_, selector)) {
          stash[selector] = spec_[selector]
        }
      }
    } else {
      for (selector in spec_) {
        stash[selector] = spec_[selector]
      }
    }
  }
  return stash
}


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
