/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Block test.
 */

import * as Blockly from 'blockly';
import {createPlayground} from '@blockly/dev-tools';
import '../src/index';
import {registerCss} from '../src/css';

// TODO: Edit list of blocks.
const allBlocks = [
  'global_declaration',
  'controls_forRange',
  'local_declaration_statement',
  'procedures_defnoreturn',
  'procedures_callnoreturn',
];

/**
 * Extend Blockly's hideChaff method with AI2-specific behaviors.
 */
Blockly.hideChaff = (function(func) {
  if (func.isWrapped) {
    return func;
  } else {
    var f = function() {
      var argCopy = Array.prototype.slice.call(arguments);
      func.apply(this, argCopy);
      // [lyn, 10/06/13] for handling parameter & procedure flydowns
      Blockly.WorkspaceSvg.prototype.hideChaff.call(Blockly.getMainWorkspace(), argCopy);
    };
    f.isWrapped = true;
    return f;
  }
})(Blockly.hideChaff);

function init(workspace) {
  // TODO: Might need the next line
  // Blockly.DropDownDiv.createDom();
  const flydown = new Blockly.Flydown(new Blockly.Options({scrollbars: false}));
  // ***** [lyn, 10/05/2013] NEED TO WORRY ABOUT MULTIPLE BLOCKLIES! *****
  workspace.flydown_ = flydown;
  Blockly.utils.dom.insertAfter(flydown.createDom('g'),
      workspace.svgBubbleCanvas_);
  flydown.init(workspace);
  flydown.autoClose = true; // Flydown closes after selecting a block
}
/**
 * Create a workspace.
 * @param {HTMLElement} blocklyDiv The blockly container div.
 * @param {!Blockly.BlocklyOptions} options The Blockly options.
 * @return {!Blockly.WorkspaceSvg} The created workspace.
 */
function createWorkspace(blocklyDiv, options) {
  registerCss();
  const workspace = Blockly.inject(blocklyDiv, options);
  init(workspace);
  return workspace;
}

document.addEventListener('DOMContentLoaded', function() {
  const defaultOptions = {
    toolbox: `<xml xmlns="https://developers.google.com/blockly/xml">
      ${allBlocks.map((b) => `<block type="${b}"></block>`)}
    </xml>`,
  };
  createPlayground(document.getElementById('root'), createWorkspace,
      defaultOptions);
});
