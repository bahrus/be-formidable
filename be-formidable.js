import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeFormidable {
    intro(proxy, target, beDecorProps) {
        const checkValidity = target.checkValidity;
        const boundCheckValidity = checkValidity.bind(target);
        target.checkValidity = () => {
            if (!boundCheckValidity())
                return this.markStatus(target, false);
            const { invalidIf } = this.proxy;
            if (invalidIf === undefined)
                return this.markStatus(target, true);
            const { noneOf } = invalidIf;
            if (noneOf === undefined)
                return this.markStatus(target, true);
            const elements = target.elements;
            for (const input of elements) {
                const inputT = input;
                const name = inputT.name || inputT.id;
                if (name === undefined)
                    continue;
                if (noneOf.includes(name)) {
                    if (inputT.value) {
                        return this.markStatus(target, true);
                    }
                }
            }
            return this.markStatus(target, false);
        };
    }
    markStatus(target, status) {
        if (status) {
            target.classList.remove('invalid');
            target.classList.add('valid');
        }
        else {
            target.classList.remove('valid');
            target.classList.add('invalid');
        }
        return status;
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
