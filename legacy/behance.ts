import {BeFormidable} from '../be-formidable.js';
export {BeFormidable} from '../be-formidable.js';
import {def} from 'trans-render/lib/def.js';

await BeFormidable.bootUp();

def('be-formidable', BeFormidable);