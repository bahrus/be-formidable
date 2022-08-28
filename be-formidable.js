import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeFormidable extends EventTarget {
    #originalCheckValidity;
    intro(proxy, target, beDecorProps) {
        const checkValidity = target.checkValidity;
        this.#originalCheckValidity = checkValidity.bind(target);
    }
    finale(proxy, target, beDecorProps) {
        this.disconnect(this);
    }
    async onInvalidIf({ invalidIf, proxy, self }) {
        const { evalInvalidIf } = await import('./evalInvalidIf.js');
        self.checkValidity = () => {
            if (!this.#originalCheckValidity()) {
                this.objections = ['']; //TODO:  Gather all the invalid messages
                proxy.isValid = false;
                return false;
            }
            const messages = evalInvalidIf(this, self);
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
    onCheckValidityOn({ checkValidityOn, self }) {
        this.disconnect(this);
        if (typeof checkValidityOn === 'string') {
            self.addEventListener(checkValidityOn, this.doCheck);
        }
        else {
            for (const checkOn of checkValidityOn) {
                if (typeof checkOn === 'string') {
                    self.addEventListener(checkOn, this.doCheck);
                }
                else {
                    self.addEventListener(checkOn.type, this.doCheck, checkOn.options);
                }
            }
        }
    }
    onCheckValidityOnInit({ self }) {
        self.checkValidity();
    }
    doCheck = (e) => {
        this.proxy.self.checkValidity();
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
    disconnect({}) {
        const checkValidityOn = this.#previousCheckValidityOn;
        if (checkValidityOn === undefined)
            return;
        const target = this.proxy.self;
        if (typeof checkValidityOn === 'string') {
            target.removeEventListener(checkValidityOn, this.doCheck);
        }
        else {
            for (const checkOn of checkValidityOn) {
                if (typeof checkOn === 'string') {
                    target.removeEventListener(checkOn, this.doCheck);
                }
                else {
                    target.removeEventListener(checkOn.type, this.doCheck, checkOn.options);
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
