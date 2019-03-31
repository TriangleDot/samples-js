Samples.js
==========
Introduction
-------------------
4 main points to understant of Sample.js:

 * Samples.js is not a javascript framework.
 * Samples.js is an extension of the HTML DOM to make your life easier.
 * Samples.js does not work on it's own; **DOM knowledge is requires**
 * ES2015 is used *EVERYWHERE*

How it works
------------------
### Basics:
To start out, you have to make a sample.
A Sample is like your own HTML tag. You can use it straight in your HTML, like this
```html
<my-sample></my-sample>
```
Or create one in JS, like this
```javascript
var a = new MySample();
document.body.addChild(a);
```
All samples are user defined.
To create one, you just need to create a class extending the Sample class from Samples.js
```javascript
class MySample extends Sample {
```
Next, you need a constructor
```javascript
	constructor () {
```
Now, you start to actually use Samples.js.
In your constructor, you will have to call the ``` super(template) ``` command.
The ```template``` argument of the super defines HTML that every Sample of that type will have. 
For example, if this is my Sample:
```javascript
class MySample extends Sample {
	constructor() {
		super("<p> Hello World!</p>");
	}
}
register("my-sample",MySample);
```
In my HTML, you would see:
```html
<my-sample><p>Hello World</p></my-sample>
```

You may have noticed the ```register``` command.
All it does is tells Sample.js the name of your sample, and it's class.
The name you register it with will be the name that's used in your HTML
**Note: Due to HTML specs, ALL Samples must have a "-" charactor in their name**

### Templates

So far, all we've done is made a tag containing static HTML. That isn't too useful.

Fortunatly, there's more!
Similar to frameworks like Vue.js, Samples supports variables in templates.

This works very simply. All you have to do is put ```{{Variable_name_goes_here}}``` into your template.
For example, my template could be 
```html
<p>Hi! My name is {{name}}</p>
```
Then from the samples's JS, I can change ```{{name}}```'s value, like so
```javascript
this.setVar("name","Bob");
```
But, setVar cannot be called from a Sample's constructor.
So, with Samples.js, all your smarts shoudl go in the ```init()``` function
Example:
```javascript
class MySample extends Sample {
	constructor() {
		super("<p>Hi! My name is {{name}}</p>");
	}
	init () {
		this.setVar("name","Joe");
	}
}
register("my-sample",MySample);
```
In the HTML, you would see:
```html
<my-sample><p>Hi! My name is Joe</p></my-sample>
```
```setVar``` can be called from anywhere, including from outside the Sample's own code.

```setVar``` can also be used for other uses like attriubutes:
Template: 
```html
<button onclick="{{callback}}">Click me!</button>
```
Code:
```javascript
this.setVar("callback","console.log('clicked')");
```
Yes, events work through the variable system.

```setVar``` for classes:
Template: 
```html
<button class="{{classes}}" onclick="this.parentElement.toggle" >Click me!</button>
```
Code:
```javascript

	init () {
		this.toggles = false;
		this.setVar("classes",["not_clicked"]);
	}
	toggle() {
		if (this.toggles == false) {
			this.setVar("classes",["clicked"]);	
		}
		else {
			this.setVar("classes",["not_clicked"])
		}
		this.toggles = !this.toggles;
	}

```

Styles work the same way, only they take an object, not a list.

### Slots
Slots let you input data from the tag's normal HTML into the template.

For example:
Template:
```html
<p><button><slot></slot></button></p>
```
Web page HTML (before run)
```html
<my-button>Test</my-button>
```
Web page HTML (after run)
```html
<my-button><p><button><slot>Test</slot></button></p></my-button>
```
As you can see, the HTML in the tag from the Web page (before run) got moved to the ``` <slot></slot>``` tag in the template.

You can also redirect differnet bits of HTML to different slot tags by using the insert tag. Example:
Web page HTML (before run)
```html
<my-button>
	<insert place="before">before</insert>
	Test
	<insert place="after">after</insert>
</my-button>

```
Template:
```html
<slot place="before"></slot>
<button>
	<slot></slot>
</button>
<slot place="after"></slot>
```

All the code from the insert tags will move to their matching slot tag with the same place

All of the code that's not in an insert tag will be moved to the normal slot tag.

Notes
--------
Samples.js is based on open web standards like custom elements, which do not have great browser support. It currently supports the newest versions of all major browsers, but may not work on older releases. 
Today, (2019-03-2), 83% of active web users support Samples.js