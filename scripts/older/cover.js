
// dog({friend: otherDog});

// function AttachRef(Target) {
//   return function Ref(arg) {
//     var count, node, keyword, canonical;
//     switch (typeof params) {
//       case "number" :
//         if (params === REF_RESET) {
//           Target = arguments[1];
//           return AttachRef;
//         }
//         return error
//
//       case "string" :
//         return Target[params]();
//       case "object" :
//         count = 0;
//         node  = KeywordNetwork;
//         for (keyword in params) {
//           count += 1;
//           node   = node[keyword];
//         }
//         if (count === 1) {
//           return Target[keyword](params[keyword]);
//         }
//         selector         = node.canonical;
//         keywords         = selector.Keywords;
//         nonOptionalCount = selector.NonOptionalCount;
//         totalCount       = keywords.length;
//         index            = 0;
//         args             = [];
//         while (index < nonOptionalCount) {
//           keyword       = keywords[index];
//           args[index++] = params[keyword];
//         }
//         while (index < totalCount) {
//           keyword = keywords[index];
//           if (keyword in params) {} else { break; }
//           args[index++] = params[keyword];
//         }
//         return Target[selector].apply(Target, args);
//     }
//   };
// }

  "use strict";

  function NewStash() {
    return Object.create(null);
  }

  function CopyWithoutIndex(array, matchIndex) {
    var copy      = [];
    var fromIndex = 0;
    var toIndex   = 0;
    var limit     = array.length;
    while (fromIndex < limit) {
      if (fromIndex !== matchIndex) {
        copy[toIndex++] = array[fromIndex];
      }
      fromIndex++;
    }
    return copy;
  }




  function OptionalLevel(param) {
    var trailingUnderscores = param.match(/[a-z0-9]+(_*)/i);
    return trailingUnderscores[1].length;
  }

  function CombosFrom(methodSignature) {
    var matchs = methodSignature.match(/(.*)\((.*)\)/);
    var selector = matchs[1];
    var paramString = matchs[2];
    var keywords = selector.split("_");
    var params = paramString.split(/\s*,\s*/);
    var combinations = NewStash();
    var key, combo, keys = [];
    KeywordCombos(keywords, params, 0, combinations);
    for (key in combinations) {
      keys.push(key);
    }
    return keys.sort();
  }

  function KeywordCombos(keywords, params, priorlevel, combinations) {
    var key, index, lastParam, lastLevel, nextKeywords, nextParams;

    key = keywords.join(" ");

    if (key in combinations) { return combinations; }
    combinations[key] = keywords;

    index = keywords.length;

    while (index--) {
      lastParam = params[index];
      lastLevel = OptionalLevel(lastParam);
      if (lastLevel && lastLevel >= priorlevel) {
        nextKeywords = CopyWithoutIndex(keywords, index);
        nextParams   = CopyWithoutIndex(params  , index);
        KeywordCombos(nextKeywords, nextParams, lastLevel, combinations);
      }
    }

    return combinations;
  }

  var c1 = CombosFrom("a_b_c_d(w, x, y, z)");
  var c2 = CombosFrom("a_b_c_d(w_, x_, y_, z_)");
  var c3 = CombosFrom("a_b_c_d(w, x, y_, z__)");
  var c4 = CombosFrom("a_b_c_d(w, x_, y_, z__)");
  var c5 = CombosFrom("r_s_t_u(w, x, y_, z_)");
