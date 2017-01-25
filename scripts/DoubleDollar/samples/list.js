/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

DD.set((_context) => {
  _context.newType(List => {


    List.addSMethods([
      function __init(elements_) {
        this._elements = []
        elements_ && this.addAll(elements_)
      },


      function __putAllWithin(source, lo, hi, fillDirection, viaLaterValues) {
        const target = this._elements

        let [tIndex, limit] =
              (fillDirection > 0) ? [lo, hi] : [hi - 1] : [lo - 1]
        let [sIndex, sIncrement] =
              viaLaterValues ? [source.length - 1, BACKWARD] : [0, FORWARD]

        while (tIndex !== limit) {
          target[tIndex] = source[sIndex]
          tIndex += fillDirection
          sIndex += sIncrement
        }
      },

      function __echoWithin(value, lo, hi) {
        const elements = this._elements

        for (let index = lo; index < hi; index++) {
          elements[index] = value
        }
      },

      function __echoFillWithin(source, lo, hi, fillDirection, viaLaterValues) {
        const target = this._elements
        const sHiIndex = source.length - 1

        let [tIndex, tLimit] = (fillDirection > 0) ?
              [lo, hi] : [hi - 1, lo - 1]
        let [sStart, sLimit, sIncrement] = viaLaterValues ?
              [sHiIndex, 0, BACKWARD] : [0, sHiIndex, FORWARD]

        sIndex = sStart
        while (tIndex !== tLimit) {
          target[tIndex] = source[sIndex]
          tIndex += fillDirection
          sIndex = (sIndex !== sLimit) ? sIndex + sIncrement : sStart
        }
      },


      function __subFromShiftTo(sourceEdge, targetEdge) {
        const elements = this._elements
        const endEdge  = elements.length
        const size     = endEdge - sourceEdge
        let   tIndex, sIndex

        if (targetEdge === sourceEdge) { return }

        if (targetEdge < sourceEdge) {
          sIndex = sourceEdge
          tIndex = targetEdge

          while (sIndex < endEdge) {
            elements[tIndex++] = elements[sIndex++]
          }
          elements.length -= size
        }
        else {
          sIndex = endEdge
          tIndex = targetEdge + size

          while (sIndex > sourceEdge) {
            elements[--tIndex] = elements[--sIndex]
          }
        }
      },

      //          lf   lo   le         i         re   ro   rf
      //   A                |                     |    :--->:
      //   B                |                     :-------->:
      //   C                |          :----------|-------->:    check trim
      //   D                |          :----------:              check trim
      //   E                |          :----:  S  |
      //
      //   F                :----------:       S  |
      //   G      :<--------|----------:       S  |
      //   H      :<-----S--:                     |
      //   I      :<---: S  |                     |
      //
      //   J                :---------------------:
      //   K                :---------------------|-------->:
      //   L      :<--------|---------------------:
      //   M      :<--------|---------------------|-------->:

      function __doWithin(
        selector, source,
        [lo, hi = lo, fillDirection = FORWARD, wraps = false],
        modifier
      ) {
        const target     = this._elements
        const targetSize = target.length
        const stretches  = (modifier === FAN)
        const fillSize   = stretches ? source.length : hi - lo

        let left, right, stretchAmount, spanBeforeTarget

        if (fillSize === 0) { return }

        if (lo > 0) {  //  A,B,C,D,E
          left  = lo
          right = left + fillSize

          if (stretches) {
            if (hi >= targetSize) {  // A,B,C,D
              if (right < targetSize) { target.length = right } // clip capacity
            } else {                 // E
              if (right !== hi) { this.__subFromShiftTo(hi, right) }
            }
          }
        }
        else {   // lo <= 0
          left = 0

          if (hi < targetSize) {  // F,G,H
            if (hi >= 0) {
              right = fillSize

              if (right !== hi) { this.__subFromShiftTo(hi, right) }
            }
            else { //  hi < 0     // I
              right = fillSize - hi

              this.__subFromShiftTo(hi, right)
              this.__echoWithin(undefined, fillSize, right)
            }
          }
          else { // hi >= targetSize //  J,K,L,M
            right = fillSize

            if (right < targetSize) { target.length = right } // clip capacity
          }
        }
        this[selector](source, left, right, fillDirection, modifier)
      },


      // 6               edge      [6,6]       |
      // [6]             span      [6,SIZE]    |-->
      // [6,]            span      [6,SIZE]    |-->
      // [6,,]           span      [6,SIZE]    |-->
      // [6,null]        span      [6,SIZE]    |-->
      // [6,undefined]   span      [6,SIZE]    |-->

      // mode, start, [[end], direction], [wraps]
      // mode, [start, [[end], direction], [wraps]]
      // mode, {start, end, direction, wraps}

      function _loHiSpanFor(spanMode, spanArgs) {
        let [arg0, ...args] = spanArgs
        let isNumber, remaining, remainingCount, size, last
        let start, end, direction, wraps

        if ((isNumber = (typeof arg0 === "number"))) {
          start = arg0, remaining = args
        }
        else if (IsArray(arg0)) {
          [start, ...remaining] = arg0
        }
        else {
          {start, end, direction, wrap} = arg0
          remaining = [end, direction, wrap || false]
        }

        remainingCount = remaining.length
        size           = this._elements.length

        if (!(start >= 0)) {
          start = (spanMode === LINEAR) ?  // LINEAR vs RELATIVE
            (start == null ? size : start) : ((start || 0) + size)
        }                                    // handles undefine

        if (isNumber && !remainingCount) {
          return [start, start, FORWARD, wraps] // edge
        }

        last  = remaining[remainingCount - 1]
        wraps = (typeof last === "boolean") ? (remainingCount--, last) : false
        end   = remaining[0]

        if (!(end >= 0)) {
          end = (spanMode === LINEAR) ?   // handles undefined
            (end == null ? size : end) : ((end || 0) + size)
        }

        direction = remaining[1] ||
          ((spanMode === LINEAR || start <= end) ? FORWARD : BACKWARD)

        return (start <= end) ?
          [start, end, direction, wraps] : [end, start, direction, wraps]
      },



      function _setDoWithin(...args) {
        return this._set(this.__doWithin, ...args)
      },



      function putAt(value, indexer) {
        return (typeof indexer === "number") ?
          this.putAtIndex(value, indexer) :
          this.putOver(value, indexer)
      }

      function putAtEach(Value, indexers) {
        return this._set(function () {
          Each(indexers, (indexer) => this.putAt(Value, indexer))
        })
      },

      function putEachAtEach(values, indexers) {
        return this._set(function () {
          const Keys = AsArray(indexers)

          Each(values, (value, sharedIndex) => {
            this.putAt(value, Keys[sharedIndex])
          })
        })

      },


      function putAtIndex(value, index) {
        return this._set(function () {
          const elements = this._elements
          let   arrayIndex

          if (index < 0) {
            arrayIndex = elements.length + index
            if (arrayIndex < 0) {
              this.__subFromShiftTo(0, -arrayIndex)
              arrayIndex = 0
            }
          } else {
            arrayIndex = index
          }

          elements[arrayIndex] = value
        })
      },

      function putWithin(value, ...edge_spanArgs) {
        const span = this._loHiSpanFor(LINEAR, edge_spanArgs)

        return this._setDoWithin("__putAllWithin", [value], span, FAN)
      },

      function putOver(value, ...edge_spanArgs) {
        const span = this._loHiSpanFor(RELATIVE, edge_spanArgs)

        return this._setDoWithin("__putAllWithin", [value], span, FAN)
      },


      function fanWithin(values, ...edge_spanArgs) {
        const source = AsArray(values)
        const span   = this._loHiSpanFor(LINEAR, edge_spanArgs)

        return this._setDoWithin("__putAllWithin", source, span, FAN)
      },

      function fanOver(values, ...edge_spanArgs) {
        const source = AsArray(values)
        const span   = this._loHiSpanFor(RELATIVE, edge_spanArgs)

        return this._setDoWithin("__putAllWithin", source, span, FAN)
      },


      function echoWithin(value, ...spanArgs) {
        const source = AsArray(values)
        const span   = this._loHiSpanFor(LINEAR, spanArgs)

        return this._setDoWithin("__echoWithin", source, span)
      },

      function echoOver(value, ...spanArgs) {
        const source = AsArray(values)
        const span   = this._loHiSpanFor(RELATIVE, spanArgs)

        return this._setDoWithin("__echoWithin", source, span)
      },


      function _contractedSpanFor(spanMode, spanArgs, source) {
        const span     = this._loHiSpanFor(spanMode, spanArgs)
        const [lo, hi, fillDirection, wraps] = span
        const spanSize = (hi - lo)
        const delta    = source.length - spanSize

        return (delta >= 0) ? span :
         ((fillDirection > 0) ?
            [lo        , hi + delta, fillDirection, wraps] :
            [lo + delta,         hi, fillDirection, wraps])
      },

      function fillWithin(values, ...spanArgs, viaLaterValues = false) {
        let source = AsArray(values)
        let span   = this._contractedSpanFor(LINEAR, spanArgs, source)

        return this._setDoWithin("__putAllWithin", source, span, viaLaterValues)
      },

      function fillOver(values, ...spanArgs, viaLaterValues = false) {
        const source = AsArray(values)
        const span   = this._contractedSpanFor(RELATIVE, spanArgs, source)

        return this._setDoWithin("__putAllWithin", source, span, viaLaterValues)
      },


      function echoFillWithin(values, ...spanArgs, viaLaterValues = false) {
        const source = AsArray(values)
        const span   = this._loHiSpanFor(LINEAR, spanArgs)

        return this._setDoWithin(
          "__echoFillWithin", source, span, viaLaterValues)
      },

      function echoFillOver(values, ...spanArgs, viaLaterValues = false) {
        const source = AsArray(values)
        const span   = this._loHiSpanFor(RELATIVE, spanArgs)

        return this._setDoWithin(
          "__echoFillWithin", source, span, viaLaterValues)
      },


      function _expandedSpanFor(edgeMode, edge, source) {
        const sourceSize = source.length
        const anchorEdge = (edge >= 0) ?
                edge : (edge || 0) + this._elements.length
        return (edgeMode === UNTIL) ?
          [anchorEdge - sourceSize, anchorEdge             , FORWARD, false] :
          [anchorEdge             , anchorEdge + sourceSize, FORWARD, false]
      },

      function layPast(values, edge, viaLaterValues = false) {
        const source = AsArray(values)
        const span   = this._expandedSpanFor(PAST_EDGE, edge, source)

        return this._setDoWithin("__putAllWithin", source, span, viaLaterValues)
      },

      function layUntil(values, edge, viaLaterValues = false) {
        const source = AsArray(values)
        const span   = this._expandedSpanFor(UNTIL_EDGE, edge, source)

        return this._setDoWithin("__putAllWithin", source, span, viaLaterValues)
      },


      function putAtIndex(value, index) {
        return this._set(function () {
          const elements = this._elements
          let   arrayIndex

          if (index < 0) {
            arrayIndex = elements.length + index
            if (arrayIndex < 0) {
              this.__subFromShiftTo(0, -arrayIndex)
              arrayIndex = 0
            }
          } else {
            arrayIndex = index
          }

          elements[arrayIndex] = value
        })
      },



      function addFirst(value) {
        return this._set(function () {
          this.__subFromShiftTo(0, 1)
          this._elements[0] = value
        })
      },

      function addLast(value) {
        return this._set(function () {
          const elements = this._elements
          elements[elements.length] = value
        }
      },

      function addFirstAll(values) {
        this.fanWithin(values, 0)
      },

      function addLastAll(values) {
        this.fanWithin(values, undefined)
      },


      function _match(Conditional, startEdge, endEdge, absentAction_) {
        let Answer

        function matchAction(value, index) {
          if (Condition.call(this.$, value, index)) {
            throw (Answer = {element: value, value: value, key: index, index: index});
          }
        }

        try {
          this._withinEach(startEdge, endEdge, matchAction)
        }
        catch (ex) {
          if (ex === Answer) { return Answer }
          throw ex
        }
        return absentAction_ && absentAction_.call(this.$)
      },

      function atIndex(index, absentValue_) {
        const element = this._elements[index]
        return (element !== undefined) ? element : absentValue_
      },

      function within(span_edge, edge_) {
        const [startEdge, endEdge] = arguments.length > 1 ?
          [span_edge, edge_] : [span_edge.start, span_edge.end]
        const subelements = ArrayWithin(this._elements, startEdge, endEdge)
        return this._new(this.__addAllLast, subelements)
      },

      function at(indexer, absentAction_) {
        if (typeof indexer === "number") {
          const element = this.atIndex(indexer)
          return (element !== undefined) ? element :
            absentAction_ && absentAction_.call(this.$, indexer)
        }
        return this.within(indexer)
      },

      function size(/* GETTER */) {  //
        return this._elements.length
      },

      function elements(/* GETTER */) {
        return this
      },

      function isEmpty(/* GETTER */) {
        return (this._elements.length === 0)
      },






      function __removeFirst(value_, absentAction__) {
        this.__subFromShiftTo(count, 0)
      },

      function __removeLast(value_, ) {
        this._elements.length -= count
      },

      function __removeBefore(value, absentAction_) {
        this._elements.length -= count
      },

      function __removeAfter(value, absentAction_) {
        this._elements.length -= count
      },

      function __removeEvery(value) {

      },



      function __removeIndex(index) {

      },

      function __removeOver(relativeSpanner) {

      },

      function __removeWithin(absoluteSpanner) {

      },

      function __removeFrom(edge) {

      },

      function __removeTo(edge) {

      },

      function _withinEach(startEdge, endEdge, action) {
        const elements = this._elements
        let   index    = startEdge

        while (index < endEdge) {
          action.call(this.$, element[index], index++)
        }
        return this
      },

      function _withinMap(startEdge, endEdge, Action) {
        return this._new(copy => {
          const elements = copy._elements
          this._withinEach(startEdge, endEdge, function (element, index) {
            elements[index] = Action.call(this.$, element, index)
          })
        })
      },

      function _indexers_func2args(span_edge, func_edge, func_) {
        let hasArgError, startEdge, endEdge, action

        switch (arguments.length) {
          case 3 :
            [startEdge, endEdge, action] = [span_edge, func_edge, func_]
            break
          case 2 :
            [startEdge, endEdge] = (typeof span_edge === "number") ?
              [span_edge.start, span_edge.end] : [span_edge, span_edge]
            action = func_edge
            break
          default :
            hasArgError = true
          break
        }
        hasArgError = hasArgError || (typeof startEdge !== "number")
        hasArgError = hasArgError || (typeof endEdge   !== "number")
        hasArgError = hasArgError || (typeof action    !== "function")

        if (hasError) { return this.error("Improper arguments!") }

        return [startEdge, endEdge, action]
      },

      function withinEach(span_edge, func_edge, func_) {
        const args = this._indexers_func2args(span_edge, func_edge, func_)
        return this._withinEach(args)
      },

      function withinMap(span_edge, func_edge, func_) {
        const args = this._indexers_func2args(span_edge, func_edge, func_)
        return this._withinMap(args)
      },

      allSuchThat

      overDo
      overMap

      removeAllSuchThat
      all

      function xyz(count, func = count) {
        return [count, func]
      }


      overeach

      allSuchThat








      function __removeLastSlots(count) {
        this.__subFromShiftTo(count, 0)
      },

      function __removeAllFrom(count) {
        this.__subFromShiftTo(count, 0)
      },

      function __removeLast(value_) {
        this._elements.length -= count
      },

      function addLast(element) {
        return (arguments.length) ?
          this._set(this.__addLast, element) :
          this.error("Requires argument!")
      },

      function addLastAll(elements) {
        return (arguments.length) ?
          this._set(this.__addAllLast, element) :
          this.error("Requires argument!")
      },

      ["add"   , "addLast"],

      ["addAll", "addAllLast"],

      // target._set(func)
      // target._set(func, ...argToPass)
      // target._set(Dict)
      // target._set(Object)
      // target._set([props], value)
      // target._set(List, value)
      // target._set("prop", value)
      // target._set("prop1", "prop2", "prop3", value)

      function _set(...params) {
        const param = params[0]
        let   func, args, path, value
        switch(typeof param) {
          case "function" :
            [func, ...args] = params
            return this._setFromContext(func, args)

          case "object" :
            if (IsArray(param)) {
              [args, func] = params
              return this._setFromContext(func, args)
            }
            else if (param.isList) {
              [args, func] = params
              return this._setFromContext(func, AsArray(args))
            }
            else {
              return this._setFromSpec(param)
            }

          case "string" :
            [...path, value] = params
            return this._setIn(path, value)
        }
      },

      function _setFromContext(contextFunc, args) {
        const isImmutable = this[IMMUTABLE]
        const target = isImmutable ? this._mutableCopy() : this

        if (args.length) { contextFunc.apply(target, args) }
        else             { contextFunc.call(target, target) }

        return isImmutable ? target.beImmutable : target
      },

      //   Method name conventions
      //   set   public method on immutable receiver
      //  _set   private method on immutable receiver
      // __set   private method on DEMANDS a mutable receiver


      // target._set(func)
      // target._set(func, ...argToPass)
      // target._set(Object|Dict)
      // target._set("prop", value)
      // target._set("prop1", "prop2", "prop3", value)

      // target._set([props], value)  // maybe not???
      // target._set(List, value)     // maybe not???

      //
      // target._new(func)            this._new(list => {})
      // target._new(func, ...args)   this._new(list => {}, )
      //                              this._new(this.__fanArrayWithin, subelements, 0)
      // target._new([args]|List, func)    this._new([1, 2, 3], list => {})
      // target._new([args]|List, func, ...args)  this._new([1, 3], this.insertFrom, 1, 2)
      // target._new(List, func)

      // target._new(Object|Dict)
      // target._new("prop", value)
      // target._new("prop1", "prop2", "prop3", value)



      // function _newFromContext(contextFunc, args) {
      //   const target = this._mutableNew(args)
      //   contextFunc.call(target, target)
      //   return this[IMMUTABLE] ? target.beImmutable : target
      // },
      //
      // function _copyFromContext(contextFunc, args) {
      //   const isImmutable = this[IMMUTABLE]
      //   const target = this._mutableCopy()
      //   const result = args.length ?
      //     contextFunc.apply(target, args) :
      //     contextFunc.call(target, target)
      //   return isImmutable ? result.beImmutable : result
      //
      //   const isImmutable = this[IMMUTABLE]
      //   const target = this._mutableCopy()
      //
      //   if (args.length) { contextFunc.apply(target, args) }
      //   else             { contextFunc.call(target, target) }
      //
      //   return isImmutable ? target.beImmutable : target
      // },






  })







  _set
  _new
   set // inside the func only can use public methods on the 'set' obj
   new // inside the func only can use public methods on the 'new' obj
