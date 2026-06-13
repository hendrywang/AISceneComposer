/// <reference types="node" />

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateCatalog } from './catalog';
import type { ModelDef, ScenePreset } from './types';

const primitive: ModelDef = {
  id: 'box',
  name: 'Box',
  type: 'prop',
  category: '家具',
  footprint: [1, 1],
  height: 1,
  source: {
    kind: 'primitive',
    parts: [{ size: [1, 1, 1], pos: [0, 0.5, 0] }],
  },
};

test('current resource catalog is valid', () => {
  assert.deepEqual(validateCatalog(), []);
});

test('validateCatalog catches duplicate ids, empty primitives, missing glTF license, and scene misses', () => {
  const catalog: ModelDef[] = [
    primitive,
    { ...primitive },
    { ...primitive, id: 'empty', source: { kind: 'primitive', parts: [] } },
    {
      ...primitive,
      id: 'gltf-no-license',
      source: { kind: 'gltf', file: 'models/gltf-no-license/model.glb' },
    },
  ];
  const scenes: ScenePreset[] = [
    { id: 'bad-scene', name: 'Bad Scene', placements: [{ modelId: 'missing', position: [0, 0, 0] }] },
  ];

  const errors = validateCatalog(catalog, scenes);
  assert.ok(errors.some((e) => e.includes('重复的模型 id:box')));
  assert.ok(errors.some((e) => e.includes('empty')));
  assert.ok(errors.some((e) => e.includes('gltf-no-license')));
  assert.ok(errors.some((e) => e.includes('bad-scene')));
});

test('validateCatalog catches scene placements with an unknown poseId', () => {
  const scenes: ScenePreset[] = [
    {
      id: 'pose-bad',
      name: 'Bad Pose',
      placements: [{ modelId: 'box', position: [0, 0, 0], poseId: 'nope' }],
    },
    {
      id: 'pose-ok',
      name: 'OK Pose',
      placements: [{ modelId: 'box', position: [0, 0, 0], poseId: 'stand' }],
    },
  ];
  const errors = validateCatalog([primitive], scenes);
  assert.ok(errors.some((e) => e.includes('pose-bad') && e.includes('nope')));
  assert.ok(!errors.some((e) => e.includes('pose-ok')));
});
