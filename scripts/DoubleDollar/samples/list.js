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
        [lo, hi, fillDirection = FORWARD, wraps = false],
        modifier
      ) {
        const target     = this._elements
        const targetSize = target.length
        const spanSize   = (hi - lo)
        const fillSize   = (modifier === STRETCHES) ? source.length : spanSize

        let left, right, stretchAmount, spanBeforeTarget

        if (wraps) { return this.error("Wrapping is not implemented yet!")}

        if (fillSize === 0) { return }

        if (lo > 0) {  //  A,B,C,D,E
          left  = lo
          right = left + fillSize

          if (fillSize !== spanSize) {
            if (hi >= targetSize) {  // A,B,C,D
              if (right < targetSize) { target.length = right } // clip capacity
            } else {                 // E
              this.__subFromShiftTo(hi, right)
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
      // [6]             edge      [6,6]    |-->
      // [6,null]        span      [6,SIZE]    |-->

      // mode, start, [end, [,direction [,wraps]]]
      // mode, [ start, [end, [,direction [,wraps]]] ]
      // mode, {start, end, direction, wraps}


      function _normalizedSpanFor(spanMode, spanArgs) {
        const [arg0, ...args] = spanArgs
        const size = this._elements.length
        let remaining, start, end, direction, wraps

        if (typeof arg0 === "number")) {
          start = arg0, remaining = args
        }
        else if (IsArray(arg0)) {
          [start, ...remaining] = arg0
        }
        else {
          {start, end, direction, wrap} = arg0
          remaining = [end, direction, wrap]
        }

        if (!(start >= 0)) {
          start = (start === null) ? size :
            ((spanMode === LINEAR) ? start : start + size) // RELATIVE
        }

        if (!remaining.length) { return [start, start, FORWARD, wraps] } // edge

        end = remaining[0]

        if (!(end >= 0)) {
          end = (end === null) ? size :
            ((spanMode === LINEAR) ? end : end + size) // RELATIVE
        }

        direction = remaining[1] ||
          ((spanMode === LINEAR || start <= end) ? FORWARD : BACKWARD)

        wraps = remaining[2] || false

        return (start <= end) ?
          [start, end, direction, wraps] : [end, start, direction, wraps]
      },



      function _setDoWithin(...args) {
        return this._set(this.__doWithin, ...args)
      },



      function toString() {
        return `List(${this._elements})`
      },


      { GETTER : [

        function size() {  //
          return this._elements.length
        },

        function isEmpty() {
          return (this._elements.length === 0)
        },

        function elements() {
          return this.copy()
        },
        normalizedSpan

        { values : "elements" },

        function keys() {
          return this.map((value, index) => index)
        },

        // Is explicit check fo immutability necessary???
        function span() {
          const span = [0, this._elements.length]
          return this[IMMUTABLE] ? Freeze(span) : span
        },

        function slots() {
          const isImmutable = this[IMMUTABLE]
          return this.map((value, index) => {
            let slot = {index: index, element: value, key: index, value: value}

            return isImmutable ? BeImmutable(slot) : slot
          })
        },

      ] },




      function at(indexer, absentAction_) {
        if (typeof indexer === "number") {
          return this.atIndex(indexer, absentAction_)
        }
        const values = this.over(indexer)
        return values.size ? values :
          absentAction_ && absentAction_.call(this.$, indexer)
      },

      function atEach(indexers) {
        return this.new((result) => {
          Each(indexers, (indexer, next) => {
            result.putAt(this.at(indexer), next)
          })
        })
      },


      function atIndex(index, absentAction_) {
        const elements  = this._elements
        const size      = elements.length
        const slotIndex = (index >= 0) ? index : size - index

        return (slotIndex >= 0 && slotIndex < size) ?
          elements[slotIndex] :
          absentAction_ && absentAction_.call(this.$, index)
      },

      { GETTER : [
        function first(/* GETTER */) {
          return this._elements[0]
        },

        function last(/* GETTER */) {
          const elements = this._elements
          return elements[elements.length - 1]
        },
      ] },




      // function _boundedSpanFor(spanMode, spanArgs) {
      //   const size  = this._elements.length
      //   const span  = this._normalizedSpanFor(spanMode, spanArgs)
      //   const [lo, hi, direction, wraps] = span
      //
      //   if (lo < 0)    { span[0] = 0    }
      //   if (hi > size) { span[1] = size }
      //
      //   return span
      // },

      function _withinDo(normalizedSpan, action) {
        const [low, high, direction = FORWARD, wraps = false] = normalizedSpan
        const source = this._elements
        const lo     = (low > 0)     ? low  : 0
        const hi     = (high < size) ? high : size
        let   noWrap, preIndex, preLimit, result

        if (wraps) {
          const size = target.length
          let [preIndex, preLimit, sIndex, limit] =
            (direction > 0) ?
              [lo    , ((noWrap = (lo < hi)) ? hi : size)    , 0   , hi]
              [hi - 1, ((noWrap = (hi > lo)) ? lo : 0   ) - 1, size, lo]

          while (preIndex !== preLimit) {
            result = action.call(this.$, source[preIndex], preIndex)
            if (result !== undefined) { return result }
            preIndex += direction
          }

          if (noWrap) { return this }
        }
        else {
          [sIndex, limit] = (direction > 0) ? [lo, hi] : [hi - 1, lo - 1]
        }

        while (sIndex !== limit) {
          result = action.call(this.$, source[sIndex], sIndex)
          if (result !== undefined) { return result }
          sIndex += direction
        }

        return this
      },

      function _withinMap(normalizedSpan, Action) {
        return this._new((result) => {
          const target = result._elements

          this._withinDo(normalizedSpan, (value, index) => {
            target[index] = Action.call(this.$, value, index)
          })
        })
      },
      

      function _within(normalizedSpan) {
        return this._withinMap(normalizedSpan, (value) => value)
      },


      function within(lo, hi, direction = FORWARD, wraps = false) {
        return this._within(this._normalizedSpanFor(LINEAR, spanArgs))
      },

      function over(...spanArgs) {
        return this._within(this._normalizedSpanFor(RELATIVE, spanArgs))
      },

      function subPast(edge, viaLaterValues = false) {
        const size      = this.size
        const left      = (edge >= 0) ? edge : size - edge
        const direction = viaLaterValues ? BACKWARD : FORWARD

        return this._within([left, size, direction])
      },

      function subUntil(edge, viaLaterValues = false) {
        const right     = (edge >= 0) ? edge : this.size - edge
        const direction = viaLaterValues ? BACKWARD : FORWARD

        return this._within([0, right, direction])
      },

      function initial(count, viaLaterValues = false) {
        const size      = this.size
        const right     = (count <= size) ? count : size
        const direction = viaLaterValues ? BACKWARD : FORWARD

        return this._within([0, right, direction])
      },

      function final(count, viaLaterValues = false) {
        const size      = this.size
        const left      = (count <= size) ? size - count : 0
        const direction = viaLaterValues ? BACKWARD : FORWARD

        return this._within([left, size, direction])
      },







      function eachDo(action) {
        return this._withinDo(this.span, action)
      },

      function withinDo(...spanArgs, action) {
        const span = this._normalizedSpanFor(LINEAR, spanArgs)

        return this._withinDo(span, action)
      },

      function overDo(...spanArgs, action) {
        const span = this._normalizedSpanFor(RELATIVE, spanArgs)

        return this._withinDo(span, action)
      },

      function map(action) {
        return this._withinMap([0, size], action)
      },

      function withinMap(...spanArgs, action) {
        const span = this._normalizedSpanFor(LINEAR, spanArgs)

        return this._withinMap(span, action)
      },

      function overMap(...spanArgs, action) {
        const span = this._normalizedSpanFor(RELATIVE, spanArgs)

        return this._withinMap(span, action)
      },

      action()
      function reduce(seed_, action) {
        let result
        return this.new((result) => {
          this.eachDo((value, index) => {
            if (!Conditional.call(this.$, value, index)) { result.add(value) }
          })
        })
      },

      // function _withinMatch(normalizedSpan, Conditional, absentAction_) {
      //   let Slot
      //
      //   function matchAction(value, index) {
      //     if (Condition.call(this.$, value, index)) {
      //       Slot = {index: index, element: value, key: index, value: value}
      //       throw Slot
      //     }
      //   }
      //
      //   try {
      //     this._withinDo(normalizedSpan, matchAction)
      //   }
      //   catch (ex) {
      //     if (ex === Answer) { return Answer }
      //     else               { throw  ex     }
      //   }
      //
      //   return absentAction_ && absentAction_.call(this.$)
      // },

      function _withinMatch(span, Conditional, absentAction_) {
        const slot = this._withinDo(span, function () {
          if (Condition.call(this.$, value, index)) {
            return { index : index, element : value }
          }
        })
        return slot || { absent : absentAction_ && absentAction_.call(this.$) }
        }
      },

      function _withinMatchAll(span, Conditional) {
        const slot = this._withinDo(span, function () {
          if (Condition.call(this.$, value, index)) {
            return { index : index, element : value }
          }
        })
        return slot || { absent : absentAction_ && absentAction_.call(this.$) }
        }
      },


      function indexOfFirst(value, absentAction_) {
        const valueMatcher = (existing => existing === value)
        const {index, absent} =
          this._withinMatch(this.span, valueMatcher, absentAction_)

        return index || absent
      },

      function indexOfLast(value, absentAction_) {
        const valueMatcher = (existing => existing === value)
        const {index, absent} =
          this._withinMatch([this.size, 0], valueMatcher, absentAction_)

        return index || absent
      },

      function indexOfEvery(value) {
        return this.new((result) => {
          this.eachDo((existing, index) => {
            if (existing === value) { result.add(value) }
          })
        })
      },

      { indexOf: "indexOfFirst" },



      function firstWhere(conditional, absentAction_) {
        const {element, absent} =
          this._withinMatch(this.span, conditional, absentAction_)

        return element || absent
      },

      function lastWhere(conditional, absentAction_) {
        const {element, absent} =
          this._withinMatch([this.size, 0], conditional, absentAction_)

        return element || absent
      },


      function everyWhere(Conditional) {
        return this.new((result) => {
          this.eachDo((value, index) => {
            if (Conditional.call(this.$, value, index)) { result.add(value) }
          })
        })
      },

      function everyNotWhere(Conditional) {
        return this.new((result) => {
          this.eachDo((value, index) => {
            if (!Conditional.call(this.$, value, index)) { result.add(value) }
          })
        })
      },


      { ALIAS : {
        do      : "eachDo",
        collect : "map",
        detect  : "firstWhere",
        find    : "firstWhere",
        select  : "everyWhere",
        reject  : "everyNotWhere"
        inject  : "reduce",
      } }







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
          const Values = AsArray(indexers)

          Each(indexers, (indexer, next) => this.putAt(Values[next], indexer))
        })
      },

      function putAtIndex(value, index) {
        return this._set(function () {
          const elements  = this._elements
          const slotIndex = (index >= 0) ? index : elements.length - index

          if (slotIndex >= 0) {
            elements[slotIndex] = value
          }
          else {
            this.__subFromShiftTo(0, -slotIndex)
            elements[0] = value
          }
        })
      },

      function putWithin(value, ...edge_spanArgs) {
        const span = this._normalizedSpanFor(LINEAR, edge_spanArgs)

        return this._setDoWithin("__putAllWithin", [value], span, STRETCHES)
      },

      function putOver(value, ...edge_spanArgs) {
        const span = this._normalizedSpanFor(RELATIVE, edge_spanArgs)

        return this._setDoWithin("__putAllWithin", [value], span, STRETCHES)
      },


      function fanWithin(values, ...edge_spanArgs) {
        const source = AsArray(values)
        const span   = this._normalizedSpanFor(LINEAR, edge_spanArgs)

        return this._setDoWithin("__putAllWithin", source, span, STRETCHES)
      },

      function fanOver(values, ...edge_spanArgs) {
        const source = AsArray(values)
        const span   = this._normalizedSpanFor(RELATIVE, edge_spanArgs)

        return this._setDoWithin("__putAllWithin", source, span, STRETCHES)
      },


      function echoWithin(value, ...spanArgs) {
        const span = this._normalizedSpanFor(LINEAR, spanArgs)

        return this._setDoWithin("__echoWithin", value, span)
      },

      function echoOver(value, ...spanArgs) {
        const span = this._normalizedSpanFor(RELATIVE, spanArgs)

        return this._setDoWithin("__echoWithin", value, span)
      },


      function _contractedSpanFor(spanMode, spanArgs, source) {
        const span     = this._normalizedSpanFor(spanMode, spanArgs)
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
        const span   = this._normalizedSpanFor(LINEAR, spanArgs)

        return this._setDoWithin(
          "__echoFillWithin", source, span, viaLaterValues)
      },

      function echoFillOver(values, ...spanArgs, viaLaterValues = false) {
        const source = AsArray(values)
        const span   = this._normalizedSpanFor(RELATIVE, spanArgs)

        return this._setDoWithin(
          "__echoFillWithin", source, span, viaLaterValues)
      },


      function _expandedSpanFor(edgeMode, edge, source) {
        const sourceSize = source.length
        const anchorEdge = (edge >= 0) ?
                edge : (edge || 0) + this._elements.length
        return (edgeMode === UNTIL) ?
          [anchorEdge - sourceSize, anchorEdge             ] :
          [anchorEdge             , anchorEdge + sourceSize]
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
        this.fanWithin(values, null)
      },


      function addBefore(value, targetValue) {
        this.error("Not implemented yet!")
      },

      function addAfter(value, targetValue) {
        this.error("Not implemented yet!")
      },

      function addAllBefore(values, targetValue) {
        this.error("Not implemented yet!")
      },

      function addAllAfter(values, targetValue) {
        this.error("Not implemented yet!")
      },

      {
        add    : "addLast",
        addAll : "addAllLast",
      }











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
