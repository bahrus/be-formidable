import {BeDecoratedProps} from 'be-decorated/types';
import {IObserve} from 'be-observant/types';
export interface BeFormidableVirtualProps{
    invalidIf: FormCriteria[],
    objections: string[],
    checkValidityOn: string | (string | CheckEventMonitor)[],
}

export interface FormCriteria{
    noneOf: string[],
    instructions: string,
    invalidMessage: string,
}

export interface CheckEventMonitor{
    type: string,
    options: AddEventListenerOptions,
}

export interface BeFormidableProps extends BeFormidableVirtualProps{
    proxy: HTMLFormElement & BeFormidableVirtualProps;
}

export interface BeFormidableActions{
    intro(proxy: HTMLFormElement & BeFormidableVirtualProps, target: HTMLFormElement, beDecorProps: BeDecoratedProps): void;
    finale(proxy: HTMLFormElement & BeFormidableVirtualProps, target: HTMLFormElement, beDecorProps: BeDecoratedProps): void;
    onInvalidIf(self: this): void;

}