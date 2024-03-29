# be-formidable

[![Playwright Tests](https://github.com/bahrus/be-formidable/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-formidable/actions/workflows/CI.yml)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-formidable?style=for-the-badge)](https://bundlephobia.com/result?p=be-formidable)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-formidable?compression=gzip">
[![NPM version](https://badge.fury.io/js/be-formidable.png)](http://badge.fury.io/js/be-formidable)

[![None Shall Pass](https://i.imgflip.com/2mj99q.jpg)](https://imgflip.com/tag/monty+python+black+knight)

Add additional validations on the form element, beyond those that can be specified on an individual field level.

```html
<form be-formidable='{
    "invalidIf":[
        {
            "noneOf": ["url", "file"],
            "instructions": "Please Select a url or a file",
            "invalidMessage": "No url or file selected"

        }
    ]
}'>
    <label>
        URL:
        <input name=url id=url type=url>
    </label>
    <label>
        File:
        <input name=file id=file type=file>
    </label>
</form>
```

Attaching this enhancement / behavior results in overriding the checkValidity() method of the form element.  Calls to checkValidity has the added side-effect of modifying a class on the form element, as well as posting messages in a few places.

The markup above does not, however, *automatically call* checkValidity.  To specify invoking checkValidity() during certain events, skip down several sections below.

## Why two negatives?

It could be argued that validOnlyIf/oneOf is clearer than invalidIf/noneOf.  Here's why:

This component prefers the "innocent until proven guilty" way of thinking, because it feels a bit truer to what it is actually doing, and may more effectively alert the developer to the fact that the form will be considered valid until the be-formidable behavior / enhancement is attached.  Before then, it might be prudent to hide/disable any submit buttons, or even hide or obscure the entire form.

## JSON-in-html?

Editing JSON-in-html can be rather error prone.  A [VS Code extension](https://marketplace.visualstudio.com/items?itemName=andersonbruceb.json-in-html) is available to help with that, and is compatible with web versions of VSCode.

And in practice, it is also quite ergonomic to edit these types of attributes in a *.mjs file that executes in (no)de(no) as the file changes, and compiles to an html file via the [may-it-be](https://github.com/bahrus/may-it-be) compiler, for example.  This allows the attributes to be editable with JS-like syntax.  Typescript 4.6 supports compiling mts to mjs files, which then allows typing of the attributes.  Examples of this in practice are:

1.  [xtal-side-nav](https://github.com/bahrus/xtal-side-nav)
2.  [xtal-editor](https://github.com/bahrus/xtal-editor)
3.  [cotus](https://github.com/bahrus/cotus)

## Specifying property to check for truthiness

By default, the "value" property is what is used on the element when it is checked for truthiness.

To specify an alternative property to check:

```html
<form be-formidable='{
    "invalidIf":[
        {
            "noneOf": ["keysInPocket.checked", "havePhone.checked"],
            "instructions": "Please take your keys, or at least a phone to call for a locksmith.",
            "invalidMessage": "Not ready to go out."
        }
    ]
}'>
   <input name=keysInPocket id=keysInPocket type=checkbox>
    <label for=keysInPocket>I have keys in my pocket</label>
    <input name=havePhone id=havePhone type=checkbox>
    <label for=havePhone>I have a phone</label>
</form>
```

<!--
Sub object checking is also allowed in the case of multiple "."'s.

Is there a use case for this
 -->


So this syntax is not compatible with form elements that use "." in the name.  If encountering a scenario where "." may be in the name, we need to be a bit more verbose:

```html
<form be-formidable='{
    "invalidIf":[
        {
            "noneOf": [
                {
                    "name": "keys.in.pocket",
                    "prop": "checked"
                 },
                 {
                     "name": "have.phone",
                     "prop": "checked"
                 }
            ],
            "instructions": "Please take your keys, or at least a phone to call for a locksmith.",
            "invalidMessage": "Not ready to go out."
        }
    ]
}'>
   ...
</form>
```

## Other validation criteria [Untested]

The rules so far have essentially been providing support for the "required" attribute, but for groups of form elements.  But there are other validations that form fields support (min, max, pattern, etc).  

Support for such criteria is provided. For example with min:

```html
<form be-formidable='{
    "invalidIf":[
        {
            "noneOf": [
                {
                    "name": "firstCustomer Age",
                    "min": 17,
                },
                {
                    "name": "secondCustomer Age",
                    "min": 17,
                },
                {
                    "name": "thirdCustomer Age",
                    "min": 17,
                },
            ],
            "instructions": "No one under the age of 17 is permitted to watch this movie without being accompanied by an adult or guardian"
        }
    ]
}'>
   ...
</form>
```

NotEquals

```html
<form be-formidable='{
    "validOnlyIf":[
        {
            "atLeastOneOf": [
                {
                    "name": "firstCustomer Age",
                    "min": 17,
                },
                {
                    "name": "secondCustomer Age",
                    "min": 17,
                },
                {
                    "name": "thirdCustomer Age",
                    "min": 17,
                },
            ],
            "equals": [
                {
                    "name": "hiddenCalculatedField"
                },
                {
                    "name": "payment"
                }
            ]
            "instructions": "No one under the age of 17 is permitted to watch this movie without being accompanied by an adult or guardian"
        }
    ]
}'>
   ...
</form>
```



## Specify querySelectorAll() for the elements to be checked

```html
<form be-formidable='{
    "invalidIf":[
        {
            "noneOf": [{
                "find": ".my-form-element-group", 
                "prop": "checked"
            }],
        }
    ]
}'>
    ...
</form>
```


## Side effect of calling checkValidity()


"objections" is an array of strings that is stored at location formElement.beEnhanced.beFormidable.objections.  It lists validation errors.  

## Specify to monitor for certain events.

As mentioned in the beginning, the examples so far do **not** result in automatically calling checkValidity (except, by default as soon as the behavior is attached), so nothing will actually happen unless some other script is invoking checkValidity.

We can specify when to automatically call checkValidity.

Simplest:

```html
<form be-formidable='{
    "invalidIf":[
        {
            "noneOf": ["url", "file"],
            "message": "Select a url or a file"
        }
    ],
    "checkValidityOn": "input"
}'>
    ...
</form>
```

If multiple events / optional settings are required:

```html
<form be-formidable='{
    "invalidIf":[
        {
            "noneOf": ["url", "file"],
            "message": "Select a url or a file"
        }
    ],
    "checkValidityOn": [
        "input", 
        {
            "type": "change",
            "options": {
                "capture": true
            }
        }
    ]
}'>
    ...
</form>
```


## Unfortunate headwinds

Unfortunately, the platform does not yet support specifying a custom validation function for a form element.

This means that the :valid and :invalid pseudo-classes are not adjusted as needed.

The be-formidable enhancement does set "valid" or "invalid" classes during the checkValidity() calls.

Suggested CSS:

```html
<style>
    form:invalid, form.be-formidable.invalid {
        border: 5px solid red;
    }
    form:valid, form.be-formidable.valid {
        border: 5px solid green;
    }
</style>
```

## Viewing Locally

Any web server that serves static files will do but...

1.  Install git.
2.  Fork/clone this repo.
3.  Install node.
4.  Open command window to folder where you cloned this repo.
5.  > npm install
6.  > npm run serve
7.  Open http://localhost:3030/demo in a modern browser.

## Importing in ES Modules:

```JavaScript
import 'be-formidable/be-formidable.js';

```

## Using from CDN:

```html
<script type=module crossorigin=anonymous>
    import 'https://esm.run/be-formidable';
</script>
```

