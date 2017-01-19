/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/



//   Method name conventions
//   set   public method on immutable receiver
//  _set   private method on immutable receiver
// __set   private method on DEMANDS a mutable receiver


// function Fill(target, offset, source, startEdge, endEdge, direction) {
//   // Note: doesn't work for shifting in same array!!!
//   let targetIndex = offset
//   let [sourceIndex, limit] = (direction > 0) ?
//     [startEdge, endEdge] : [endEdge - 1, startEdge - 1]
//
//   while (sourceIndex !== limit) {
//     target[targetIndex++] = source[sourceIndex]
//     sourceIndex += direction
//   }
//   return targetIndex
// }

function CopyArray(source) {
  let target = []
  let next   = target.count
  while (next--) { target[next] = source[next] }
  return target
}
function FillValueOverSpan(target, value, startEdge, endEdge) {
  for (let index = startEdge; index < endEdge; index++) {
    target[index] = value
  }
}

function FillAtFromSpan(target, offset, source, startEdge, endEdge) {
  let targetIndex, sourceIndex
  let size = endEdge - startEdge

  if (offset < startEdge || target !== source) {
    targetIndex = offset
    sourceIndex = startEdge
    while (startEdge !== endEdge) {
      target[targetIndex++] = source[sourceIndex++]
    }
  }
  else if (offset !== startEdge) {
    // Handles shifting property so no improper overwriting
    targetIndex = offset + size
    sourceIndex = endEdge
    while (endEdge !== startEdge) {
      target[--targetIndex] = source[--sourceIndex]
    }
  }
  return offset + size
}

function FillAtFrom(target, offset, source, direction) {
  let size        = source.length
  let sourceIndex = size
  let targetIndex = offset + (direction > 0 ? sourceIndex : - 1)

  while (sourceIndex--) {
    targetIndex -= direction
    target[targetIndex] = source[sourceIndex]
  }
  return size
}


//          lf   lo   le         i         re   ro   rf
//   A                |                     |    :--->:
//   B                |                     :-------->:
//   C                |          :----------|-------->:    check trim
//   D                |          :----------:              check trim
//   E                |          :----:  S  |              check trim

//   F                :----------:       S  |              check trim
//   G      :<--------|----------:       S  |              check trim
//   H      :<--------:                     |
//   I      :<---:    |                     |

//   J                :---------------------:
//   K                :---------------------|-------->:
//   L      :<--------|---------------------:
//   M      :<--------|---------------------|-------->:

function _fillFromOver_(
  elements, source, startEdge, endEdge = startEdge, direction = FORWARD
) {
  const isImmutable  = this[IMMUTABLE]
  const elements     = this._elements
  const elementsSize = elements.length,
  const sourceSize   = source.length
  const target       = isImmutable ? [] : elements
  let count, fillEdge, isEndBeforeStart

  if (sourceSize === 0) { return elements }

  if (0 < startEdge) {                  //  A,B,C,D,E
    if (isImmutable) {                  //      A         B,C,D,E
      fillEdge = (startEdge > targetSize) ? targetSize : startEdge
      FillAtFromSpan(target, 0, elements, 0, fillEdge)
    }
    count = startEdge + sourceSize

    if (endEdge < targetSize) {         //  E
      count = FillAtFromSpan(target, count, elements, endEdge, targetSize)
    }

    FillAtFrom(target, startEdge, source, direction)
  }
  else {   // startEdge <= 0
    if (endEdge < targetSize) {         //  F,G,H,I
      isEndBeforeStart = (endEdge < 0)  //           I                 F,G,H
      count = isEndBeforeStart ? (fillEdge = sourceSize - endEdge) : sourceSize

      if (isImmutable || count !== endEdge) {
        count = FillAtFromSpan(target, count, elements, endEdge, targetSize)
      }
      if (isEndBeforeStart)             //  I
        FillValueOverSpan(target, undefined, sourceSize, fillEdge)
      }
    }
    else { // endEdge >= targetSize     //  J,K,L,M
      if (isImmutable && IsFrozen(source)) { return source }
    }
    FillAtFrom(target, 0, source, direction)
  }
  target.length = count  // reconcile by trims any undeleted slots
  return target
}


function ForEach(object, action) {
  if (object.isThing) {
    object.forEach(action)
  }
  else if (IsArray(object)) {
    for (let index = 0, count = object.length; index < count; index++) {
      action(object[index], index)
    }
  }
  else {
    let keys = LocalProperties(object).sort()
    for (let index = 0, count = keys.length; index < count; index++) {
      const key = keys[index]
      action({ key: key, value: object[key] }, index)
    }
  }
  return object
}

function AsElements(object) {
  if (object.isThing)  { return object.elements }
  if (IsArray(object)) { return object }

  let elements = []
  if (typeof object === "string") {
    for (let index = 0, count = object.length; index < count; index++) {
      elements[index] = object[index]
    }
  }

  let keys = LocalProperties(object).sort()
    for (let index = 0, count = keys.length; index < count; index++) {
      const key = keys[index]
      elements[index] = { key: key, value: object[key] }
    }
  }
  return elements
}

switch (typeof elements_) {
  case "object" : break
  default : return this.error("Parameter must be a collection!") || this
}


DD.set((_context) => {
  _context.newType(List => {
    List.addSMethods(function __init(elements_) {
      this._elements = []
      elements_ && this.addAll(elements_)
    })

    List.addSMethod(function __addLast_(element) {
      this._elements[elements.length] = element
      return this
    })

    List.addSMethod(function __addAllLast_(elements) {
      elements[elements.length] = element

      this._fillFromOver_(existElements, newElements, edge)
elements, source, startEdge, endEdge = startEdge, direction = FORWARD
      return this._set("_elements", elements)
    })

    List.addSMethod(function addLast(element) {
      return (arguments.length) ?
        this.set(this.__addLast_, element) :
        this.error("Requires argument!")
    })

    List.addSMethod(function addAllLast(elements) {
      return (arguments.length) ?
        this.set(this.__addAllLast_, element) :
        this.error("Requires argument!")
    })

    List.addSAlias("add"   , "addLast")
    List.addSAlias("addAll", "addAllLast")



    _List.addSMethod(function addAll_(elements) {
      const list = this._asMutable


    })

    _List.addSMethod(function _withAll(elements_) {
      this._elements = []
      this.addAll(elements_)
    })


  })

  // target.set(func, ...args)
  // target.set("x", 10)
  // target.set("x", "r", "3", 10)
  // target.set(["x", "r", "3"], 10)
  // target.set({address: "123 Main St", zip: "60600"})
  // target.set(_copy => {
  //
  // })



  GroceryList.addSMethod(function __init(name, price) {
    this.name  = name
    this.price = price
  })

  GroceryList.addSMethod(function _init(elements_) {
    this._head = this._tail = Node()
    this.size = 0
  })

  LinkedList.addSAccessor(function isEmpty() {
    return (this.size === 0)
  })

  LinkedList.addSMethod(function addFirst(element) {
    return this._set(function () {
      this._head = Node(element, this._head.next)
      _list.size++
    })
  })

  LinkedList.addSMethod(function addLast(element) {
    return this.new(_list => {
      _list._head = Node(element, this._head.next)
      _list.size++
    })

    this._tail = this._tail.next = _Node.New(element, null);
    this._size++;
    return this;
  });

  LinkedList.addSMethod(function removeFirst(absentAction_, presentAction_) {
    var head, first, element;
    head = this._head;
    if (head === this._tail) {
      return absentAction_ ? absentAction_.call(this) : null;
    }
    first = head.next;
    element = first.element;
    head.next = first.next;
    this._size--;
    return presentAction_ ? presentAction_.call(this, element) : element;
  });

  LinkedList.addSMethod(function removeLast(absentAction_, presentAction_) {
    var tail, prior, next, element;
    tail = this._tail;
    prior = this._head;
    if (prior === tail) {
      return absentAction_ ? absentAction_.call(this) : null;
    }
    while ((next = prior.next) !== tail) {
      prior = next;
    }
    this._tail = prior;
    element = tail.element;
    this._size--;
    return presentAction_ ? presentAction_.call(this, element) : element;
  });

  LinkedList.addSMethod(function forEach(action) {
    if (action) {
      let current = this._head
      let tail    = this._tail
      while ((current = current.next) !== tail) {
        action.call(this, current.element)
      }
    }
    return this
  })
})
