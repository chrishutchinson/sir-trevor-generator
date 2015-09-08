// Initialise the block
var block = new SirTrevorBlock('Some Block', 'someblock');

// Setup all attributes, icons, properties and components
block.setAttribute('droppable')
      .setAttribute('uploadable')
      .setIcon('text')
      .setProperty('minimisable')
      .setUploadableComponent('image', {
        label: 'Image',
        default: null
      }, function(event, st) {
        console.log(event, st);
      })
      .setComponent('size', {
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
      })
      .setComponent('textarea', {
        label: 'Text!',
        type: 'textarea',
      })
      .setComponent('checkbox', {
        label: 'Checkbox',
        type: 'checkbox'
      });

// Build our block
block.buildBlock('Someblock');

// Add the block to Sir Trevor
SirTrevor.Blocks.Someblock = block.block;
