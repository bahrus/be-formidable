import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeFormidableActions, BeFormidableProps, BeFormidableVirtualProps} from './types';
import {register} from 'be-hive/register.js';

export class BeFormidable implements BeFormidableActions{
    //#target!: HTMLFormElement;
    intro(proxy: HTMLFormElement & BeFormidableProps, target: HTMLFormElement, beDecorProps: BeDecoratedProps): void{
        //this.#target = target;
        const checkValidity = target.checkValidity;
        const boundCheckValidity = checkValidity.bind(target);
        target.checkValidity = () => {
            if(!boundCheckValidity()) return false;
            const {invalidIf} = this.proxy;
            if(invalidIf === undefined) return true;
            const {noneOf} = invalidIf;
            if(noneOf === undefined) return true;
            const elements = target.elements;
            for(const input of elements){
                const inputT = input as HTMLInputElement;
                const name = inputT.name;
                if(name === undefined) continue;
                if(noneOf.includes(name)){
                    if(inputT.value) {
                        //const internals = target.attachInternals();
                        
                        return true;
                    }
                }
            }
            return false;
        }
    }
    // onInvalidIf(self: this): void{
    // } 
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
            virtualProps: ['invalidIf'],
            intro: 'intro'
        },
        actions:{
            //onInvalidIf: 'invalidIf',
        }
    },
    complexPropDefaults:{
        controller: BeFormidable,
    }
});
register(ifWantsToBe, upgrade, tagName);
