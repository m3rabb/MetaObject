var Math_floor  = Math.floor;
		var Math_random = Math.random;

		var HandleErrorsQuietly = false;

		var ParenthesesMatcher = /\(|\)/;
		var SelectorMatcher    = /[\w\$_!&]+/gi;
		var VowelMatcher       = /^[aeiou]/i;


// #### Random Number Generation
function RandomInt(minInt_, maxInt) {
    var min, max;
    if (arguments.length <= 1) {
        min = 0, max = minInt_;
    } else {
        min = minInt_, max = maxInt;
    }
    return Math_floor(Math_random() * (max - min + 1)) + min;
}

// #### 128-bit ID Generation Functions
var ZERO_PADDING, MAX_UNIQUE_ID_LENGTH, RandomIntMethod, NewUniqueIdMethod;

ZERO_PADDING = "0000000000000000";
MAX_UNIQUE_ID_LENGTH =
  (+new Date("2067-01-01") * 0xFFFFFFFFFFFF).toString(36).length;

function NewUniqueId(prefix, seedDate, seedValue) {
  var id, zeros;
  id = seedDate * seedValue;
  id = id.toString(36);
  zeros = ZERO_PADDING.slice(0, MAX_UNIQUE_ID_LENGTH - id.length);
  return prefix + zeros + id;
}

function newUniqueId(prefix_) {
    var prefix = prefix_ || "";
    return NewUniqueId(prefix, Date.now(), RandomIntMethod(0xFFFFFFFFFFFF));
};
