import {BeDecoratedProps} from 'be-decorated/types';

export interface BeFormidableEndUserProps{
    invalidIf: FormCriteria[],
    checkValidityOn: string | (string | CheckEventMonitor)[],
    checkValidityOnInit: boolean;
}

export interface BeFormidableComputedProps{
    objections: string[],
    checkValidityAttached: boolean;
    isValid: boolean;
}
export interface BeFormidableVirtualProps extends BeFormidableEndUserProps, BeFormidableComputedProps{}

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

export interface BeFormidableProps extends BeFormidableVirtualProps{
    proxy: HTMLFormElement & BeFormidableVirtualProps;
}

export interface BeFormidableActions{
    intro(proxy: HTMLFormElement & BeFormidableVirtualProps, target: HTMLFormElement, beDecorProps: BeDecoratedProps): void;
    finale(proxy: HTMLFormElement & BeFormidableVirtualProps, target: HTMLFormElement, beDecorProps: BeDecoratedProps): void;
    onInvalidIf(self: this): void;
    onCheckValidityOn(self: this): void;
    onCheckValidityOnInit(self: this): void;
}