import test from 'node:test';import assert from 'node:assert/strict';import {candidateSchema,stageSchema} from './validation.js';
const valid={name:'Alex Smith',email:'alex@example.com',role:'Engineer',skills:['React']};
test('candidate input parsed',()=>{const v=candidateSchema.parse(valid);assert.equal(v.stage,'Applied');assert.equal(v.experience,0)});
test('bad email rejected',()=>assert.equal(candidateSchema.safeParse({...valid,email:'bad'}).success,false));
test('unsupported stage rejected',()=>assert.equal(stageSchema.safeParse({stage:'Unknown'}).success,false));
test('experience cannot be negative',()=>assert.equal(candidateSchema.safeParse({...valid,experience:-1}).success,false));
test('normalizes email address',()=>assert.equal(candidateSchema.parse({...valid,email:'  ALEX@EXAMPLE.COM  '}).email,'alex@example.com'));
test('rejects excessive skills',()=>assert.equal(candidateSchema.safeParse({...valid,skills:Array.from({length:26},(_,i)=>'Skill'+i)}).success,false));