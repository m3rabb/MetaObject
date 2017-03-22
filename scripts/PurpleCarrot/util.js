
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

  _AddGetter(target, Name, false, function _loader() {
    DefineProperty(this, Name, InvisibleConfiguration)
    return (this[Name] = Installer.call(this))
  })
}
