var Math_floor  = Math.floor;
		var Math_random = Math.random;

		var HandleErrorsQuietly = false;

		var ParenthesesMatcher = /\(|\)/;
		var SelectorMatcher    = /[\w\$_!&]+/gi;
		var VowelMatcher       = /^[aeiou]/i;


// #### Random Number Generation
function RandomInt(max_min, max_) {
    var min, max;
    if (arguments.length <= 1) {
        min = 0, max = max_min;
    } else {
        min = max_min, max = max_;
    }
    return Math_floor(Math_random() * (max - min + 1)) + min;
}

var ZERO_PADDING, MAX_UNIQUE_ID_LENGTH, RandomIntMethod, NewUniqueIdMethod;

RANDOM_MAX = 0xFFFFFFFFFFFF;
ZERO_PADDING = "0000000000000000";
MAX_UNIQUE_ID_LENGTH =
  (+new Date("2067-01-01") * RANDOM_MAX).toString(36).length;

function _NewUniqueId(prefix, seedDate, seedValue) {
  var id, zeros;
  id = seedDate * seedValue;
  id = id.toString(36);
  zeros = ZERO_PADDING.slice(0, MAX_UNIQUE_ID_LENGTH - id.length);
  return prefix + zeros + id;
}

function NewUniqueId(prefix_) {
    var prefix = prefix_ || "";
    return _NewUniqueId(prefix, Date.now(), RandomIntMethod(RANDOM_MAX));
};
