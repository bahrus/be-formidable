# be-formidable

Add additional validations on form element beyond those that can be specified on an individual field level.

```html
<form be-formidable='{
    "invalidIf":{
        "noneOf": ["url", "file"]
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