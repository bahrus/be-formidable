# be-formidable [TODO]

[![None Shall Pass](https://i.imgflip.com/2mj99q.jpg)](https://imgflip.com/tag/monty+python+black+knight)

Add additional validations on form element beyond those that can be specified on an individual field level.

```html
<form be-formidable='{
    "invalidIf":[
        {
            "noneOf": ["url", "file"],
            "message": "Select a url or a file"
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

## Specifying property to check for truthiness

```html
<form be-formidable='{
    "invalidIf":[
        {
            "noneOf": ["keysInPocket.checked", "havePhone.checked"],
            "message": "Not ready to go out."
        }
    ]
}'>
   ...
</form>
```

Attaching this decorator / behavior results in overriding the checkValidity() method of the form element.  Calls to checkValidity has the added side-effect of modifying a class on the form element, as well as posting messages in a few places.

The markup above does not, however, *automatically call* checkValidity.  To specify invoking checkValidity() during certain events, see below.

"objections" is an array of strings that is stored to formEl.beDecorated.formidable.objections.  It lists validation errors.  The array is also posted with event "formidable::objections-changed", emitted from the form element (no bubbles / composed). [TODO]

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

So if rather than a string, we have an array, the first element of the array is expected to a string, to use in a querySelectorAll() selector within the form element.  The second optional value is the property to check for truthiness.  If not specified, the property is assumed to be "value".  

## Specify to monitor for certain events.[TODO]

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

## Make noneOf, message derivable from other elements, like the host.[TODO]

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