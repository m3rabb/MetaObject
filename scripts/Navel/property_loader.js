HandAxe(function (SpawnFrom, _OwnKeysOf, _PropertyLoader) {
  "use strict"

  const LISTING_DELIMITER_MATCHER = /\s*[ ,]\s*/

  const modeNames =
    `ALIAS DECLARATION DECLARE DURABLE FOR_ASSIGN FOR_MANDATORY FOR_SETTER
     LAZY MANDATORY METHOD RETRO RETROACTIVE SELF SELF_METHOD SETTER
     SETTER_ASSIGNER SHARED STANDARD VALUE VALUE_METHOD`

  _PropertyLoader.addSharedProperty("modes", modeNames.split(/\s+/))

  _PropertyLoader.addValueMethod(function _init(type) {
    this._type    = type
    this._aliases = SpawnFrom(null)
  })


  _PropertyLoader.addValueMethod(function _saveAlias(aliasName, existingName) {
    this._aliases[aliasName] = existingName
  })

  _PropertyLoader.addValueMethod(function _resolveAliases() {
    const type    = this._type
    const aliases = this._aliases
    for (var aliasName in aliases) {
      var existingName = aliases[aliasName]
      type.addAlias(aliasName, existingName)
    }
    this._aliases = SpawnFrom(null)
  })


  _PropertyLoader.addValueMethod(function isMode(string) {
    return (this.modes.indexOf(string) >= 0)
  })


  _PropertyLoader.addValueMethod(function load(item, mode = "STANDARD") {
    this._load(item, mode)
    this._resolveAliases
  })


  _PropertyLoader.addValueMethod(function _load(item, mode) {
    switch (item.constructor) {
      case Array    : this._loadFromArray (item, mode) ; break
      case Object   : this._loadFromSpec  (item, mode) ; break
      case Function : this._loadFunc      (item, mode) ; break
      case String   : this._loadFromString(item, mode) ; break

      default : this._signalError("Definitions must be in a list|spec|func!!")
    }
  })

  _PropertyLoader.addValueMethod(function _loadFromArray(items, mode) {
    var index, count, item

    index = 0
    count = items.length

    while (index < count) {
      item = items[index++]

      switch (item.constructor) {
        default       : return this._signalError("Unexpected item!!")
        case Object   : this._loadFromSpec (item, mode)             ; break
        case Array    : this._loadFromArray(item, mode)             ; break
        case Function : this._loadFunc     (item, mode)             ; break
        case String   :
          if (this.isMode(item)) { this._load(items[index++], (mode = item)) }
          else                   { this._loadFromString(item,  mode        ) }
          break
      }
    }
  })

  _PropertyLoader.addValueMethod(function _loadFromSpec(item, mode) {
    var keys = _OwnKeysOf(item)

    keys.forEach(key => {
      var value = item[key]

      if (this.isMode(key)) { this._load(value, key)           }
      else                  { this._loadPair(key, value, mode) }
    })
  })


  _PropertyLoader.addValueMethod(function _loadPair(name, value, mode) {
    switch (mode) {
      case "ALIAS"           : return this._saveAlias(name, value)
      case "SHARED"          : return this._type.addSharedProperty    (name, value)

      case "METHOD"          : return this._type.addMethod            (name, value)

      case "SELF"            :
      case "SELF_METHOD"     : return this._type.addSelfMethod        (name, value)
      case "VALUE"           :
      case "VALUE_METHOD"    : return this._type.addValueMethod       (name, value)

      case "LAZY"            : return this._type.addLazyProperty      (name, value)
      case "RETRO"           :
      case "RETROACTIVE"     : return this._type.addRetroactiveValue  (name, value)
      case "SETTER"          : return this._type.addSetter            (name, value)
      case "MANDATORY"       : return this._type.addMandatorySetter   (name, value)
      case "SETTER_ASSIGNER" : return this._type.addSetterAndAssigner (name, value)


      case "FOR_ASSIGN"      : return this._type.forAddAssigner       (name, value)
      case "FOR_SETTER"      : return this._type.forAddSetter         (name, value)
      case "FOR_MANDATORY"   : return this._type.forAddMandatorySetter(name, value)

      case "STANDARD"        :
        return this._signalError(`Must define mode for spec containing '${name}'!!`)

      default : return this._signalError(`Invalid pair mode: ${mode}!!`)
    }
  })

  _PropertyLoader.addValueMethod(function _loadFunc(func, mode) {
    switch (mode) {
      case "STANDARD"      :
      case "METHOD"        : return this._type.addMethod          (func)

      case "SELF"          :
      case "SELF_METHOD"   : return this._type.addSelfMethod      (func)
      case "VALUE"         :
      case "VALUE_METHOD"  : return this._type.addValueMethod     (func)

      case "LAZY"          : return this._type.addLazyProperty    (func)
      case "RETRO"         :
      case "RETROACTIVE"   : return this._type.addRetroactiveValue(func)
      case "SETTER"        : return this._type.addSetter          (func)
      case "MANDATORY"     : return this._type.addMandatorySetter (func)

      case "FOR_ASSIGN"    : return this._type.forAddAssigner     (func)

      default : return this._signalError(`Invalid definition mode: ${mode}!!`)
    }
  })

  _PropertyLoader.addValueMethod(function _loadFromString(string, mode) {
    const names = string.split(LISTING_DELIMITER_MATCHER)
    names.forEach(name => this._loadFromName(name, mode))
  })

  _PropertyLoader.addValueMethod(function _loadFromName(name, mode) {
    switch (mode) {
      case "STANDARD"      : return this._type.addDeclaration       (name)
      case "DECLARE"       : return this._type.addDeclaration       (name)
      case "DECLARATION"   : return this._type.addDeclaration       (name)

      case "DURABLE"       : return this._type.addDurable           (name)

      case "SETTER"        : return this._type.addSetter            (name)
      case "MANDATORY"     : return this._type.addMandatorySetter   (name)

      case "FOR_SETTER"    : return this._type.forAddSetter         (name)
      case "FOR_MANDATORY" : return this._type.forAddMandatorySetter(name)

      default : return this._signalError(`$Invalid name mode: ${mode}!!`)
    }
  })

})


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
