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


