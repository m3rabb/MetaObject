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
