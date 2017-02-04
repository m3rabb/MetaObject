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

Conversion
  toString()
  asString

Accessing
  General
    size
    slots
    elements
    values
    keys
    indexes
    span
    inverseSpan
    reversed
    isEmpty

  Generic
    at(index_span, absent_)
    atEach(indexers)
    reverse()

  By Index
    atIndex(index, absent_)
    first
    last

  By Span
    within(lo, hi = lo, dir, wrap)
    beyond(edge, scanDirective_)
    until(edge, scanDirective_)
    initial(count = 1, scanDirective_)
    final(count = 1, scanDirective_)

  By Value
    Answer Index
      indexOf(value, scanDirective_)
      indexOfFirst(value)
      indexOfLast(value)
      indexesOfEvery(value, scanDirective_)

    Answer Count
      countOf(value)
      countOfWhere(scanDirective_, conditional)
      contains(value)

  By Value Condition
    Answer Index
      indexOfWhere(scanDirective_, condition)
      indexesOfWhere(scanDirective_, condition)

    Answer Value
      valueWhere(scanDirective_, condition, absent_)
      everyWhere(scanDirective_, conditional)
      everyWhereNot(scanDirective_, conditional)

      where   : "valueWhere"
      detect  : "valueWhere",
      find    : "valueWhere",
      select  : "everyWhere",
      reject  : "everyWhereNot"

  By Sub
    Answer Span
      spanOf(matchSub, directives_)                  scan|match
      spanOfFirst(matchSub, subDirection_)
      spanOfLast(matchSub, subDirection_)
      spansOfDistinct(matchSub, directive_)       scan|sub
      spansOfIndistinct(matchSub, directive_)       scan|sub

    Answer Count
      countOfDistinct(matchSub, directives_)      scan|sub
      countOfIndistinct(matchSub, directives_)      scan|sub
      containsSub(sub)

  By Sub condition
    Answer Span
      spanWhere(directives_, subSize, condition)
      distinctSpansWhere(directives_, subSize, condition)
      indistinctSpansWhere(directives_, subSize, condition)

    Answer Sub
      subWhere(directives_, subSize, condition)
      distinctWhere(directives_, subSize, condition)
      indistinctWhere(directives_, subSize, condition)

Enumeration
  By Value
    withinDo(normSpan, action)
    withinMap(normSpan, Action)
    withinReduce(scanDirective, startValue_, reducer)

    eachDo(span_, action)
    map(span_, action)
    eachSend(span_, method_selector, ...args)
    mapSend(span_, method_selector, ...args)

    reduce(startValue_, reducer)

    do      : "eachDo",
    collect : "map",
    inject  : "reduce",

  By Sub
    distinctDo(directives_, subSize, action)       scan|sub
    indistinctDo(directives_, subSize, action)       scan|sub
    distinctMap(directives_, subSize, action)       scan|sub
    indistinctMap(directives_, subSize, action)       scan|sub


Put
  Generic
    atPut(index_span, value)
    atEachPut(indexers, value)
    atEachPutEach(indexers, values)
    atFan()

  By Index
    atIndexPut(index, value)

  By Span
    withinPut(edge_span, value)
    withinEcho(span, value)

    withinFan(span, values, fillDirective_)              fill
    withinFill(span, values, fillDirective_)             fill
    withinEchoFill(span, values, fillDirective_)         fill

    beyondLay(edge, sub, fillDirective_)                 fill
    untilLay(edgs, sub, fillDirective_)                  fill

  By Value
   atValuePut
   atFirstPut(matchElement, newElement)
   atLastPut(matchElement, newElement)
   atEveryPut(matchElement, newElement)

  By Sub
    fanOver(sub, values, directives_)              scan|sub|fill
    fanOverLast(sub, values)
    fanOverLast(sub, values)
    fanOverDistinct(sub, values, directives_)         scan|sub|fill

Add
  Generic
    add    : "addLast",
    addAll : "addAllLast",                   fill

  By Value
    addFirst(value)
    addLast(value)
    addBefore(value, targetValue)
    addAfter(value, targetValue)

  By Sub
    addFirstAll(values, directive_)                fill
    addLastAll(values, directive_)                 fill
    addAllBefore(values, targetValue, directive_)  scan|sub|fill
    addAllAfter(values, targetValue, directive_)   scan|sub|fill

Remove
  Generic
    removeAt(index_span)
    removeAtEach(indexers)
    removeEach(values)
    removeAll()
    empty

  By Index
    removeAtIndex(index)

  By Span
    removeWithin(lo, hi = lo)
    removeBeyond(edge)
    removeUntil(edge)
    removeInitial(count = 1)
    removeFinal(count = 1)

  By Value
    remove(value, scanDirective_)
    removeFirst(value_)
    removeLast(value_)
    removeEvery(value)

    removeWhere(span_, condition)
    removeEveryWhere(span_, conditional)
    removeEveryWhereNot(span_, conditional)

  By Span
    removeOver(sub, directive_)    scan|sub
    removeOverFirst(sub, subDirection_)    scan|sub
    removeOverLast(sub, subDirection_)    scan|sub
    removeOverDistinct(sub, directive_)    scan|sub
