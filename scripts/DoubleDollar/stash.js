// Note: Doesn't handle symbols for init
function NewStash(spec_) {
  const stash = SpawnFrom(Stash_root)
  if (spec_) {
    if (HandleInheritancePoisoning && spec_ instanceof Object) {
      for (const name in spec_) {
        let value = spec_[name]
        if (value !== Object_prototype[name] ||
            IsLocalProperty.call(spec_, name)) {
          stash[name] = spec_[name]
        }
      }
    } else {
      for (const name in spec_) {
        stash[name] = spec_[name]
      }
    }
  }
  return stash
}
