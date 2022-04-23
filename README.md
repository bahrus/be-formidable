# be-formidable

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

Attaching this decorator / behavior results in overriding the checkValidity() method of the form element.

It does not, however, call checkValidity, with the markup above.  To specify invoking checkValidity() during certain events, see below.

"problems" is an array of strings that is stored to formEl.beDecorated.formidable.problems.  It lists validation errors.  The array is also posted with event "formidable::problems-changed", emitted from the form element (no bubbles / composed).

## Specify querySelectorAll() to be checked [TODO]

```html
<form be-formidable='{
    "invalidIf":[
        {
            "noneOf": [[".my-form-element-group"]],
        }
    ]
}'>
    ...
</form>
```

So if string is inside square brackets, it is treated as a querySelectorAll() selector.  

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