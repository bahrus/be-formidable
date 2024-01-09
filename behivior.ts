import {register} from 'be-hive/register.js';
import {tagName } from './be-formidable.js';
import './be-formidable.js';

const ifWantsToBe = 'formidable';
const upgrade = 'form';

register(ifWantsToBe, upgrade, tagName);