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

  function GroupsFromKeywordsAndParams(keywords, params) {
    var groups, index, limit, param, level,
        highestFoundLevel, group, keyword;
    groups = [];
    index  = 0;
    limit  = keywords.length;
    while (index < limit) {
      param = params[index];
      if (param) {
        level = OptionalLevel(param);
        highestFoundLevel = level;
      } else {
        level = highestFoundLevel + 1;
      }
      group = groups[level] || (groups[level] = []);
      keyword = keywords[index++];
      group.push(keyword);
    }
    return groups;
  }

  var Array_push = Array.prototype.push;

  function Permutations(group, base_) {
    var permutations, base, index, limit, keyword, newBase, remaining;
    permutations = [];
    base = base_ ? base_.slice() : [];
    index = 0;
    limit = group.length;
    while (index < limit) {
      keyword = group[index];
      newBase = base.concat(keyword);
      remaining = CopyWithoutIndex(group, index++);
      permutations.push(newBase);
      Array_push.apply(permutations, Permutations(remaining, newBase));
    }
    return permutations;
  }

  function display(array) {
    var output = array.map(function (each) {
      return "(" + each.toString() +")";
    });
    return output.join(" ");
  }

  function AddGroupToCombos(permutations, combos) {
    var newCombos, toIndex, toLimit;
    var fromIndex, fromLimit, combo, permutation;
    newCombos = [];
    toIndex = 0;
    toLimit = combos.length;
    fromLimit = permutations.length;
    while (toIndex < toLimit) {
      combo = combos[toIndex++];
      fromIndex = 0;
      while (fromIndex < fromLimit) {
        permutation = permutations[fromIndex++];
        newCombos.push(combo.concat(permutation));
      }
    }
    return newCombos;
  }

  function CombosFromGroupsAndBase(groups, base) {
    var combos, index, limit, group;
    combos = [base];
    index = 0;
    limit = groups.length;
    while (index < limit) {
      group = groups[index++];
      combos = AddGroupToCombos(group, combos);
    }
    return combos;
  }


  //
  // function CombosFromGroups(keywordGroups) {
  //   var
  //   group0 = keywordGroups[0];
  //   combos = [group0];
  //   while (index < limit) {
  //     nextGroup = keywordGroups[index];
  //     AddGroupToCombos(combos, nextGroup);
  //   }
  // }

  VOID

  at_ifAbsent(index, action_)

  z_x_q_y()

  list.at_ifAbsent(index, element)
  list.at_put$({key: index, value: element})
  list.at_put$("key", index, "value", element})
  list.$({at: index, put: element})
  list.$_({at: index})
  //
  // abc de fg
  //
  // abc
  //
  // abcd
  //
  // abce
  //
  //
  // abcde
  //
  //
  //
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
    var groups = GroupsFromKeywordsAndParams(keywords, params);
    var base = groups[0] || [];
    groups = CopyWithoutIndex(groups, 0);
    return CombosFromGroupsAndBase(groups, base);
  }


  var c1 = CombosFrom("a_b_c_d(w, x, y, z)");
  var c2 = CombosFrom("a_b_c_d(w_, x_, y_, z_)");
  var c3 = CombosFrom("a_b_c_d(w, x, y_, z__)");
  var c4 = CombosFrom("a_b_c_d(w, x_, y_, z__)");
  var c5 = CombosFrom("r_s_t_u(w, x, y_, z_)");
