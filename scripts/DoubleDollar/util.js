
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

function Copy(value) {
  switch (typeof value) {
    default         : return value  // Primitives don't need wrapping
    case "function" : return CopyFunc(value)
    case "object"   : return CopyObject(value)
  }
}

function CopyObject(object) {
  if (IsFrozen(object)) { return object }
  if (IsArray(object)) { return object.slice() }

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
