
function IsUpperCase(string) {
  return /^[A-Z]/.test(string)
}

function IsLowerCase(string) {
  return /^[a-z]/.test(string)
}

function IsValidMethodSelector(selector) {
  return ValidSelectorMatcher.test(selector)
}

const DefineProperty     = Object.defineProperty

const VisibleConfiguration = {
  __proto__   : null,
  writable    : true,
  enumerable  : true,
  configurable: true,
}

const VisibleLockedConfiguration = {
  __proto__   : null,
  enumerable  : true,
  // writable    : false,
  // configurable: false,
}

const InvisibleConfiguration = {
  __proto__   : null,
  // enumerable  : false,
  writable    : true,
  configurable: true,
}

function _AddGetter(target, name, getter) {
  const configuration = {
    __proto__ : InvisibleConfiguration,
      get     : getter
  }
  return DefineProperty(target, name, configuration)
}

function AddGetter(target, namedGetter_name, getter_) {
  const [name, getter] =
    (typeof namedGetter_name === "function") ?
      [namedGetter_name.name, namedGetter_name] :
      [namedGetter_name     , getter_         ]

  return _AddGetter(target, name, getter)
}

function AddLazyProperty(target, namedInstaller_name, installer_) {
  const [Name, installer] =
    (typeof namedInstaller_name === "function") ?
      [namedInstaller_name.name, namedInstaller_name] :
      [namedInstaller_name     , installer_         ]

  _AddGetter(target, Name, function _loader() {
    DefineProperty(this, Name, InvisibleConfiguration)
    return (this[Name] = installer.call(this))
  })
}

// function AsSpan(firstArg, ...remainingArgs) {
//   let startEdge, restArgs, numbersCount, lastArg, wraps
//
//   if (typeof firstArg === "number") {
//     startEdge = firstArg, restArgs = remainingArgs
//   } else {
//     [startEdge, ...restArgs] = firstArg
//   }
//   numbersCount = restArgs.length
//   lastArg = restArgs[numbersCount - 1]
//   wraps = (typeof lastArg === "boolean") ? (numbersCount -= 1, lastArg) : false
//
//   switch (numbersCount) {
//     //               startEdge, endEdge    , direction  , wrap
//     case 0 : return [startEdge, startEdge  , undefined  , wraps]
//     case 1 : return [startEdge, restArgs[0], undefined  , wraps]
//     case 2 : return [startEdge, restArgs[0], restArgs[1], wraps]
//   }
// }

// NOTE: for use with over vs within
// function AsSpan(firstArg, ...remainingArgs) {
//   let startEdge, endEdge, direction, wraps
//   let restArgs, numbersCount, _startEdge, _endEdge
//
//   if (typeof firstArg === "number") {
//     startEdge = firstArg, restArgs = remainingArgs
//   } else {
//     [startEdge, ...restArgs] = firstArg
//   }
//   numbersCount = restArgs.length
//   lastArg = restArgs[numbersCount - 1]
//   wraps = (typeof lastArg === "boolean") ? (numbersCount -= 1, lastArg) : false
//
//   if (numbersCount === 0) {
//     return [startEdge, startEdge, FORWARD, wraps]
//   }
//   endEdge = restArgs[1]
//   _startEdge = (startEdge !== undefined) ? startEdge : Infinity
//   _endEdge   = (endEdge !== undefined) ? endEdge : Infinity
//   direction = (_startEdge <= _endEdge) ? FORWARD : BACKWARD
//   return [startEdge, endEdge, direction, wraps]
// }



// function AsSmartSpan(firstArg, ...remainingArgs) {
//   let startEdge, restArgs, lastArg
//
//   if (typeof firstArg === "number") {
//     startEdge = firstArg, restArgs = remainingArgs
//   } else {
//     [startEdge, ...restArgs] = firstArg
//   }
//   switch (restArgs.length) {
//     case 0 : return [startEdge, startEdge, false]
//     case 2 : return [startEdge, ...restArgs]
//   }
//
//   return (typeof (lastArg = restArgs[0]) === "number") ?
//   // startEdge, endEdge  , wrap
//     [startEdge, lastArg  , false] :
//     [startEdge, startEdge, lastArg]
// }




function Each(object, action) {
  if (object.isThing) {
    object.each(action)
  }
  else if (IsArray(object) || typeof object === "string") {
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

function EqualArrays(a, b) {
  if (a === b) { return true }
  let count = a.length
  if (b.length !== count) { return false }
  while (count--) { if (a[count] !== b[count]) { return false } }
  return true
}

function AsArray(object) {
  if (object.isThing)  { return object.asArray }
  if (IsArray(object)) { return object }

  let array = []
  if (typeof object === "string") {
    for (let index = 0, count = object.length; index < count; index++) {
      array[index] = object[index]
    }
  }

  let keys = LocalProperties(object).sort()
    for (let index = 0, count = keys.length; index < count; index++) {
      const key = keys[index]
      array[index] = { key: key, value: object[key] }
    }
  }
  return array
}

function ArrayWithin(source, startEdge, endEdge) {
  const target      = []
  let   targetIndex = 0
  let   sourceIndex = startEdge
  while (index < endEdge) {
    target[targetIndex++] = source[sourceIndex++]
  }
  return target
}

function CopyArray(source) {
  let target = []
  let next   = target.count
  while (next--) { target[next] = source[next] }
  return target
}

function CopyObject(object) {
  if (IsFrozen(object)) { return object }
  if (IsArray(object)) { return CopyArray(object) }

  const copy = { __proto__ : object.__proto__ }
  const names = LocalProperties(object)
  let next = names.length
  while (next--) {
    const name = names[next]
    copy[name] = object[name]
  }
  return copy
})

function CopyFunc(func) {
  if (IsFrozen(func)) { return func }

  const Func = func[ORIGINAL] || func
  const copy = function (...args) {
    return Func.apply(this, ...args)
  }
  copy[ORIGINAL] = Func
  DefineProperty(copy, "name", VisibleConfiguration)

  const names = LocalProperties(func)
  let next = names.length
  while (next--) {
    const name = names[next]
    copy[name] = func[name]
  }
  copy.prototype = _Copy(func.prototype)
  return (copy.prototype.construct = copy)
}

function Copy(value) {
  switch (typeof value) {
    default         : return value  // Primitives don't need wrapping
    case "function" : return CopyFunc(value)
    case "object"   : return CopyObject(value)
  }
}
