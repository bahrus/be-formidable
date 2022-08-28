import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeFormidableActions, BeFormidableProps, BeFormidableVirtualProps, FormCriteria, CheckEventMonitor} from './types';
import {register} from 'be-hive/register.js';

export class BeFormidable extends EventTarget implements BeFormidableActions{
    #originalCheckValidity!: () => boolean;
    intro(proxy: HTMLFormElement & BeFormidableProps, target: HTMLFormElement, beDecorProps: BeDecoratedProps): void{
        const checkValidity = target.checkValidity;
        this.#originalCheckValidity = checkValidity.bind(target);
        
    }

    finale(proxy: HTMLFormElement & BeFormidableProps, target: HTMLFormElement, beDecorProps: BeDecoratedProps): void{
        this.disconnect(this);
        
    }

    async onInvalidIf({invalidIf, proxy, self}: this) {
        const {evalInvalidIf} = await import('./evalInvalidIf.js');
        self.checkValidity = () => {
            if(!this.#originalCheckValidity()){
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
        }
        proxy.checkValidityAttached = true;
    }

    #previousCheckValidityOn: undefined | string | (string | CheckEventMonitor)[];
    onCheckValidityOn({checkValidityOn, self}: this): void {
        this.disconnect(this);
        
        if(typeof checkValidityOn === 'string'){
            self.addEventListener(checkValidityOn, this.doCheck);
        }else{
            for(const checkOn of checkValidityOn){
                if(typeof checkOn === 'string'){
                    self.addEventListener(checkOn, this.doCheck);
                }else{
                    self.addEventListener(checkOn.type, this.doCheck, checkOn.options);
                }
            }
        }
    }

    onCheckValidityOnInit({self}: this): void {
        self.checkValidity();
    }

    doCheck = (e: Event) => {
        this.proxy.self.checkValidity();
    }

    markStatus(target:HTMLFormElement, valid: boolean){
        if(valid){
            target.classList.remove('invalid');
            target.classList.add('valid');
        }else{
            target.classList.remove('valid');
            target.classList.add('invalid');
        }
    }

    

    disconnect({}: this){
        const checkValidityOn = this.#previousCheckValidityOn;
        if(checkValidityOn === undefined) return;
        const target = this.proxy.self;
        if(typeof checkValidityOn === 'string'){
            target.removeEventListener(checkValidityOn, this.doCheck);
        }else{
            for(const checkOn of checkValidityOn){
                if(typeof checkOn === 'string'){
                    target.removeEventListener(checkOn, this.doCheck);
                }else{
                    target.removeEventListener(checkOn.type, this.doCheck, checkOn.options);
                }
            }
        }
    }

}

export interface BeFormidable extends BeFormidableProps{}

const tagName = 'be-formidable';

const ifWantsToBe = 'formidable';

const upgrade = 'form';

define<BeFormidableProps & BeDecoratedProps<BeFormidableProps, BeFormidableActions>, BeFormidableActions>({
    config:{
        tagName,
        propDefaults:{
            upgrade,
            ifWantsToBe,
            virtualProps: ['invalidIf', 'objections', 'checkValidityOn', 'checkValidityOnInit', 'checkValidityAttached', 'isValid'],
            emitEvents: ['objections', 'isValid'],
            intro: 'intro',
            finale: 'finale',
            proxyPropDefaults:{
                checkValidityOnInit: true,
            }
        },

        actions:{
            onInvalidIf: 'invalidIf',
            onCheckValidityOn: 'checkValidityOn',
            onCheckValidityOnInit: {
                ifAllOf: ['checkValidityOnInit', 'checkValidityAttached']
            }
        }
    },
    complexPropDefaults:{
        controller: BeFormidable,
    }
});
register(ifWantsToBe, upgrade, tagName);
