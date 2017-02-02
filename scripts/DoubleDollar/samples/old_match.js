function _withinMatch(normalizedSpan, Conditional, absentAction_) {
  let Slot

  function matchAction(value, index) {
    if (Condition.call(this.$, value, index)) {
      Slot = {index: index, element: value, key: index, value: value}
      throw Slot
    }
  }

  try {
    this._withinDo(normalizedSpan, matchAction)
  }
  catch (ex) {
    if (ex === Answer) { return Answer }
    else               { throw  ex     }
  }

  return absentAction_ && absentAction_.call(this.$)
},
