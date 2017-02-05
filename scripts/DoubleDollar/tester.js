
function Parcel() {

}

Parcel.prototype.setLocation = function (city, country) {
  this._setCity(city)
  this._setCountry(country)
}

Parcel.prototype._setCity = function (city) {
  this._city = city
}

Parcel.prototype._setCountry = function (country) {
  this._country = country
}

var box = new Parcel()

var p = new Proxy(box, {
  get : function (inner, selector) {
    return inner[selector]
  }
})


const DefineProperty     = Object.defineProperty

const LazyPropertyConfiguration = {
  __proto__   : null,
  // writable    : true,
  enumerable  : false,
  configurable: true,
}

const InvisibleConfiguration = {
  __proto__   : null,
  writable    : true,
  enumerable  : true,
  configurable: true,
}

function _AddGetter(target, name, installer) {
  const configuration = {
    __proto__ : LazyPropertyConfiguration,
      get     : installer
  }

  return DefineProperty(target, name, configuration)
}

function AddGetter(target, namedInstaller_name, installer_) {
  const [name, installer] =
    (typeof namedInstaller_name === "function") ?
      [namedInstaller_name.name, namedInstaller_name] :
      [namedInstaller_name     , installer_         ]

  return _AddGetter(target, name, installer)
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

parent = {}
obj = {__proto__: parent, first: "Barack", last: "Obama"}

AddLazyProperty(parent, "fullName", function () {
  return `${this.first} ${this.last}`
})

kname = obj.fullName
