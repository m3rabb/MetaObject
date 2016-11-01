// !!! Need to add JS get/set type methods to this package
// !! Then using setAge <-- type setters will need to be the default approach

Top.Extend(function (_Thing) {
  _Thing.addSMethod(function addAccessor(accessorSignature, options_) {
    const factory = AccessorFactory.make(accessorSignature, options_)
    this.atPutMethod(factory.selector, factory.accessor)
  })

  Type.new(function (AccessorFactory) {
      // Visualize SIG_MATCHER in regexper.com via http://bit.ly/------

    //  1 2  3   4   5  6  7   8 9  10   11    12 13 14  15  16 17 RegExp Grouping
    //  ([~][+][*+][#+][?]) ([_][$]accessor)(:+)(ovar) ([~][*+][#+][!][?])    Guide
    //
    //    ~            [?]  ([_][$]accessor)     [*+][#+] . [?]     getter
    //      [+][*+][#+][?]  ([_][$]accessor)   ~            [?]     setter
    //      [+][*+][#+][?]  ([_][$]accessor)     [*+][#+][!][?]     accessor

    //  ~  = no setter|getter. never on bothsides
    //  +  = write once
    //  *  = duplicate before|after access ** for deepcopy
    //  #  = as immutable before|after access ## for deep immutable
    //  &  = use private (vs symbol) for internal ivar property
    //  ?  = check the arguments and error if problem
    //  _  = privacy prefixed
    //  $  = fixed property prefixed
    //  !  = alway return value

    //     = illegal option
    //  [] = optional
    //  .  = not applicable/ignored

    const SymbolRepo   = NewStash()
    const AccessorRepo = NewStash()

    AccessorFactory.addOMethod(function symbolAt(name) {
      return SymbolRepo[name] || (SymbolRepo[name] = Symbol(`@${name}`))
    })

    AccessorFactory.addOMethod(function make(signature_selector, options_) {
      return this.new(signature_selector, options_).make()
    })

    AccessorFactory.addOMethod(function makeGetter(signature_selector, options_) {
      return this.new(signature_selector, options_).makeGetter()
    })

    AccessorFactory.addOMethod(function makeSetter(signature_selector, options_) {
      return this.new(signature_selector, options_).makeSetter()
    })

    AccessorFactory.addOMethod(function new(signature_selector, options_) {
      const [selector, options] = options_ ?
        arguments : this._parseSignature(signature_selector)
      return this._super("new", selector, options)
    })

    AccessorFactory.addOMethod(function _parseSignature(signature) {
      const SIGNATURE_MATCHER   =
        /^([~*#?!+]*)(:?)([a-z$][\w$]*)(:([\w$]+))?([~*#?!]*)$/i
      const COPY_POLICY_MATCHER = /(^[^#*]*(\*{1,2}|#{1,2})[^#*]*$)?/

      const match = SIGNATURE_MATCHER.exec(signature)
      if (!match) { return this.error("Malformed accessor signature!") }

      const prefix   = match[1]
      const selector = match[3]
      const ivarName = (match[4] || match[2]) ? (match[5] || "") : undefined
      const suffix   = match[6]

      const options   = {
        isArgChecking         : signature.indexOf("?") >= 0,
        alwayReturnValue      : signature.indexOf("!") >= 0,
        isExplicit            : signature.indexOf("~~") >= 0,

        isGetter              : prefix.indexOf("~") >= 0,
        isWriteOnce           : prefix.indexOf("+") >= 0,
        setCopyPolicy         : prefix.match(COPY_POLICY_MATCHER)[2] || "",

        ivarName              : ivarName,

        isSetter              : suffix.indexOf("~") >= 0,
        getCopyPolicy         : suffix.match(COPY_POLICY_MATCHER)[2] || "",
      }

      return [selector, options]
    })


    AccessorFactory.addSMethod(function _init(selector, options) {
      const match, isExplicit, isFixed, name
      this.selector = selector
      this.options  = options

      if ((isExplicit = options.isExplicit)) {
        const EXPLICIT_GETTER_SETTER_MATCHER =
          /^_*(\$*)(set|get)(([A-Z])|_*(\$*))([\w$]+)$/
        match = selector.match(EXPLICIT_GETTER_SETTER_MATCHER)
        if (!match) {
          return this.error("Malformed explicit getter/setter selector!")
        }
        isFixed = !!(match[1] && match[5])
      }
      else {
        const ACCESSOR_SELECTOR_MATCHER = /^_*(\$*)([a-z$][\w$]+)$/i
        match = selector.match(ACCESSOR_SELECTOR_MATCHER)
        if (!match) {
          return this.error("Malformed accessor selector!")
        }
        isFixed = !!match[1]
      }

      if ((this.isFixed = isFixed) && options.isWriteOnce) {
        return this.error("It's redundant to specify a fixed accessor as write-once!");
      }
      // this.isWriteOnce = isWriteOnce || isFixed

      if (!(name = options.ivarName)) {
        name = (name === "") ? "_" : "@" +
          (isExplicit ? (match[4] || "").toLowerCase() + match[6] : match[2])
      }
      this.name = name
      this.property = (name[0] === "@") ? _Top.symbolAt(name) : name

      if (name === selector) {
        return this.error("Selector and ivar can't have the same name!")
      }
    })


    AccessorFactory.addSMethod(function makeGetter() {
      //  ([~][+][*+][#+][&][?]) ([_][$]accessor) ([~][*+][#+][!][?])    Guide
      //
      //    ~            [&][?]  ([_][$]accessor)     [*+][#+] . [?]     getter
      const options = this.options

      if (options.isSetter) {
        return this.error("A getter can't also be specified as setter!")
      }
      if (options.isWriteOnce) {
        return this.error("It's improper to specify a getter as write-once!")
      }
      if (options.setCopyPolicy) {
        return this.error("A getter can't specify a setter copying policy!")
      }

      const IAC       = options.isArgChecking
      const GCP       = options.getCopyPolicy

      const iac       = IAC ? "?" : ""
      const canonical = `~${this.name}${GCP}${iac}`

      return this._accessorAt(canonical, property => (IAC || GCP) ?
        this._newGeneralGetter(property, IAC, GCP) :
        this._newCommonGetter(property))
    })

    AccessorFactory.addSMethod(function _newGeneralGetter(
        Property, IsArgChecking, CopyPolicy) {
      return function __GeneralGetter() {
        if (IsArgChecking && arguments.length) {
          return this.error("Getter must be called with no args!")
        }
        switch (CopyPolicy) {
          case "*"  : return Dup(this[Property])
          case "**" : return DeepDup(this[Property])
          case "#"  : return AsImmutable(this[Property])
          case "##" : return AsDeepImmutable(this[Property])
          default   : return this[Property]
        }
      }
    })

    AccessorFactory.addSMethod(function _newCommonGetter(Property) {
      return function __CommonGetter() {
        return this[Property];
      }
    })


    AccessorFactory.addSMethod(function makeSetter() {
      //  ([~][+][*+][#+][&][?]) ([_][$]accessor) ([~][*+][#+][!][?])    Guide
      //
      //      [+][*+][#+][&][?]  ([_][$]accessor)   ~            [?]     setter
      const options = this.options

      if (options.isGetter) {
        return this.error("A setter can't also be specified as getter!")
      }
      if (options.getCopyPolicy) {
        return this.error("A setter can't specify a getter copying policy!")
      }
      if (options.alwayReturnValue) {
        return this.error("A setter can't be specified to return a value!")
      }

      const IAC       = options.isArgChecking
      const IWO       = options.isWriteOnce || this.isFixed
      const SCP       = options.setCopyPolicy

      const iwo       = IWO ? "+" : ""
      const iac       = IAC ? "?" : ""
      const canonical = `${iwo}${SCP}${this.name}~${iac}`

      return this._accessorAt(canonical, property => (IAC || IWO || SCP) ?
        this._newGeneralSetter(property, IAC, IWO, SCP) :
        this._newCommonSetter(property))
    })

    AccessorFactory.addSMethod(function _newGeneralSetter(
        Property, IsArgChecking, IsWriteOnce, CopyPolicy) {
      return function __GeneralSetter(value) {
        if (IsArgChecking && arguments.length !== 1) {
          return this.error("Setter must be called with exactly one arg!")
        }
        if (IsWriteOnce && Property in this) {
          return (IsArgChecking) ?
            this.error("Write-once property is already defined!") : this
        }

        switch (CopyPolicy) {
          case "*"  : this[Property] = Dup(value)            ; break
          case "**" : this[Property] = DeepDup(value)        ; break
          case "#"  : this[Property] = AsImmutable(value)    ; break
          case "##" : this[Property] = AsDeepImmutable(value); break
          default   : this[Property] = value                 ; break
        }
        return this
        // existing butt capital cupcake# even not stupid @ ellar {= kf dopode baba}
      }
    })

    AccessorFactory.addSMethod(function _newCommonSetter(Property) {
      return function __CommonSetter(value) {
        return arguments.length ? (this[Property] = value, this) : this
      }
    })


    AccessorFactory.addSMethod(function make() {
      //  ([~][+][*+][#+][&][?]) ([_][$]accessor) ([~][*+][#+][!][?])    Guide
      //
      //      [+][*+][#+][&][?]  ([_][$]accessor)     [*+][#+][!][?]     accessor
      const options = this._options
      if (options.isGetter) { return this.makeGetter() }
      if (options.isSetter) { return this.makeSetter() }

      const IAC       = options.isArgChecking
      const IWO       = options.isWriteOnce || this.isFixed
      const SCP       = options.setCopyPolicy
      const ARV       = options.alwayReturnValue
      const GCP       = options.getCopyPolicy

      const iwo       = IWO ? "+" : ""
      const arv       = ARV ? "!" : ""
      const iac       = IAC ? "?" : ""
      const canonical = `${iwo}${SCP}${this.name}${GCP}${arv}${iac}`

      return this._accessorAt(canonical, property => (IAC||IWO||SCP||ARV||GCP) ?
        this._newGeneralSetter(property, IAC, IWO, SCP, ARV, GCP) :
        this._newCommonSetter(property, ARV))
    })

    AccessorFactory.addSMethod(function _newGeneralAccessor(
        Property, IsArgChecking, IsWriteOnce,
        SetCopyPolicy, AlwaysReturnValue, GetCopyPolicy) {
      return function __GeneralAccessor(value_) {
        const value

        switch (arguments.length) {
          case 0 :
            value = this[Property]; break
          default : // More than 1 arg
            if (IsArgChecking) {
              return this.error("Accessor must be called with no more than one arg!")
            }
            // INTENTIONAL FALLTHRU
          case 1 :
            if (IsWriteOnce && Property in this) {
              if (IsArgChecking) {
                return this.error("Write-once property is already defined!")
              }
              if (!AlwaysReturnValue) { return this }
              // INTENTIONAL FALLTHRU AFTER ELSE CLAUSE
            }
            else {
              switch (SetCopyPolicy) {
                case "*"  : value = Dup(value_)            ; break
                case "**" : value = DeepDup(value_)        ; break
                case "#"  : value = AsImmutable(value_)    ; break
                case "##" : value = AsDeepImmutable(value_); break
                default   : value = value_                 ; break
              }
              this[Property] = value
              if (AlwaysReturnValue) { break }
              return this
            }
            // INTENTIONAL FALLTHRU (FROM IF CLAUSE)
          case 0 :
            value = this[Property]; break
        }
        switch (GetCopyPolicy) {
          case "*"  : return Dup(value)
          case "**" : return DeepDup(value)
          case "#"  : return AsImmutable(value)
          case "##" : return AsDeepImmutable(value)
          default   : return value
        }
        // existing butt capital cupcake# even not stupid @ ellar {= kf dopode baba}
      }
    })

    AccessorFactory.addSMethod(function _newCommonAccessor(
        Property, AlwaysReturnValue) {
      return function __CommonAccessor(value_) {
        return arguments.length ?
          (this[Property] = value_, AlwaysReturnValue ? value_ : this) :
          this[Property]
      }
    })


    AccessorFactory.addSMethod(function _accessorAt(canonical, absentAction) {
      return AccessorRepo[canonical] ||
        (AccessorRepo[canonical] = absentAction(this.property))
    })
