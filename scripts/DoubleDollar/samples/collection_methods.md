__init(elements_)
__withinFill(lo, hi, fillDirection, source, takeDirection)
__echoWithin(value, lo, hi)
__echoFillWithin(source, lo, hi, fillDirection, takeDirection)
__subFromShiftTo(sourceEdge, targetEdge)

_withinSetBy(
_normalize(span_startEdge, endEdge_)
_normalizeArgs(...args)

_byOverFind(grip, ...args)
_byOverFindAll(Grip, ...args)

_contractedSpanTo(span, fillSize)
_expandFromBy(edge, anchorLocation, fillSize)


toString()

* copy(span_)
  asNew
  asCopy
  asNonCopy


Accessing
  Generic
    size
    isEmpty
    elements
    keys
    span
    inverseSpan
    slots

    values @ index|span
      at(index_span, absent_)
      atEach(indexers)

    value @ index|span
      atIndex(index, absent_)
      first
      last

    index|span @ value(s)
      indexOf(value, scanDir_)
      indexOfFirst(value)
      indexOfLast(value)
      indexOfEvery(value, scanDir_)

      countOf(value)
      contains(value)

      indexWhere(span_, condition, absent_)
      indexesWhere(span_, condition)
      countWhere(span_, conditional)

      valueWhere(span_, condition, absent_)
      everyWhere(span_, conditional)
      everyNotWhere(span_, conditional)

  Enumeration
    withinDo(normSpan, action)
    withinMap(normSpan, Action)

    eachDo(span_, action)
    map(span_, action)
    eachSend(span_, method_selector, ...args)
    mapSend(span_, method_selector, ...args)
    reduce(span_, action, seed_)

    do      : "eachDo",
    overDo  : "eachDo",
    collect : "map",
    detect  : "valueWhere",
    find    : "valueWhere",
    select  : "everyWhere",
    reject  : "everyNotWhere"
    inject  : "reduce",
    where   : "valueWhere"

Put
  Generic
    atPut(index_span, value)
    atFan()
    atEachPut(indexers, value)
    atEachPutEach(indexers, values)

  index|span PUT value(s)
    atIndexPut(index, value)
    withinPut(edge_span, value)

    withinEcho(span, value)

  value PUT value
   atFirstPut(matchElement, newElement)
   atLastPut(matchElement, newElement)
   atEveryPut(matchElement, newElement)


*   reverse
*   reverseCopy

Add
  addFirst(value)
  addLast(value)
  addBefore(value, targetValue)
  addAfter(value, targetValue)

  add    : "addLast",

  plural
    within(lo, hi = lo, direction, wrap)
    beyond(edge, scanDir_)
    until(edge, scanDir_)
    initial(count = 1, scanDir_)
    final(count = 1, scanDir_)

    _overDo(justSpan, subSize, directions, action)

*    overDo(span_, subSize, directions_, action)    sub|overlaps
    overMap(span_, subSize, directions_, action)   match

*    spanOf(matchSub, directives_)                   scan|match
    spanOfFirst(matchSub, directive_)               match
    spanOfLast(matchSub, directive_)                match

*    spanOfEvery(matchSub, options_)                 scan|match|overlaps
*    countOver(matchSub, options_)                   scan|match|overlaps

    withinFan(span, sub, directive_)               fill
    withinFill(span, sub, directive_)              fill
    withinEchoFill(span, sub, directive_)          fill
    beyondLay(edge, sub, directive_)                fill
    untilLay(edge, sub, directive_)                 fill

    overFan(matchSub, newSub, directives_)          scan|match|fill
    overFirstFan(matchSub, newSub)
    overLastFan(matchSub, newSub)
*    overEveryFan(matchSub, newSub, directives_)    scan|match|fill

    addAll()
    addFirstAll(values, directive_)                 fill
    addLastAll(values, directive_)                  fill

    addAllBefore(values, targetValue, directive_)   scan|match|fill
    addAllAfter(values, targetValue, directive_)    scan|match|fill

    addAll : "addAllLast",

    List("but but but not wow").overFirstFan(
      List("but", List("near"), BACKWARD


      function _overDo(justSpan, size, directives_, action) {
        let subDirection = FWD
        let asList       = false
        let overlaps     = true

        switch (directives_) {
          default         :                                    break
          case "function" : action        = directives_;       break
          case "boolean"  : overlaps      = directives_      ; break
          case "number"   : scanDirection = directives_      ; break
          case "object"   :
            { SUB      : subDirection = FWD,
              AS_LIST  : asList       = false,
              OVERLAPS : overlaps     = true, } = directives_; break
            // subDirection = directives.SUB || FWD
            // asList       = directives.AS_LIST || false
            // overlaps     = directives.OVERLAPS || true
        }

        const target = this._elements
        const [lo, hi, scanDirection, wraps] = justSpan

        if (wraps) {
          return this.error(
            "Wrapping on span enumeration is not yet implemented!")
        }

        let [start, limit, startInc, endInc] = (scanDirection < 0) ?
              [hi, lo, BWD, -size] : [lo, hi, FWD, size]

        if (!overlaps) { startInc *= size }

        let [sStart, sLimit] = (subDirection < 0) ? [size - 1, -1] : [0, size]

        do {
          do {
            let end       = start + endInc
            let remaining = (limit - end) * scanDirection

            if (remaining < 0) { break }

            let [tIndex, nextSpan] = (scanDirection < 0) ?
                  [end  , [end, start, subDirection]] :
                  [start, [start, end, subDirection]]

            let sub = []
            let sIndex = sStart

            while (sIndex !== sLimit) {
              sub[sIndex] = target[tIndex++]
              sIndex += subDirection
            }

            let nextSub = asList ? List(sub) : sub
            let result  = action.call(this.$, nextSub, nextSpan)

            if (result !== undefined) { return result }

            start += startInc
          } while (true)

          if (remaining === 0) { break }

          size += count
          end = limit
        } while (true)

        return undefined
      },

      function overDo(...span___subSize__directives___action) {
        const [justSpan, subSize, directives_, action] =
          this._normalizeArgs(span___subSize__directives___action)

        return this._overDo(justSpan, subSize, directives_, action)
      },

      function overMap(...span___subSize__directives___action) {
        const [justSpan, subSize, directives_, Action] = 
          this._normalizeArgs(span___subSize__directives___action)

        return this.new((result) => {
          this._overDo(justSpan, subSize, directives_, (sub, span) => {
            result.add(Action.call(this.$, sub, span))
          })
        })
      },


scan|match

    function spanOf(matchSub, directives_) {
      const source     = AsArray(matchSub)
      const subSize    = source.length
      const condition  = (nextSub) => EqualArrays(nextSub, source)
      const directives = this._normalizeDirectives(SCAN, directives_)


      const justSpan = this._normalizeArgs(directives.SCAN)

      const found = this._overDo(justSpan, subSize, (sub, index) => {
      if (Condition.call(this.$, value, index)) {
        return { index: index, value: value } // element: value, key: index,
      }
    })
    return found ? found[grip] :
      (typeof absent_ !== "function") ? absent_ : absent_.call(this.$)







Remove
  removeAtIndex(index)
  removeWithin(lo, hi = lo)
  removeOver(span)

  removePast(edge)
  removeUntil(edge)
  removeInitial(count = 1)
  removeFinal(count = 1)

  remove(value, scanDir_)
  removeFirst(value_)
  removeLast(value_)
*  removeEvery(value)

  removeSub(sub, scanDir_)
  removeFirstSub(sub)
  removeLastSub(sub)
  removeEverySub(sub, scanDir_)
