function _Set(target, ...name_path_spec_action, value = undefined) {
  // NOTE: this is mutable
  switch (name_path_spec_action.length) {
    case 0 : return this
    case 2 : return _SetIn(target, name_path_spec_action, value)
  }
  switch (typeof name_path_spec_action[0]) {
    case "string" :
      target[name_path_spec_action] = value_
      return target

    case "object" :
      if (name_spec_action === null) { return this }
      if (IsArray(name_path_spec_action)) {
        return _SetIn(target, name_path_spec_action, value)
      }
      for (const name in name_spec_action) {
        // target[name] = name_spec_action[name]
      }
      return target

    case "function" :
      const result = name_spec_action.call(this, target)
      return result === undefined ? target : result

    case "undefined" :
      return target

    default :
      return target.error("Improper arguments for setting!")
  }
}

return this[IMMUTABLE] ?
  (this._mutableCopy().__addLast_(element)).beImmutable :
  this.__addLast_(element)
}



PutMethod(Thing_root, function _set(name_spec_action, value_) {
  return _Set(this._asMutable, name_spec_action, value_)
})

PutMethod(Thing_root, function set(name_spec_action, value_) {
  return _Set(this._mutableCopy, name_spec_action, value_).beImmutable
}



return this._new(this.__fanArrayWithin, subelements, 0)


return this._new(copy => {
  const elements = copy._elements
  this._withinEach(startEdge, endEdge, function (element, index) {
    elements[index] = Action.call(this.$, element, index)
  })
})

_setSpawn
