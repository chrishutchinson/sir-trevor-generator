/**********************************
 * Base Sir Trevor Card Generator
 *
 * Author: Chris Hutchinson [chris.hutchinson@the-times.co.uk]
 **********************************/

(function (root, factory) {
  if(typeof module === 'object' && module.exports) {
    module.exports = factory(require('sir-trevor'));
  } else {
    root.SirTrevorBlock = factory(root.SirTrevor);
  }
}(this, function(SirTrevor) {
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

    /**
     * Creates an element using jQuery
     * @function
     * @param {string} name         - The name of our component
     * @param {object} component    - The component configuration
     * @param {string} value        - The value of this component
     * @param {object} st           - The Sir Trevor JS instance.
     * @param {object} parent       - The parent component (if repeater)
     */
    this.createElement = function(name, component, value, st, parent) {
      switch(component.type) {
        case 'text':
          var $element = $('<input>', {
            type: 'text',
            name: name,
            placeholder: component.placeholder,
            value: (value ? value : component.default),
            class: component.class,
          });

          if(component.required) {
            $element.addClass('st-required');
          }
          break;
        case 'file':
          var $element = $('<input>', {
            type: 'file',
            name: name,
            class: component.class,
            'data-parent': parent
          });

          $element.on('change', function(ev) {
            st.onDrop(ev.currentTarget);
          });
          if(component.required) {
            $element.addClass('st-required');
          }

          if(value) {
            // Hide the file uploader, and prevent it being included in data scapes for this card
            $element.attr('type', 'hidden').val(value);

            // Setup the template and HTML for the file preview
            var $filePreview = $('<div>');

            var typeData = '';
            // Handle images
            if (/image/.test(value)) {
              typeData = 'image';
            }

            // Handle audio
            if (/audio/.test(value)) {
              typeData = 'audio';
            }

            // Handle video
            if (/video/.test(value)) {
              typeData = 'video';
            }

            switch(typeData) {
              case 'image':
              default:
                var $filePreviewElem = $('<img>', {
                  src: value,
                  class: 'st-image-preview'
                });
                break;
              case 'audio':
                var $filePreviewElem = $('<audio>', {
                  src: value,
                  controls: 'controls',
                  preload: 'auto',
                });
                break;
              case 'video':
                var $filePreviewElem = $('<video>', {
                  src: value,
                  controls: 'controls',
                });
                break;
            }
            var $el = $element;
            var $filePreviewRemove = $('<a>', {
              class: 'st-upload-btn st-button st-button--small st-button--table st-button--remove remove-button',
            }).html('Remove').on('click', function(e) {
              // On click of the remove button, show the uploader and remove the preview
              e.preventDefault();
              $el.attr('type', 'file').val('');
              $filePreview.remove();
            });
            $filePreview.append($filePreviewElem).append($filePreviewRemove);
            var $newElement = $('<div>');
            $newElement.append($element).append($filePreview);
            $element = $newElement;
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

          if(component.required) {
            $element.addClass('st-required');
          }
          break;
        case 'textarea':
          var $element = $('<div>', {
            contenteditable: true,
            class: 'st-text-block st-formattable st-textarea-block__editor st-block__editor',
            name: name
          });

          component.default = component.default || '';

          var componentValue = (value ? value : component.default);
          if(SirTrevor.version == '0.3.0') {
            componentValue = (value ? SirTrevor.toHTML(value) : component.default);
          }

          if(component.required) {
            $element.addClass('st-required');
          }

          component.textMode = component.textMode || 'block';
          switch(component.textMode) {
            case 'inline':
              this.defaults.scribeOptions.tags.p = false;
              this.defaults.scribeOptions.tags.br = true;
              this.defaults.scribeOptions.allowBlockElements = false;
              break;
            case 'block':
            default:
              this.defaults.scribeOptions.tags.p = {
                style: false
              };
              this.defaults.scribeOptions.tags.br = false;
              this.defaults.scribeOptions.allowBlockElements = true;
              break;
          }

          var editor = st.newTextEditor($element[0].outerHTML);
          editor.scribe.setHTML('');
          editor.scribe.setHTML(componentValue);
          $element = $(editor.node);
          $element.editor = editor;
          break;
        case 'select':
          var $element = $('<select>', {
            class: 'st-select',
            name: name,
          });

          component.default = component.default || '';

          switch(component.sourceType) {
            case 'ajax':
              // Set a loading value and disable the select until we load the data
              var $loadingOption = $('<option>', {
                value: ''
              }).html('Loading data...');
              $element.append($loadingOption).prop('disabled', true);

              $.ajax({
                type: 'get',
                url: component.source,
                success: function(response) {
                  // Data has been loaded, clear the loader and re-enable the select
                  $element.html('').prop('disabled', false);

                  // Decode the response
                  response = JSON.parse(response);
                  if(response.length === 0) {
                    // We've not got any data, boo!
                    var $errorOption = $('<option>', {
                      value: ''
                    }).html('Error loading data via AJAX');
                    $element.append($errorOption).prop('disabled', true);
                  } else {
                    // Iterate through the response data
                    $.each(response, function(key, string) {
                      var $option = $('<option>', {
                        value: key,
                      }).html(string);

                      if(value && value === key) {
                        $option.prop('selected', true);
                      }

                      $element.append($option);
                    });
                  }
                },
                error: function(response) {
                  // Unknown error loading, let the user know
                  var $errorOption = $('<option>', {
                    value: ''
                  }).html('Error loading data via AJAX');
                  $element.html('').append($errorOption);
                }
              });
              break;
            case 'object':
              if(component.nullable) {
                var $option = $('<option>', {
                  value: '',
                }).html('-- Select --');
                $element.append($option);
              }

              $.each(component.source, function(key, string) {
                var $option = $('<option>', {
                  value: key,
                }).html(string);

                if(value && value === key) {
                  $option.prop('selected', true);
                }

                $element.append($option);
              });
              break;
          }

          // Set the default value if supplied
          var componentValue = (value ? value : component.default);
          $element.val(componentValue);

          if(component.required) {
            $element.addClass('st-required');
          }

          if(component.searchable) {
            $element.addClass('st-searchable');
          }
          break;
        case 'repeater':
          // Set some defaults
          var that = this;
          var children = component.components;
          var $elementWrapper = $('<div>');
          var repeaterLabel = component.label || 'Item';

          var $repeatButton = $('<button>', {
            class: 'st-upload-btn st-button st-button--add repeat-button',
          }).html('Add ' + repeaterLabel);

          var $removeButton = $('<button>', {
            class: 'st-upload-btn st-button st-button--danger remove-button'
          }).html('Remove ' + repeaterLabel);

          // Build the 'Add' button
          $repeatButton.on('click', function(e) {
            e.preventDefault();

            var $this = $(this);
            var $cloned = createRepeatingElement();
            $this.parent().after($cloned);
          });

          // Build the 'Remove' button
          $removeButton.on('click', function(e) {
            e.preventDefault();
            var $this = $(this);
            $this.parent().remove();
            $(st.$editor.find('button.repeat-button')).last().show();
          });

          var createRepeatingElement = function(value) {
            value = value || null;

            var $el = $('<div>', {
              class: 'st-repeater'
            });
            var $child = '';
            var $childWrapper = $('<div>', {
              class: 'st-repeater-child',
              style: 'margin-bottom: 10px;'
            });
            var $childWrapperTitle = $('<h3>').css({
              marginTop: '10px',
              marginBottom: '5px'
            }).html(repeaterLabel + ' #');
            $childWrapper.append($childWrapperTitle);

            // Iterate through the fields
            $.each(children, function(n, c) {
              var $childLabel = $('<label>').html(c.label);
              var childValue = (value ? value[n] : null);
              $child = that.createElement(n, c, childValue, st, name);
              $child.css({
                marginBottom: '10px'
              });

              var $elementWrapper = $('<div>', {
                class: 'st-element-child'
              });

              if(c.required) {
                $elementWrapper.addClass('st-element-child--required');
              }
              $elementWrapper.append($childLabel).append($child);
              $childWrapper.append($elementWrapper);
              $el.append($childWrapper);

              if($child.data('hasCallback')) {
                $child.data('callback')();
              }
            });

            $el.append($repeatButton.clone(true));
            $el.append($removeButton.clone(true));

            return $el;
          };

          if(value) {
            $.each(value, function(e, value) {
              $elementWrapper.append(createRepeatingElement( value ));
            }.bind(this));
          } else {
            $elementWrapper.append(createRepeatingElement());
          }

          $element = $elementWrapper;
          break;
        case 'checkbox':
          var $element = $('<input>', {
            type: 'checkbox',
            name: name,
            /** If the checkbox has never been set before then the value field will be the empty string, in which case we
            use the default value. This could in theory be any string, so we'll decide that 'false' is false and anything
            else is true. If the checkbox has previously been set, its value will be a boolean so we can safely use that. **/
            checked: (value === '') ? ((component.default === 'false') ? false : true) : value,
            class: component.class
          });

          if(component.required) {
            $element.addClass('st-required');
          }
          break;
        case 'table':
          var $element = $('<div>', {
            name: name,
            type: 'table'
          });

          var hot = new Handsontable($element[0], _.extend(component.tableConfig, {
            afterChange: function(change, source) {
              $element.data('hotData', JSON.stringify(this.getData()));
            },
            data: (value && value.length > 0 ? value : component.default)
          }));

          $element.data('hot', hot);
          $element.data('data', (value ? value : component.default));

          $element.data('hasCallback', true);
          $element.data('callback', function(data) {
            setTimeout(function(data) {
              if(data) {
                $element.data('hot').loadData(data);
              } else {
                $element.data('hot').render();
              }
            }, 1, data);
          });
          break;
      }

      if(!_.isUndefined(component.callbacks)) {
        $.each(component.callbacks, function(eventName, callback) {
          $element.on(eventName, function(e) {
            callback(e, SirTrevor.getInstance(), $element);
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
   * Hides the icon
   * @memberof SirTrevorBlock
   * @function
   * @returns {object} this       - The instance on which this method was called.
   */
  SirTrevorBlock.prototype.hideIcon = function() {
    this.hidden = true;
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

  SirTrevorBlock.prototype.setRepeaterComponent = function(name, children, label) {
    this.components[name] = {
      type: 'repeater',
      components: children,
      label: label
    };

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
    /*if(!this.hasUplodable) {
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
    }*/

    this.components[name] = component;

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
      this.defaults.multi_editable = true;
      this.defaults.scribeOptions = {
        tags: {
          script: false,
          ul: true,
          li: true,
          p: {
            style: false
          }
        }
      };
    }
    if(that.attributes.uploadable) {
      this.defaults.uploadable = true;
    }

    this.defaults.configureScribe = function(scribe) {
      scribe.use(new ScribeGeneratorBlockPlugin(this));
    };

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


    // Block data
    this.block = SirTrevor.Block.extend(_.extend(this.defaults, {

      toolbarEnabled: (!this.hidden ? true : false),

      // Sets the initial HTML
      editorHTML: '<div><h2>' + this.title + '</h2><hr /></div>',

      drawnComponents: 0,

      isRendered: false,

      repeatableComponents: 0,

      // Loads data
      loadData: function(data) {
        var st = this;

        if (typeof data === 'undefined') { data = {}; }

        $.each(that.components, function(i, e) {
          if(typeof data[i] === 'undefined') { data[i] = ''; }
        });

        this.addComponents(data, that.components);
      },

      updateFileData: function(data, target) {
        var $target = $(target);

        // Hide the file uploader, and prevent it being included in data scapes for this card
        $target.attr('type', 'hidden').val(data.url);

        // Setup the template and HTML for the file preview
        var $filePreview = $('<div>');
        switch(data.type) {
          case 'image':
            var $filePreviewElem = $('<img>', {
              src: data.url,
              class: 'st-image-preview'
            });
            break;
          case 'audio':
            var $filePreviewElem = $('<audio>', {
              src: data.url,
              controls: 'controls',
              preload: 'auto',
            });
            break;
          case 'video':
            var $filePreviewElem = $('<video>', {
              src: data.url,
              controls: 'controls',
            });
            break;
        }
        var $filePreviewRemove = $('<a>', {
          class: 'st-upload-btn st-button st-button--small st-button--table st-button--remove remove-button',
        }).html('Remove').on('click', function(e) {
          // On click of the remove button, show the uploader and remove the preview
          e.preventDefault();
          $target.attr('type', 'file').val('');
          $filePreview.remove();
        });
        $filePreview.append($filePreviewElem).append($filePreviewRemove);

        // Add the preview
        $target.after($filePreview);
      },

      // Adds components
      addComponents: function(data, components) {
        var st = this;
        var select2;

        if(Object.keys(components).length > 0) {
          $.each(components, function(i, e) {
            var $elementWrapper = $('<div>', {
              class: 'st-element',
              style: 'margin-bottom: 10px;',
              'data-name': i
            });

            if(e.required) {
              $elementWrapper.addClass('st-element--required');
            }

            var $elementLabel = $('<label>').html(e.label);
            var $element = that.createElement(i, e, data[i], st);

            if(e.type !== 'repeater') {
              $elementWrapper.append($elementLabel)
            }

            $elementWrapper.append($element);
            st.$editor.append($elementWrapper);

            if($element.data('hasCallback')) {
              $element.data('callback')();
            }

            st.drawnComponents++;
          });
        } else {
          st.$editor.append($('<p><em>This block has no configurable elements</em></p>'));
        }

        st.$editor.find('.st-searchable').each(function(index, el) {
          var $searchableEl = $(el);
          var select2 = $searchableEl.select2();
          if($searchableEl.hasClass('st-required')) {
            // Do we have a value? Probably pre-loaded? If so, remove the required class
            if(select2.val() !== '') {
              select2.removeClass('st-required');
            }

            // On change of the select
            select2.on('change', function (e) {
              // Got a value? remove the required class
              if(select2.val() !== '') {
                select2.removeClass('st-required');
              } else {
                // No value, add the required class
                select2.addClass('st-required');
              }
            });
          }
        });

        st.$editor.show();

        this.isRendered = true;
      },

      // Renders the block
      onBlockRender: function() {
        // Add a class that allows us to target it with CSS
        this.$el.addClass('st-generated-block');

        if(this.uploadable) {
          this.$inputs.hide();
          this.$editor.show();
        }

        if(this.drawnComponents === 0){
          this.loadData();
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
          var typeData = 'image';
        }

        // Handle audio
        if (/audio/.test(file.type)) {
          var typeData = 'audio';
        }

        // Handle video
        if (/video/.test(file.type)) {
          var typeData = 'video';
        }

        this.loading();

        this.uploader(
          file,
          function(data) {
            this.updateFileData({
              url: data.file.url,
              type: typeData,
            }, transferData);
            this.ready();
          },
          function(error){
            console.error(error);
            this.addMessage(i18n.t('blocks:image:upload_error'));
            $(transferData).val('');
            this.ready();
          }
        );

        that.uploadCallback(event, this);
      },

      // Handles the output to JSON object
      _serializeData: function() {
        if(this.isRendered) {
          var st = this;

          var data = {},
              text = null;

          this._processData(data, that.components, st);

          return data;
        }
      },

      // Handles the output to JSON object
      toData: function() {
        if(this.isRendered) {
          var st = this;

          var data = {},
              text = null;

          this._processData(data, that.components, st);

          if(!_.isEmpty(data)) {
            this.setData(data);
          }
        }
      },

      // Processes the data for each component
      _processData: function(data, components, st) {
        $.each(components, function(i, e) {
          data[i] = st._processFieldType(i, e, st);
        });

        return data;
      },

      // Depending on the field type, processes the data
      _processFieldType: function(i, e, st, container) {
        var data;
        container = container || false;

        switch(e.type) {
          case 'textarea':
            if(container) {
              if(_.isObject(container)) {
                data = st.$editor.find(container).find('div[contenteditable][name="' + i + '"]')[0].innerHTML;
              } else {
                data = st.$editor.find(container + ' div[contenteditable][name="' + i + '"]')[0].innerHTML;
              }
            } else {
              data = st.$editor.find('div[contenteditable][name="' + i + '"]')[0].innerHTML;
            }

            data = data.replace(/(\s|&nbsp;)+/g, ' ');
            break;
          case 'select':
            if(container) {
              if(_.isObject(container)) {
                data = st.$(container).find('select[name="' + i + '"]').val();
              } else {
                data = st.$(container + ' select[name="' + i + '"]').val();
              }
            } else {
              data = st.$('select[name="' + i + '"]').val();
            }
            break;
          case 'repeater':
            data = [];

            if(container) {
              if(_.isObject(container)) {
                var repeaters = st.$editor.find(container).find('div.st-element[data-name="' + i + '"] .st-repeater');
              } else {
                var repeaters = st.$editor.find(container + ' div.st-element[data-name="' + i + '"] .st-repeater');
              }
            } else {
              var repeaters = st.$editor.find('div.st-element[data-name="' + i + '"] .st-repeater')
            }

            $.each(repeaters, function(j, repeater) {
              var dataModel = {};

              $.each(e.components, function(key, value) {
                dataModel[key] = st._processFieldType(key, value, st, repeater);
              });

              data.push(dataModel);
            });
            break;
          case 'checkbox':
            if(container) {
              if(_.isObject(container)) {
                data = st.$(container).find('input[name="' + i + '"]')[0].checked;
              } else {
                data = st.$(container + ' input[name="' + i + '"]')[0].checked;
              }
            } else {
              data = st.$('input[name="' + i + '"]')[0].checked;
            }
            break;
          case 'table':
            if(container) {
              if(_.isObject(container)) {
                data = JSON.parse(st.$(container).find('div[name="' + i + '"]').data('hotData'));
              } else {
                data = JSON.parse(st.$(container + ' div[name="' + i + '"]').data('hotData'));
              }
            } else {
              data = JSON.parse(st.$('div[name="' + i + '"]').data('hotData'));
            }

            // Clear out rows that are entirely null values
            var newData = [];

            $.each(data, function(i, d) {

              var isNull = true;
              $.each(d, function(j, v) {
                if(v !== null) {
                  isNull = false;
                }
              });

              if(!isNull) {
                newData.push(data[i]);
              }
            });
            data = newData;
            break;
          default:
            if(container) {
              if(_.isObject(container)) {
                data = st.$(container).find('input[name="' + i + '"]').val();
              } else {
                data = st.$(container + ' input[name="' + i + '"]').val();
              }
            } else {
              data = st.$('input[name="' + i + '"]').val();
            }
            break;
        }

        return data;
      }
    }));

    return this;
  };

  var ScribeGeneratorBlockPlugin = function(block) { 
    return function(scribe) {
    };
  };

  return SirTrevorBlock;
}));