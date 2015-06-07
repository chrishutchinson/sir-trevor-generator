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

  setTitle: function(title) {
    this.title = title;
  },

  setIcon: function(icon) {
    this.icon = icon;
  },

  setComponent: function(name, component) {
    this.components[name] = component;
  },

  setComponents: function(components) {
    $.each(this.components, function(i, e) {
      this.components[i] = e;
    });
  },

  setAttribute: function(attribute, target) {
    this.attributes[attribute] = {
      pasteTarget: (target ? target : false),
    };

    if(target) {
      this.pasteTarget = target;
    }
  },

  setType: function(type) {
    this.type = type;
  },

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

  buildBlock: function() {
    var that = this;

    // Default config
    this.defaults = {
      type: this.type,
      title: this.title,
      icon_name: this.icon,
    };

    // Attributes
    if(this.pastable) {
      this.defaults.pastable = true;
    }
    if(this.droppable) {
      this.defaults.droppable = true;
    }
    if(this.formattable) {
      this.defaults.formattable = true;
    }

    // HTML
    if(this.html.paste) {
      this.defaults.paste_options = {
        html: this.html.paste, 
      };
    }

    // Block data
    this.block = SirTrevor.Block.extend(_.extend(this.defaults, {
      loadData: function(data) {
        var st = this;

        if (typeof data === 'undefined') { data = {}; }

        $.each(that.components, function(i, e) {
          if(typeof data[i] === 'undefined') { data[i] = ''; }

          var $elementLabel = $('<label>').html(e.label);
          
          switch(e.type) {
            case 'text':
              var $element = $('<input>', {
                type: 'text',
                name: i,
                placeholder: e.placeholder,
                value: e.default,
              });
              break;
            case 'number':
              var $element = $('<input>', {
                type: 'number',
                name: i,
                min: e.min,
                max: e.max,
                step: e.step,
                placeholder: e.placeholder,
                value: e.default,
              });
              break;
            case 'textarea':
              var $element = $('<div>', {
                contenteditable: true,
                class: 'st-required st-text-block st-formattable',
                name: i,
              }).html(e.default);

              st.text_block = $element;
              st._initTextBlocks();
              break;
          }

          st.$editor.append($elementLabel).append($element);
        });
      },

      onBlockRender: function() {
        if(this.$editor[0].children.length == 0){
          this.loadData();
        } 
      },
    }));

    return this.block;
  }
};