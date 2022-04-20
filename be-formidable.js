import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeFormidable {
    //#target!: HTMLFormElement;
    intro(proxy, target, beDecorProps) {
        //this.#target = target;
        const checkValidity = target.checkValidity;
        const boundCheckValidity = checkValidity.bind(target);
        target.checkValidity = () => {
            if (!boundCheckValidity())
                return false;
            const { invalidIf } = this.proxy;
            if (invalidIf === undefined)
                return true;
            const { noneOf } = invalidIf;
            if (noneOf === undefined)
                return true;
            const elements = target.elements;
            for (const input of elements) {
                const inputT = input;
                const name = inputT.name;
                if (name === undefined)
                    continue;
                if (noneOf.includes(name)) {
                    if (inputT.value) {
                        //const internals = target.attachInternals();
                        return true;
                    }
                }
            }
            return false;
        };
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
            intro: 'intro'
        },
        actions: {
        //onInvalidIf: 'invalidIf',
        }
    },
    complexPropDefaults: {
        controller: BeFormidable,
    }
});
register(ifWantsToBe, upgrade, tagName);
