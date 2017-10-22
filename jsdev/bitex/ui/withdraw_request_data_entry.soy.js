// This file was automatically generated from withdraw_request_data_entry.coinage.soy.
// Please don't edit this file by hand.

goog.provide('bitex.ui.WithdrawRequestDataEntry.templates');

goog.require('soy');


bitex.ui.WithdrawRequestDataEntry.templates.WithdrawRequestDataEntry = function(opt_data) {
  var output = '';
  /** @desc Warning message when the user has unconfirmed deposits. */
  var MSG_UNNAMED_266 = goog.getMsg('You can\'t withdraw funds from the exchange while you have unconfirmed deposits.');
  output += '<form id="' + soy.$$escapeHtml(opt_data.id) + '_form" class="form-horizontal" data-deposit-status="prepare" data-uniform-control-holder-class="form-group"><fieldset><input id="' + soy.$$escapeHtml(opt_data.id) + '_currency" type="hidden" name="Currency" value="' + soy.$$escapeHtml(opt_data.currency) + '"><div class="error"></div><div class="alert alert-warning text-left bitex-model" data-model-action="show_element" data-model-key-list="HasAnyPosition" data-model-formula="HasAnyPosition" style="display:none;margin-bottom:10px;">' + MSG_UNNAMED_266 + '</div>';
  if (opt_data.methods.length == 0) {
    if (opt_data.verificationLevel <= 2) {
      /** @desc Error message when the user is not yet verified. */
      var MSG_UNNAMED_268 = goog.getMsg(
          'Due to anti-money laundry international laws and government regulations, deposits/withdrawals in the local currency are only available to verified customers.{$break}We are very sorry for the inconvenience.',
          {'break': '<br/>'});
      output += '<div class="alert alert-warning text-left">' + MSG_UNNAMED_268 + '</div>';
      if (opt_data.verificationLevel == 0) {
        /** @desc get verified message */
        var MSG_UNNAMED_270 = goog.getMsg(' Verify your account ');
        output += '<a href="" data-switch-view="verification">' + MSG_UNNAMED_270 + '</a>';
      }
    } else {
      /** @desc Error message when the brokers doesn't have deposit methods */
      var MSG_UNNAMED_272 = goog.getMsg('We are not accepting deposits at this moment. We sorry for the inconvenience.');
      output += '<div class="alert alert-danger text-center">' + MSG_UNNAMED_272 + '</div>';
    }
  } else {
    /** @desc amount */
    var MSG_UNNAMED_276 = goog.getMsg('Amount');
    /** @desc Fee percentage label */
    var MSG_UNNAMED_282 = goog.getMsg('Fees:');
    if (opt_data.methods.length == 1) {
      var methodList41 = opt_data.methods;
      var methodListLen41 = methodList41.length;
      for (var methodIndex41 = 0; methodIndex41 < methodListLen41; methodIndex41++) {
        var methodData41 = methodList41[methodIndex41];
        output += '<input id="' + soy.$$escapeHtml(opt_data.id) + '_method" type="hidden" name="Method" value="' + soy.$$escapeHtml(methodData41['method']) + '" data-net-value="' + soy.$$escapeHtml(opt_data.id) + '_method_' + soy.$$escapeHtml(methodData41['method']) + '_net_value" data-percent-fee="' + soy.$$escapeHtml(opt_data.id) + '_method_' + soy.$$escapeHtml(methodData41['method']) + '_percent_fee" data-fixed-fee="' + soy.$$escapeHtml(opt_data.id) + '_method_' + soy.$$escapeHtml(methodData41['method']) + '_fixed_fee">';
      }
    } else {
      /** @desc method */
      var MSG_UNNAMED_274 = goog.getMsg('Method');
      output += '<div class="form-group"><label class="col-xs-2 control-label">' + MSG_UNNAMED_274 + '</label><div class="col-xs-10"><select id="' + soy.$$escapeHtml(opt_data.id) + '_method" name="Method" class="withdraw-method-selector" style="vertical-align:sub">';
      var methodList67 = opt_data.methods;
      var methodListLen67 = methodList67.length;
      for (var methodIndex67 = 0; methodIndex67 < methodListLen67; methodIndex67++) {
        var methodData67 = methodList67[methodIndex67];
        output += '<option value="' + soy.$$escapeHtml(methodData67['method']) + '" data-net-value="' + soy.$$escapeHtml(opt_data.id) + '_method_' + soy.$$escapeHtml(methodData67['method']) + '_net_value" data-percent-fee="' + soy.$$escapeHtml(opt_data.id) + '_method_' + soy.$$escapeHtml(methodData67['method']) + '_percent_fee" data-fixed-fee="' + soy.$$escapeHtml(opt_data.id) + '_method_' + soy.$$escapeHtml(methodData67['method']) + '_fixed_fee">' + soy.$$escapeHtml(methodData67['description']) + '</option>';
      }
      output += '</select></div></div>';
    }
    output += '<div class="withdraw-methods">';
    var methodList88 = opt_data.methods;
    var methodListLen88 = methodList88.length;
    for (var methodIndex88 = 0; methodIndex88 < methodListLen88; methodIndex88++) {
      var methodData88 = methodList88[methodIndex88];
      output += '<div class="withdraw-method" data-withdraw-method="' + soy.$$escapeHtml(methodData88['method']) + '" style="' + ((opt_data.methods.length > 1) ? 'display:none;' : '') + '"><div class="form-group"><label class="col-xs-2 control-label">' + MSG_UNNAMED_276 + '</label><div class="col-xs-6 col-sm-4"><div class="input-group"><span class="input-group-addon">' + soy.$$escapeHtml(opt_data.currencySign) + '</span><input id="' + soy.$$escapeHtml(opt_data.id) + '_method_' + soy.$$escapeHtml(methodData88['method']) + '_amount" data-uniform-validators="required; validateNumber ' + ((methodData88['limits'][opt_data.verificationLevel]['enabled']) ? ' ' + ((methodData88['limits'][opt_data.verificationLevel]['min']) ? '; validateMin ' + soy.$$escapeHtml(methodData88['limits'][opt_data.verificationLevel]['formatted_min_value']) : '') + ((methodData88['limits'][opt_data.verificationLevel]['max']) ? '; validateMax ' + soy.$$escapeHtml(methodData88['limits'][opt_data.verificationLevel]['formatted_max_value']) + ' ' : '') + ' ' : '') + '" data-uniform-type="number" data-uniform-filters="positive_number" value="" type="text" class="withdraw-field form-control" size="16" name="Amount" ' + ((! (methodIndex88 == 0)) ? 'disabled' : '') + '></div>';
      if (methodData88['limits'][opt_data.verificationLevel]['enabled']) {
        output += '<div><small>';
        if (methodData88['limits'][opt_data.verificationLevel]['max']) {
          /** @desc amount help block */
          var MSG_UNNAMED_278 = goog.getMsg(
              ' Maximum: {$xxx}',
              {'xxx': soy.$$escapeHtml(methodData88['limits'][opt_data.verificationLevel]['formatted_max'])});
          output += MSG_UNNAMED_278;
        }
        if (methodData88['limits'][opt_data.verificationLevel]['min']) {
          /** @desc amount help block */
          var MSG_UNNAMED_280 = goog.getMsg(
              ' Minimum: {$xxx} per transaction.  ',
              {'xxx': soy.$$escapeHtml(methodData88['limits'][opt_data.verificationLevel]['formatted_min'])});
          output += MSG_UNNAMED_280;
        }
        output += '</small></div>';
      }
      output += '</div></div><div class="form-group" style="margin-bottom: 5px;"><div class="col-xs-10 col-xs-offset-2"><p style="font-size: 16px">' + soy.$$escapeHtml(methodData88['disclaimer']) + '</p><input id="' + soy.$$escapeHtml(opt_data.id) + '_method_' + soy.$$escapeHtml(methodData88['method']) + '_percent_fee" type="hidden" value="' + soy.$$escapeHtml(methodData88['percent_fee']) + '"><input id="' + soy.$$escapeHtml(opt_data.id) + '_method_' + soy.$$escapeHtml(methodData88['method']) + '_fixed_fee" type="hidden" value="' + soy.$$escapeHtml(methodData88['fixed_fee']) + '"></div></div><div class="form-group"><label class="col-xs-2 control-label">' + MSG_UNNAMED_282 + '</label><div class="col-xs-10"><p id="' + soy.$$escapeHtml(opt_data.id) + '_method_' + soy.$$escapeHtml(methodData88['method']) + '_fees"  class="form-control-static"></p></div></div><div class="form-group"><label class="col-xs-2 control-label net-amount">' + soy.$$escapeHtml(opt_data.netAmountLabel) + ':</label><div class="col-xs-10"><p id="' + soy.$$escapeHtml(opt_data.id) + '_method_' + soy.$$escapeHtml(methodData88['method']) + '_net_value"  class="form-control-static net-amount"></p><input id="' + soy.$$escapeHtml(opt_data.id) + '_method_' + soy.$$escapeHtml(methodData88['method']) + '_net_value_value" type="hidden" value=""></div></div>';
      var fieldList172 = methodData88['fields'];
      var fieldListLen172 = fieldList172.length;
      for (var fieldIndex172 = 0; fieldIndex172 < fieldListLen172; fieldIndex172++) {
        var fieldData172 = fieldList172[fieldIndex172];
        output += (fieldData172['side'] == 'client') ? '<div class="form-group"><label class="col-xs-2 control-label">' + soy.$$escapeHtml(fieldData172['label']) + '</label><div class="col-xs-10"><input id="' + soy.$$escapeHtml(opt_data.id) + '_' + soy.$$escapeHtml(fieldData172['name']) + '" class="withdraw-field form-control" data-uniform-validators="' + ((fieldData172['required']) ? 'required;' : '') + soy.$$escapeHtml(fieldData172['validator']) + '" type="' + soy.$$escapeHtml(fieldData172['type']) + '" name="' + soy.$$escapeHtml(fieldData172['name']) + '" label="' + soy.$$escapeHtml(fieldData172['placeholder']) + '" value="' + soy.$$escapeHtml(fieldData172['value']) + '"' + ((! (methodIndex88 == 0)) ? 'disabled' : '') + ' /></div></div>' : '';
      }
      if (opt_data.currency == 'BTC') {
        /** @desc WebCam */
        var MSG_UNNAMED_284 = goog.getMsg(' WebCam');
        output += '<div class="form-group"><label class="col-xs-2 control-label" for=""></label><div class="col-xs-10"><a id="' + soy.$$escapeHtml(opt_data.id) + '_open_webcam" href="#"><i class="glyphicon glyphicon-qrcode"></i><span> ' + MSG_UNNAMED_284 + '</span></a></div></div><div class="form-group"><div id="' + soy.$$escapeHtml(opt_data.id) + '_webcam"></div></div>';
      }
      output += '</div>';
    }
    output += '</div>';
  }
  output += '</fieldset></form>';
  return output;
};
