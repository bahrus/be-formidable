// @ts-check
import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
/** @import {EMC} from './ts-refs/trans-render/be/types' */

/**
 * @type {EMC}
 */
export const emc = {
    base: 'be-formidable',
    enhPropKey: 'beFormidable',
    map: {
        '0.0': {
            instanceOf: 'Object',
            mapsTo: '.',
        },
    },
    importEnh: async () => {
        const { BeFormidable } = 
        /** @type {{new(): IEnhancement<HTMLFormElement>}} */ 
        /** @type {any} */
        (await import('./be-formidable.js'));
        return BeFormidable;
    }
};

const mose = seed(emc);
MountObserver.synthesize(document, BeHive, mose);