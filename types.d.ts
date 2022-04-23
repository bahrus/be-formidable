import {BeDecoratedProps} from 'be-decorated/types';
import {IObserve} from 'be-observant/types';
export interface BeFormidableVirtualProps{
    rules: FormCriteria[],
    problems: string[],
}

export interface FormCriteria{
    invalidIf: {
        noneOf: string[],
        message: string,
    }
    
}

export interface BeFormidableProps extends BeFormidableVirtualProps{
    proxy: HTMLFormElement & BeFormidableVirtualProps;
}

export interface BeFormidableActions{
    intro(proxy: HTMLFormElement & BeFormidableVirtualProps, target: HTMLFormElement, beDecorProps: BeDecoratedProps): void;
    //onRules(self: this): void;
    //onInvalidIf(self: this): void;
}