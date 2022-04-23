# be-formidable [TODO]

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

## Specifying property to check for truthiness [TODO]

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
   ...
</form>
```

Sub object checking is also allowed in the case of multiple "."'s.

So this web component is not compatible with form elements that use . in the name.  If encountering a scenario where . may be in the name, we need to be a bit more verbose:

```html
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
            "instructions": "Not ready to go out."
        }
    ]
}'>
   ...
</form>
```
```

## Other validation criteria [TODO]

The rules so far are strongly analogous to the "required" attribute of form fields.  But there are other validation thats form fields support (min, max, pattern, etc).  

To specify such criteria, for example with min:



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

## Side effect of not validating


"objections" is an array of strings that is stored at location formEl.beDecorated.formidable.objections.  It lists validation errors.  The array is also posted with event "formidable::objections-changed", emitted from the form element (no bubbles / composed). [TODO]

## Specify querySelectorAll() to be checked [TODO]

```html
<form be-formidable='{
    "invalidIf":[
        {
            "noneOf": [[".my-form-element-group", "checked"]],
        }
    ]
}'>
    ...
</form>
```

So if rather than a string, or an object, we have an array, the first element of the array is expected to be a string, to use in a querySelectorAll() selector within the form element.  The second optional value is the property to check for truthiness.  If not specified, the property is assumed to be "value".  The first element of the array can also be an object (for reasons stated above, like needing to specify a min value), in which case the second element is ignored (as it is specified via the "prop" field).  So the syntax above is shorthand for:

```html
<form be-formidable='{
    "invalidIf":[
        {
            "noneOf": [{
                "find": ".my-form-element-group", "prop": "checked"
            }],
        }
    ]
}'>
    ...
</form>
```

## Specify to monitor for certain events.[TODO]

As mentioned in the beginning, the examples so far do **not** result in automatically calling checkValidity.

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

Most Complex:

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