Tranya(function (MarkFunc, RoundDown, RandomUnitValue, Shared) {
  "use strict"

  // #### Random Number Generation
  const MAX_SAFE_INTEGER     = 9007199254740991
  const RANDOM_MAX           = 0xFFFFFFFFFFFF
  const ZERO_PADDING         = "0000000000000000"
  const MAX_DATE_LENGTH      = 8
  const MAX_RAND_LENGTH      = 10
  //  (+new Date("2067-01-01") * RANDOM_MAX).toString(36).length

  function RandomInt(max_min_, max__) {
    var min, max
    switch (arguments.length) {
      case 0  : min = 0       ; max = MAX_SAFE_INTEGER ; break
      case 1  : min = 0       ; max = max_min_         ; break
      default : min = max_min_; max = max__            ; break
    }
    return RoundDown(RandomUnitValue() * (max - min + 1)) + min
  }

  function NewUniqueId(
    prefix      = "",
    seedDate    = Date.now(),
    seedValue   = RandomInt(RANDOM_MAX),
    longVersion = false
  ) {
    var dateId    = seedDate.toString(36)
    var randId    = seedValue.toString(36)

    if (longVersion) {
      var dateZeros = ZERO_PADDING.slice(0, MAX_DATE_LENGTH - dateId.length)
      var randZeros = ZERO_PADDING.slice(0, MAX_RAND_LENGTH - randId.length)
      return `${prefix}${dateZeros}${dateId}_${randZeros}${randId}`
    }
    else {
      var value = (seedDate * seedValue).toString(36).slice(0, 10)
      return `${prefix}${value.slice(0,5)}_${value.slice(5,10)}`
    }
  }

  Shared.randomInt   = MarkFunc(RandomInt)
  Shared.newUniqueId = MarkFunc(NewUniqueId)

})
