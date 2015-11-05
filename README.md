# Sir Trevor JS block generator

## Build by Chris Hutchinson, 2015

An early, *early* pass at building a simple Sir Trevor JS block builder

## Installation

Install via Bower by running:
    
    bower install sir-trevor-generator --save

Include `block.js` into your project to be able to create blocks using this library.

Install via `npm` by running:
    
    npm install sir-trevor-generator --save

This library supports the require syntax in CommonJS: `var SirTrevorBlock = require('sir-trevor-generator');`

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