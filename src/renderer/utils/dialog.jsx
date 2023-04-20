/**
 * @license
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import Blockly from 'blockly/core';
import { message,Input,Button,Typography } from 'antd';
/**
 * An example implementation of how one might replace Blockly's browser
 * dialogs. This is just an example, and applications are not encouraged to use
 * it verbatim.
 *
 * @namespace
 */
 const CustomDialog = {};
const {Text}=Typography
 /** Override Blockly.dialog.setAlert() with custom implementation. */
 Blockly.dialog.setAlert(function(message, callback) {
  //  console.log('Alert: ' + message);
   CustomDialog.show('Alert', message, {
     onCancel: callback
   });

 });
 
 /** Override Blockly.dialog.setConfirm() with custom implementation. */
 Blockly.dialog.setConfirm(function(message, callback) {
  //  console.log('Confirm: ' + message);
   CustomDialog.show('Confirm', message, {
     showOkay: true,
     onOkay: function() {
       callback(true);
     },
     showCancel: true,
     onCancel: function() {
       callback(false);
     }
   });
 });
 
 /** Override Blockly.dialog.setPrompt() with custom implementation. */
 Blockly.dialog.setPrompt(function(message, defaultValue, callback) {
  //  console.log('Prompt: ' + message);
   CustomDialog.show('Prompt', message, {
     showInput: true,
     showOkay: true,
     onOkay: function() {
       callback(CustomDialog.inputField.value);
     },
     showCancel: true,
     onCancel: function() {
       callback(null);
     },
   });
   CustomDialog.inputField.value = defaultValue;
 });
 
 /** Hides any currently visible dialog. */
 CustomDialog.hide = function() {
   if (CustomDialog.backdropDiv_) {
     CustomDialog.backdropDiv_.style.display = 'none';
     CustomDialog.dialogDiv_.style.display = 'none';
   }
 };
 
 /**
  * Shows the dialog.
  * Allowed options:
  *  - showOkay: Whether to show the OK button.
  *  - showCancel: Whether to show the Cancel button.
  *  - showInput: Whether to show the text input field.
  *  - onOkay: Callback to handle the okay button.
  *  - onCancel: Callback to handle the cancel button and backdrop clicks.
  */
 CustomDialog.show = function(title, message, options) {
   var backdropDiv = CustomDialog.backdropDiv_;
   var dialogDiv = CustomDialog.dialogDiv_;
   if (!dialogDiv) {
     // Generate HTML
     backdropDiv = document.createElement('div');
     backdropDiv.id = 'customDialogBackdrop';
     backdropDiv.style.cssText =
         'position: absolute;' +
         'top: 0; left: 0; right: 0; bottom: 0;' +
         'background-color: rgba(0, 0, 0, .7);' +
         'z-index: 100;';
     document.body.appendChild(backdropDiv);
 
     dialogDiv = document.createElement('div');
     dialogDiv.id = 'customDialog';
    //  dialogDiv.style.cssText =
    //      'background-color: #fff;' +
    //      'width: 400px;' +
    //      'margin: 20px auto 0;' +
    //      'padding: 10px;';
     backdropDiv.appendChild(dialogDiv);
 
     dialogDiv.onclick = function(event) {
       event.stopPropagation();
     };
 
     CustomDialog.backdropDiv_ = backdropDiv;
     CustomDialog.dialogDiv_ = dialogDiv;
   }
   backdropDiv.style.display = 'block';
   dialogDiv.style.display = 'block';
 
  //  dialogDiv=(
  //   <div id='customDialog'>
  //     <Text className='customDialogTitle'>{title}</Text>
  //     <Text className='customDialogMessage'>{message}</Text>
  //     {options.showInput?(<Input id="customDialogInput"></Input>):(<></>)}
  //     <div className='customDialogButtons'>
  //     {options.showCancel?(<Button id="customDialogInput">Cancel</Button>):(<></>)}
  //     {options.showOkay?(<Button id="customDialogOkay">OK</Button>):(<></>)}
  //     </div>
  //   </div>
  //   )
   dialogDiv.innerHTML =
       '<header class="customDialogTitle"></header>' +
       '<span class="customDialogMessage"></span>' +
       (options.showInput ? '<div><input id="customDialogInput"></div>' : '') +
       '<div class="customDialogButtons">' +
       (options.showCancel ? '<button id="customDialogCancel">Cancel</button>': '') +
       (options.showOkay ? '<button id="customDialogOkay">OK</button>': '') +
       '</div>';
  //  dialogDiv.getElementsByClassName('customDialogTitle')[0].appendChild(document.createTextNode(title));
   dialogDiv.getElementsByClassName('customDialogMessage')[0]
       .appendChild(document.createTextNode(message));
 
   var onOkay = function(event) {
     CustomDialog.hide();
     options.onOkay && options.onOkay();
     event && event.stopPropagation();
   };
   var onCancel = function(event) {
     CustomDialog.hide();
     options.onCancel && options.onCancel();
     event && event.stopPropagation();
   };
 
   var dialogInput = document.getElementById('customDialogInput');
   CustomDialog.inputField = dialogInput;
   if (dialogInput) {
     dialogInput.focus();
 
     dialogInput.onkeyup = function(event) {
       if (event.keyCode == 13) {
         // Process as OK when user hits enter.
         onOkay();
         return false;
       } else if (event.keyCode == 27)  {
         // Process as cancel when user hits esc.
         onCancel();
         return false;
       }
     };
   } else {
     var okay = document.getElementById('customDialogOkay');
     okay && okay.focus();
   }
 
   if (options.showOkay) {
     document.getElementById('customDialogOkay').addEventListener('click', onOkay);
   }
   if (options.showCancel) {
     document.getElementById('customDialogCancel').addEventListener('click', onCancel);
   }
 
   backdropDiv.onclick = onCancel;
 };