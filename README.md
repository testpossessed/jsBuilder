### jsBuilder
A utility library for creating test JavaScript objects inspired by [NBuilder](https://github.com/garethdown44/nbuilder/) my preferred .NET test data builder.

Building complex or multiple object literals to test your JavaScript component can be tedious.  Copy and paste can help, but it is still tedious, and my experience is often a barrier to adopting TDD for some developers.

You can use the builder pattern to avoid repetition, but even though this helps you practice the DRY principle creating the builder can be tedious, albeit only once.

Using some soft of builder can make test code much more readable and expressive, which is always a good thing.  Whether you are building test data inline with tests or creating custom builders I believe jsBuilder can help you do so quickly and cleanly.

#### Installing

jsBuilder is designed to work in browsers with or without RequireJS or with Node.js.  It hasn't been fully tested with RequireJS as I don't use it myself, but I hope to do more testing with it at some point.

Install with npm.  Please note the name is different as there was already a jsbuilder module registered with npm
```
npm install jsbuilder-node --save-dev
```

Install with bower
```
bower install jsBuilder --save-dev
```

Install with NuGet

To install with NuGet search for jsBuilder or use Package Manager Console to execute
```
Install-Package jsBuilder
```

#### Usage

With jsBuilder you can create single objects or collections (arrays) of objects, you can use an object as a template or you can just use the fluent API to build your objects.

To start building objects you first need a reference to the factory object.

In a browser it is made available as **builder** in the global space aka **window.builder**

In Node a new instance is exported by the modules so you use something like

```javascript
var builder = require('jsbuilder-node');
```

If you are using RequireJS you will declare a dependency something like this

```javascript
define(['jsBuilder'], function(builder){
});
```

Once you have the factory you can use the **create** method to get instances of SingleObjectBuilder or CollectionBuilder.  Both types of builder support fluent usage, all methods except one return the builder to support chaining.

```javascript
// to get a SingleObjectBuilder
var mySob = builder.create();
// or
var mySob = builder.create(1);

// to get a CollectionBuilder
var myCb = builder.create(3);

```

##### Templates
The **create** method of the factory also supports passing a template, not so useful for a single object but invaluable for creating a collection of objects based on an "interface"

A template is a JavaScript object with members that all built objects should have and either a type specifier or a value generator function for each member.

The supported member type specifiers are provided in an "enum" object, but if you prefer you can simply use the equivalent string the enum provides

```javascript
builder.MemberType.String // defined as 'string'
builder.MemberType.Number // defined as 'number'
builder.MemberType.Date // defined as 'date'
```

If one of the supported type specifiers is used builders will generate predictable values as follows:

String: member name + sequence number e.g. {name: 'name 1'}, {name: 'name 2'}
Number: squence number e.g. {id: 1}, {id: 2}
Date: new Date()

For anything else you provide a generator function defined with the follow signature.

```javascript
var generator = function(seq)
{
	return // anything you like
}
```
Generators can be pre-defined or anonymous functions.

The template is passed as the first argument to **builder.create**.  The number of objects to be built can still be specified following the template

```javascript
var template = {
	id: builder.MemberType.Number,
	name: builder.MemberType.String,
	age: function(seq){
		return seq * 15;
	}	
}

var myCb = builder.create(template, 5);
```

#### Generation
To initiate the generation of your test objects you simply call the **build** method of a builder.  You will typically use method chaining, which is more expressive, but you are not forced to.

```javascript
// this
var myCollection = builder.create(template, 5).build();

// is equivalent to

var myBuilder = builder.create(template, 5);
var myCollection = myBuilder.build();

// both return the following collection of objects

[{id: 1, name: 'name 1', age: 15},
{id: 2, name: 'name 2', age: 30},
{id: 3, name: 'name 3', age: 45},
{id: 4, name: 'name 4', age: 60},
{id: 5, name: 'name 5', age: 75}]
```

#### Fluent Building
Templates are great when you want a number of similar objects generated and don't care too much what the values are, or when you want to re-use a single object builder to generate objects with a minor differences.
However there are times when you want something more than a simple set of sequentially generated objects, this is where the fluent building API comes in handy.

Both types of builder implement a **with** method that can be used to define or override the template for a single member of generated objects.  The following example shows how to fluently produce the same result as above.

```javascript
var myCollection = builder.create(5)
				.with('id', builder.MemberType.Number)
				.with('name', builder.MemberType.String)
				.with('age', function(seq){return seq * 15;})
				.build();
```

Personally I find this more expressive and readable than the template example.

Ok you say, so this is all well and good, but sometimes I want a collection of objects with a more complicated setup.
Maybe I want the first couple of objects to have one set of values, then the next three something different and the last few with yet another set of values.

And I say, no problem jsBuilder can help you there with its **theFirst**, **theNext**, **theLast** and **theRemainder** methods.
These methods can all be used in conjunction with a template to setup the base requirements of generated objects and only override specific members.  I will present each of these methods and their affect, then provide a complex example that shows them off.

###### theFirst
Sets the context of the builder to the first *n* objects generated.
Subsequent calls to **with** affect only the first specified subset of objects in the collection.  Each time it is called it overrides any previous specification for the first *n* objects.

###### theNext
Sets the context of the builder to the next *n* objects generated.
An error will be thrown if **theNext** is used without first using **theFirst** or the specified number combined with previous numbers exceeds the specified size of the collection.
It can be called multiple times and each subset starts after the preceding first *n* or next *n* subset.

##### theLast
Sets the context of the builder to the last *n* objects generated.
You can use **theLast** on its own but if you have used **theFirst** with or without **theNext** it will throw an error if the combined total of items specified exceeds the size of the collection.

##### theRemainder
Sets the context of the builder to the objects that are not covered by any of the **theXXXX** *n* methods.
Internally this is the context you start with so it is not essential to use it, you would get the same effect by calling **with** on the builder before any of the **theXXXX** *n* methods but it can help in explicitly expressing intent.

```javascript
var myCollection = builder.create(10)
				.with('id', builder.MemberType.Number)
				.with('name', builder.MemberType.String)
				.with('age', function(seq){return seq * 5;})
				.theFirst(2)
				.with('age', function(){return 20;})
				.theNext(2)
				.with('age', function(){return 25;})
				.theNext(2)
				.with('age', function(){return 23;})
				.theLast()
				.with('age', function(){return 50;})
				.build();
				
// generates the following collection

[{id: 1, name: 'name 1', age: 20},
{id: 2, name: 'name 2', age: 20},
{id: 3, name: 'name 3', age: 25},
{id: 4, name: 'name 4', age: 25},
{id: 5, name: 'name 5', age: 23},
{id: 6, name: 'name 6', age: 23},
{id: 7, name: 'name 7', age: 35},
{id: 8, name: 'name 8', age: 40},
{id: 9, name: 'name 9', age: 45},
{id: 10, name: 'name 10', age: 50}]
```

Note in the above example no value is specified for *n* in the call to **theLast**.  All of the methods assume 1 if no explicit value is specified.

Ok you say, this is all well and good, but!! sometimes I need to build really complex object graphs with members that are collections or complex objects.

And I say, no problem you can "nest" builders to create objects as complex as you like

#### Nested Builders
jsBuilder doesn't do templates within templates (uugghh!! how ugly would that be) but you can still generate complex objects with deep hierarchies using the generator functions.
I took the decision early on that I would only support automatic generation of primitive members, for anything else including fixed values you need to use generator functions.
This keeps jsBuilder fairly simple but gives you the flexibility to do pretty much anything you want.

Here is an example of a using "nesting" to create a simple object with a collection member taken directly from the jsBuilder tests

```javascript
var actual = builder.create()
            .with('id', builder.MemberType.Number)
            .with('name', builder.MemberType.String)
            .with('children', function () {
                return builder.create(3)
                    .with('id', builder.MemberType.Number)
                    .with('name', builder.MemberType.String)
                    .build()
            }).build();

var expected = {
    id: 1,
    name: 'name 1',
    children: [
        {
            id: 1,
            name: 'name 1'
        },
        {
            id: 2,
            name: 'name 2'
        },
        {
            id: 3,
            name: 'name 3'
        }
    ]
}

expect(actual).toEqual(expected);
expect(actual.children).toBeDefined();
expect(actual.children).toEqual(expected.children);
```

That's it for now, as always if you have any constructive comments or questions please feel free to post an Issue in this repo and I will deal with it as soon as I can.

For more examples browse the tests in the specs folder of the source.





