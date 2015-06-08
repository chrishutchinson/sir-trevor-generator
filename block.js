/**********************************
 * Base Sir Trevor Card Generator
 *
 * Author: Chris Hutchinson [chris.hutchinson@the-times.co.uk]
 **********************************/

var SirTrevorBlock = {
  config: false,
  type: null,
  title: null,
  attributes: {},
  components: {},
  icon: 'default',
  html: {
    drop: false,
    paste: false
  },
  pasteTarget: false,
  addedComponents: false,

  // Default blank paste callback
  pasteCallback: function(event, st) {},

  // Creates an element using jQuery
  createElement: function(name, component, value) {
    switch(component.type) {
      case 'text':
        var $element = $('<input>', {
          type: 'text',
          name: name,
          placeholder: component.placeholder,
          value: (value ? value : component.default),
          class: component.class,
        });
        break;
      case 'number':
        var $element = $('<input>', {
          type: 'number',
          name: name,
          min: component.min,
          max: component.max,
          step: component.step,
          placeholder: component.placeholder,
          value: (value ? value : component.default),
          class: component.class
        });
        break;
      case 'textarea':
        var $element = $('<div>', {
          contenteditable: true,
          class: 'st-required st-text-block st-formattable',
          name: name
        }).html((value ? value : component.default));
        break;
    }

    if(!_.isUndefined(component.callbacks)) {
      $.each(component.callbacks, function(eventName, callback) {
        $element.on(eventName, function(e) {
          callback(e, SirTrevor.getInstance());
        });
      });
    }

    return $element;
  },

  // Sets the title
  setTitle: function(title) {
    this.title = title;
  },

  // Sets the icon
  setIcon: function(icon) {
    this.icon = icon;
  },

  // Creates a pastable component
  setPastableComponent: function(name, component) {
    this.components[name] = component;
    this.attributes.pastable = {
      pasteTarget: name,
    };
    this.pasteTarget = name;

    component.class = 'st-block__paste-input st-paste-block';
    var $element = this.createElement(name, component);

    this.setHTML('paste', $element[0].outerHTML);
  },

  // Creates a regular component
  setComponent: function(name, component) {
    this.components[name] = component;
  },

  // Creates a list of components
  setComponents: function(components) {
    $.each(this.components, function(i, e) {
      this.components[i] = e;
    });
  },

  // Sets an attribute on the block
  setAttribute: function(attribute, target) {
    this.attributes[attribute] = {
      pasteTarget: (target ? target : false),
    };

    if(target) {
      this.pasteTarget = target;
    }
  },

  // Set the type for the block
  setType: function(type) {
    this.type = type;
  },

  // Set HTML for each attribute
  setHTML: function(type, html) {
    switch(type) {
      case 'drop':
        this.html.drop = html;
        break;
      case 'paste':
        this.html.paste = html;
        break;
    }
  },

  // Set the paste callback
  setPasteCallback: function(callback) {
    this.pasteCallback = callback;
  },

  // Build the block
  buildBlock: function() {
    var that = this;

    // Default config
    this.defaults = {
      type: this.type,
      title: this.title,
      icon_name: this.icon,
    };

    // Attributes
    if(that.attributes.pastable) {
      this.defaults.pastable = true;
      this.defaults.pasteCallback = that.pasteCallback;
    }
    if(that.attributes.droppable) {
      this.defaults.droppable = true;
    }
    if(that.attributes.formattable) {
      this.defaults.formattable = true;
    }

    // HTML
    if(that.html.paste) {
      this.defaults.paste_options = {
        html: that.html.paste, 
      };
    }

    // Block data
    this.block = SirTrevor.Block.extend(_.extend(this.defaults, {

      editorHTML: '<div><h2>' + this.title + '</h2><hr /></div>',
      
      loadData: function(data) {
        var st = this;

        if (typeof data === 'undefined') { data = {}; }

        $.each(that.components, function(i, e) {
          if(typeof data[i] === 'undefined') { data[i] = ''; }
        });

        this.addComponents(data, that.components);
      },

      addComponents: function(data, components) {
        var st = this;

        if(data[that.pasteTarget] !== '') {
          $.each(components, function(i, e) {
            var $elementWrapper = $('<div>', {
              class: 'st-element',
              style: 'margin-bottom: 10px;'
            });
            var $elementLabel = $('<label>').html(e.label);
            var $element = that.createElement(i, e, data[i]);

            if(e.type === 'textarea') {
              st.text_block = $element;
              st._initTextBlocks();
            }

            $elementWrapper.append($elementLabel).append($element)
            st.$editor.append($elementWrapper);
          });
        }
      },

      onBlockRender: function() {
        if(this.$editor[0].children.length == 0){
          this.loadData();
        } 
      },

      onContentPasted: function(event) {
        if(that.pasteTarget) {
          var setDataConfig = {};
          setDataConfig[that.pasteTarget] = event.target.value; 
          
          this.setAndLoadData(setDataConfig);

          this.pasteCallback(event, this);
        }
      },  
    }));

    return this.block;
  }
};