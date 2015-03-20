    // $options $REST $SPEC $LIST $ARGS // $ACTUAL
    // params extras specials
    // $$ means safe for modifying



    KEY_LIST_MATCHER = /([\[\(])?(.+)([\)\])])?/;
    COMMA_MATCHER = /\s*,\s*/;
    WHITE_SPACE_MATCHER = /\s+/;

    COPY_ON_REQUEST    = 1
    AS_ARRAY_IF_PASSED = 2
    ALREADY_NEW        = 0
    COPY_THRESHOLD     = 2


    function AsElements(string) {
      var matchs, body, delimiterMatcher;

      matchs = KEY_LIST_MATCHER.exec(string);
      if (matchs[1] && matchs[3]) {
        body = matchs[2].trim();
        delimiterMatcher = body.index(",") >= 0 ?
          COMMA_MATCHER : WHITE_SPACE_MATCHER;
        return body.split(delimiterMatcher);
      }
      return null;
    }

    // spec - stash/object          /unorderedcollection
    // list - array/fauxArray/slist /orderedcollection
    // kList, vList
    // kvList, true
    // (str, val)*
    function Create$Method(ParamsSpec, BaseMethod) {
      return function _$(/* arguments */) {
        return ParamsSpec.execute(BaseMethod, this, arguments);
      };
    }

    ParamsSpec.addInstanceMethod(function execute(baseMethod, target, actuals) {
      //// PRIV INSTANCE)
      //// $(d d d d )
      this._I

      var actualsCount, elements, copyRule;
      actualsCount = actuals.length;
      elements  = actuals[0];

      if (IsArray(elements)) {
        copyRule = COPY_ON_REQUEST;
      }
      // if (arg instanceof Thing) {
      //   arg.asParams()
      // }
      else if (typeof elements === "object") {
        if (elements.length >= 0 && typeof elements.callee === "function") {
          copyRule = AS_ARRAY_IF_PASSED;
        }
        else {
          return (actualsCount === 1) ?
            this.executeOnSpec(baseMethod, target, elements, COPY_ON_REQUEST) :
            target.improperArgsConfigurationError(actuals, this);
        }
      }
      else if (typeof elements === "string") {
        elements = AsElements(elements);
        if (elements === null) {
          return this.executeOnCombinedArray(baseMethod, target, actuals);
        }
        copyRule = ALREADY_NEW;
      }

      switch (actualsCount) {
        case 0 :
          return this.executeOnCombinedArray(baseMethod, target, []);
        case 1 :
          return this.executeOnValues(baseMethod, target, elements, copyRule);
        case 2 :
          return this.executeOnPlural(baseMethod, target, elements, actuals);
        default :
          return target.improperArgsConfigurationError(actuals, this);
      }
    });



    // PARAMS_LIST_MATCHER = /function.*\((.*)\)/;
    // METHOD_HEADER_MATCHER =
    //   /function.*\((.*)\)\s*{((\s*\/\/.*\n)?\s*\/\/\s*\((.*)\))?/i;

    PARAMS_LIST_MATCHER    = /\(([$\w\s,]+)\)/i;
    EXTRAS_COMMENT_MATCHER = /\/\/[ \t]*(\$)?\(([$\w\s,]+)\)/i;

    PARAMS_DELIMITER       = /\s*,?\s*/;
    OPTIONALS_MATCHER      = /_*[a-z0-9]*(_+)/i
    OPTIONS_MATCHER        = /_*($?)([a-z][a-z0-9]*)(_*)/i;
    SPECIAL_PARAM_MATCHER  = /(\$?)(\$\w+)/i;
    SOLO_SPECIAL_MATCHER   = /\$\w+/i;

    ParamsSpec = Type.newInstance("ParamsSpec");

    // Add check for empty or /* arguments */) parameters!!!
    ParamsSpec.addIMethod(function _init(method) {
      var methodSource   = method.toString();
      var paramsSource   = methodSource.match(PARAMS_LIST_MATCHER)[1];
      var hasNoOptionals = paramsSource.match(OPTIONALS_MATCHER) === null;
      var hasNoSpecials  = paramsSource.lastIndexOf("$") < 0;
      var extrasSource, specials;

      if (hasNoSpecials) {
        this._extractParamNames(paramsSource);

        this.executeOnValues = ExecuteOnMappingValuesToParams;
        if (hasNoOptionals) {
          this.executeOnSpec = ExecuteOnMappingSpecToArray;
          return;
        }
      }
      else {
        extrasSource = methodSource.match(EXTRAS_COMMENT_MATCHER)[2];
        this._extractParamNames(paramsSource, extrasSource);
        specials = this._Specials;

        if (specials.length === 1) {
          specialMatch = specials[0].match(SPECIAL_PARAM_MATCHER);
          this._CopyRequest = specialMatch[1].length;

          switch ((this._SoleSpecialParam = specialMatch[2])) {
            case "$LIST" :
              this.executeOnValues = ExecuteOnMappingValuesToArray;
              this.executeOnSpec   = ExecuteOnMappingSpecToArray;
              return;
            case "$ARGS" :
            case "$REST" :
              this.executeOnValues = ExecuteOnMappingValuesToArray;
              this.executeOnSpec   = ExecuteOnMappingSpecToSpec;
              return;
            case "$SPEC" :
            default :
              this.executeOnValues = ExecuteOnMappingValuesToSpec;
              this.executeOnSpec   = ExecuteOnMappingSpecToSpec;
              return;
          }
        }
      }
      this._extractAllParamDetails(paramsSource);
    });


    _extractSpecNames(methodSource, specNamesSource);
this._SpecNames = AsSpecNames(specSource);

specialMatchs = paramNames[0].match(SPECIAL_PARAM_MATCHER);
this._CopyRequest = specialMatchs[1].length;

var paramNames     = namesSource.trim().split(PARAMS_DELIMITER);
    paramNames     = paramNames[0] ? paramNames : [];
var paramCount     = paramNames.length;



    OPTIONS_MATCHER = /_*(\$?)(\$?)([a-z][a-z0-9]*(_?[a-z][a-z0-9]*)*)(_*)/i
    // OPTIONS_MATCHER = /_*(\${0,2})([a-z][a-z0-9]*)(_*)/i;


    function AsLowerCamelCase(name) {
      return name[0].toLowerCase() + name.slice(1);
    }

    ParamsSpec.addInstanceMethod(function _extractAllParamDetails(paramsSource) {
      var Specials, SkipIndexes, StartIndex, LastIndex;
      Specials = NewStash();
      SkipIndexes = [];
      LastIndex = 0;
      paramNames = paramsSource.trim().split(PARAMS_DELIMITER);

      this._ParamSlots = paramNames.map(function (paramName, index) {
        var matchs, body, key;
        matchs = paramName.match(OPTIONS_MATCHER);
        name = AsLowerCamelCase(matchs[3]);

        if (matchs[1]) { // $
          switch (name) {
            case "LIST" : case "REST" : case "SPEC" : key = name; break;
            default : key = "otherSpec"; break;
          }
          if (Specials[key] !== undefined) {
            return this.repeatedSpecialParamError(paramName);
          }
          Specials[key] = NewStash({index : index, isCopying : !!match[2]});
          SkipIndexes.push(index);
          return [];
        }
        if (!match[5]) { // has no trailing optional underscores
          if (StartIndex === undefined) { StartIndex = index; }
          LastIndex = index;
        }
        return (matchs[4]) ? // optional names
          name.split("_").map(AsLowerCamelCase).concat(name) : name;
      });

      this._Specials    = Specials;
      this._SkipIndexes = SkipIndexes;
      this._StartIndex  = StartIndex;
      this._LastIndex   = LastIndex;
    });


    function ExecuteOnMappingValuesToParams(
        baseMethod, target, values, _copyRule) {
      return baseMethod.apply(target, values);
    }

    function ExecuteOnMappingSpecToArray(
        baseMethod, target, spec, _copyRule) {
      var names, index, args, name;
      names = this._SpecNames;
      index = names.length;
      array = [];

      while(index--) {
        name = names[index];
        array[index] = spec[name];
      }
      return this._SoleSpecialParam ?
        baseMethod.call(target, array);
        baseMethod.apply(target, array);
    });


    function ExecuteOnMappingValuesToSpec(
        baseMethod, target, values, _copyRule) {
      var spec, names, valuesCount, paramsCount, count, index, name;

      spec = NewStash();
      names = this._SpecNames;
      // if (names == null) { // If there is no params comment specified!!!
      //   return target.noValuesToParamsMapSpecifiedError(values, this, baseMethod);
      // }
      valuesCount = values.length;
      paramsCount = names.length;
      count = valuesCount < paramsCount ? valuesCount : paramsCount;
      index = 0;

      while (index < count) {
        name = names[index];
        spec[name] = values[index++];
      }
      return baseMethod.call(target, spec);
    }

    function ExecuteOnMappingSpecToSpec(
        baseMethod, target, spec0, copyRule) {
      var spec1 = (copyRule && this._CopyRequest) ? NewStash_(spec0) : spec0;
      return baseMethod.call(target, spec1);
    }

    function ExecuteOnMappingValuesToArray(
        baseMethod, target, values, copyRule) {
      var array = (copyRule + this._CopyRequest) > COPY_THRESHOLD ?
        Array_slice(values) : values;
      return baseMethod.call(target, array);
    }


    ParamsSpec.addInstanceMethod(function executeOnValues(
        baseMethod, target, values, copyRule) {

      valuesIndex = 0;
      valuesCount = values.length;

      skipIndex = skipIndexes[next];
      paramsIndex  = this._StartIndex;
      paramsCount = this._LastIndex;
      specials = this._Specials;
      array = [];

      count = (paramsCount < valuesCount) ? paramsCount : valuesCount;
      // If there are specials don't add extra args, add to specials instead

      // fix below to gather proper remaining values
      // fix to work assuming single $spec param feed by values

      while (valuesIndex < count) {
        if (skipIndex === undefined) {
          do {
            array[paramsIndex++] = values[valuesIndex++];
          } while (valuesIndex < count)
          break;
        }
        while (paramsIndex === skipIndex)
          paramsIndex++;
          skipIndex = skipIndexes[++next];
        }
        array[paramsIndex++] = values[valuesIndex++];
      }

      if ((specialSpec = specials.LIST)) {
        array[specialSpec.index] = (specialSpec.isCopying) ?
          values.slice(0) : values;
      }

      if ((specialSpec = specials.SPEC)) {
        array[specialSpec.index] = (specialSpec.isCopying) ?
          values.slice(0) : values;
      }

      if ((specialSpec = specials.REST)) {
        array[specialSpec.index] = (valuesIndex || specialSpec.isCopying) ?
          values.slice(valuesIndex) : values;
      }
      else {
        while (valuesIndex < valuesCount) {
          array[paramsIndex++] = values[valuesIndex++];
        }
      }



      if ((specialSpec = specials.SPEC)) {

      }

      if (())

      if ((specialIndex = Specials.spec) !== undefined) {
        spec = NewStash();
        groupingsIndex = 0;
        groupingsCount = Groupings.length;
        valuesIndex = 0;
        while (groupingsIndex < groupingsCount) {
          names = Groupings[groupingsIndex++];
          next = 0;
          count = names.length;
          value = array[valuesIndex++];
          while (next < count) {
            name = names[next++];
            spec[name] = value;
          }
        }
        array[specialIndex] = spec;
      }
      if ((specialIndex = Specials.values) !== undefined) {
        array[specialIndex] = values;
      }
      if ((specialIndex = Specials.copy) !== undefined) {
        array[specialIndex] = values.slice();
      }
      return Method.apply(this, array);
    }




    ParamsSpec.addInstanceMethod(function executeOnPlural(
        baseMethod, target, elements, actuals) {
      var values = actuals[1];

      if (IsArray(values)) {
        // All set!
      }
      // if (arg_ instanceof Thing) {
      //   arg_.asParams()
      // }
      else if (typeof values === "object") {
        if (values.length >= 0 && typeof values.callee === "function") {} else {
          values = null;
        }
      }
      else if (typeof values === "string") {
        values = AsElements(values);
      }
      else if (values === true) {
        return this.executeOnCombinedArray(baseMethod, target, elements);
      }
      return values ?
        this.executeOnKeysAndValues(baseMethod, target, elements, values) :
        this.improperArgsConfigurationError(actuals, this);
    });

    ParamsSpec.addIMethod(function executeOnCombinedArray(
        baseMethod, target, array) {
      var spec, index, value, key;

      if (array.length % 2) {
        return target.improperArgumentConfigurationError(array, this);
      }
      spec = NewStash();
      index = array.length;
      while (index) {
        value     = array[--index];
        key       = array[--index];
        spec[key] = value;
      }
      return this.executeOnSpec(baseMethod, target, spec, ALREADY_NEW);
    });

    ParamsSpec.addIMethod(function executeOnKeysAndValues(
        baseMethod, target, keys, values) {
      var spec = NewStash();
      var keysIndex = 0;
      var keysCount = keys.length;
      var valuesIndex = 0;
      var valuesCount = values.length;
      var value, key;

      if (valuesCount <= 1) {
        keysIndex = keysCount;
        value = values[0];
        while (keysIndex-- > 0) {
          key = keys[keysIndex];
          spec[key] = value;
        }
      }
      else if (valuesCount === keysCount) {
        keysIndex = keysCount;
        while (keysIndex-- > 0) {
          key = keys[keysIndex];
          value = values[keysIndex];
          spec[key] = value;
        }
      }
      else {
        while (keysIndex < keysCount) {
          key = keys[keysIndex++];
          value = values[valuesIndex++];
          spec[key] = value;
          if (valuesIndex === valuesCount) { valuesIndex = 0; }
        }
      }
      return this.executeOnSpec(baseMethod, target, spec, ALREADY_NEW);
    });


    // function Create$Method(ParamsSpec, BaseMethod) {
    //   return function _$(arg, arg_) {
    //     var argumentsCount, elements, values;
    //
    //     argumentsCount = arguments.length;
    //     if (IsArray(arg)) {
    //       elements = arg;
    //     }
    //     // if (arg instanceof Thing) {
    //     //   arg.asParams()
    //     // }
    //     else if (typeof arg === "object") {
    //       if (arg.length >= 0 && typeof arg.callee === "function") {
    //         elements = (argumentsCount === 1) ? Array_slice.call(arg) : arg;
    //       }
    //       else {
    //         return (argumentsCount === 1) ?
    //           ParamsSpec.executeSpec(this, arg, arg, BaseMethod) :
    //           this.improperArgsConfigurationError(arguments, ParamsSpec);
    //       }
    //     }
    //     else if (typeof arg === "string") {
    //       elements = String2Elements(arg);
    //       if (elements === null) {
    //         return MethodSpec.executeCombinedArray(this, arguments);
    //       }
    //     }
    //
    //     switch (argumentsCount) {
    //       case 0 :
    //         return ParamsSpec.executeCombinedArray(this, [], BaseMethod);
    //       case 1 :
    //         return
    //           ParamsSpec.executeValues(this, elements, arg, BaseMethod);
    //       case 2 :
    //         if (IsArray(arg_)) {
    //           values = arg_;
    //         }
    //         // if (arg_ instanceof Thing) {
    //         //   arg_.asParams()
    //         // }
    //         else if (typeof arg_ === "object") {
    //           if (arg.length >= 0 && typeof arg.callee === "function") {
    //             values = arg_;
    //           }
    //         }
    //         else if (typeof arg_ === "string") {
    //           values = String2Elements(arg);
    //         }
    //         else if (arg_ === true) {
    //           return ParamsSpec.executeCombinedArray(this, arg, BaseMethod);
    //         }
    //     }
    //     return values ?
    //       ParamsSpec.executeKeysAndValues(this, elements, values, BaseMethod) :
    //       this.improperArgsConfigurationError(arguments, ParamsSpec);
    //   };
    // }
