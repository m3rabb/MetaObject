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
        let sIndex, tIndex, limit

        ;[tIndex, limit] = (fillDirection > 0) ? [lo, hi] : [hi - 1] : [lo - 1]
        ;[takeDirection, sIndex] = (takeDirection > 0) ?
          [FWD, 0] : [BWD, source.length - 1]

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


      function _normalize(place, bounded = true) {
        let start, end, dir, direction, lo, hi
        let size = this._elements.length

        switch (typeof place) {
          case "boolean" :                // direction
            return [0, size, place ? FWD : BWD]
          case "number"  :                // relative index
            start = place, end = place + 1
            if (start === end) { [        // direction ([-]Infinity)
              return [0, size, (place > 0) ? FWD : BWD]
            }
            break
          case "object"  :
            [start, end, dir] = place
            if (dir) {                    // linear span|edge
              [lo, hi, direction, wraps] = place
            }
            else if (end === undefined) { // linear index
              [lo, hi, direction] = [place, place + 1, NON]
            }
            break                         // relative span|edge
          default : return undefined
        }

        if (lo === undefined) {
          start = (start >= 0) ? (start === null ? size : start) : start + size
          end   = (end   >= 0) ? (end   === null ? size : end  ) : end   + size

          [lo, hi, direction] = (start < end) ?
            [start, end, FWD] :
            [end, start, (start > end) ? BWD : NON]
        }

        return (bounded) ?
          [(lo < 0) ? 0 : lo, (hi > size) ? size : hi, direction, wraps] :
          (dir) ? this : [lo, hi, direction]
      },

      // function _normalize(span_startEdge, endEdge_) {
      //   let start, end, direction, size
      //
      //   switch (typeof span_startEdge) {
      //     case "number" :
      //       start = span_startEdge
      //       end = (endEdge_ === undefined) ? start : endEdge_
      //       break
      //     case "object" :
      //       [start, end = start, direction] = span_startEdge
      //       if (direction) { return span } else { break }
      //     default :
      //       return undefined
      //   }
      //
      //   size  = this._elements.length
      //   start = (start >= 0) ? start : (start === null) ? size : end + size
      //   end   = (end   >= 0) ? end   : (end   === null) ? size : end + size
      //
      //   return (start <= end) ? [start, end, FWD] : [end, start, BWD]
      // },


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

      // function _normalizeArgs(...args) {
      //   let [first, ...remaining] = args
      //   if (typeof first !== "object") { return [this.span, ...args] }
      //   if (args.length === 1) {
      //     [first, ...remaining] = first
      //     if (typeof first !== "object") { return [this.span, ...args] }
      //   }
      //   return [this._normalize(first), ...remaining]
      // },

      function _configureArgs(...args) {
        do {
          let [first, ...remaining] = args

          switch (typeof first) {
            case "function"  : return [this.span, ...args]
            case "string"    : return [this.span, ...args]
            case "undefined" : return [[0, 0, FWD], ...args]
          }

          if (args.length === 1) { args = first; continue }
        } while (false)

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




      function at(place, absent_) {
        if (typeof place === "number") {
          return this.atIndex(place, absent_)
        }
        const values = this.over(place)
        return values.size ? values :
          (typeof absent_ !== "function") ?
            absent_ : absent_.call(this.$, place)
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



      function _withinDo(innerSpan, action) {
        let target = this._elements
        let size   = target.length
        let preIndex, preLimit, sIndex, sLimit, noWrap, result
        let [lo, hi, direction, wraps] = innerSpan

        if (wraps) {
          [preIndex, preLimit, sIndex, sLimit] =
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
          [sIndex, sLimit] = (direction > 0) ? [lo, hi] : [hi - 1, lo - 1]
        }

        while (sIndex !== sLimit) {
          result = action.call(this.$, target[sIndex], sIndex)
          if (result !== undefined) { return result }
          sIndex += direction
        }

        return this
      },

      function eachDo(place_, action) {
        return action ?
          this._withinDo(this._normalize(place_), action) :
          this._withinDo(this.span, action = place_)
      },

      function map(place_, action) {
        return action ?
          this._withinMap(this._normalize(place_), action) :
          this._withinMap(this.span, action = place_)
      },

      function _withinMap(innerSpan, Action) {
        return this.new((result) => {
          const target = result._elements

          this._withinDo(innerSpan, (value, index) => {
            target[index] = Action.call(this.$, value, index)
          })
        })
      },


      function _withinSubsDo(innerSpan, subSize, action, subsAsArrays) {
        let target = this._elements
        let tSize  = target.length
        let [lo, hi, direction, wraps] = innerSpan

        if (wraps) {
          return this.error(
            "Wrapping on span enumeration is not yet implemented!")
        }

        [next, tLimit] = (direction > 0) ?
          [lo, hi - subSize + 1] : [hi - subSize, lo - 1]

        while (next !== tLimit) {
          let tIndex = next + subSize
          let sIndex = subSize
          let span   = [next, tIndex, FWD]
          let sub    = []

          while (sIndex--) { sub[sIndex--] = target[tIndex--] }

          const sublist = subsAsArrays ? sub : List(sub)
          const result  = action.call(this.$, sublist, span)
          if (result !== undefined) { return result }
          next += direction
        }

        return this
      },

      function _withinSubsMap(innerSpan, subSize, action, subsAsArrays) {
        return this.new((result) => {
          let target = result._elements
          let count  = 0

          this._withinSubsDo(innerSpan, subSize, (sub, span) => {
            target[count++] = Action.call(this.$, sub, span)
          }, subsAsArrays)
        })
      },

      // function withinSubsDo(normSpanner, subSize, action) {
      //   return this._withinSubsDo(normSpanner, subSize, action, false)
      // },
      //
      // function withinSubsMap(normSpanner, subSize, action) {
      //   return this._withinSubsMap(normSpanner, subSize, action, false)
      // },



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

      function _within(lo, hi, direction, wraps) {
        return this._withinMap([lo, hi, direction, wraps], (value) => value))
      },


      function over(place_start, end, direction, wraps) {
        const args = (place_start.length) ? place_start :
          [place_start, end, direction, wraps]
        const innerSpan = this._normalize(args)
        const [lo, hi, direction, wraps] = innerSpan

        return (this[IMMUTABLE] &&
          (lo === 0 && hi === this.size && direction === FWD && !wrap) ?
            this : this._withinMap(innerSpan, (value) => value))
      },

      // function copy(span_) {
      //   if (!span_ && this[IMMUTABLE]) { return this }
      //
      //   return this.within(span_ ? this._normalize(span_) : this.span)
      // },


      function subPast(edge) {
        return this.over(edge, null)
      },

      function subUntil(edge) {
        return this.over(0, edge)
      },

      function initial(count = 1) {
        return this.over(0, count)
      },

      function final(count = 1, viaLaterValues = false) {
        const size = this.size

        return this.over(size - count, size)
      },




      function eachSend(place_, method_selector, ...args) {
        let [innerSpan, Method, Args] =
          this._configureArgs(place_, method_selector, args)

        return (typeof Method === "function") ?
          this._withinDo(innerSpan, (value) => { Method.apply(value, Args))
          this._withinDo(innerSpan, (value) => { value[Method](...Args))
      },


      function mapSend(place_, method_selector, ...args) {
        let [innerSpan, Method, Args] =
          this._configureArgs(place_, method_selector, args)

        return (typeof Method === "function") ?
          this._withinMap(innerSpan, (value) => { Method.apply(value, Args))
          this._withinMap(innerSpan, (value) => { value[Method](...Args))
      },



      function reduce(...place___action__seed_) {
        let args = this._configureArgs(place___action__seed_)
        let [innerSpan, Action, Accumulator] = args

        if (args.length === 2) {
          Accumulator = (direction > 0) ?
            this.at(innerSpan[0]++) : this.at(--innerSpan[1])
        }

        this._withinDo(innerSpan, function (value, index) {
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
        const [innerSpan, Conditional, absent_] = this._configureArgs(args)

        const found = this._withinDo(innerSpan, function (value, index) {
          if (Condition.call(this.$, value, index)) {
            return { index: index, value: value } // element: value, key: index,
          }
        })
        return found ? found[grip] :
          (typeof absent_ !== "function") ? absent_ : absent_.call(this.$)
      },

      function _byOverFindAll(Grip, ...args) {
        const [innerSpan, Conditional] = this._configureArgs(args)

        return this.new((result) => {
          this._withinDo(innerSpan, (value, index) => {
            if (Conditional.call(this.$, value, index)) {
              const slot =
                { index: index, value: value } // element: value, key: index,
              result.add(slot[Grip])
            }
          })
        })
      },


      function _byOverFindSub(grip, place, ...args) {
        const [innerSpan, subSize Conditional, absent_] =
          this._configureArgs(place, args)

        const found = this._withinSubsDo(innerSpan, subSize, (sub, span) => {
          if (Condition.call(this.$, sub, index)) {
            return { span: span, sub: sub }
          }
        }, true)
        return found ? found[grip] :
          (typeof absent_ !== "function") ? absent_ : absent_.call(this.$)
      },

      function spanOf(sub, place = FORWARD) {
        const sSub      = AsArray(sub)
        const size      = sSub.length
        const condition = (tSub) => EqualArrays(tSub, sSub)

        return this._byOverFindSub("span", place, size, condition)
      },

      function spanOfFirst(sub) {
        return this.spanOf(sub, FORWARD)
      },

      function spanOfLast(sub) {
        return this.spanOf(sub, BACKWARD)
      },


      function _byOverFindAllSubs(Grip, ...args) {
        const [innerSpan, subSize, Conditional] =
          this._configureArgs(args)

        return this.new((result) => {
          this._withinSubsDo(innerSpan, subSize, (sub, span) => {
            if (Conditional.call(this.$, value, index)) {
              const slots = { span: span, sub: sub }
              result.add(slots[Grip])
            }
          }, true)
        })
      },

      function spansAcrossEvery(sub, place = FORWARD) {
        const sSub      = AsArray(sub)
        const size      = sSub.length
        const condition = (tSub) => EqualArrays(tSub, sSub)

        return this._byOverFindAllSubs("span", place, size, condition)
      },


      function indexWhere(place_, condition, absent_) {
        return this._byOverFind("index", place_, condition, absent_)
      },

      function indexesWhere(place_, condition) {
        return this._byOverFindAll("index", place_, condition)
      },

      function indexOf(value, place = FORWARD) {
        const condition = (existing) => value === existing)
        return this._byOverFind("index", place, condition)
      },

      function indexOfFirst(value) {
        return this.indexOf(value, FWD)
      },

      function indexOfLast(value) {
        return this.indexOf(value, BWD)
      },


      function indexesOfEvery(value, place = FORWARD) {
        const condition = (existing) => value === existing)
        return this._byOverFindAll("index", place, condition)
      },

      function valueWhere(place_, condition, absent_) {
        return this._byOverFind("value", place_, condition, absent_)
      },

      function everyWhere(place_, conditional) {
        return this._byOverFindAll("value", place_, conditional)
      },

      function everyNotWhere(place_, conditional) {
        let [innerSpan, Conditional] = this._configureArgs(place_, conditional)

        return this.new((result) => {
          this.withinDo(innerSpan, (value, index) => {
            if (!Conditional.call(this.$, value, index)) { result.add(value) }
          })
        })
      },

      function countWhere(place_, conditional) {
        let [innerSpan, Conditional] = this._configureArgs(place_, conditional)

        let count = 0
        this.withinDo(innerSpan, (value, index) => {
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
        where   : "valueWhere"
      } },



      function atPut(place, value) {
        return (typeof place === "number") ?
          this.atIndexPut(place, value) :
          this.overPut(place, value)
      }

      function atFan(place, values) {
        return this.overFan(place, value)
      }

      // LOOK check use of set vs _set!!!
      function atEachPut(places, value) {
        return this.set(function () {
          Each(places, (place) => this.atPut(place, value))
        })
      },

      function atEachPutEach(places, Values) {
        return this.set(function () {
          Each(places, (place, next) => this.atPut(place, Values[next]))
        })
      },

      function atIndexPut(index, value) {
        return this._set(function () {
          const elements  = this._elements
          const slotIndex

          if   (index >= 0) { slotIndex = index }
          else (index <  0) { slotIndex = elements.length - index }
          else              { return this }

          if (slotIndex >= 0) {
            elements[slotIndex] = value
          }
          else {
            this.__subFromShiftTo(0, -slotIndex)
            elements[0] = value
          }
        })
      },


      function overPut(place, value) {
        const normSpan = this._normalize(place, false)

        return this._withinSetBy(normSpan, [value], "__withinFill", STRETCHES)
      },

      function overFan(place, values) {
        const source   = AsArray(values)
        const normSpan = this._normalize(place, false)

        return this._withinSetBy(normSpan, source, "__withinFill", STRETCHES)
      },

      function overEcho(place, value) {
        const normSpan = this._normalize(place, false)

        return this._withinSetBy(normSpan, value, "__withinEcho")
      },


      function _contractedSpanTo(place, fillSize) {
        const normSpan = this._normalize(place, false)
        const [lo, hi, fillDirection, wraps] = normSpan
        const spanSize = (hi - lo)
        const delta    = fillSize - spanSize

        return (delta >= 0) ? normSpan :
          (fillDirection > 0) ?
            [lo        , hi + delta, fillDirection, wraps] :
            [lo + delta,         hi, fillDirection, wraps]
      },

      function overFill(place, values, takeDirection = FORWARD) {
        const source   = AsArray(values)
        const normSpan = this._contractSpanTo(place, source.length)

        return this._withinSetBy(
          normSpan, source, "__withinFill", takeDirection)
      },

      function overEchoFill(place, values, takeDirection = FORWARD) {
        const source   = AsArray(values)
        const normSpan = this._normalize(place, false)

        return this._withinSetBy(
          normSpan, source, "__withinEchoFill", takeDirection)
      },

      // LOOK
      function _expandFromBy(edge, anchorLocation, fillSize) {
        const span      = edge.length ? edge : [edge]
        const normSpan = this._normalize(place, false)

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


      function atFirstPut(matchValue, newValue) {
        return this.atIndexPut(this.indexOf(matchValue, FORWARD), newValue)
      },

      function atLastPut(matchValue, newValue) {
        return this.atIndexPut(this.indexOf(matchValue, BACKWARD), newValue)
      },

      function atEveryPut(matchValue, newValue, searchDirection = FORWARD) {
        return this._set((result) => {
          let target = result._elements
          let count = 0

          this.overDo(searchDirection, function (value, index) {
            if (value === matchValue) {
              target[index] = newValue
              count++
            }
          })
          if (count === 0) { return this }
        })
      },

      function overSubFan(
        matchSub, newSub, searchDirection = FORWARD, takeDirection = FORWARD
      ) {
        const innerSpan = this.spanOf(matchSub, searchDirection)
        innerSpan[3] = takeDirection
        return this._withinSetBy(innerSpan, newSub, "__withinFill", STRETCHES)
      },

      function overFirstFan(matchSub, newSub, takeDirection = FORWARD) {
        return this.overSubFan(normSpan, newElement, FORWARD, takeDirection)
      },

      function overLastFan(matchSub, newSub, takeDirection = FORWARD) {
        return this.overSubFan(normSpan, newElement, BACKWARD, takeDirection)
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

      function addBefore(value, targetValue, searchDirection = FORWARD) {
        const insertionEdge = this.indexOf(value, searchDirection)
        return (index >= 0) ? this.overPut(insertionEdge, value) : this
      },

      function addAfter(value, targetValue, searchDirection = FORWARD) {
        const insertionEdge = this.indexOf(value, searchDirection) + 1
        return (index >= 0) ? this.overPut(insertionEdge, value) : this
      },

      function addAllBefore(values, targetValue, searchDirection = FORWARD) {
        const insertionEdge = this.indexOf(value, searchDirection)
        return (index >= 0) ? this.overFan(insertionEdge, values) : this
      },

      function addAllAfter(values, targetValue, searchDirection = FORWARD) {
        const insertionEdge = this.indexOf(value, searchDirection) + 1
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

      function remove(value, searchDirection = FWD) {
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
        const innerSpan = this.spanOfSub(sub)

        return (innerSpan) ? this.removeWithin(innerSpan) :
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
