# Sir Trevor JS block generator

## Built by Chris Hutchinson, 2016

A simple programmatic block builder for [Sir Trevor JS](http://www.github.com/madebymany/sir-trevor-js).


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
- Files
- Select
- Tables (uses [Handsontable](http://handsontable.com/))
- Checkboxes
- Repeaters


### Callbacks

Most fields also support custom callbacks such as the following:
- On paste
- On click
- On keyup

You can define your own callback functions to allow these fields to interact with Sir Trevor JS.

**Callbacks are experimental at the moment, and haven't been tested thoroughly**


### Examples

See the `/examples` folder for a range of example blocks.


### Version History

**1.0.4 (1 December, 2016)**

- Ensure searchable <select>s work in repeaters

**1.0.3 (1 December, 2016)**

- Pass the element object through to each callback object
- Add the editor object to the element

**1.0.2 (21 April, 2016)**

- Add support for a new `.hideIcon()` method to hide the icon in the edit toolbar

**1.0.1 (21 April, 2016)**

- Fixes an issue with rich textarea fields, where sometimes `&nbsp;` characters were appearing in the output instead of spaces

**1.0.0 (21 April, 2016)**

- Adds support for searchable selects via the Select2 Library
- I decided to bump the version to 1.0.0 as it's had a bunch of features added over the past few months, and 1.0.0 sounds better
- _Be glad I didn't do a Facebook and make it version 11.0.0_

**0.0.10 (1 March, 2016)**

- Ensures required asterisks show on repeater fields

**0.0.9 (18 February, 2016)**

- Adds a required asterisk after labels on required fields

**0.0.8 (4 February, 2016)**

- Change support for required property and nullable property on select components

**0.0.7 (11 December, 2015)**

- Fixes an issue with <br> tags in inline rich text areas

**0.0.6 (11 December, 2015)**

- Fixes issue with Markdown formatting in rich text areas
- Fixes issue with stray <p> tags in inline rich text areas

**0.0.5 (10 December, 2015)**

- Adds support for richer callbacks, making that functionality more powerful

**0.0.4 (10 December, 2015)**

- Fixes an issue loading in empty Handlebars data
- Updates to README.md

**0.0.3 (09 December, 2015)**

- Adds support for non block level elements in textareas (uses `<br />` tags instead of `<p>` tags)

**0.0.2**

- Improvements to media and rich text fields
- Many enhancements I've since forgotten, check the GitHub commit logs

**0.0.1**

- Initial release