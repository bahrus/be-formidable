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
</form>
```

Attaching this decorator / behavior results in overriding the checkValidity() method of the form element.

It does not, however, call checkValidity, with the markup above.  To specify invoking checkValidity() during certain events, see below.

"problems" is an array of strings that is stored to formEl.beDecorated.formidable.problems.  It lists validation errors.  The array is also posted with event "formidable::problems-changed", emitted from the form element (no bubbles / composed).



## Make noneOf, message derivable from other elements, like the host.[TODO]

## Specify to monitor for certain events.[TODO]

We can specify when to automatically call checkValidity:

```html
<form be-formidable='{
    "invalidIf":[
        {
            "noneOf": ["url", "file"],
            "message": "Select a url or a file"
        }
    ],
    "checkValidityOn": {
        "change": true,
        "submit": true
    }
}'>
<label>
    URL:
    <input name=url id=url type=url>
</label>
<label>
    File:
    <input name=file id=file type=file>
</form>
```

The name "checkValidityOn" is a dictionary of events to monitor.  The keys are the event names, the values are booleans.  If the value is true, the checkValidity() method is invoked on the form element when the event is fired.  The default is to monitor for "change" and "submit".

[Name and description above written by github autopilot].









## Unfortunate headwinds

Unfortunately, the platform does not yet support specifying a custom validation function for a form element.

This means that:

1.  The developer needs to invoke checkValidity() by strategically adding event listeners.
2.  the :valid and :invalid psudo-classes are not adjusted as needed.

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