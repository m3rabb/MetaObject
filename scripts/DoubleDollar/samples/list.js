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


      function __withinFill(lo, hi, fillDirection, source, takeDirection) {
        const target = this._elements

        let [tIndex, limit] =
              (fillDirection > 0) ? [lo, hi] : [hi - 1] : [lo - 1]
        let sIndex = takeDirection ? source.length - 1, 0

        while (tIndex !== limit) {
          target[tIndex] = source[sIndex]
          tIndex += fillDirection
          sIndex += takeDirection
        }
      },

      function __echoWithin(value, lo, hi) {
        const elements = this._elements

        for (let index = lo; index < hi; index++) {
          elements[index] = value
        }
      },

      function __echoFillWithin(source, lo, hi, fillDirection, takeDirection) {
        const target = this._elements
        const sHiIndex = source.length - 1

        let [tIndex, tLimit] = (fillDirection > 0) ? [lo, hi] : [hi - 1, lo - 1]
        let [sStart, sLimit] = takeDirection ? [sHiIndex, 0] : [0, sHiIndex]

        sIndex = sStart
        while (tIndex !== tLimit) {
          target[tIndex] = source[sIndex]
          tIndex += fillDirection
          sIndex = (sIndex !== sLimit) ? sIndex + takeDirection : sStart
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

      function _withinSetBy(
        [lo, hi, fillDirection, wraps = false],
        source, selector, modifier
      ) {
        this._set(function () {
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
                if (right < targetSize) { target.length = right }//clip capacity
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
        })
      }


      // 6               edge      [6,6]       |
      // [6]             edge      [6,6]    |-->
      // [6,null]        span      [6,SIZE]    |-->

      // mode, start, [end, [,direction [,wraps]]]
      // mode, [ start, [end, [,direction [,wraps]]] ]
      // mode, {start, end, direction, wraps}


      function _normalize(span_startEdge, endEdge_) {
        let start, end, direction, size

        if (typeof span_startEdge === "number") {
          start = span_startEdge
          end = (endEdge_ === undefined) ? start : endEdge_
        } else {
          [start, end = start, direction] = span_startEdge
          if (direction) { return span }
        }

        size  = this._elements.length
        start = (start >= 0) ? start : (start === null) ? size : end + size
        end   = (end   >= 0) ? end   : (end   === null) ? size : end + size

        return (start <= end) ? [start, end, FORWARD] : [end, start, BACKWARD]
      },

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

      // function _normalizeParams(...params) {
      //   const [first, ...remaining] = params
      //   return (typeof first === "function") ?
      //     [this.span, ...params] : [this._normalize(first), ...remaining] :
      //   }
      // },

      // function _normalizeArgs(args) {
      //   const [first, ...remaining] = args
      //   return (typeof first === "function") ?
      //     [this.span, ...args] : [this._normalize(first), ...remaining] :
      //   }
      // },

      function _normalizeArgs(...args) {
        let [first, ...remaining] = args
        if (typeof first !== "object") { return [this.span, ...args] }
        if (args.length === 1) {
          [first, ...remaining] = first
          if (typeof first !== "object") { return [this.span, ...args] }
        }
        return [this._normalize(first), ...remaining]
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

        function keys() {
          return this.map((value, index) => index)
        },

        // Is explicit check fo immutability necessary???
        function span() {
          const span = [0, this._elements.length, FORWARD]
          return this[IMMUTABLE] ? Freeze(span) : span
        },

        function inverseSpan() {
          return [0, this._elements.length, BACKWARD]
        },

        function slots() {
          const isImmutable = this[IMMUTABLE]
          return this.map((value, index) => {
            let slot = {index: index, element: value, key: index, value: value}

            return isImmutable ? BeImmutable(slot) : slot
          })
        },

        { ALIAS : {
          values : "elements"
        } },

      ] },




      function at(index_span, absent_) {
        if (typeof index_span === "number") {
          return this.atIndex(index_span, absent_)
        }
        const values = this.over(index_span)
        return values.size ? values :
          (typeof absent_ !== "function") ?
            absent_ : absent_.call(this.$, index_span)
      },

      function atEach(indexers) {
        return this.new((result) => {
          Each(indexers, (indexer, next) => {
            result.putAt(this.at(indexer), next)
          })
        })
      },


      function atIndex(index, absent_) {
        const elements  = this._elements
        const size      = elements.length
        const slotIndex = (index >= 0) ? index : size - index

        return (slotIndex >= 0 && slotIndex < size) ? elements[slotIndex] :
          (typeof absent_ !== "function") ?
            absent_ : absent_.call(this.$, index)
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



      function withinDo(normSpan, action) {
        let [lo, hi, direction = FORWARD, wraps = false] = normSpan
        let target = this._elements
        let size   = target.length

        let noWrap, preIndex, preLimit, result

        lo = (lo > 0)    ? lo : 0
        hi = (hi < size) ? hi : size

        if (wraps) {
          let [preIndex, preLimit, sIndex, limit] =
            (direction > 0) ?
              [lo    , ((noWrap = (lo < hi)) ? hi : size)    , 0   , hi]
              [hi - 1, ((noWrap = (hi > lo)) ? lo : 0   ) - 1, size, lo]

          while (preIndex !== preLimit) {
            result = action.call(this.$, target[preIndex], preIndex)
            if (result !== undefined) { return result }
            preIndex += direction
          }

          if (noWrap) { return this }
        }
        else {
          [sIndex, limit] = (direction > 0) ? [lo, hi] : [hi - 1, lo - 1]
        }

        while (sIndex !== limit) {
          result = action.call(this.$, target[sIndex], sIndex)
          if (result !== undefined) { return result }
          sIndex += direction
        }

        return this
      },

      function withinMap(normSpan, Action) {
        return this.new((result) => {
          const target = result._elements

          this.withinDo(normSpan, (value, index) => {
            target[index] = Action.call(this.$, value, index)
          })
        })
      },


      function _withinSubsDo(normSpan, subSize, action, subsAsArrays) {
        let [lo, hi, direction = FORWARD, wraps = false] = normSpan
        let target = this._elements
        let tSize  = target.length

        lo = (lo > 0)     ? lo : 0
        hi = (hi < tSize) ? hi : tSize

        if (wraps) {
          return this.error("Wrapping on span enumeration is not yet implemented!")
        }
        [next, tLimit] = (direction > 0) ?
          [lo, hi - subSize + 1] : [hi - subSize, lo - 1]

        while (next !== tLimit) {
          let tIndex = next + subSize
          let sIndex = subSize
          let span   = [next, tIndex, FORWARD]
          let sub    = []

          while (sIndex--) { sub[sIndex--] = target[tIndex--] }

          const sublist = subsAsArrays ? sub : List(sub)
          const result  = action.call(this.$, sublist, span)
          if (result !== undefined) { return result }
          next += direction
        }

        return this
      },

      function _withinSubsMap(normSpan, subSize, action, subsAsArrays) {
        return this.new((result) => {
          let target = result._elements
          let count  = 0

          this._withinSubsDo(normSpan, subSize, (sub, span) => {
            target[count++] = Action.call(this.$, sub, span)
          }, subsAsArrays)
        })
      },

      function withinSubsDo(normSpan, subSize, action) {
        return this._withinSubsDo(normSpan, subSize, action, false)
      },

      function withinSubsMap(normSpan, subSize, action) {
        return this._withinSubsMap(normSpan, subSize, action, false)
      },



      // function within(...args) {
      //   let first = args[0]
      //   let [lo, hi = lo, direction = FORWARD, wrap] =
      //         (typeof arg0 === "number") ? args : first
      //   let normSpan = [lo, hi, direction, wrap]
      //
      //   return (this[IMMUTABLE] &&
      //     (lo === 0 && hi === this.size && direction === FORWARD && !wrap) ?
      //       this : this.withinMap(normSpan, (value) => value))
      // },

      function within(lo, hi = lo, direction, wrap) {
        if (typeof lo !== "number") { [lo, hi = lo, direction, wrap] = lo }
        let normSpan = [lo, hi, direction || FORWARD, wrap]

        return (this[IMMUTABLE] &&
          (lo === 0 && hi === this.size && direction === FORWARD && !wrap) ?
            this : this.withinMap(normSpan, (value) => value))
      },

      function over(lo, hi = lo) {
        const span = (typeof lo === "number") ? [lo, hi] : lo

        return this.within(this._normalize(span))
      },

      function copy(span_) {
        if (!span_ && this[IMMUTABLE]) { return this }

        return this.within(span_ ? this._normalize(span_) : this.span)
      },


      function subPast(edge) {
        return this.within(this._normalize(edge, null))
      },

      function subUntil(edge) {
        return this.within(this._normalize(0, edge))
      },

      function initial(count = 1) {
        return this.within(0, count)
      },

      function final(count = 1, viaLaterValues = false) {
        const size = this.size

        return this.within(size - count, size)
      },


      function eachDo(span_, action) {
        return action ?
          this.withinDo(this._normalize(span_), action) :
          this.withinDo(this.span, action = span_)
      },

      function map(span_, action) {
        return action ?
          this.withinMap(this._normalize(span_), action) :
          this.withinMap(this.span, action = span_)
      },

      function eachSend(span_, method_selector, ...args) {
        let [normSpan, Method, Args] =
          this._normalizeArgs(span_, method_selector, args)

        return (typeof Method === "function") ?
          this.withinDo(normSpan, (value) => { Method.apply(value, Args))
          this.withinDo(normSpan, (value) => { value[Method](...Args))
      },

      function mapSend(span_, method_selector, ...args) {
        let [normSpan, Method, Args] =
          this._normalizeArgs(span_, method_selector, args)

        return (typeof Method === "function") ?
          this.withinMap(normSpan, (value) => { Method.apply(value, Args))
          this.withinMap(normSpan, (value) => { value[Method](...Args))
      },



      function reduce(...span___action__seed_) {
        let args = this._normalizeArgs(span___action__seed_)
        let [normSpan, Action, Accumulator] = args

        if (args.length === 2) {
          const [lo, hi, direction] = normSpan

          if (direction > 0) {
            Accumulator = this.at(lo)
            normSpan = [lo + 1, hi, direction]
          } else {
            Accumulator = this.at(hi - 1)
            normSpan = [lo, hi - 1, direction]
          }
        }

        this.withinDo(normSpan, function (value, index) {
          Accumulator = Action.call(this.$, Accumulator, value, index)
        })

        return Accumulator
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

      function _byOverFind(grip, ...args) {
        const [span, Conditional, absent_] = this._normalizeArgs(args)

        const found = this.withinDo(span, function (value, index) {
          if (Condition.call(this.$, value, index)) {
            return { index: index, value: value } // element: value, key: index,
          }
        })
        return found ? found[grip] :
          (typeof absent_ !== "function") ? absent_ : absent_.call(this.$)
      },

      function _byOverFindAll(Grip, ...args) {
        const [normSpan, Conditional] = this._normalizeArgs(args)

        return this.new((result) => {
          this.withinDo(normSpan, (value, index) => {
            if (Conditional.call(this.$, value, index)) {
              const slot =
                { index: index, value: value } // element: value, key: index,
              result.add(slot[Grip])
            }
          })
        })
      },

      function _byOverFindSub(grip, ...args) {
        const [normSpan, Conditional, absent_] = this._normalizeArgs(args)

        const found = this._withinSubsDo(normSpan, subSize, function (sub, span) {
          if (Condition.call(this.$, sub, index)) {
            return { span: span, sub: sub }
          }
        }, true)
        return found ? found[grip] :
          (typeof absent_ !== "function") ? absent_ : absent_.call(this.$)
      },

      function _byOverFindAllSubs(Grip, ...args) {
        const [normSpan, Conditional] = this._normalizeArgs(args)

        return this.new((result) => {
          this._withinSubsDo(normSpan, (sub, span) => {
            if (Conditional.call(this.$, value, index)) {
              const slots = { span: span, sub: sub }
              result.add(slots[Grip])
            }
          }, true)
        })
      },

      function spanOf(sub, searchDirection = FORWARD) {
        const span      = (searchDirection > 0) ? [0, null] : [null, 0]
        const sArray    = AsArray(sub)
        const sSize     = sArray.length

        return this._byOverFindSub(
          "span", span, sSize, (tArray) => EqualArrays(tArray, sArray))
      },


      function spanOfFirst(sub) {
        return this.spanOf(sub, FORWARD)
      },

      function spanOfLast(sub) {
        return this.spanOf(sub, BACKWARD)
      },


      function indexWhere(span_, condition, absent_) {
        return this._byOverFind("index", span_, condition, absent_)
      },

      function indexesWhere(span_, condition) {
        return this._byOverFindAll("index", span_, condition)
      },

      function indexOf(value, searchDirection = FORWARD) {
        const span      = (searchDirection > 0) ? [0, null] : [null, 0]
        const condition = (existing) => value === existing
        return this._byOverFind("index", span, condition)
      },

      function indexOfFirst(value) {
        return this.indexOf(value, FORWARD)
      },

      function indexOfLast(value) {
        return this.indexOf(value, BACKWARD)
      },


      function indexesOfEvery(value) {
        return this._byOverFindAll("index", (existing) => value === existing))
      },

      function valueWhere(span_, condition, absent_) {
        return this._byOverFind("value", span_, condition, absent_)
      },

      function everyWhere(span_, conditional) {
        return this._byOverFindAll("value", span_, conditional)
      },

      function everyNotWhere(span_, conditional) {
        let [normSpan, Conditional] = this._normalizeArgs(span_, conditional)

        return this.new((result) => {
          this.withinDo(normSpan, (value, index) => {
            if (!Conditional.call(this.$, value, index)) { result.add(value) }
          })
        })
      },

      function countWhere(span_, conditional) {
        let [normSpan, Conditional] = this._normalizeArgs(span_, conditional)

        let count = 0
        this.withinDo(normSpan, (value, index) => {
          if (Condition.call(this.$, value, index)) { count++ }
        })
        return count
      },

      function countOf(value) {
        return this.countWhere((existing) => (existing === value))
      },

      function contains(value) {
        return (this.indexOf(value) >= 0)
      },

      { ALIAS : {
        do      : "eachDo",
        collect : "map",
        detect  : "firstWhere",
        find    : "firstWhere",
        select  : "everyWhere",
        reject  : "everyNotWhere"
        inject  : "reduce",
      } },



      function atPut(index_span, value) {
        return (typeof index_span === "number") ?
          this.atIndexPut(index_span, value) :
          this.overPut(index_span, value)
      }

      // LOOK check use of set vs _set!!!
      function atEachPut(indexers, value) {
        return this.set(function () {
          Each(indexers, (index_span) => this.putAt(index_span, value))
        })
      },

      function atEachPutEach(indexers, values) {
        return this.set(function () {
          const Values = AsArray(indexers)

          Each(indexers, (indexer, next) => this.atPut(Values[next], indexer))
        })
      },

      function atIndexPut(index, value) {
        return this._set(function () {
          const elements  = this._elements
          const slotIndex = (index >= 0) ? index : (elements.length - index)

          if (slotIndex >= 0) {
            elements[slotIndex] = value
          }
          else {
            this.__subFromShiftTo(0, -slotIndex)
            elements[0] = value
          }
        })
      },


      function overPut(edge_span, value) {
        const normSpan = this._normalize(edge_span)

        return this._withinSetBy(normSpan, [value], "__withinFill", STRETCHES)
      },

      function overFan(edge_span, values) {
        const source   = AsArray(values)
        const normSpan = this._normalize(edge_span)

        return this._withinSetBy(normSpan, source, "__withinFill", STRETCHES)
      },

      function overEcho(span, value) {
        const normSpan = this._normalize(span)

        return this._withinSetBy(normSpan, value, "__withinEcho")
      },


      function _contractedSpanTo(span, fillSize) {
        const normSpan = this._normalize(span)
        const [lo, hi, fillDirection, wraps] = normSpan
        const spanSize = (hi - lo)
        const delta    = fillSize - spanSize

        return (delta >= 0) ? normSpan :
          (fillDirection > 0) ?
            [lo        , hi + delta, fillDirection, wraps] :
            [lo + delta,         hi, fillDirection, wraps]
      },

      function overFill(span, values, takeDirection = FORWARD) {
        const source   = AsArray(values)
        const normSpan = this._contractSpanTo(span, source.length)

        return this._withinSetBy(
          normSpan, source, "__withinFill", takeDirection)
      },

      function overEchoFill(span, values, takeDirection = FORWARD) {
        const source   = AsArray(values)
        const normSpan = this._normalize(span)

        return this._withinSetBy(
          normSpan, source, "__withinEchoFill", takeDirection)
      },


      function _expandFromBy(edge, anchorLocation, fillSize) {
        const normSpan = this._normalize(edge)

        (anchorLocation === UNTIL_EDGE) ?
          (normSpan[0] -= fillSize) : (normSpan[1] += fillSize)
        return normSpan
      },

      function pastLay(edge, values, takeDirection = FORWARD) {
        const source   = AsArray(values)
        const normSpan = this._expandFromBy(edge, PAST_EDGE, source.length)

        return this._withinSetBy(
          normSpan, source, "__withinFill", takeDirection)
      },

      function untilLay(edge, values, takeDirection = FORWARD) {
        const source   = AsArray(values)
        const normSpan = this._expandFromBy(edge, UNTIL_EDGE, source.length)

        return this._withinSetBy(
          normSpan, source, "__withinFill", takeDirection)
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
        return this.overFan(0, values)
      },

      function addLastAll(values) {
        return this.overFan(null, values)
      },

      function addBefore(value, targetValue) {
        const insertionEdge = this.indexOfFirst(value)
        return (index >= 0) ? this.overPut(insertionEdge, value) : this
      },

      function addAfter(value, targetValue) {
        const insertionEdge = this.indexOfFirst(value) + 1
        return (index >= 0) ? this.overPut(insertionEdge, value) : this
      },

      function addAllBefore(values, targetValue) {
        const insertionEdge = this.indexOfFirst(value)
        return (index >= 0) ? this.overFan(insertionEdge, values) : this
      },

      function addAllAfter(values, targetValue) {
        const insertionEdge = this.indexOfFirst(value) + 1
        return (index >= 0) ? this.overFan(insertionEdge, values) : this
      },

      { ALIAS : {
        add    : "addLast",
        addAll : "addAllLast",
      } },




      function removeAtIndex(index) {
        return (typeof index !== "number") ? this :
          this.removeWithin(index, index + 1)
      },

      function removeWithin(lo, hi = lo) {
        if (typeof lo !== "number") { [lo, hi = lo] = lo }

        lo = (lo > 0)    ? lo : 0
        hi = (hi < size) ? hi : size

        return (lo === hi) ? this : this._set(this.__subFromShiftTo, hi, lo)
      },

      function removeOver(span) {
        return this.removeWithin(this._normalize(span))
      },

      function removePast(edge) {
        return this.removeWithin(this._normalize(edge, null))
      },

      function removeUntil(edge) {
        return this.removeWithin(this._normalize(0, edge))
      },

      function removeInitial(count = 1) {
        return this.removeWithin(0, count)
      },

      function removeFinal(count = 1) {
        const size  = this.size
        const delta = (count < size) ? count : size
        return count ?
          this._set((result) => { result._elements.length -= delta }) : this
      },

      function remove(value, searchDirection = FORWARD) {
        return this.removeAtIndex(this.indexOf(value, searchDirection))
      },

      function removeFirst(value_) {
        const index = (arguments.length) ? this.indexOfFirst(value_) : 0
        return this.removeAtIndex(index)
      },

      function removeLast(value_) {
        return (arguments.length) ?
          this.removeAtIndex(this.indexOfLast(value_)) : this.removeFinal()
      },

      function removeEvery(value) {
        this._nonCopy((result, isImmutable) => {
          const remaining = []

          this.eachDo((existing, index) => {
            if (existing !== value) { remaining[index] = existing }
          })
          if (remaining.length === this.size) { return this }

          result._elements = remaining
        })
      },

      function removeSub(sub) {
        const normSpan = this.spanOfSub(sub)

        return (normSpan) ? this.removeWithin(normSpan) :
          (typeof absent_ !== "function") ? absent_ :
            absent_.call(this.$, value)
      }



      // target._set(func)
      // target._set(func, ...argToPass)
      // target._set(Dict)
      // target._set(Object)
      // target._set(props, value)
      // target._set(List, value)
      // target._set("prop", value)
      // target._set("prop1", "prop2", "prop3", value)

      // target._set(keyObject, value)

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
