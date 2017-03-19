-- Examples of different ways to manage faster property enumeration for copying,
   equality, etc.

-- bias towards reading over writing
-- be lazy, dont store until you need to
--

propsKind = (isPublic) ? (core[OUTER][selector] = value, PROPS) : _PROPS

if (!core[KNOWN_PROPERTIES]) {
  props = core[propsKind]
  if (!props[selector]) { props[PROPS_COUNT]++ }
  props[selector] = true
}
return true
},

deleteProperty (core, selector, inner) {
propsKind = (selector[0] !== "_") ?
  (delete core[OUTER][selector], PROPS) : _PROPS
if (!core[KNOWN_PROPERTIES]) {
  props = core[propsKind]
  if (!props[selector]) { props[PROPS_COUNT]-- }
  delete props[selector]
}
delete core[selector]
return true
}
}


======
Every time a new property is added/removed rebuild the cache

set (core, selector, value, inner) {
  const isPublic = (selector[0] !== "_")
  const hasNewProperty = ((core[selector] === undefined) &&
    !core[ROOT][KNOWN_PROPERTIES] && !core._has(selector))

  switch (typeof value) {

  }

  if (isPublic) {
    const outer = core[OUTER]
    outer[selector] = value
    if (hasNewProperty) {
      outer[KNOWN_PROPERTIES] = VisibleLocalNames(outer)
    }
  }
  else if (hasNewProperty) {
    core[KNOWN_PROPERTIES] = VisibleLocalNames(core)
  }

  return true
},


===
Better yet, only build the cache when it is needed to be read

===

Better yet load ref KNOWN_SELECTORS on init

==

thought about going to two level -> _KNOWN_SELECTORS & KNOWN_SELECTORS

but better to go to current model, without lazyInstallers
