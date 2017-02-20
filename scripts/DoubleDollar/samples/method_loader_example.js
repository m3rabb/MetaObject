Thing.add(function addAll(items) {
  let savedAliases = SpawnFrom(null)
  let limit   = namedFuncs.length
  let next    = 0

  while (next < index) {
    item = items[next++]

    switch (typeof item) {
      default         : continue

      case "object"   :
        this.add(item)
        break

      case "function" :

        this.addSMethod(item)
        break

      case "string"   :

        switch (item.toUpperCase()) {
          case "GETTER"  :
          case "GETTERS" :
            item = items[next++]

            if (typeof item === "function") {
              this.addSGetter(item)
            }
            else {
              let getters = item
              count   = getters.length
              while (count--) { this.addSGetter(getters[count]) }
            }
            break

          case "ALIAS"   :
          case "ALIASES" :
            aliases = items[next++]
            aliasNames = LocalProperties(aliases)
            count      = getters.length

            while (count--) {
              aliasName      = aliasNames[count]
              originalName   = aliases[aliasName]
              savedAliases[aliasName] = originalName
            }
            break

          case "JIT"             :
          case "JIT PROP"        :
          case "JIT PROPERTY"    :
          case "JIT PROPERTIES"  :
          case "LAZY"            :
          case "LAZY PROP"       :
          case "LAZY PROPERTY"   :
          case "LAZY PROPERTIES" :
            item = items[next++]

            if (typeof item === "function") {
              AddLazilyInstalledProperty(item)
            }
            else {
              let lazies = item
              count   = getters.length
              while (count--) {
                AddLazilyInstalledProperty(lazies[count])
              }
            }
            break
        }
    }
  }

  count = savedAliases.length

  while (count--) {
    aliasName      = savedAliases[count]
    originalName   = aliases[aliasName]
    this.addSAlias(aliasName, originalName)
  }

  return this
})
