/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {assert} from 'chai';
import td from 'testdouble';

import MDCSwitchFoundation from '../../../packages/mdc-switch/foundation';

suite('MDCSwitchFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCSwitchFoundation);
});

test('exports strings', () => {
  assert.isOk('strings' in MDCSwitchFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  const {defaultAdapter} = MDCSwitchFoundation;
  const methods = Object.keys(defaultAdapter).filter((k) => typeof defaultAdapter[k] === 'function');

  assert.equal(methods.length, Object.keys(defaultAdapter).length, 'Every adapter key must be a function');
  assert.deepEqual(methods, ['addClass', 'removeClass', 'registerChangeHandler', 'deregisterChangeHandler',
    'setChecked', 'isChecked', 'setDisabled', 'isDisabled']);
  methods.forEach((m) => assert.doesNotThrow(defaultAdapter[m]));
});

function setupTest() {
  const mockAdapter = td.object(MDCSwitchFoundation.defaultAdapter);
  const foundation = new MDCSwitchFoundation(mockAdapter);
  return {foundation, mockAdapter};
}

test('#init calls adapter.registerChangeHandler() with a change handler function', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.init();
  td.verify(mockAdapter.registerChangeHandler(isA(Function)));
});

test('#destroy calls adapter.deregisterChangeHandler() with a registerChangeHandler function', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  let changeHandler;
  td.when(mockAdapter.registerChangeHandler(isA(Function))).thenDo(function(handler) {
    changeHandler = handler;
  });
  foundation.init();

  foundation.destroy();
  td.verify(mockAdapter.deregisterChangeHandler(changeHandler));
});

test('#isChecked returns true when the value of adapter.isChecked() is true', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.isChecked()).thenReturn(true);
  assert.isOk(foundation.isChecked());
});

test('#isChecked returns false when the value of adapter.isChecked() is false', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.isChecked()).thenReturn(false);
  assert.isNotOk(foundation.isChecked());
});

test('#setChecked updates the checked state', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setChecked(true);
  td.verify(mockAdapter.setChecked(true));

  foundation.setChecked(false);
  td.verify(mockAdapter.setChecked(false));
});

test('#setChecked adds mdc-switch--checked to the switch element when set to true', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.isChecked()).thenReturn(true);
  foundation.setChecked(true);
  td.verify(mockAdapter.addClass(MDCSwitchFoundation.cssClasses.CHECKED));
});

test('#setChecked removes mdc-switch--checked from the switch element when set to false', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.isChecked()).thenReturn(false);
  foundation.setChecked(false);
  td.verify(mockAdapter.removeClass(MDCSwitchFoundation.cssClasses.CHECKED));
});

test('#isDisabled returns true when adapter.isDisabled() is true', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.isDisabled()).thenReturn(true);
  assert.isOk(foundation.isDisabled());
});

test('#isDisabled returns false when adapter.isDisabled() is false', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.isDisabled()).thenReturn(false);
  assert.isNotOk(foundation.isDisabled());
});

test('#setDisabled updates the disabled state', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(true);
  td.verify(mockAdapter.setDisabled(true));

  foundation.setDisabled(false);
  td.verify(mockAdapter.setDisabled(false));
});

test('#setDisabled adds mdc-switch--disabled to the switch element when set to true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(true);
  td.verify(mockAdapter.addClass(MDCSwitchFoundation.cssClasses.DISABLED));
});

test('#setDisabled removes mdc-switch--disabled from the switch element when set to false', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(false);
  td.verify(mockAdapter.removeClass(MDCSwitchFoundation.cssClasses.DISABLED));
});

test('a native control change event fired when the switch changes to a checked state results in adding ' +
      'mdc-switch--checked to the switch ', () => {
  const {foundation, mockAdapter} = setupTest();

  let changeHandler;
  td.when(mockAdapter.registerChangeHandler(td.matchers.isA(Function))).thenDo((handler) => {
    changeHandler = handler;
  });
  foundation.init();

  td.when(mockAdapter.isChecked()).thenReturn(true);

  changeHandler();
  td.verify(mockAdapter.addClass(MDCSwitchFoundation.cssClasses.CHECKED));
});

test('a native control change event fired when the switch changes to an unchecked state results in removing ' +
      'mdc-switch--checked from the switch ', () => {
  const {foundation, mockAdapter} = setupTest();

  let changeHandler;
  td.when(mockAdapter.registerChangeHandler(td.matchers.isA(Function))).thenDo((handler) => {
    changeHandler = handler;
  });
  foundation.init();

  td.when(mockAdapter.isChecked()).thenReturn(false);

  changeHandler();
  td.verify(mockAdapter.removeClass(MDCSwitchFoundation.cssClasses.CHECKED));
});