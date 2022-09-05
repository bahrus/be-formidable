import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeFormidable extends EventTarget {
    #originalCheckValidity;
    intro(proxy, target, beDecorProps) {
        const checkValidity = target.checkValidity;
        this.#originalCheckValidity = checkValidity.bind(target);
    }
    finale(proxy, target, beDecorProps) {
        this.disconnect();
    }
    async onInvalidIf(pp) {
        const { invalidIf, proxy, self } = pp;
        const { evalInvalidIf } = await import('./evalInvalidIf.js');
        self.checkValidity = () => {
            if (!this.#originalCheckValidity()) {
                proxy.objections = ['']; //TODO:  Gather all the invalid messages
                proxy.isValid = false;
                return false;
            }
            const messages = evalInvalidIf(pp, self);
            const valid = messages.length === 0;
            this.markStatus(self, valid);
            proxy.objections = messages;
            proxy.isValid = valid;
            return valid;
        };
        proxy.checkValidityAttached = true;
        proxy.resolved = true;
    }
    #previousCheckValidityOn;
    #abortControllers;
    onCheckValidityOn({ checkValidityOn, self }) {
        this.disconnect();
        this.#abortControllers = [];
        if (typeof checkValidityOn === 'string') {
            const abortController = new AbortController();
            this.#abortControllers.push(abortController);
            self.addEventListener(checkValidityOn, e => {
                self.checkValidity();
            }, { signal: abortController.signal });
        }
        else {
            for (const checkOn of checkValidityOn) {
                const abortController = new AbortController();
                this.#abortControllers.push(abortController);
                if (typeof checkOn === 'string') {
                    self.addEventListener(checkOn, e => {
                        self.checkValidity();
                    }, { signal: abortController.signal });
                }
                else {
                    const options = { ...checkOn.options || {}, signal: abortController.signal };
                    self.addEventListener(checkOn.type, e => {
                        self.checkValidity();
                    }, options);
                }
            }
        }
    }
    onCheckValidityOnInit({ self }) {
        self.checkValidity();
    }
    markStatus(target, valid) {
        if (valid) {
            target.classList.remove('invalid');
            target.classList.add('valid');
        }
        else {
            target.classList.remove('valid');
            target.classList.add('invalid');
        }
    }
    disconnect() {
        if (this.#abortControllers !== undefined) {
            for (const abortController of this.#abortControllers) {
                abortController.abort();
            }
        }
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
            virtualProps: ['invalidIf', 'objections', 'checkValidityOn', 'checkValidityOnInit', 'checkValidityAttached', 'isValid'],
            emitEvents: ['objections', 'isValid'],
            intro: 'intro',
            finale: 'finale',
            proxyPropDefaults: {
                checkValidityOnInit: true,
            }
        },
        actions: {
            onInvalidIf: 'invalidIf',
            onCheckValidityOn: 'checkValidityOn',
            onCheckValidityOnInit: {
                ifAllOf: ['checkValidityOnInit', 'checkValidityAttached']
            }
        }
    },
    complexPropDefaults: {
        controller: BeFormidable,
    }
});
register(ifWantsToBe, upgrade, tagName);
