# be-formidable

[![Playwright Tests](https://github.com/bahrus/be-formidable/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-formidable/actions/workflows/CI.yml)

[![None Shall Pass](https://i.imgflip.com/2mj99q.jpg)](https://imgflip.com/tag/monty+python+black+knight)

Add additional validations on form element beyond those that can be specified on an individual field level.

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

Attaching this decorator / behavior results in overriding the checkValidity() method of the form element.  Calls to checkValidity has the added side-effect of modifying a class on the form element, as well as posting messages in a few places.

The markup above does not, however, *automatically call* checkValidity.  To specify invoking checkValidity() during certain events, skip down several sections below.

## Why two negatives?

It could be argued that validOnlyIf/oneOf is clearer than invalidIf/noneOf.  But this component prefers the "innocent until proven guilty" way of thinking.

## Naming

If we need our HTML to be HTML5 compliant, we should probably prefix be- with data-.  That is supported.

The ending -formidable is configurable also, within each ShadowDOM realm.

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


So this web component is not compatible with form elements that use . in the name.  If encountering a scenario where . may be in the name, we need to be a bit more verbose:

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

## Support for cancelling previous calls [TODO]

## Support for debouncing [TODO]]

## Other validation criteria [TODO]

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


"objections" is an array of strings that is stored at location formElement.beDecorated.formidable.objections.  It lists validation errors.  The array is also posted with event "formidable::objections-changed", emitted from the form element (no bubbles / composed). 

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

The be-formidable decorator does set "valid" or "invalid" classes during the checkValidity() calls.

Suggested CSS:

```html
<style>
    form:invalid, form[is-formidable].invalid {
        border: 5px solid red;
    }
    form:valid, form[is-formidable].valid {
        border: 5px solid green;
    }
</style>
```