// Copyright 2018 The Casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { newEnforcer } from 'casbin';
import { PubsubWatcher } from '../src/watcher';

describe('Test', () => {
  let watcher: PubsubWatcher;
  let updater: PubsubWatcher;

  afterEach(async () => {
    if (watcher) await watcher.close();
    if (updater) await updater.close();
  });

  test('Test1', async (done) => {
    watcher = await PubsubWatcher.newWatcher(undefined, 'casbin', 'sub_casbin_1');
    const enforcer = await newEnforcer('examples/authz_model.conf', 'examples/authz_policy.csv');
    enforcer.setWatcher(watcher);
    watcher.setUpdateCallback(done);
    await enforcer.savePolicy();
  });

  test('Test2', async (done) => {
    watcher = await PubsubWatcher.newWatcher(undefined, 'casbin', 'sub_casbin_1');
    const enforcer = await newEnforcer('examples/authz_model.conf', 'examples/authz_policy.csv');
    enforcer.setWatcher(watcher);
    watcher.setUpdateCallback(done);

    updater = await PubsubWatcher.newWatcher(undefined, 'casbin', 'sub_casbin_2');
    await updater.update();
  });
});
