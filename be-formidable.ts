import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeFormidableActions, BeFormidableProps, BeFormidableVirtualProps, FormCriteria, CheckEventMonitor} from './types';
import {register} from 'be-hive/register.js';

export class BeFormidable implements BeFormidableActions{
    #target: HTMLFormElement | undefined;
    #originalCheckValidity!: () => boolean;
    intro(proxy: HTMLFormElement & BeFormidableProps, target: HTMLFormElement, beDecorProps: BeDecoratedProps): void{
        this.#target = target;
        const checkValidity = target.checkValidity;
        this.#originalCheckValidity = checkValidity.bind(target);
        
    }

    finale(proxy: HTMLFormElement & BeFormidableProps, target: HTMLFormElement, beDecorProps: BeDecoratedProps): void{
        this.disconnect(this);
        this.#target = undefined;
        
    }

    async onInvalidIf({invalidIf, proxy}: this) {
        const {evalInvalidIf} = await import('./evalInvalidIf.js');
        this.#target!.checkValidity = () => {
            if(!this.#originalCheckValidity()){
                this.objections = ['']; //TODO:  Gather all the invalid messages
                return false;
            }
            const messages = evalInvalidIf(this, this.#target!);
            const valid = messages.length === 0;
            this.markStatus(this.#target!, valid);
            proxy.objections = messages;
            return messages.length === 0;
        }
        proxy.checkValidityAttached = true;
    }

    #previousCheckValidityOn: undefined | string | (string | CheckEventMonitor)[];
    onCheckValidityOn({checkValidityOn}: this): void {
        this.disconnect(this);
        
        if(typeof checkValidityOn === 'string'){
            this.#target!.addEventListener(checkValidityOn, this.doCheck);
        }else{
            for(const checkOn of checkValidityOn){
                if(typeof checkOn === 'string'){
                    this.#target!.addEventListener(checkOn, this.doCheck);
                }else{
                    this.#target!.addEventListener(checkOn.type, this.doCheck, checkOn.options);
                }
            }
        }
    }

    onCheckValidityOnInit(self: this): void {
        this.#target!.checkValidity();
    }

    doCheck = (e: Event) => {
        this.#target!.checkValidity();
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

    emitEvents = ['objections'];

    disconnect({}: this){
        const checkValidityOn = this.#previousCheckValidityOn;
        if(checkValidityOn === undefined) return;
        if(typeof checkValidityOn === 'string'){
            this.#target!.removeEventListener(checkValidityOn, this.doCheck);
        }else{
            for(const checkOn of checkValidityOn){
                if(typeof checkOn === 'string'){
                    this.#target!.removeEventListener(checkOn, this.doCheck);
                }else{
                    this.#target!.removeEventListener(checkOn.type, this.doCheck, checkOn.options);
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
            virtualProps: ['invalidIf', 'objections', 'checkValidityOn', 'checkValidityOnInit', 'checkValidityAttached'],
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
