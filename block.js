/**********************************
 * Base Sir Trevor Card Generator
 *
 * Author: Chris Hutchinson [chris.hutchinson@the-times.co.uk]
 **********************************/


/**
 * @class
 * @param {string} title                  - The title of our block
 * @param {string} type                   - The type of our block
 * @property {string}  type               - The block type
 * @property {string}  title              - The block title
 * @property {object}  attributes         - The attributes set on the block
 * @property {object}  properties         - The properties set on the block
 * @property {object}  components         - The components set on the block
 * @property {boolean}  controllable      - Can we add controllers to this block?
 * @property {string}  icon               - The block icon name
 * @property {object}  html               - The HTML for this block
 * @property {object}  html.drop          - The dropzone HTML for this block
 * @property {object}  html.paste         - The paste field HTML for this block
 * @property {object}  html.upload        - The upload area HTML for this block
 * @property {string}  pasteTarget        - The pastable target field name for this block
 * @property {string}  uploadTarget       - The uploadable target field name for this block
 * @property {boolean}  hasPastable       - Has this block got a pastable component?
 * @property {boolean}  hasUplodable      - Has this block got an uplodable component?
 * @property {boolean}  isRendered        - Is this block fully rendered?
 */
var SirTrevorBlock = function(title, type) {
  this.title = title;
  this.type = type;

  this.attributes = {};
  this.properties = {};
  this.components = {};
  this.controllable = false;
  this.icon = 'default';
  this.html = {
    drop: false,
    paste: false,
    upload: false,
  };
  this.pasteTarget = false;
  this.uploadTarget = false;
  this.hasPastable = false;
  this.hasUploadable = false;
  this.hasTextarea = false;

  /**
   * Creates an element using jQuery
   * @function
   * @param {string} name         - The name of our component
   * @param {object} component    - The component configuration
   * @param {string} value        - The value of this component
   * @param {object} st           - The Sir Trevor JS instance.
   */
  this.createElement = function(name, component, value, st) {
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
      case 'file':
        if(value) {
          // Create our image tag
          var $element = $('<div>');

          var elementValue = value;
          if(typeof value.url !== 'undefined') {
            var elementValue = value.url;
          }

          var $elementImage = $('<a>', {
            href: elementValue,
            style: 'max-width: 100%; display: block;'
          }).html('View Media');
          var $elementInput = $('<input>', {
            value: elementValue,
            type: 'hidden',
            name: name
          });
          $element.append($elementImage).append($elementInput);
        } else {
          var $element = $('<input>', {
            type: 'file',
            name: name,
            class: component.class,
          });
        }
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
        });

        if(SirTrevor.version == '0.3.0') {
          $element.html((value ? SirTrevor.toHTML(value) : component.default));
        } else {
          $element.html((value ? value : component.default));
        }

        if(this.hasTextarea) {
          console.error('Sir Trevor Block Generator: We are only able to add one formattable textarea at the moment. The "' + name + '"  component will not be formattable.');
        }

        this.hasTextarea = true;
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
  };

  /**
   * Default blank paste callback
   * @function
   * @param {object} event    - The event which triggered this callback.
   * @param {object} st       - The Sir Trevor JS instance.
   */
  this.pasteCallback = function(event, st) {};

  /**
   * The callback used when an item is uploaded via Sir Trevor JS.
   *
   * @callback uploadCallback
   * @param {object} event    - The event that triggered the callback
   * @param {object} st       - The instance of Sir Trevor
   */
  this.uploadCallback = function(event, st) {};
}

/**
 * Set the paste callback
 * @function
 * @memberof SirTrevorBlock
 * @param {pasteCallback} callback         - The callback to run when an item is pasted into the block's pasteTarget
 */
SirTrevorBlock.prototype.setPasteCallback = function(callback) {
  this.pasteCallback = callback;
};

/**
 * Set the upload callback
 * @memberof SirTrevorBlock
 * @function
 * @param {uploadCallback} callback         - The callback to run when an item is upload into the block's upload field
 */
SirTrevorBlock.prototype.setUploadCallback = function(callback) {
  this.uploadCallback = callback;
};

/**
 * Set HTML for each attribute
 * @memberof SirTrevorBlock
 * @function
 * @param {string} type         - The property to set the HTML to
 * @param {string} html         - The HTML to set
 * @returns {object} this       - The instance on which this method was called.
 */
SirTrevorBlock.prototype.setHTML = function(type, html) {
  switch(type) {
    case 'drop':
      this.html.drop = html;
      break;
    case 'paste':
      this.html.paste = html;
      break;
    case 'upload':
      this.html.upload = html;
      break;
  }

  return this;
};

/**
 * Sets the icon
 * @memberof SirTrevorBlock
 * @function
 * @param {string} icon        - The icon of our block
 * @returns {object} this       - The instance on which this method was called.
 */
SirTrevorBlock.prototype.setIcon = function(icon) {
  this.icon = icon;
  return this;
};

/**
 * Sets the title
 * @memberof SirTrevorBlock
 * @function
 * @param {string} title        - The title of our block
 * @returns {object} this       - The instance on which this method was called.
 */
SirTrevorBlock.prototype.setTitle = function(title) {
  this.title = title;
  return this;
};

/**
 * Creates a pastable component
 * @memberof SirTrevorBlock
 * @function
 * @param {string} name         - The name of our component
 * @param {object} component    - The component configuration
 * @param {function} callback   - The callback to run on paste
 * @returns {object} this       - The instance on which this method was called.
 */
SirTrevorBlock.prototype.setPastableComponent = function(name, component, callback) {
  if(!this.hasPastable) {
    this.hasPastable = true;
    this.components[name] = component;
    this.attributes.pastable = {
      pasteTarget: name,
    };
    this.pasteTarget = name;

    component.class = 'st-block__paste-input st-paste-block';
    var $element = this.createElement(name, component);

    this.setHTML('paste', $element[0].outerHTML);

    this.setPasteCallback(callback);
  } else {
    console.error('Sir Trevor Block Generator: This block already has a pastable element. The "' + name + '" component has been ignored.');
  }

  return this;
};

/**
 * Creates an uploadable component
 * @memberof SirTrevorBlock
 * @function
 * @param {string} name         - The name of our component
 * @param {object} component    - The component configuration
 * @param {uploadCallback} callback   - The callback to run on upload
 * @returns {object} this       - The instance on which this method was called.
 */
SirTrevorBlock.prototype.setUploadableComponent = function(name, component, callback) {
  if(!this.hasUplodable) {
    this.hasUplodable = true;
    this.components[name] = component;
    this.components[name].type = 'file';

    this.attributes.uploadable = {
      uploadTarget: name,
    };
    this.uploadTarget = name;

    var uploadHTML = [
      '<div class="st-block__upload-container">',
        '<input type="file" name="' + name + '" class="st-file-upload">',
        '<button class="st-upload-btn"><%= i18n.t("general:upload") %></button>',
      '</div>'
    ].join('\n');
    this.setHTML('upload', uploadHTML);

    this.setUploadCallback(callback);
  } else {
    console.error('Sir Trevor Block Generator: This block already has a uploadable element. The "' + name + '" component has been ignored.');
  }

  return this;
};

/**
 * Creates a regular component
 * @memberof SirTrevorBlock
 * @function
 * @param {string} name         - The name of our component
 * @param {object} component    - The component configuration
 * @returns {object} this       - The instance on which this method was called.
 */
SirTrevorBlock.prototype.setComponent = function(name, component) {
  this.components[name] = component;

  return this;
};

/**
 * Creates regular components from a list
 * @memberof SirTrevorBlock
 * @function
 * @param {object} components    - An object of components and their configurations
 * @returns {object} this       - The instance on which this method was called.
 */
SirTrevorBlock.prototype.setComponents = function(components) {
  $.each(this.components, function(i, e) {
    this.components[i] = e;
  });

  return this;
};

/**
 * Sets an attribute on the block
 * @memberof SirTrevorBlock
 * @function
 * @param {string} attribute         - The name of the attribute you wish to set
 * @param {string} target            - The target for this attribute
 * @returns {object} this       - The instance on which this method was called.
 */
SirTrevorBlock.prototype.setAttribute = function(attribute, target) {
  this.attributes[attribute] = {
    pasteTarget: (target ? target : false),
  };

  if(target) {
    this.pasteTarget = target;
  }

  return this;
};

/**
 * Sets a property on the block
 * @memberof SirTrevorBlock
 * @function
 * @param {string} property         - The name of the property you wish to set
 * @returns {object} this       - The instance on which this method was called.
 */
SirTrevorBlock.prototype.setProperty = function(property) {
  this.controllable = true;

  this.properties[property] = true;

  return this;
};

/**
 * Set the type for the block
 * @memberof SirTrevorBlock
 * @function
 * @param {string} type         - The type you want to set for the block
 * @returns {object} this       - The instance on which this method was called.
 */
SirTrevorBlock.prototype.setType = function(type) {
  this.type = type;

  return this;
};

/**
 * Generates the required block code for use in your Sir Trevor based on your block config
 * @memberof SirTrevorBlock
 * @function
 * @returns {object} this       - The instance on which this method was called.
 */
SirTrevorBlock.prototype.buildBlock = function() {
  var that = this;

  // Default config
  this.defaults = {
    type: this.type,
    title: this.title,
    icon_name: this.icon,
    properties: this.properties,
    controllable: this.controllable,
    controls: {}
  };

  // Some booleans
  this.isRendered = false;

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
  if(that.attributes.uploadable) {
    this.defaults.uploadable = true;
  }

  // Properties
  if(this.properties.minimisable) {
    this.defaults.controls.minimise = function(event) {
      this.$el.toggleClass('st-block__minimised');
    };
  }

  // HTML
  if(that.html.paste) {
    this.defaults.paste_options = {
      html: that.html.paste, 
    };
  }
  if(that.html.upload) {
    this.defaults.upload_options = {
      html: that.html.upload, 
    };
  }

  // Block data
  this.block = SirTrevor.Block.extend(_.extend(this.defaults, {

    // Sets the initial HTML
    editorHTML: '<div><h2>' + this.title + '</h2><hr /></div>',

    drawnComponents: 0,
    
    // Loads data
    loadData: function(data) {
      var st = this;

      if (typeof data === 'undefined') { data = {}; }

      $.each(that.components, function(i, e) {
        if(typeof data[i] === 'undefined') { data[i] = ''; }
      });

      this.addComponents(data, that.components);
    },

    // Adds components
    addComponents: function(data, components) {
      var st = this;

      //if(data[that.pasteTarget] !== '') {
        $.each(components, function(i, e) {
          var $elementWrapper = $('<div>', {
            class: 'st-element',
            style: 'margin-bottom: 10px;'
          });
          var $elementLabel = $('<label>').html(e.label);
          var $element = that.createElement(i, e, data[i], st);

          if(e.type === 'textarea') {
            st.text_block = $element;
            st._initTextBlocks();
          }

          $elementWrapper.append($elementLabel).append($element);
          st.$editor.append($elementWrapper);
          st.drawnComponents++;
        });
      //}

      st.$editor.show();

      this.isRendered = true;
    },

    // Renders the block
    onBlockRender: function() {
      if(this.uploadable) {
        /* Setup the upload button */
        this.$inputs.find('button').bind('click', function(ev){ ev.preventDefault(); });
        this.$inputs.find('input').on('change', _.bind(function(ev){
          this.onDrop(ev.currentTarget);
        }, this));

        this.$editor.show();
      } else {
        if(this.drawnComponents === 0){
          this.loadData();
        } 
      }
    },

    // Handles pasted content
    onContentPasted: function(event) {
      if(that.pasteTarget) {
        var setDataConfig = {};
        setDataConfig[that.pasteTarget] = event.target.value; 
        
        this.setAndLoadData(setDataConfig);

        this.pasteCallback(event, this);
      }
    }, 

    // Handle file drops
    onDrop: function(transferData){
      var file = transferData.files[0],
          urlAPI = (typeof URL !== "undefined") ? URL : (typeof webkitURL !== "undefined") ? webkitURL : null;

      // Handle images
      if (/image/.test(file.type)) {
        this.loading();
        // Show this image on here
        this.$inputs.hide();
        var dataObj = {};
        dataObj[transferData.name] = {
          url: urlAPI.createObjectURL(file)
        };

        this.uploader(
          file,
          function(data) {
            this.setData(data);
            this.loadData(data);
            this.ready();
          },
          function(error){
            this.addMessage(i18n.t('blocks:image:upload_error'));
            this.ready();
          }
        );
      }

      // Handle Videos
      if (/video/.test(file.type)) {
        this.loading();
        // Show this image on here
        this.$inputs.hide();

        var dataObj = {};
        dataObj[transferData.name] = {
          url: urlAPI.createObjectURL(file)
        };

        this.uploader(
          file,
          function(data) {
            this.setData(data);
            this.loadData(data);
            this.ready();
          },
          function(error){
            console.error(error);
            this.addMessage(i18n.t('blocks:image:upload_error'));
            this.ready();
          }
        );
      }

      that.uploadCallback(event, this);
    },

    // Handles the output to JSON object
    _serializeData: function() {
      if(that.isRendered) {
        var st = this;

        var data = {},
            text = null;

        $.each(that.components, function(i, e) {
          switch(e.type) {
            case 'textarea':
              data[i] = st.$editor.find('div[contenteditable][name="' + i + '"]')[0].innerHTML;
              if (data[i].length > 0 && st.options.convertToMarkdown) {
                data[i] = stToMarkdown(data[i], e.type);
              }
              break;
            default:
              data[i] = st.$('input[name="' + i + '"]').val();
              break;
          }
        });

        return data;
      }
    },

    // Handles the output to JSON object
    toData: function() {
      if(this.isRendered) {
        var st = this;

        var data = {},
            text = null;

        $.each(that.components, function(i, e) {
          switch(e.type) {
            case 'textarea':
              data[i] = st.$editor.find('div[contenteditable][name="' + i + '"]')[0].innerHTML;
              if (data[i].length > 0) {
                data[i] = SirTrevor.toMarkdown(data[i], e.type);
              }
              break;
            default:
              data[i] = st.$('input[name="' + i + '"]').val();
              break;
          }
        });

        if(!_.isEmpty(data)) {
          this.setData(data);
        }
      }
    },
  }));

  return this;
};