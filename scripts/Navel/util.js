function MakeNamelessVacuousFunction() {
  return function () {}
}



// function InAtPut(target, selector, func) {
//   target[selector] = func
// }

// function InPutNamedFunc(target, namedFunc) {
//   target[namedFunc.name] = namedFunc
// }



const VisibleConfiguration = {
  configurable: true,
  writable    : true,
  enumerable  : true,
}

const InvisibleConfiguration = {
  configurable: true,
  writable    : true,
  enumerable  : false,
}

function _AddGetter(target, name, isVisible, getter) {
  const configuration = {
    configurable: true,
    enumerable  : isVisible,
    get         : getter
  }
  return DefineProperty(target, name, configuration)
}

function AddGetter(target, namedGetter_name, getter_) {
  const [name, getter] = (typeof namedGetter_name === "function") ?
      [namedGetter_name.name, namedGetter_name] :
      [namedGetter_name     , getter_         ]

  return _AddGetter(target, name, true, getter)
}

// UNTESTED
function AddInvisibleGetter(target, namedGetter_name, getter_) {
  const [name, getter] = (typeof namedGetter_name === "function") ?
      [namedGetter_name.name, namedGetter_name] :
      [namedGetter_name     , getter_         ]

  return _AddGetter(target, name, false, getter)
}

function AddLazyProperty(target, namedInstaller_name, installer_) {
  const [Name, Installer] =
    (typeof namedInstaller_name === "function") ?
      [namedInstaller_name.name, namedInstaller_name] :
      [namedInstaller_name     , installer_         ]

  _AddGetter(target, Name, true, function $loader() {
    DefineProperty(this, Name, InvisibleConfiguration)
    return (this[Name] = Installer.call(this))
  })
}


function AsMethod(method_func__name, func__, mode___) {
  return (method_func__name.isMethod) ?
    method_func__name : Method(method_func__name, func__, mode___)
}

// function AsMethod(method_func__name, func__, mode___) {
//   if (method_func__name.isMethod) { return method_func__name }
//   const method$core = new MethodBlanker()
//   method$core[INNER]._init(method_func__name, func__, mode___)
//   return method$core[RIND]
// }

function MakeLazyLoader(Handler) {
  return function $loader() {
    DefineProperty(this, selector, VisibleConfiguration)
    return (this[selector] = handler.call(this))
  }
}
