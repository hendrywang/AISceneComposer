/// <reference types="node" />

import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as THREE from 'three';
import { computePreset } from './camera';
import type { EditorObject } from '../store/editorStore';

function actor(id: string, x: number, z: number, height = 1.8): EditorObject {
  return {
    id,
    modelId: 'man-tall',
    kind: 'actor',
    position: [x, 0, z],
    rotationY: 0,
    color: '#e23b3b',
    size: [0.55, height, 0.4],
    poseId: 'stand',
    label: id,
  };
}

test('two-shot frames the selected actor and nearest secondary actor', () => {
  const a = actor('a', -1, 0);
  const b = actor('b', 1, 0);
  const c = actor('c', 4, 0);

  const pose = computePreset(
    'two-shot',
    [a, b, c],
    'a',
    new THREE.Vector3(0, 2, 6),
    new THREE.Vector3(0, 1, 0),
  );

  assert.ok(pose);
  assert.equal(pose.fov, 40);
  assert.ok(Math.abs(pose.target[0]) < 0.001);
  assert.ok(pose.position[2] > pose.target[2]);
});

test('group preset uses all actors when no actor is selected', () => {
  const pose = computePreset(
    'group',
    [actor('a', -2, 0), actor('b', 0, 0), actor('c', 2, 0)],
    null,
    new THREE.Vector3(0, 2, 6),
    new THREE.Vector3(0, 1, 0),
  );

  assert.ok(pose);
  assert.equal(pose.fov, 50);
  assert.ok(Math.abs(pose.target[0]) < 0.001);
});

test('presets return null when no actor exists', () => {
  const pose = computePreset('closeup', [], null, new THREE.Vector3(0, 2, 6), new THREE.Vector3(0, 1, 0));

  assert.equal(pose, null);
});
