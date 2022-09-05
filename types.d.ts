import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';

export interface BeFormidableEndUserProps{
    invalidIf?: FormCriteria[],
    checkValidityOn?: string | (string | CheckEventMonitor)[],
    checkValidityOnInit?: boolean;
}

export interface BeFormidableVirtualProps extends BeFormidableEndUserProps, MinimalProxy<HTMLFormElement>{
    objections: string[],
    checkValidityAttached: boolean;
    isValid: boolean;
}

export interface FormCriteria{
    noneOf: (string | FieldOptions)[],
    instructions: string,
    invalidMessage: string,
}

export interface FieldIdentifierOptions {
    name?: string,
    prop: string,
    find?: string,

}

export interface FieldValidationOptions{
    disabled?: boolean,
    required?: boolean,
    min?: number,
    max?: number,
    pattern?: string,
    type?: string,
}

export interface FieldOptions extends FieldIdentifierOptions, FieldValidationOptions{}

export interface CheckEventMonitor{
    type: string,
    options: AddEventListenerOptions,
}

export type Proxy = HTMLFormElement & BeFormidableVirtualProps;

export interface ProxyProps extends BeFormidableVirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;

export interface BeFormidableActions{
    intro(proxy: Proxy, target: HTMLFormElement, beDecorProps: BeDecoratedProps): void;
    finale(proxy: Proxy, target: HTMLFormElement, beDecorProps: BeDecoratedProps): void;
    onInvalidIf(pp: PP): void;
    onCheckValidityOn(pp: PP): void;
    onCheckValidityOnInit(pp: PP): void;
}