# be-formidable [TODO]

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

[TODO]

1.  Make noneOf, message derivable from other elements like the host.






Attaching this decorator / behavior results in overriding the checkValidity() method of the form element.

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