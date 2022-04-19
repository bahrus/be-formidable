import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeFormidableActions, BeFormidableProps, BeFormidableVirtualProps} from './types';
import {register} from 'be-hive/register.js';

export class BeFormidable implements BeFormidableActions{
    #target!: HTMLFormElement;
    intro(proxy: HTMLFormElement & BeFormidableProps, target: HTMLFormElement, beDecorProps: BeDecoratedProps): void{
        this.#target = target;
    }
    onInvalidIf(self: this): void{
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
            virtualProps: ['invalidIf'],
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
