import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeFormidable {
    #target;
    intro(proxy, target, beDecorProps) {
        this.#target = target;
    }
    onInvalidIf(self) {
    }
}
const tagName = 'be-formidable';
const ifWantsToBe = 'formidable';
const upgrade = 'form';
define({
    config: {
        tagName,
        propDefaults: {
            upgrade,
            ifWantsToBe,
            virtualProps: ['invalidIf'],
        },
        actions: {
            onInvalidIf: 'invalidIf',
        }
    },
    complexPropDefaults: {
        controller: BeFormidable,
    }
});
register(ifWantsToBe, upgrade, tagName);
