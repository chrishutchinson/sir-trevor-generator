var block = new SirTrevorBlock('oEmbed', 'oembed');

block.setAttribute('pastable')
      .setIcon('text')
      .setPastableComponent('oembed', {
          label: 'oEmbed',
          type: 'text',
          placeholder: 'Enter your embeddable URL here',
          default: null
        }, function(event, st) {
          // Create the anchor to convert to an embedded element
          var $anchor = $('<a>', {
            href: event.target.value,
            style: 'display: block;',
          });

          // Add the anchor
          st.$editor.find('[name="' + event.target.name + '"]').hide().after($anchor);

          // Convert to oEmbed
          $anchor.oembed();
        })
      .buildBlock();

// Setup the block
SirTrevor.Blocks.Oembed = block.block;