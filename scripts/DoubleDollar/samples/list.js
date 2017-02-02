/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

DD.set((_context) => {
  _context.newType(List => {

    const LO        =  0
    const HI        =  1
    const START     =  0
    const END       =  1
    const DIRECTION =  2
    const WRAPS     =  3

    const FWD       =  1
    const BWD       = -1
    const NON       =  0
    const STRETCH   =  null
    const UNBOUNDED =  false

    const FORWARD   =  1
    const BACKWARD  = -1

    const SCAN      = "SCAN"
    const MATCH     = "MATCH"
    const FILL      = "FILL"

    const INDEX     = "INDEX"
    const VALUE     = "VALUE"
    const SPAN      = "SPAN"
    const SUB       = "SUB"


    const DefaultDirections = { SCAN: FORWARD, MATCH: FORWARD, FILL: FORWARD }

    const UNTIL_EDGE  = Symbol("UNTIL_EDGE")
    const BEYOND_EDGE = Symbol("BEYOND_EDGE")

    const BEYOND      = 1000000000000

    List.addSMethods([
      function __init(elements_) {
        this._elements = []
        elements_ && this.addAll(elements_)
      },


      function __fillWithin(source, lo, hi, scanDir, fillDir, sIndex_) {
        const target = this._elements

        let [tIndex, tLimit, fillInc, takeInc] = (scanDir < 0) ?
          [hi - 1, lo - 1, BWD, (fillDir < 0) ? FWD : BWD] :
          [lo    , hi    , FWD, (fillDir < 0) ? BWD : FWD]

        let sIndex = (takeInc > 0) ? sIndex_ || 0 :
          (sIndex_ === undefined) ? source.length - 1 : sIndex_

        while (tIndex !== tLimit) {
          target[tIndex] = source[sIndex]
          tIndex += fillInc
          sIndex += takeInc
        }

        return sIndex
      },

      function __echoWithin(value, lo, hi) {
        for (let target = this._elements, index = lo; index < hi; index++) {
          target[index] = value
        }
      },

      function __echoFillWithin(source, lo, hi, scanDir, fillDir) {
        const target = this._elements

        let [tIndex, tLimit, fillInc, takeInc] = (scanDir < 0) ?
          [hi - 1, lo - 1, BWD, (fillDir < 0) ? FWD : BWD] :
          [lo    , hi    , FWD, (fillDir < 0) ? BWD : FWD]

        let [sStart, sLimit] = (takeInc > 0) ? [0 : sSize] : [sSize - 1, -1]

        sIndex = sStart
        while (tIndex !== tLimit) {
          target[tIndex] = source[sIndex]
          tIndex += fillInc
          sIndex = (sIndex !== sLimit) ? sIndex + takeInc : sStart
        }
      },


      function __subFromShiftTo(sourceEdge, targetEdge) {
        const target  = this._elements
        const endEdge = elements.length
        const size    = endEdge - sourceEdge
        let   tIndex, sIndex

        if (targetEdge === sourceEdge) { return }

        if (targetEdge < sourceEdge) {
          sIndex = sourceEdge
          tIndex = targetEdge

          while (sIndex < endEdge) { target[tIndex++] = target[sIndex++] }
          target.length -= size
        }
        else {
          sIndex = endEdge
          tIndex = targetEdge + size

          while (sIndex > sourceEdge) { target[--tIndex] = target[--sIndex] }
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
        [lo, hi, scanDirection, wraps = false], source, selector, modifier
      ) {
        this._set(function () {
          const target     = this._elements
          const targetSize = target.length
          const spanSize   = (hi - lo)
          const sourceSize = source.length
          const fillSize   = (scanDirection === STRETCH) ? sourceSize : spanSize
          let   left, right

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

          this[selector](source, left, right, scanDirection, modifier)
        })
      }

      //    1           direction
      //   [1]          relative edge
      //   [1,,]        relative index
      //   [2,-1]       relative span
      //   [1,,,]       linear index
      //   [7,2,-1]     linear span

      function _normalizeSpan(span, bounded = true) {
        let start, end, direction, lo, hi
        let size = this._elements.length

        switch (span.length) {
          case undefined :                     // direction
            return [0, size, (span < 0) ? BWD : FWD]
          case 1 :                             // relative edge
            ;[start, end, direction] = [span, span, NON]
            break
          case 2 :
            ;[start, end = start + 1] = span  // relative span|edge|index
            break
          case 4 :
            wraps = span[WRAPS]
            // INTENTIONAL FALL THRU
          case 3 :
            ;[lo, hi = lo, direction] = span  // linear span|edge|index
            direction = direction ? (direction < 0 ? BWD : FWD) : NON
            break
          default : return undefined
        }

        if (lo === undefined) {
          start = (start >= 0) ? (start === null ? size : start) : start + size
          end   = (end   >= 0) ? (end   === null ? size : end  ) : end   + size

          ;[lo, hi, direction] = (start < end) ?
            [start, end, FWD] :
            [end, start, (start > end ? BWD : NON)]
        }

        if (bounded) {
          (lo < 0) && (lo = 0); (hi > size) && (hi = size)
        }
        else (bounded === STRETCH) {
          direction = STRETCH
        }

        return (wraps) ? [lo, hi, direction, wraps] : [lo, hi, direction]
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


      function _normalizeArgs(...args) {
        do {
          let [first, ...remaining] = args

          switch (typeof first) {
            case "function"  : return [this.span, ...args]
            case "string"    : return [this.span, ...args]
            case "undefined" : return undefined  // [[0, 0, NON], ...args]
          }

          if (args.length === 1) { args = first; continue }
        } while (false)

        return [this._normalizeSpan(first), ...remaining]
      },

      function _normalizeDirectives(directiveName, directives) {
        switch (typeof directives) {
          default :       return DefaultDirections
          case "object" : return directives
          case "number" : return
           { __proto__ : DefaultDirections, [directiveName] : directives }
        }
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

        // LOOK: Is explicit check fo immutability necessary???
        function span() {
          const span = [0, this._elements.length, FWD]
          return this[IMMUTABLE] ? Freeze(span) : span
        },

        function inverseSpan() {
          return [0, this._elements.length, BWD]
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
        if (index_span.length) {
          const values = this.within(index_span)
          return values.size ? values :
            (typeof absent_ !== "function") ?
              absent_ : absent_.call(this.$, index_span)
        }
        return this.atIndex(index_span, absent_)

      },

      function atEach(indexes_spans) {
        return this.new((result) => {
          Each(indexes_spans, (index_span) => {
            result.atPut(this.at(index_span))
          })
        })
      },


      function _atIndex(justIndex) {
        return this._elements[justIndex]
      },

      function atIndex(index, absent_) {
        const target    = this._elements
        const size      = elements.length
        const slotIndex = (index < 0) ? size - index : index

        return (slotIndex >= 0 && slotIndex < size) ? target[slotIndex] :
          (typeof absent_ !== "function") ?
            absent_ : absent_.call(this.$, index)
      },

      { GETTER : [
        function first(/* GETTER */) {
          return this._elements[0]
        },

        function last(/* GETTER */) {
          const target = this._elements
          return target[elements.length - 1]
        },
      ] },



      function _withinDo(justSpan, action) {
        let target = this._elements
        let size   = target.length
        let preIndex, preLimit, sIndex, sLimit, noWrap, result
        let [lo, hi, scanDirection, wraps] = justSpan

        if (wraps) {
          [preIndex, preLimit, sIndex, sLimit, inc] =
            (scanDirection < 0) ?
              [hi - 1, ((noWrap = (hi > lo)) ? lo : 0   ) - 1, size, lo, -1] :
              [lo    , ((noWrap = (lo < hi)) ? hi : size)    , 0   , hi,  1]

          while (preIndex !== preLimit) {
            result = action.call(this.$, target[preIndex], preIndex)
            if (result !== undefined) { return result }
            preIndex += inc
          }

          if (noWrap) { return this }
        }
        else {
          [sIndex, sLimit, inc] = (scanDirection < 0) ?
            [hi - 1, lo - 1, -1] : [lo, hi, 1]
        }

        while (sIndex !== sLimit) {
          result = action.call(this.$, target[sIndex], sIndex)
          if (result !== undefined) { return result }
          sIndex += inc
        }

        return undefined
      },

      function eachDo(span_, action) {
        return action ?
          this._withinDo(this._normalizeSpan(span_), action) :
          this._withinDo(this.span, action = span_)
      },

      function map(span_, action) {
        return action ?
          this._withinMap(this._normalizeSpan(span_), action) :
          this._withinMap(this.span, action = span_)
      },

      function _withinMap(justSpan, Action) {
        return this.new((result) => {
          const target = result._elements

          this._withinDo(justSpan, (value, index) => {
            target[index] = Action.call(this.$, value, index)
          })
        })
      },


      function _overDo(
        justSpan, subSize, action, {asLists = false, overlaps = true}
      ) {
        let target = this._elements
        let tSize  = target.length
        let [lo, hi, scanDirection, wraps] = justSpan

        if (wraps) {
          return this.error(
            "Wrapping on span enumeration is not yet implemented!")
        }

        [next, tLimit, inc] = (scanDirection < 0) ?
          [hi - subSize, lo - 1          , -1] :
          [lo          , hi - subSize + 1,  1]

        while (next !== tLimit) {
          let tIndex = next + subSize
          let sIndex = subSize
          let span   = [next, tIndex, FWD]
          let sub    = []

          while (sIndex--) { sub[sIndex--] = target[tIndex--] }

          const nextSub = asLists ? List(sub) : sub
          const result  = action.call(this.$, nextSub, span)
          if (result !== undefined) { return result }
          next += inc
        }

        return undefined
      },

      // LOOK Might not need this method
      function _overMap(justSpan, subSize, action, subsAsLists = false) {
        return this.new((result) => {
          let target = result._elements
          let count  = 0

          this._overDo(justSpan, subSize, (sub, span) => {
            target[count++] = Action.call(this.$, sub, span)
          }, subsAsLists)
        })
      },

      function overDo(span_, subSize, action) {
        let args = this._normalizeArgs(span_, subSize, action)
        return this._overDo(...args, true)
      },

      function overMap(span_, subSize, action) {
        let args = this._normalizeArgs(span_, subSize, action)
        return this._overMap(...args, true)
      },



      // function within(...args) {
      //   let first = args[0]
      //   let [lo, hi = lo, direction = FWD, wrap] =
      //         (typeof arg0 === "number") ? args : first
      //   let normSpan = [lo, hi, direction, wrap]
      //
      //   return (this[IMMUTABLE] &&
      //     (lo === 0 && hi === this.size && direction === FWD && !wrap) ?
      //       this : this.withinMap(normSpan, (value) => value))
      // },


      // function within(lo, hi = lo, direction, wrap) {
      //   if (typeof lo !== "number") { [lo, hi = lo, direction, wrap] = lo }
      //   let normSpan = [lo, hi, direction || FWD, wrap]
      //
      //   return (this[IMMUTABLE] &&
      //     (lo === 0 && hi === this.size && direction === FWD && !wrap) ?
      //       this : this.withinMap(normSpan, (value) => value))
      // },




      function within(span_start, ...end__scanDirection__doWrap) {
        const span = (span_start.length) ? span_start :
          [span_start, ...end__scanDirection__doWrapp]
        const justSpan = this._normalizeSpan(span)

        if (this[IMMUTABLE] {
          const [lo, hi, direction, wraps] = justSpan
          if (lo === 0 && hi === this.size && direction === FWD && !wrap) {
            return this
          }
        }

        return this._withinMap(justSpan, (value) => value))
      },



      // function copy(span_) {
      //   if (!span_ && this[IMMUTABLE]) { return this }
      //
      //   return this.within(span_ ? this._normalize(span_) : this.span)
      // },

      function _within(start, end, scanDir, _wraps) {
        const justSpan = this._normalizeSpan([start, end])

        justSpan[DIRECTION] = (scanDir.toFixed) ? scanDir : scanDir.SCAN || FWD
        return this._withinMap(justSpan, (value) => value))
      },

      function beyond(edge, scanDirective = FORWARD) {
        this._within(edge, null, scanDirective)
      },

      function until(edge, scanDirective = FORWARD) {
        return this._within(0, edge, scanDirective)
      },

      function initial(count = 1, scanDirective = FORWARD) {
        return this._within(0, count, scanDirective)
      },

      function final(count = 1, scanDirective = FORWARD) {
        const size = this.size
        return this.within(size - count, size, scanDirective)
      },



      function eachSend(span_, method_selector, ...args) {
        let [justSpan, Method, Args] =
          this._normalizeArgs(span_, method_selector, args)

        return (typeof Method === "function") ?
          this._withinDo(justSpan, (value) => { Method.apply(value, Args))
          this._withinDo(justSpan, (value) => { value[Method](...Args))
      },


      function mapSend(span_, method_selector, ...args) {
        let [justSpan, Method, Args] =
          this._normalizeArgs(span_, method_selector, args)

        return (typeof Method === "function") ?
          this._withinMap(justSpan, (value) => { Method.apply(value, Args))
          this._withinMap(justSpan, (value) => { value[Method](...Args))
      },



      function reduce(...span___action__seed_) {
        let args = this._normalizeArgs(...span___action__seed_)
        let [justSpan, Action, Accumulator] = args
        let scanDirection = span[DIRECTION]

        if (args.length === 2) {
          Accumulator = (scanDirection < 0) ?
            this._atIndex(--span[HI]) : this._atIndex(span[LO]++)
        }

        this._withinDo(justSpan, function (value, index) {
          Accumulator = Action.call(this.$, Accumulator, value, index)
        })

        return Accumulator
      },


      function _byWithinFind(grip, ...args) {
        const [justSpan, Conditional, absent_] = this._normalizeArgs(...args)

        const found = this._withinDo(justSpan, function (value, index) {
          if (Condition.call(this.$, value, index)) {
            return { index: index, value: value } // element: value, key: index,
          }
        })
        return found ? found[grip] :
          (typeof absent_ !== "function") ? absent_ : absent_.call(this.$)
      },

      function _byWithinFindAll(Grip, ...args) {
        const [justSpan, Conditional] = this._normalizeArgs(...args)

        return this.new((result) => {
          this._withinDo(justSpan, (value, index) => {
            if (Conditional.call(this.$, value, index)) {
              const slot =
                { index: index, value: value } // element: value, key: index,
              result.add(slot[Grip])
            }
          })
        })
      },

      function indexWhere(span_, condition, absent_) {
        return this._byWithinFind(INDEX, span_, condition, absent_)
      },

      function indexesWhere(span_, condition) {
        return this._byWithinFindAll(INDEX, span_, condition)
      },


      function indexOf(value, scanDir = FORWARD) {
        const condition = (existing) => value === existing)
        const direction = (scanDir.toFixed) ? scanDir : scanDir.SCAN || FWD

        return this._byWithinFind(INDEX, direction, condition)
      },

      function indexOfFirst(value) {
        return this.indexOf(value, FORWARD)
      },

      function indexOfLast(value) {
        return this.indexOf(value, BACKWARD)
      },

      function indexOfEvery(value, scanDir = FORWARD) {
        const condition = (existing) => value === existing)
        const direction = (scanDir.toFixed) ? scanDir : scanDir.SCAN || FWD

        return this._byWithinFindAll(INDEX, direction, condition)
      },

      function valueWhere(span_, condition, absent_) {
        return this._byWithinFind(VALUE, span_, condition, absent_)
      },

      function everyWhere(span_, conditional) {
        return this._byWithinFindAll(VALUE, span_, conditional)
      },

      function everyNotWhere(span_, conditional) {
        let [justSpan, Conditional] = this._normalizeArgs(span_, conditional)

        return this.new((result) => {
          this._withinDo(justSpan, (value, index) => {
            if (!Conditional.call(this.$, value, index)) { result.add(value) }
          })
        })
      },

      function countWhere(span_, conditional) {
        let [justSpan, Conditional] = this._normalizeArgs(span_, conditional)

        let count = 0
        this._withinDo(justSpan, (value, index) => {
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
        detect  : "valueWhere",
        find    : "valueWhere",
        select  : "everyWhere",
        reject  : "everyNotWhere"
        inject  : "reduce",
        where   : "valueWhere"
      } },



      function _byWithinFindSub(grip, span, ...args) {
        const [justSpan, subSize Conditional, absent_] =
          this._normalizeArgs(span, args)

        const found = this._overDo(justSpan, subSize, (sub, span) => {
          if (Condition.call(this.$, sub, index)) {
            return { span: span, sub: sub }
          }
        })
        return found ? found[grip] :
          (typeof absent_ !== "function") ? absent_ : absent_.call(this.$)
      },

      function spanOf(sub, directions_) {
        const sSub      = AsArray(sub)
        const size      = sSub.length
        const condition = (tSub) => EqualArrays(tSub, sSub)

        return this._byWithinOverFind(SPAN, span, size, condition)

      },

      function spanOfFirst(sub) {
        return this.spanOf(sub, FORWARD)
      },

      function spanOfLast(sub) {
        return this.spanOf(sub, BACKWARD)
      },

      // LOOK: Should this be consolidated???
      function _byWithinFindAllSubs(Grip, ...args) {
        const [scanDir, subSize, Conditional] = this._normalizeArgs(...args)
        const direction = (scanDir.toFixed) ? scanDir : scanDir.SCAN || FWD
        const justSpan  = this.normalizeSpan(direction)

        return this.new((result) => {
          this._overDo(justSpan, subSize, (sub, span) => {
            if (Conditional.call(this.$, value, index)) {
              const slots = { span: span, sub: sub }
              result.add(slots[Grip])
            }
          })
        })
      },

      function spanOfAcrossEvery(sub, scanDir = FORWARD) {
        const sSub      = AsArray(sub)
        const size      = sSub.length
        const condition = (tSub) => EqualArrays(tSub, sSub)

        return this._byWithinFindAllSubs(SPAN, scanDir, size, condition)
      },



      function atPut(index_span, value) {
        return (index_span.length) ?
          this.withinPut(index_span, value) :
          this.atIndexPut(index_span, value)
      }

      function atFan(index_span, values) {
        const span = (index_span.length) ? index_span : [index_span,,]
        return this.withinFan(span, values)
      }

      // LOOK check use of set vs _set!!!
      function atEachPut(indexes_spans, value) {
        return this.set(function () {
          Each(indexes_spans, (index_span) => this.atPut(index_span, value))
        })
      },

      function atEachPutEach(indexes_spans, Values) {
        return this.set(function () {
          Each(indexes_spans,
            (index_span, next) => this.atPut(index_span, Values[next]))
        })
      },

      function atIndexPut(index, value) {
        return this._set(function () {
          const target = this._elements
          const slotIndex

          if   (index >= 0) { slotIndex = index }
          else (index <  0) { slotIndex = target.length - index }
          else              { return this }

          if (slotIndex >= 0) {
            target[slotIndex] = value
          }
          else {
            const right = -slotIndex
            this.__subFromShiftTo(0, right)
            this.__echoWithin(undefined, 1, right)
            target[0] = value
          }
        })
      },


      function withinPut(span, value) {
        const normSpan = this._normalizeSpan(span, STRETCH)
        return this._withinSetBy(normSpan, [value], "__fillWithin")
      },

      function withinFan(span, values, fillDir = FORWARD) {
        const source    = AsArray(values)
        const normSpan  = this._normalizeSpan(span, STRETCH)
        const direction = (fillDir.toFixed) ? fillDir : fillDir.FILL || FWD

        return this._withinSetBy(normSpan, source, "__fillWithin", direction)
      },

      function withinEcho(span, value) {
        const normSpan = this._normalizeSpan(span, UNBOUNDED)

        return this._withinSetBy(normSpan, value, "__withinEcho")
      },


      function _contractSpanTo(span, fillSize) {
        const normSpan = this._normalizeSpan(span, UNBOUNDED)
        const [lo, hi, scanDirection] = normSpan
        const spanSize = (hi - lo)
        const delta    = fillSize - spanSize

        (delta < 0) &&
          normSpan[(scanDirection < 0) ? LO : HI] += delta * scanDirection

        return normSpan
      },
      //
      // function _expandFromBy(edge, anchorLocation, fillSize) {
      //   const span = this._normalizeSpan([edge], UNBOUNDED)
      //
      //   (anchorLocation === UNTIL_EDGE) ?
      //     (span[LO] -= fillSize) : (span[HI] += fillSize)
      //   return span
      // },


      function withinFill(span, values, fillDir = FORWARD) {
        const source    = AsArray(values)
        const normSpan  = this._contractSpanTo(span, source.length)
        const direction = (fillDir.toFixed) ? fillDir : fillDir.FILL || FWD

        return this._withinSetBy(normSpan, source, "__fillWithin", direction)
      },

      function withinEchoFill(span, values, fillDir = FORWARD) {
        const source    = AsArray(values)
        const normSpan  = this._normalizeSpan(span, UNBOUNDED)
        const direction = (fillDir.toFixed) ? fillDir : fillDir.FILL || FWD

        return this._withinSetBy(
          normSpan, source, "__withinEchoFill", direction)
      },

      function beyondLay(edge, values, fillDir = FORWARD) {
        const source    = AsArray(values)
        const normSpan  = this._contractSpanTo([edge, BEYOND], source.length)
        const direction = (fillDir.toFixed) ? fillDir : fillDir.FILL || FWD

        return this._withinSetBy(normSpan, source, "__fillWithin", direction)
      },

      function untilLay(edge, values, fillDir = FORWARD) {
        const source    = AsArray(values)
        const normSpan  = this._contractSpanTo([-BEYOND, edge], source.length)
        const direction = (fillDir.toFixed) ? fillDir : fillDir.FILL || FWD

        return this._withinSetBy(normSpan, source, "__fillWithin", direction)
      },


      function atFirstPut(matchValue, newValue) {
        return this.atIndexPut(this.indexOf(matchValue, FORWARD), newValue)
      },

      function atLastPut(matchValue, newValue) {
        return this.atIndexPut(this.indexOf(matchValue, BACKWARD), newValue)
      },

      function atEveryPut(matchValue, newValue) {
        return this._set((result) => {
          let target = result._elements
          let count = 0

          this._withinDo(this.span, function (value, index) {
            if (value === matchValue) {
              target[index] = newValue
              count++
            }
          })
          if (count === 0) { return this }
        })
      },

      function overFan(sub, values, directives_) {
        const directives = this._normalizeDirectives(SCAN, directives_)
        const source     = AsArray(values)
        const span       = this.spanOf(sub, directives)

        span[DIRECTION] = STRETCH
        return this._withinSetBy(span, source, "__fillWithin", directives.FILL)
      },

      // function overFirstFan(sub, values, match_fill_dir_) {
      //   let directives = this._normalizeDirectives(MATCH, match_fill_dir_)
      //   directives = { __proto__ : directives, SCAN : FORWARD }
      //   return this.overFan(sub, values, directives)
      // },

      function overFirstFan(sub, values) {
        return this.overFan(sub, values, FORWARD)
      },

      function overLastFan(sub, values) {
        return this.overFan(sub, values, BACKWARD)
      },



      function addFirst(value) {
        return this._set(function () {
          this.__subFromShiftTo(0, 1)
          this._elements[0] = value
        })
      },

      function addLast(value) {
        return this._set(function () {
          const target = this._elements
          target[elements.length] = value
        }
      },

      function addFirstAll(values, fillDir = FORWARD) {
        return this.withinFan([0], values, fillDir)
      },

      function addLastAll(values, fillDir = FORWARD) {
        return this.withinFan([null], values, fillDir)
      },

      function addBefore(value, matchValue, scanDir = FORWARD) {
        const index = this.indexOf(matchValue, scanDir)
        if (index === undefined) { return this }

        return this.withinPut([index], value)
      },

      function addAfter(value, matchValue, scanDir = FORWARD) {
        const index = this.indexOf(matchValue, scanDir)
        if (index === undefined) { return this }

        return this.withinPut([++index], value)
      },


      function addAllBefore(values, sub, directives_) {
        const span = this.spanOf(sub, directives_)
        if (span === undefined) { return this }

        return this.withinFan([span[LO]], values, directives_)
      },

      function addAllAfter(values, sub, directives_) {
        const span = this.spanOf(sub, directives_)
        if (span === undefined) { return this }

        return this.withinFan([span[HI]], values, directives_)
      },

      { ALIAS : {
        add    : "addLast",
        addAll : "addAllLast"
      } },




      function removeAtIndex(index) {
        return (typeof index !== "number") ? this :
          this.removeWithin(index, index + 1)
      },

      // LOOK!!!
      function removeWithin(lo, hi = lo) {
        if (typeof lo !== "number") { [lo, hi = lo] = lo }

        lo = (lo > 0)    ? lo : 0
        hi = (hi < size) ? hi : size

        return (lo === hi) ? this : this._set(this.__subFromShiftTo, hi, lo)
      },

      // LOOK!!!
      function removeOver(span) {
        return this.removeWithin(this._normalizeSpan(span))
      },

      function removeBeyond(edge) {
        return this.removeWithin(this._normalizeSpan([edge, null]))
      },

      function removeUntil(edge) {
        return this.removeWithin(this._normalizeSpan([0, edge]))
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
        const span = this.spanOfSub(sub)

        return (span) ? this._removeWithin(span) :
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
