import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeFormidableActions, BeFormidableProps, BeFormidableVirtualProps, FormCriteria} from './types';
import {register} from 'be-hive/register.js';

export class BeFormidable implements BeFormidableActions{
    #target!: HTMLFormElement;
    #originalCheckValidity!: () => boolean;
    intro(proxy: HTMLFormElement & BeFormidableProps, target: HTMLFormElement, beDecorProps: BeDecoratedProps): void{
        this.#target = target;
        const checkValidity = target.checkValidity;
        this.#originalCheckValidity = checkValidity.bind(target);
        
    }

    finale(proxy: HTMLFormElement & BeFormidableProps, target: HTMLFormElement, beDecorProps: BeDecoratedProps): void{
        this.disconnect(this);
    }

    async onInvalidIf({invalidIf}: this) {
        const {evalInvalidIf} = await import('./evalInvalidIf.js');
        this.#target.checkValidity = () => {
            if(!this.#originalCheckValidity()){
                this.objections = ['']; //TODO:  Gather all the invalid messages
                return false;
            }
            const messages = evalInvalidIf(this, this.#target);
            this.objections = messages;
            return messages.length === 0;
        }
    }

    onCheckValidityOn({}: this): void {
        this.disconnect(this);
    }

    markStatus(target:HTMLFormElement, messages: string[]): boolean{
        if(messages.length === 0){
            target.classList.remove('invalid');
            target.classList.add('valid');
        }else{
            target.classList.remove('valid');
            target.classList.add('invalid');
            const message = messages.join('\n');
            
        }
        this.proxy.problems = messages;
        return messages.length === 0;
    }

    emitEvents = ['objections'];

    disconnect({}: this){
        //TODO:  implement this
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
            virtualProps: ['invalidIf', 'objections', 'checkValidityOn'],
            intro: 'intro',
            finale: 'finale',
        },

        actions:{
            onInvalidIf: 'invalidIf',
        }
    },
    complexPropDefaults:{
        controller: BeFormidable,
    }
});
register(ifWantsToBe, upgrade, tagName);
