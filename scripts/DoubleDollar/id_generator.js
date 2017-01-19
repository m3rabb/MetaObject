// #### Random Number Generation
const MAX_SAFE_INTEGER     = 9007199254740991
const RANDOM_MAX           = 0xFFFFFFFFFFFF
const ZERO_PADDING         = "0000000000000000"
const MAX_UNIQUE_ID_LENGTH =
  (+new Date("2067-01-01") * RANDOM_MAX).toString(36).length

function RandomInt(max_min_, max__) {
  let min, max
  switch (arguments.length) {
    case 0  : min = 0       ; max = MAX_SAFE_INTEGER; break
    case 1  : min = 0       ; max = max_min_        ; break
    default : min = max_min_; max = max__           ; break
  }
  return Floor(RandomUnitValue() * (max - min + 1)) + min
}

function NewUniqueId(
  prefix    = "",
  seedDate  = Date.now(),
  seedValue = RandomInt(RANDOM_MAX)
) {
  const id = (seedDate * seedValue).toString(36)
  const zeros = ZERO_PADDING.slice(0, MAX_UNIQUE_ID_LENGTH - id.length)
  return prefix + zeros + id
}
