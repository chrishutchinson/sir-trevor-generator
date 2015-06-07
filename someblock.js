// Initialise the block
var someBlock = SirTrevorBlock;

// Set the title
someBlock.setTitle('Some Block');

// Set the type
someBlock.setType('someblock');

// Set any attributes
//someBlock.setAttribute('pastable');
//someBlock.setAttribute('droppable');
someBlock.setAttribute('formattable');

// Set the icon
someBlock.setIcon('text');

// Add some components
someBlock.setComponent('url', {
  label: 'URL',
  type: 'text',
  placeholder: 'Enter your URL here',
  default: null,
});
someBlock.setComponent('size', {
  label: 'Size',
  type: 'number',
  placeholder: 'Enter the size here',
  min: 0,
  max: 10,
  step: 0.1,
  default: 5.5,
});
someBlock.setComponent('textarea', {
  label: 'Text!',
  type: 'textarea',
});
someBlock.setComponent('textarea2', {
  label: 'Text 2!',
  type: 'textarea',
});

// Grab the config
var blockData = someBlock.buildBlock('Someblock');

// Setup the block
SirTrevor.Blocks.Someblock = blockData;