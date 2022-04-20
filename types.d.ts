import {BeDecoratedProps} from 'be-decorated/types';

export interface BeFormidableVirtualProps{
    invalidIf:{
        allOf: string[];
    }
}

export interface BeFormidableProps extends BeFormidableVirtualProps{
    proxy: HTMLFormElement & BeFormidableVirtualProps;
}

export interface BeFormidableActions{
    intro(proxy: HTMLFormElement & BeFormidableVirtualProps, target: HTMLFormElement, beDecorProps: BeDecoratedProps): void;
    //onInvalidIf(self: this): void;
}