function putAtEvery(newValue, matchValue) {
  return this._set((result) => {
    let target = result._elements
    let count = 0

    this.withinDo(undefined, function (value, index) {
      if (value === matchValue) {
        target[index] = newValue
        count++
      }
    })
    if (count === 0) { return this }
  })
},

function putAtEvery(newValue, matchValue) {
  if (newValue === matchValue) { return this }
  let result = this.new()
  let target = this._elements
  let count = 0

  return this.withinDo(undefined, function (value, index) {
    if (value === matchValue) { this._putAtIndex(newValue, index) }
  })
},


function putAtEvery(newValue, matchValue) {
  if (newValue === matchValue) { return this }
  let target = this._._elements

  return this.withinDo(undefined, function (value, index) {
    if (value === matchValue) { target[index] = newValue }
  })
},


function putAtEvery(newValue, matchValue) {
  if (newValue === matchValue) { return this }

  return this.withinDo(undefined, function (value, index) {
    if (value === matchValue) { this._._elements[index] = newValue }
  })
},




// This would be nice but won't work as result of asMutable would be privacy wrapped!!!
function putAtIndex(value, index) {
  const target   = this.asMutable
  const elements = this._elements
  const slotIndex

  if   (index >= 0) { slotIndex = index }
  else (index <  0) { slotIndex = target.length - index }
  else              { return this }

  if (slotIndex >= 0) {
    elements[slotIndex] = value
  }
  else {
    const right = -slotIndex
    this.__subFromShiftTo(0, right)
    this.__echoWithin(undefined, 1, right)
    elements[0] = value
  }
  return (this === target) ? this : target.beImmutable
},


function addFirst(value) {
  return this._set(function () {
    this.__subFromShiftTo(0, 1)
    this._elements[0] = value
  })
},
