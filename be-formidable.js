import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeFormidable {
    #target;
    intro(proxy, target, beDecorProps) {
        this.#target = target;
        const checkValidity = target.checkValidity;
        const boundCheckValidity = checkValidity.bind(target);
        target.checkValidity = () => {
            if (!boundCheckValidity())
                return this.markStatus(target, ['']);
            const { invalidIf } = this.proxy;
            if (invalidIf === undefined)
                return this.markStatus(target, []);
            const messages = [];
            for (const criteria of invalidIf) {
                const { noneOf, message } = criteria;
                if (noneOf === undefined)
                    return this.markStatus(target, []);
                const elements = target.elements;
                for (const input of elements) {
                    const inputT = input;
                    const name = inputT.name || inputT.id;
                    if (name === undefined)
                        continue;
                    if (noneOf.includes(name)) {
                        if (inputT.value) {
                            //we're good.  not all of them are empty.
                            continue;
                        }
                    }
                }
                messages.push(message || `No value was entered for any of these fields: ${noneOf.join(', ')}`);
            }
            this.markStatus(target, messages);
            return messages.length === 0;
        };
    }
    markStatus(target, messages) {
        if (messages.length === 0) {
            target.classList.remove('invalid');
            target.classList.add('valid');
        }
        else {
            target.classList.remove('valid');
            target.classList.add('invalid');
            const message = messages.join('\n');
        }
        this.proxy.problems = messages;
        return messages.length === 0;
    }
    emitEvents = ['problems'];
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
            virtualProps: ['problems'],
            intro: 'intro',
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
