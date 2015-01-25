// $options $REST $SPEC $LIST $ARGS // $ACTUAL
// params extras specials
// $$ means safe for modifying


args <== 1, 2, 3, 4, 5, 6, 7

$(a, b, c)  

a         = 1
b         = 2
c         = 3
arguments = (1, 2, 3, 4, 5, 6, 7)


$(a, b, c, $options)

a         = 1
b         = 2
c         = 3
$options  = undefined


$(a, b, c, $SPEC)

a         = 1
b         = 2
c         = 3
$SPEC     = a:1, b:2, c:3


$(a, b, c, $REST)

a         = 1
b         = 2
c         = 3
$REST     = [4, 5, 6, 7]


$(a, b, c, $LIST)
$(a, b, c, $ARGS)

a           = 1
b           = 2
c           = 3
$LIST/$ARGS = args


$(a, b, c, $options, $SPEC, $REST, $LIST, $ARGS)

a           = 1
b           = 2
c           = 3
$options    = undefined
$SPEC       = a:1, b:2, c:3
$REST       = [4, 5, 6, 7]
$LIST       = args
$ARGS       = args



$(a, b, c)  // $(d, e)

a         = 1
b         = 2
c         = 3
arguments = (1, 2, 3, 4, 5, 6, 7)


$(a, b, c, $options)  // $(d, e)

a         = 1
b         = 2
c         = 3
$options  = d:4, e:5


$(a, b, c, $SPEC)  // $(d, e)

a         = 1
b         = 2
c         = 3
$SPEC     = a:1, b:2, c:3, d:4, e:5


$(a, b, c, $REST)  // $(d, e) <-- extras n/a

a         = 1
b         = 2
c         = 3
$REST     = [4, 5, 6, 7]


$(a, b, c, $LIST)  // $(d, e) <-- extras n/a
$(a, b, c, $ARGS)  // $(d, e) <-- extras n/a

a           = 1
b           = 2
c           = 3
$LIST/$ARGS = args


$(a, b, c, $options, $SPEC, $REST, $LIST, $ARGS)  // $(d, e)

a           = 1
b           = 2
c           = 3
$options    = d:4, e:5
$SPEC       = a:1, b:2, c:3, d:4, e:5
$REST       = [6, 7]
$LIST       = args
$ARGS       = args


args <== 1, 2, 3, 4, 5, 6, 7

$($options)
$($SPEC)
undefined

$($REST)
$($LIST)
$($ARGS)
args

$($options)  // $(a b c d)
$($SPEC)     // $(a b c d)
a:1, b:undefined, c:3, d:4


$($options, $REST)  // $(a b c d)
options = a:1, b:undefined, c:3, d:4
rest = [5, 6, 7]



===================

<== a:1, c:3, d:4, e:5, g:7, h:8

$(a, b, c)

a         = 1
b         = undefined
c         = 3
arguments = (1, undefined, 3)


$(a, b, c, $options)

a         = 1
b         = undefined
c         = 3
$options  = d:4, e:5, g:7, h:8


$(a, b, c, $SPEC)
$(a, b, c, $ARGS)

a         = 1
b         = undefined
c         = 3
$SPEC     = args


$(a, b, c, $REST)

a         = 1
b         = undefined
c         = 3
$REST     = d:4, e:5, g:7, h:8


$(a, b, c, $LIST)

a           = 1
b           = undefined
c           = 3
$LIST       = [1, undefined, 3]


$(a, b, c, $options, $SPEC, $REST, $LIST, $ARGS)

a           = 1
b           = undefined
c           = 3
$options    = d:4, e:5, g:7, h:8
$SPEC       = args
$REST       = ()
$LIST       = [1, undefined, 3]
$ARGS       = args



$(a, b, c)  // $(d, e)

a         = 1
b         = undefined
c         = 3
arguments = (1, undefined, 3)


$(a, b, c, $options)  // $(d, e)

a         = 1
b         = undefined
c         = 3
$options  = d:4, e:5


$(a, b, c, $SPEC)  // $(d, e)
$(a, b, c, $ARGS)  // $(d, e)

a         = 1
b         = undefined
c         = 3
$SPEC     = args


$(a, b, c, $REST)  // $(d, e)

a         = 1
b         = undefined
c         = 3
$REST     = d:4, e:5, g:7, h:8


$(a, b, c, $LIST)  // $(d, e)

a           = 1
b           = undefined
c           = 3
$LIST       = [1, undefined, 3, 4, 5]


$(a, b, c, $options, $SPEC, $REST, $LIST, $ARGS)  // $(d, e)

a           = 1
b           = undefined
c           = 3
$options    = d:4, e:5
$SPEC       = args
$REST       = g:7, h:8
$LIST       = [1, undefined, 3, 4, 5]
$ARGS       = args



args <== a:1, c:3, d:4, e:5, g:7, h:8

$($options)
$($SPEC)
$($REST)
$($ARGS)
args

$($LIST)
undefined


$($options)  // $(a b c d_)
a:1, b:undefined, c:3, d:4

$($SPEC)     // $(a b c d)
$($REST)     // $(a b c d)
$($ARGS)     // $(a b c d)
args

$($LIST)     // $(a b c d)
[1, undefined, 3, 4]

$($options, $REST)  // $(a b c d)
options = a:1, b:undefined, c:3, d:4
rest    = e:5, g:7, h:8

$($LIST, $REST)  // $(a b c d)
options = [1, undefined, 3, 4]
rest    = e:5, g:7, h:8
