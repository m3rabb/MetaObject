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

    _overDo(justSpan, subSize, directives_, action)  sub|overlaps|subsAsLists

    overDo(span_, subSize, directives_, action)    sub|overlaps
    overMap(span_, subSize, directives_, action)   match

*    spanOf(matchSub, directives_)                   scan|match
    spanOfFirst(matchSub, directive_)               sub
    spanOfLast(matchSub, directive_)                sub

*    spanOfEvery(matchSub, options_)                 scan|sub|overlaps
*    countOver(matchSub, options_)                   scan|sub|overlaps

    withinFan(span, sub, directive_)               fill
    withinFill(span, sub, directive_)              fill
    withinEchoFill(span, sub, directive_)          fill
    beyondLay(edge, sub, directive_)                fill
    untilLay(edge, sub, directive_)                 fill

    overFan(matchSub, newSub, directives_)          scan|sub|fill
    overFirstFan(matchSub, newSub)
    overLastFan(matchSub, newSub)
*    overEveryFan(matchSub, newSub, directives_)    scan|sub|fill

    addAll()
    addFirstAll(values, directive_)                 fill
    addLastAll(values, directive_)                  fill

    addAllBefore(values, targetValue, directive_)   scan|sub|fill
    addAllAfter(values, targetValue, directive_)    scan|sub|fill

    addAll : "addAllLast",

    List("but but but not wow").overFirstFan(
      List("but", List("near"), BACKWARD




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
