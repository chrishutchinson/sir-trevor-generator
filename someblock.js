// Initialise the block
var someBlock = SirTrevorBlock;

// Set the title
someBlock.setTitle('Some Block');

// Set the type
someBlock.setType('someblock');

// Set any attributes
someBlock.setAttribute('pastable');
//someBlock.setAttribute('droppable');
//someBlock.setAttribute('formattable');

// Set the icon
someBlock.setIcon('text');

// Add some components
someBlock.setPastableComponent('video', {
  label: 'YouTube Video',
  type: 'text',
  placeholder: 'Enter your YouTube URL here',
  default: null
}, function(event, st) {
  var $anchor = $('<a>', {
    href: event.target.value,
    style: 'display: block;',
  });
  st.$editor.find('[name="' + event.target.name + '"]').hide().after($anchor);
  $anchor.oembed();
});

someBlock.setComponent('size', {
  label: 'Size',
  type: 'number',
  placeholder: 'Enter the size here',
  min: 0,
  max: 10,
  step: 0.1,
  default: 5.5,
  callbacks: {
    keyup: function(e, st) {
      console.log('keyup', e, st);
    },
    click: function(e, st) {
      console.log('clicky', e, st);
    }
  }
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