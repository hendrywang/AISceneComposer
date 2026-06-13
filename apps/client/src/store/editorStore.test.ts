/// <reference types="node" />

import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { useEditor, type EditorObject, type SceneSnapshot } from './editorStore';
import type { ModelDef } from '@asc/resource-library';

const userModel: ModelDef = {
  id: 'user-model',
  name: 'User Model',
  type: 'prop',
  category: '我的模型',
  footprint: [1, 1],
  height: 2,
  source: { kind: 'gltf', file: 'data:model/gltf-binary;base64,AA==' },
};

const original: EditorObject = {
  id: 'original',
  modelId: 'user-model',
  kind: 'prop',
  position: [0, 0, 0],
  rotationY: Math.PI / 2,
  color: '#b8b2a6',
  size: [1, 2, 1],
};

function resetStore() {
  useEditor.setState({
    objects: [],
    selectedId: null,
    transformMode: 'translate',
    shots: [],
    activeShotId: null,
    cameraCmd: null,
    bgImageUrl: null,
    bgAspect: null,
    userModels: [],
  });
}

afterEach(resetStore);

test('loadSnapshot restores embedded user models and recomputes dimensions', () => {
  const snapshot: SceneSnapshot = {
    version: 1,
    objects: [original, { ...original, id: 'missing', modelId: 'missing-model' }],
    shots: [],
    bgImageUrl: null,
    bgAspect: null,
    userModels: [userModel],
    savedAt: Date.now(),
  };

  useEditor.getState().loadSnapshot(snapshot);
  const state = useEditor.getState();

  assert.equal(state.userModels.length, 1);
  assert.equal(state.objects.length, 1);
  assert.deepEqual(state.objects[0]?.size, [1, 2, 1]);
  assert.equal(state.objects[0]?.modelId, 'user-model');
});

test('splitInto replaces the original object with rotated part placements', () => {
  resetStore();
  useEditor.setState({
    objects: [original],
    selectedId: 'original',
    userModels: [userModel],
  });

  useEditor.getState().splitInto('original', [
    { def: { ...userModel, id: 'part-a', height: 1, footprint: [0.5, 0.5] }, dx: 1, dz: 0 },
    { def: { ...userModel, id: 'part-b', height: 1, footprint: [0.5, 0.5] }, dx: 0, dz: 1 },
  ]);

  const state = useEditor.getState();
  assert.equal(state.objects.length, 2);
  assert.equal(
    state.objects.some((o) => o.id === 'original'),
    false,
  );
  assert.deepEqual(
    state.objects[0]?.position.map((n) => Number(n.toFixed(6))),
    [0, 0, -1],
  );
  assert.deepEqual(
    state.objects[1]?.position.map((n) => Number(n.toFixed(6))),
    [1, 0, 0],
  );
  assert.equal(
    state.userModels.some((m) => m.id === 'part-a'),
    true,
  );
});
