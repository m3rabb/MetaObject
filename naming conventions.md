# A case for Morabbian naming conventions

As rule, I'm strongly biased towards message passing between objects.  I avoid direct access of instance variables (ivars), even within the methods of an object.  While direct access of instance variables is fastest, it limits flexibility and maintainability as it exposes an object's implementation.  Best practices demand the separation of interface from implementation.  Being disciplined and only interacting with an object via is methods as a rule is worth whatever performance expense it entails.  After testing and profiling, the few exceptions can be handled.  Restricting ourselves to using messages to access object state not only protects the implementation, but provides advantages for testing, notification, and other extended functionality.  The high value I've placed on preserving encapsulation, and separation of implementation from interface has motivated the following naming conventions.

By default, all the properties of JS objects are publicly accessible.  While closures can be used to enforce privacy, a common convention to indicate a private property is to prepend an underscore to the property name.  While this does nothing to ensure encapsulation, it provides a strong visual clue, that a property is off limits.

Not only do we need ivars to be private, we also need to be able to define private methods.  No avoid improperly accessing ivars, and avoid accessing private methods and failing to call them correctly, itself useful to have a naming convention that distinguishs ivars, from methods.

While, the importance of protecting the separation of interface from implemtation is critical, nonetheless there are occasions where it's useful for objects to have publicly available non-method properties.  Likewise, it's extremely helpful to be able to distinguish such properties from the others.  These needs and values have led me to the following naming conventions for JS.

Property Type       Public       Private
method              lowerCamel   _lowerCamel
non-method          UpperCamel   _UpperCamel




Mike Merchant
National Writing Project
The Illinois wiritng project has been nacent
connected learning intitiative -- thru DePaul

The Chicago Summer of learning
Digital badges -- 21st century assessment -- connective learning
reimaging education and learning -- get credit fo education outsite of schools
portable and transferable
Mozilla/ThoughtWorks
2013

brenda wilkerson --> Computer science/IT at CPS
she would know how to get this in front
encam
txt@ brenda wilkerson

HS students --> CPS
13 -->  
FERPA
18 years -->

Oct-->
Wheaton -->








## Coding Conventions
### js
* properties
    * publicMethod
    * _privateMethod
    * _PrivateVar
    * _OptionalPrivateVar_
    * PublicSubproperty  -- with new cover model, perhaps not
* variable
  * parameter/localVar
  * ClosuredParameters/ClosuredLocalVar
    * optionalParam_
    * additionalOptionalParam__
    * pairedAdditionalOptionalParam__
  * _paySpecialAttentionToThisVar
  * _PaySpecialAttentionToThisVar
  * CONST_REF

### angular specific
* angular directives
  * [prefix directives with data- for valid html](http://stackoverflow.com/questions/16184428/what-is-the-difference-between-ng-app-and-data-ng-app)

## Coding methodology
The structure below shows the intended structure of each instance of each class.
Whenever possible direct access to instance properties should be avoided, and instead,
properties should be accessed, and behaviors initiated via method calls.
