import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeFormidable {
    #target;
    #originalCheckValidity;
    intro(proxy, target, beDecorProps) {
        this.#target = target;
        const checkValidity = target.checkValidity;
        this.#originalCheckValidity = checkValidity.bind(target);
    }
    finale(proxy, target, beDecorProps) {
        this.disconnect(this);
        this.#target = undefined;
    }
    async onInvalidIf({ invalidIf }) {
        const { evalInvalidIf } = await import('./evalInvalidIf.js');
        this.#target.checkValidity = () => {
            if (!this.#originalCheckValidity()) {
                this.objections = ['']; //TODO:  Gather all the invalid messages
                return false;
            }
            const messages = evalInvalidIf(this, this.#target);
            const valid = messages.length === 0;
            this.markStatus(this.#target, valid);
            this.objections = messages;
            return messages.length === 0;
        };
    }
    #previousCheckValidityOn;
    onCheckValidityOn({ checkValidityOn }) {
        this.disconnect(this);
        if (typeof checkValidityOn === 'string') {
            this.#target.addEventListener(checkValidityOn, this.doCheck);
        }
        else {
            for (const checkOn of checkValidityOn) {
                if (typeof checkOn === 'string') {
                    this.#target.addEventListener(checkOn, this.doCheck);
                }
                else {
                    this.#target.addEventListener(checkOn.type, this.doCheck, checkOn.options);
                }
            }
        }
    }
    onCheckValidityOnInit(self) {
        this.#target.checkValidity();
    }
    doCheck = (e) => {
        this.#target.checkValidity();
    };
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
    emitEvents = ['objections'];
    disconnect({}) {
        const checkValidityOn = this.#previousCheckValidityOn;
        if (checkValidityOn === undefined)
            return;
        if (typeof checkValidityOn === 'string') {
            this.#target.removeEventListener(checkValidityOn, this.doCheck);
        }
        else {
            for (const checkOn of checkValidityOn) {
                if (typeof checkOn === 'string') {
                    this.#target.removeEventListener(checkOn, this.doCheck);
                }
                else {
                    this.#target.removeEventListener(checkOn.type, this.doCheck, checkOn.options);
                }
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
            virtualProps: ['invalidIf', 'objections', 'checkValidityOn', 'checkValidityOnInit'],
            intro: 'intro',
            finale: 'finale',
            proxyPropDefaults: {
                checkValidityOnInit: true,
            }
        },
        actions: {
            onInvalidIf: 'invalidIf',
            onCheckValidityOn: 'checkValidityOn',
            onCheckValidityOnInit: 'checkValidityOnInit',
        }
    },
    complexPropDefaults: {
        controller: BeFormidable,
    }
});
register(ifWantsToBe, upgrade, tagName);
