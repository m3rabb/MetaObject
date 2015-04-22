In programming, it's crucial to be able to tell whether or not two things are equivalent.  However determining whether two entities are _the same_ or not can be surprisingly challenging.  JavaScript does have two equality operators: ```===``` and ```==```.  The

Given its fundamental importance, one might be surprised that JavaScript doesn't have a built in equality method, i.e. ```isEqual()```  


This article will discuss the challenges in implementing such a function

JavaScript does ha

Equality is a surprisingly tricky concept in programming.  


JavaScript

Equality is usually type dependent, and is frequently context dependent

Righting proper equality functions can be challenging.  And because it is challenging, it make it all the more useful it programming languages provided a robust value and structural equality methods.

The method would serve as default approaches to equality.  While they might not always meet one's requirement for equality, they would however be robust in that they wouldn't go into infinite loops when asked to compare self referential, cyclic or or mutually referential objects.

In the Top framework for JavaScript, I've provided exactly this functionality in supporting general purpose equality.

In the following discussion, I will explain step by step how one can implement general purpose object equality.  While the discussion is bias towards JavaScript, the principals are applicable to implement general purpose equality in other languages as well.

As mentioned earlier, the simplest form or equality is identity.  Two object references are only considered equal if they refer to exactly the same objects.
