// Initialise the block
//var someBlock = SirTrevorBlock;

// Set the title
//someBlock.setTitle('Some Block');

// Set the type
//someBlock.setType('someblock');

// Set any attributes
//someBlock.setAttribute('pastable');
//someBlock.setAttribute('droppable');
//someBlock.setAttribute('uploadable');
//someBlock.setAttribute('formattable');

// Set the icon
//someBlock.setIcon('text');

// Add some components
/*someBlock.setPastableComponent('video', {
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
});*/
var block = SirTrevorBlock.setTitle('Some Block')
                      .setType('someblock')
                      .setAttribute('droppable')
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
                      .buildBlock('Someblock');

// Setup the block
SirTrevor.Blocks.Someblock = block.block;