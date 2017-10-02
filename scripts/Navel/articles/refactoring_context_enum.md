_Context.addValueMethod(function knownTypes() {
  return GlazeImmutable(TypesFrom(this._knownEntries))
})

_Context.addValueMethod(function ownTypes() {
  return GlazeImmutable(TypesFrom(this.ownEntries))
})


_Context.addValueMethod(function knownTypeNames() {
  return GlazeImmutable(
    TypesFrom(this._knownEntries).map(type => type.name))
})

_Context.addValueMethod(function ownTypeNames() {
  return GlazeImmutable(TypesFrom(this.ownEntries).map(type => type.name))
})


function TypesFrom(entries) {
  var selector, entry, _$entry, index
  const types = []

  index = 0
  for (selector in entries) {
    entry   = entries[selector]
    _$entry = InterMap.get(entry)
    if (_$entry && _$entry[$IS_TYPE]) { types[index++] = entry }
  }
  return types.sort((a, b) => a.name.localeCompare(b.name))
}


///=========


_Context.addSelfMethod(function forEachKnown(action) {
  const entries = this._knownEntries
  for (var key in entries) { action(entries[key], key) }
})

_Context.addSelfMethod(function forEachOwn(action) {
  const entries = this._knownEntries
  const keys    = _OwnKeysOf(this._knownEntries)
  keys.forEach(key => action(entries[key], key))
})

_Context.addValueMethod(function _enumEntries(which, action) {
  return (which.toUpperCase() === "OWN") ?
    this.forEachOwn(action) : this.forEachKnown(action)
})


_Context.addValueMethod(function _mapEntries(which, action) {
  const results = []
  var   index   = 0
  this._enumEntries(which, (entry,key) => results[index++] = action(entry,key))
  return GlazeImmutable(results)
})

_Context.addValueMethod(function _mapTypes(which, action) {
  const results = []
  var   index   = 0
  this._enumEntries(which, (entry, key) => {
    const _$entry = InterMap.get(entry)
    if (_$entry && _$entry[$IS_TYPE]) {
      results[index++] = action(entry, key)
    }
  })
  return GlazeImmutable(results)
})

_Context.addValueMethod(function knownTypes() {
  return this._mapTypes("KNOWN", type => type)
})

_Context.addValueMethod(function ownTypes() {
  return this._mapTypes("OWN", type => type)
})

_Context.addValueMethod(function knownTypeNames() {
  return this._mapTypes("KNOWN", (type, typeName) => typeName)
})

_Context.addValueMethod(function ownTypeNames() {
  return this._mapTypes("OWN", (type, typeName) => typeName)
})


///======


_Context.addSelfMethod(function forEachKnown(action) {
  const entries = this._knownEntries
  const keys    = []
  var   index   = 0
  for (var keys in entries) { keys[index++] = keys }
  const count   = index
  index = 0
  while (index < count) {
    key = keys[index++]
    action(entries[key], key)
  }
})


///======


_Context.addValueMethod(function knownKeys() {
  var key, index
  const entries = this._knownEntries
  const keys    = []

  index = 0
  for (key in entries) { keys[index++] = key }
  return GlazeImmutable(keys.sort(CompareSelectors))
})

_Context.addSelfMethod(function forEachKnown(action) {
  var entries, keys, index, count, key

  entries = this._knownEntries
  keys    = []
  index   = 0
  for (var keys in entries) { keys[index++] = keys }

  count = index
  index = 0
  while (index < count) {
    key = keys[index++]
    action(entries[key], key)
  }
})



///======


_Context.addValueMethod(function knownKeys() {
  var key, index
  const entries = this._knownEntries
  const keys    = []

  index = 0
  for (key in entries) { keys[index++] = key }
  return GlazeImmutable(keys.sort(CompareSelectors))
})

_Context.addSelfMethod(function forEachKnown(action) {
  this.knownKeys.forEach(key => {
    key = keys[index++]
    action(entries[key], key)
  })
})



///====


_Context.addSelfMethod(function forEachKnown(action) {
  this.knownKeys.forEach(key => {
    key = keys[index++]
    action(entries[key], key)
  })
})

_Context.addSelfMethod(function forEachOwn(action) {
  const entries = this._knownEntries
  const keys    = OwnKeysOf(this._knownEntries)
  keys.forEach(key => action(entries[key], key) }
})

_Context.addValueMethod(function _enumEntries(which, action) {
  return (which.toUpperCase() === "OWN") ?
    this.forEachOwn(action) : this.forEachKnown(action)
})


///====


_Context.addSelfMethod(function forEachKnown(action) {
  this._forEachEntry("knownKeys", action)
})

_Context.addSelfMethod(function forEachOwn(action) {
  this._forEachEntry("ownKeys", action)
})

_Context.addValueMethod(function _forEachEntry(which, action) {
  this[which].forEach(key => {
    key = keys[index++]
    action(entries[key], key)
  })
})


///===




_Context.addValueMethod(function knownKeys() {
  var key, index
  const entries = this._knownEntries
  const keys    = []

  index = 0
  for (key in entries) { keys[index++] = key }
  return GlazeImmutable(keys.sort(CompareSelectors))
})

_Context.addValueMethod(function ownKeys() {
  return OwnKeysOf(this._knownEntries)
})



_Context.addSelfMethod(function forEachKnown(action) {
  this._forEachEntry("knownKeys", action)
})

_Context.addSelfMethod(function forEachOwn(action) {
  this._forEachEntry("ownKeys", action)
})

_Context.addValueMethod(function _forEachEntry(which, action) {
  const Entries = this._knownEntries
  this[which].forEach(key => action(Entries[key], key))
  return this
})

_Context.addValueMethod(function _mapEntries(which, action) {
  const results = []
  var   index   = 0
  this._forEachEntry(
    which, (entry, key) => results[index++] = action(entry, key))
  return GlazeImmutable(results)
})

_Context.addValueMethod(function _mapTypes(which, action) {
  const results = []
  var   index   = 0
  this._forEachEntry(which, (entry, key) => {
    const _$entry = InterMap.get(entry)
    if (_$entry && _$entry[$IS_TYPE]) {
      results[index++] = action(entry, key)
    }
  })
  return GlazeImmutable(results)
})



_Context.addValueMethod(function knownTypes() {
  return this._mapTypes("knownKeys", type => type)
})

_Context.addValueMethod(function ownTypes() {
  return this._mapTypes("ownKeys", type => type)
})

_Context.addValueMethod(function knownTypeNames() {
  return this._mapTypes("knownKeys", (type, typeName) => typeName)
})

_Context.addValueMethod(function ownTypeNames() {
  return this._mapTypes("ownKeys", (type, typeName) => typeName)
})




///===



_Context.addValueMethod(function _mapKind(which, where, action) {
  const results = []
  var   index   = 0
  this._forEachEntry(where, (entry, key) => {
    const _$entry = InterMap.get(entry)
    if (_$entry && _$entry[which]) {
      results[index++] = action(entry, key)
    }
  })
  return GlazeImmutable(results)
})


///====

_Context.addValueMethod(function knownKeys() {
  var key, index
  const entries = this._knownEntries
  const keys    = []

  index = 0
  for (key in entries) { keys[index++] = key }
  return GlazeImmutable(keys.sort(CompareSelectors))
})

_Context.addValueMethod(function ownKeys() {
  return OwnKeysOf(this._knownEntries)
})



_Context.addSelfMethod(function forEachKnown(action) {
  this._forEachEntry("knownKeys", action)
})

_Context.addSelfMethod(function forEachOwn(action) {
  this._forEachEntry("ownKeys", action)
})

_Context.addValueMethod(function _forEachEntry(where, action) {
  const Entries = this._knownEntries
  this[where].forEach(key => action(Entries[key], key))
  return this
})

_Context.addValueMethod(function _mapEntries(where, action) {
  const results = []
  var   index   = 0
  this._forEachEntry(
    where, (entry, key) => results[index++] = action(entry, key))
  return GlazeImmutable(results)
})

_Context.addValueMethod(function _mapKind(which, where, action) {
  const results = []
  var   index   = 0
  this._forEachEntry(where, (entry, key) => {
    const _$entry = InterMap.get(entry)
    if (_$entry && _$entry[which]) {
      results[index++] = action(entry, key)
    }
  })
  return GlazeImmutable(results)
})


_Context.addValueMethod(function knownTypes() {
  return this._mapKind($IS_TYPE, "knownKeys", type => type)
})

_Context.addValueMethod(function ownTypes() {
  return this._mapKind($IS_TYPE, "ownKeys", type => type)
})

_Context.addValueMethod(function knownTypeNames() {
  return this._mapKind($IS_TYPE, "knownKeys", (type, typeName) => typeName)
})

_Context.addValueMethod(function ownTypeNames() {
  return this._mapKind($IS_TYPE, "ownKeys", (type, typeName) => typeName)
})


_Context.addValueMethod(function knownContexts() {
  return this._mapKind($IS_CONTEXT, "knownKeys", context => context)
})

_Context.addValueMethod(function ownContexts() {
  return this._mapKind($IS_CONTEXT, "ownKeys", context => context)
})


///====


_Context.addValueMethod(function _mapKind(which, where, action_) {
  const results = []
  var   index   = 0
  this._forEachEntry(where, (entry, key) => {
    const _$entry = InterMap.get(entry)
    if (_$entry && _$entry[which]) {
      results[index++] = action_ ? action_(entry, key) : entry
    }
  })
  return GlazeImmutable(results)
})


_Context.addValueMethod(function knownTypes() {
  return this._mapKind($IS_TYPE, "knownKeys")
})

_Context.addValueMethod(function ownTypes() {
  return this._mapKind($IS_TYPE, "ownKeys")
})


///====


_Context.addValueMethod(function _mapKind(which, where, action = AlwaysPass) {
  const results = []
  var   index   = 0
  this._forEachEntry(where, (entry, key) => {
    const _$entry = InterMap.get(entry)
    if (_$entry && _$entry[which]) {
      results[index++] = action(entry, key)
    }
  })
  return GlazeImmutable(results)
})


Shared.alwaysPass     = MarkFunc(         arg => arg         )


////=====


_Context.addValueMethod(function _mapKind(which, where, selection) {
  const results = []
  var   index   = 0
  this._forEachEntry(where, (entry, key) => {
    const _$entry = InterMap.get(entry)
    if (_$entry && _$entry[which]) {
      results[index++] = selection(entry, key)
    }
  })
  return GlazeImmutable(results)
})


_Context.addValueMethod(function knownTypes() {
  return this._mapKind($IS_TYPE, "knownKeys", AlwaysPass1st)
})

_Context.addValueMethod(function ownTypes() {
  return this._mapKind($IS_TYPE, "ownKeys", AlwaysPass1st)
})

_Context.addValueMethod(function knownTypeNames() {
  return this._mapKind($IS_TYPE, "knownKeys", AlwaysPass2nd)
})

_Context.addValueMethod(function ownTypeNames() {
  return this._mapKind($IS_TYPE, "ownKeys", AlwaysPass2nd)
})

///====


_Context.addValueMethod(function _mapKind(which, where, selection) {
  const results = []
  var   index   = 0
  this._forEachEntry(where, (entry, key) => {
    const _$entry = InterMap.get(entry)
    if (_$entry && _$entry[which]) {
      results[index++] = [entry, key][selection]
    }
  })
  return GlazeImmutable(results)
})


///===


const VALUE = 0
const KEY   = 1

_Context.addValueMethod(function knownTypes() {
  return this._mapKind($IS_TYPE, "knownKeys", VALUE)
})


///===


_Context.addValueMethod(function knownContextNames() {
  return this._getContexts("knownKeys", NAME)
})

_Context.addValueMethod(function knownContextKeys() {
  return this._getContexts("knownKeys", NAME)
})
