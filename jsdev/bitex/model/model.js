goog.provide('bitex.model.Model');
goog.provide('bitex.model.Model.EventType');
goog.provide('bitex.model.ModelEvent');
goog.provide('bitex.model.OrderBookInstrumentModel');


goog.require('goog.structs.Map');
goog.require('goog.events.EventTarget');
goog.require('goog.array');
goog.require('goog.dom');

goog.require('goog.Timer');
goog.require('goog.dom.classes');

goog.require('goog.i18n.NumberFormat');
goog.require('expression_evaluator.Parser');
goog.require('bitex.primitives.Price');

/**
 * @typedef {{ symbol:String, currency:String, description:String }}
 */
bitex.model.OrderBookInstrumentModel;


/**
 * @param {Element} element
 * @param {*=} opt_map Map or Object to initialize the map with.
 * @param {...*} var_args If 2 or more arguments are present then they
 *     will be used as key-value pairs.
 *
 * @constructor
 * @extends {goog.events.EventTarget}
 */
bitex.model.Model = function(element, opt_map, var_args){
  goog.events.EventTarget.call(this);

  this.element_ = element;

  this.map_ = new goog.structs.Map(opt_map, var_args);

};
goog.inherits(bitex.model.Model, goog.events.EventTarget);


/**
 * @type {Element}
 */
bitex.model.Model.prototype.element_;


/**
 * @type {goog.structs.Map}
 * @private
 */
bitex.model.Model.prototype.map_;


/**
 * Common events fired by Applications
 * @enum {string}
 */
bitex.model.Model.EventType = {
  /** dispatched after set */
  SET: 'model_set'
};

/**
 *  Remove everything from the model
 */
bitex.model.Model.prototype.clear = function(){
  this.map_.clear();
  this.updateDom();
};

/**
 * Returns the value for the given key.  If the key is not found and the default
 * value is not given this will return {@code undefined}.
 * @param {*} key The key to get the value for.
 * @param {*=} opt_val The value to return if no item is found for the given
 *     key, defaults to undefined.
 * @return {*} The value for the given key.
 */
bitex.model.Model.prototype.get = function(key, opt_val) {
  return this.map_.get(key, opt_val);
};

/**
 * Removes the key from the model
 * @param {*} key
 */
bitex.model.Model.prototype.remove = function(key) {
  var res = this.map_.remove(key);
  this.updateDom();
  return res;
};



bitex.model.Model.prototype.updateDom = function() {
  var elements = goog.dom.getElementsByClass('bitex-model', this.element_);
  goog.array.forEach( elements, function(el) {
    var model_key = el.getAttribute('data-model-key');
    var model_formula = el.getAttribute('data-model-formula');
    var value = this.get(model_key);

    if (goog.isDefAndNotNull(model_formula)) {
      var model_key_list = el.getAttribute('data-model-key-list');
      model_key_list = model_key_list.split(',');

      var variables = {};
      goog.array.forEach(model_key_list, function(model_key){
        variables[model_key] = this.get(model_key, 0);
      }, this);
      value = new expression_evaluator.Parser().parse(model_formula).evaluate(variables);
      this.setElementValue_(el, value, false);
    } else if (goog.isDefAndNotNull(model_key)) {
      this.setElementValue_(el, value, false);
    }
  }, this);
};

/**
 * @param {!Element} el
 * @param {*} value
 * @param {Boolean=} opt_blinkOnChange Defaults to false
 */
bitex.model.Model.prototype.setElementValue_ = function(el, value, opt_blinkOnChange ) {
  var model_action = el.getAttribute('data-model-action');
  if (!goog.isDefAndNotNull(model_action)) {
    model_action = 'text_content';
  }

  var el_formatter = el.getAttribute('data-model-formatter');
  if (!goog.isDefAndNotNull(el_formatter)) {
    el_formatter = 'text';
  }
  var fmt;
  var pos = [0];
  if (el_formatter == 'currency') {
    var pattern  =  el.getAttribute('data-model-formatter-pattern');
    var currency =  el.getAttribute('data-model-formatter-currency');
    fmt = new goog.i18n.NumberFormat(pattern, currency);
  } else if (el_formatter == 'decimal') {
    fmt = new goog.i18n.NumberFormat(goog.i18n.NumberFormat.Format.DECIMAL);
    if (goog.isDefAndNotNull(el.getAttribute('data-model-formatter-max-faction-digits'))) {
      fmt.setMaximumFractionDigits(parseInt(el.getAttribute('data-model-formatter-max-faction-digits'), 10));
    }
    if (goog.isDefAndNotNull(el.getAttribute('data-model-formatter-min-faction-digits'))) {
      fmt.setMinimumFractionDigits(parseInt(el.getAttribute('data-model-formatter-min-faction-digits'),10));
    }
  } else if (el_formatter == 'percent') {
    fmt = new goog.i18n.NumberFormat(goog.i18n.NumberFormat.Format.PERCENT);
    if (goog.isDefAndNotNull(el.getAttribute('data-model-formatter-max-faction-digits'))) {
      fmt.setMaximumFractionDigits(parseInt(el.getAttribute('data-model-formatter-max-faction-digits'), 10));
    }
    if (goog.isDefAndNotNull(el.getAttribute('data-model-formatter-min-faction-digits'))) {
      fmt.setMinimumFractionDigits(parseInt(el.getAttribute('data-model-formatter-min-faction-digits'),10));
    }
  }

  var should_add_blink_class = false;

  if (model_action == 'value') {
    current_value = goog.dom.forms.getValue(el);

    if (goog.isDefAndNotNull(fmt)) {
      pos = [0];
      var tmp_value = fmt.parse(current_value , pos );
      if (!(pos[0] != current_value.length || isNaN(tmp_value) || tmp_value <= 0 )) {
        current_value = tmp_value;
      }
    }

    if (current_value !== value) {
      if (goog.isDefAndNotNull(fmt)) {
        goog.dom.forms.setValue( el, fmt.format(value) );
      } else {
        goog.dom.forms.setValue( el, value );
      }
    }
  } else if (model_action == 'text_content') {
    // TODO: make sure this also works with value attribute
    current_text_content = goog.dom.getTextContent(el);

    if (goog.isDefAndNotNull(fmt)) {
      pos = [0];
      var tmp_value = fmt.parse(current_text_content, pos);
      if (!(pos[0] != current_text_content.length || isNaN(tmp_value) || tmp_value <= 0 )) {
        current_text_content = tmp_value;
      }
    }

    if (current_text_content !== value) {
      goog.dom.forms.setValue( el, value );

      if (goog.isDefAndNotNull(fmt)) {
        goog.dom.setTextContent(el, fmt.format(value));
      } else {
        goog.dom.setTextContent(el, value);
      }
      should_add_blink_class = true;
    }
  } else if (model_action == 'show_element') {
    current_value = goog.style.isElementShown(el);
    if (current_value !== value) {
      goog.style.showElement(el, value);
    }
  } else if (model_action == 'hide_element') {
    current_value = !goog.style.isElementShown(el);
    if (current_value !== value) {
      goog.style.showElement(el, !value);
    }
  }

  if (opt_blinkOnChange === true && should_add_blink_class) {
    var blink_class = el.getAttribute('data-blink-class');
    if (goog.isDefAndNotNull(blink_class)) {
      var blink_delay = el.getAttribute('data-blink-delay') || 700;
      blink_delay = parseInt(blink_delay, 10);

      goog.dom.classes.add( el,  blink_class );
      goog.Timer.callOnce( function(){
        goog.dom.classes.remove( el,  blink_class );
      }, blink_delay , this);
    }
  }
};

/**
 * Adds a key-value pair to the map.
 * @param {*} key The key.
 * @param {*} value The value to add.
 * @param {Boolean=} opt_deepExpose Defaults to false
 */
bitex.model.Model.prototype.set = function(key, value, opt_deepExpose) {
  var deepExpose = (goog.isDefAndNotNull(opt_deepExpose) && opt_deepExpose === true);

  var old_value = this.map_.get(key);
  this.map_.set(key, value);

  var update_dom = true;
  if ( goog.isArrayLike(value) ) {
    if (deepExpose){
      goog.array.forEach( value, function(array_value, array_value_index) {
        this.set( key + '_' + array_value_index,  array_value,deepExpose );
      }, this );

    }
    update_dom = false;
  } else if (goog.isObject(value)) {
    if (deepExpose) {
      goog.object.forEach(value, function (object_value, object_value_key) {
        this.set(key + '_' + object_value_key, object_value, deepExpose);
      }, this);
    }
    update_dom = false;
  } else if (goog.isFunction(value)) {
    update_dom = false;
  } else if (old_value === value) {
    return;
  }

  if (update_dom) {
    var elements = goog.dom.getElementsByClass('bitex-model', this.element_);
    goog.array.forEach( elements, function(el) {
      var model_key = el.getAttribute('data-model-key');
      var match_model_key = (model_key === key);

      var key_in_key_list = false;
      var model_key_list = el.getAttribute('data-model-key-list');
      if (goog.isDefAndNotNull(model_key_list)){
        model_key_list = model_key_list.split(',');
        key_in_key_list = goog.array.contains(model_key_list, key );
      }
      var model_formula = el.getAttribute('data-model-formula');

      if (key_in_key_list && goog.isDefAndNotNull(model_formula)) {
        var variables = {};
        goog.array.forEach(model_key_list, function(model_key){
          variables[model_key] = this.get(model_key, 0);
        }, this);
        var formula_result = new expression_evaluator.Parser().parse(model_formula).evaluate(variables);
        this.setElementValue_(el, formula_result, true);

      } else if (match_model_key) {
        this.setElementValue_(el, value, true);
      }
    }, this);
  }

  this.dispatchEvent( new bitex.model.ModelEvent(
      bitex.model.Model.EventType.SET + key,
      key,
      value,
      old_value));

  this.dispatchEvent( new bitex.model.ModelEvent(
      bitex.model.Model.EventType.SET,
      key,
      value,
      old_value));

};



/**
 *
 * @param {string} type
 * @param {string} key
 * @param {Object|string|number|boolean} data
 * @constructor
 * @extends {goog.events.Event}
 */
bitex.model.ModelEvent = function( type, key, data, old_data){
  goog.events.Event.call(this, type);

  /** @type {string} */
  this.key = key;

  /** @type {Object|string|number|boolean} */
  this.data = data;

  /** @type {Object|string|number|boolean} */
  this.old_data = old_data;

};
goog.inherits(bitex.model.ModelEvent, goog.events.Event);

