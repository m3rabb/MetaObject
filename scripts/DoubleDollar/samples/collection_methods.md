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

  Index|Span
    value|sub @ index|span
      atIndex(index, absent_)
      first
      last

      within(lo, hi = lo, direction, wrap)
      over(lo, hi = lo)

      subPast(edge)
      subUntil(edge)
      initial(count = 1)
      final(count = 1, viaLaterValues = false)

    index|span @ value(s)
      indexOf(value, searchDirection = FORWARD)
      indexOfFirst(value)
      indexOfLast(value)
*      indexesOfEvery(value, searchDirection = FORWARD)

      spanOf(sub, searchDirection = FORWARD)
      spanOfFirst(sub)
      spanOfLast(sub)
*      spansOfEvery(sub, searchDirection = FORWARD)

    other
      countOf(value)
      contains(value)

    via condition
      indexWhere(span_, condition, absent_)
      indexesWhere(span_, condition)
      countWhere(span_, conditional)

      valueWhere(span_, condition, absent_)
      everyWhere(span_, conditional)
      everyNotWhere(span_, conditional)

*     spanWhere(span_, condition, absent_)
*     spansWhere(span_, condition)
*     countSpansWhere(span_, condition)

*     subWhere(span_, condition, absent_)
*     everySubWhere(span_, condition)


  Enumeration
    withinDo(normSpan, action)
    withinMap(normSpan, Action)

    eachDo(span_, action)
    map(span_, action)
    eachSend(span_, method_selector, ...args)
    mapSend(span_, method_selector, ...args)
    reduce(span_, action, seed_)

    do      : "eachDo",
    collect : "map",
    detect  : "firstWhere",
    find    : "firstWhere",
    select  : "everyWhere",
    reject  : "everyNotWhere"
    inject  : "reduce",
*   where   : "valueWhere"

Put
  Generic
    atPut(index_span, value)
    atEachPut(indexers, value)
    atEachPutEach(indexers, values)

  index|span PUT value(s)
    atIndexPut(index, value)
    overPut(edge_span, value)
    overFan(edge_span, values)

    overEcho(span, value)
    overFill(span, values, takeDirection = FORWARD)
    overEchoFill(span, values, takeDirection = FORWARD)
    pastLay(edge, values, takeDirection = FORWARD)
    untilLay(edge, values, takeDirection = FORWARD)

  value PUT value
*  putAtFirst(newElement, existingElement, absentAction_)
*  putAtLast(newElement, existingElement, absentAction_)
*  putAtEvery(newElement, existingElement, absentAction_)

*  fanOverFirst(newElements, existingElements, absentAction_)
*  fanOverLast(newElements, existingElements, absentAction_)
*  fanOverEvery

*   reverse
*   reverseCopy

Add
  addFirst(value)
  addLast(value)
  addFirstAll(values)
  addLastAll(values)
  addBefore(value, targetValue)
  addAfter(value, targetValue)
  addAllBefore(values, targetValue)
  addAllAfter(values, targetValue)

  add    : "addLast",
  addAll : "addAllLast",


Remove
  removeAtIndex(index)
  removeWithin(lo, hi = lo)
  removeOver(span)
  removePast(edge)
  removeUntil(edge)
  removeInitial(count = 1)
  removeFinal(count = 1)
  remove(value, searchDirection = FORWARD)
  removeFirst(value_)
  removeLast(value_)
  removeEvery(value)
  removeSub(sub)
