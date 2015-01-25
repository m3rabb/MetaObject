
    function xyz(first, second, $REST_, $g_)

    $remaining $rest

    function xyz(size, weight, $ARGS, $REST)

    $arguments
    $remaining

    xyz_()


    var Create_SmartMethod = AsMemoizing(

    function (methodSignature) {
      var MethodName = methodSignature[0];
      var Count = methodSignature.length;
      var ParamNames = [];
      var IsOptionals = [];
      while (--Count > 0) {
        IsOptionals.push(!methodSignature[Count]);
        ParamNames.push(methodSignature[--Count]);
      }
      Count = Params.length;

      return function specOrList2args(spec_list) {
        var index, params, next, name;
        if (Array_isArray(spec_list)) {
          params = spec_list;
        } else {
          index = Count;
          params = [];
          next = 0;

          while(index-- > 0) {
            name = ParamNames[index];
            if (IsOptionals[index]) {
              if (name in spec_list) {
                params[next++] = spec_list[name];
              }
            } else {
              params[next++] = spec_list[name];
            }
          }
        }
        return this[MethodName].apply(this, params);
      }
    });


    name, first_last, last_age, age_

    name, first, last, age
    name, first, last
    name, last, age

    1:[name]
    2:[first, last]
    3:
    4:
    $rest $remaining              --- passed in
    $remaining$args $args$rest
    $remaining$params $params$rest

    $args $arguments --- array
    $actual          --- passed in
    $params $parameters $pairs $spec $options --- spec default

    _({}, false)
    _([v, v], false_)
    _([k, k], [v, v])
    _("k", v, "k", v)
    _("k k", v, v)
    _("(k)", [v])
    _("k k", "v v")
    _([k, v, k, v], true)

    function AsSmartMethodNamed_($args) {
      // (red, green, blue
      //  )
    }

    function AsLowerCamelCase(name) {
      return name[0].toLowerCase() + name.slice(1);
    }



    PARAMS_LIST_MATCHER = /function.*\((.*)\)/;
    PARAMS_DELIMITER = /\s*,\s*/;

    OPTIONALS_MATCHER = /_*[a-z0-9]*(_+)/i
    OPTIONS_MATCHER = /_*($?)([a-z][a-z0-9]*)(_*)/i;


    function AsSmartMethodNamed(method, name) {
      var paramsString = method.toString().match(PARAMS_LIST_MATCHER)[1];
      var paramNames = paramsString.split(PARAMS_DELIMITER);
      var paramCount = paramNames.length;
      var LastIndex, SpecialsMap, groupings;


      hasNoOptionals = paramsString.match(OPTIONALS_MATCHER) === null;
      hasNoSpecials  = paramsString.indexOf("$") < 0;

      if (hasNoSpecials) {
        return (hasNoOptionals) ?
          this.createCommon(method, paramNames, paramCount) :
          this.createParams(method, paramNames, paramCount) :
        }
      }
      return (paramCount === 1) ?
        this.createSpec(method, paramNames[0]) :
        this.createGeneral(method, paramNames, paramCount);
      }

      SpecialsMap = NewStash({customs : []});
      options = paramNames.map(function (paramName, index) {
        var matchs = paramName.match(OPTIONS_MATCHER);
        var names = matchs[2];
        var name;
        if (matchs[3] === "") { // isNonOptional
          LastIndex = index;
        }
        if (matchs[1] === "$") {
          name = names.toLowerCase();
          if (name in SpecialKeywords) {
            SpecialsMap[name] = index;
          }
          else {
            SpecialsMap.customs.push(index)
          }
          return [];
        }
        return names.split("_").map(AsLowerCamelCase);
      });
      return CreateGeneralSmartMethod(method, groupings, LastIndex, SpecialsMap);
    }

    xyz_([6,7,8, 9, 10, 11])
      // _(a b c d)

$raw - values/keys
$explicit - values/keys
$implicit - spec/array
$data

$args - $spec $list
$rest/$remaining/$rest

$spec $LIST $REST
$$spec $$LIST $$REST

    $$spec
    xyz($spec, $rest, $copy, $values)
    xyz(a, b_c, $spec, c)
    $values $copy $rest
    $rest $args $actual|$raw $values $array $list $spec

    [[a],[b,c],[],[c]]
    [2]

    SpecialKeywords = NewStash_({values : true, copy : true, rest : true});

    KEY_LIST_MATCHER = /([\[\(])?(.+)([\)\])])?/;
    WHITE_SPACE_MATCHER = /\s+/;






    function ExecuteOnMappingValuesToParams(target, values, baseMethod, _methodSpec, _isOriginal) {
      return baseMethod.apply(target, values);
    }

    function ExecuteOnMappingSpecToParams(target, spec, baseMethod, paramNames, methodSpec, _isOriginal) {
      var paramNames, index, args, name;
      paramNames = methodSpec.ParamNames;
      index = paramNames.length;
      args = [];

      while(index-- > 0) {
        name = paramNames[index];
        args[index] = spec[name];
      }
      return methodSpec.BaseMethod.apply(target, args);
    }

    function ExecuteOnMappingValuesToSpec(target, values, methodSpec, _isOriginal) {
      var spec, paramNames, valuesCount, paramsCount, count, index, name;
      spec = NewStash();
      paramNames = methodSpec.ParamNames;
      valuesCount = values.length;
      paramsCount = paramNames.length;
      count = valuesCount < paramsCount ? valuesCount : paramsCount;
      index = 0;

      while (index < count) {
        name = paramNames[index];
        spec[name] = values[index++];
      }
      return methodSpec.BaseMethod.call(target, spec);
    }

    BaseMethod
    function ExecuteOnMappingSpecToSpec(target, spec, methodSpec, isOriginal) {
      var arg = isOriginal && methodSpec.EnsureCopy ? NewStash_(spec) : spec;
      return methodSpec.BaseMethod.call(target, arg);
    }

    function List_OnExecuteValues(target, spec, methodSpec, isOriginal) {
      var arg = isOriginal && methodSpec.EnsureCopy ? NewStash_(spec) : spec;
      return methodSpec.BaseMethod.call(target, arg);
    }

    function List_OnExecuteSpec(target, spec, methodSpec, isOriginal) {
      var arg = isOriginal && methodSpec.EnsureCopy ? NewStash_(spec) : spec;
      return methodSpec.BaseMethod.call(target, arg);
    }



    function OnExecuteValues() {
      fromIndex = 0;
      fromCount = values.length;
      next      = 0;
      skipIndex = SkipIndexes[next];
      toIndex   = StartIndex;

      count = (FillCount && FillCount < fromCount) ? FillCount : fromCount;
      // If there are specials don't add extra args, add to specials instead

      // fix below to gather proper remaining values
      // fix to work assuming single $spec param feed by values

      while (fromIndex < count) {
        if (skipIndex === undefined) {
          do {
            args[toIndex++] = values[fromIndex++];
          } while (fromIndex < count)
          break;
        }
        while (toIndex === skipIndex)
          toIndex++;
          skipIndex = SkipIndexes[++next];
        }
        args[toIndex++] = values[fromIndex++];
      }
      specialIndex = Specials.remaining;
      if (specialIndex !== undefined) {
        args[specialIndex] = values.slice(fromIndex);
      } else {
        while (fromIndex < fromCount) {
          args[toIndex++] = values[fromIndex++];
        }
      }
      if ((specialIndex = Specials.spec) !== undefined) {
        spec = NewStash();
        groupingsIndex = 0;
        groupingsCount = Groupings.length;
        fromIndex = 0;
        while (groupingsIndex < groupingsCount) {
          names = Groupings[groupingsIndex++];
          next = 0;
          count = names.length;
          value = args[fromIndex++];
          while (next < count) {
            name = names[next++];
            spec[name] = value;
          }
        }
        args[specialIndex] = spec;
      }
      if ((specialIndex = Specials.values) !== undefined) {
        args[specialIndex] = values;
      }
      if ((specialIndex = Specials.copy) !== undefined) {
        args[specialIndex] = values.slice();
      }
      return Method.apply(this, args);
    }

    function OnExecuteSpec() {
      groupingsIndex = 0;
      groupingsCount = Groupings.length;
      toIndex = 0;

      specialIndex = Specials.remaining;
      if (specialIndex !== undefined) {
        stash = NewStash_(spec);
        while (groupingsIndex < groupingsCount) {
          names = Groupings[groupingsIndex++];
          next = 0;
          count = names.length;
          while (next < count) {
            name = names[next++];
            if (name in stash) {
              args[toIndex] = stash[name];
              delete stash[name];
              break;
            }
          }
          toIndex++;
        }
      } else {
        stash = NewStash();
        while (groupingsIndex < groupingsCount) {
          names = Groupings[groupingsIndex++];
          next = 0;
          count = names.length;
          while (next < count) {
            name = names[next++];
            if (!stash[name]) {
              args[toIndex] = spec[name];
              stash[name] = true;
              break;
            }
          }
          toIndex++;
        }
      }
      if ((specialIndex = Specials.spec) !== undefined) {
        args[specialIndex] = spec;
      }
      if ((specialIndex = Specials.values) !== undefined) {
        args[specialIndex] = spec;
      }
      if ((specialIndex = Specials.copy) !== undefined) {
        args[specialIndex] = IsArgNew ? spec : Dup(spec);
      }
      return Method.apply(this, args);
    }
