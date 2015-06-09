# Sir Trevor JS block generator

## Build by Chris Hutchinson, 2015

An early, *early* pass at building a simple Sir Trevor JS block builder

### Currently supported fields

- Text
- Textarea
- Number 
- Files (uploadable)

### Callbacks

Most fields also support custom callbacks such as the following:
- On paste
- On click
- On keyup

You can define your own callback functions to allow these fields to interact with Sir Trevor JS.

### Example

See `someblock.js` and `oembed.js` as examples, although, they've not been thoroughly tested at present.