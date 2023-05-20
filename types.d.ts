import { ActionOnEventConfigs } from "trans-render/froop/types";
import {IBE} from 'be-enhanced/types';

export interface EndUserProps extends IBE<HTMLFormElement>{
    invalidIf?: FormCriteria[],
    checkValidityOn?: string | (string | CheckEventMonitor)[],
    checkValidityOnInit?: boolean;
}

export interface AllProps extends EndUserProps{
    objections: string[],
    checkValidityAttached: boolean;
    isValid: boolean;
}

export interface FormCriteria{
    noneOf?: (string | FieldOptions)[],
    instructions?: string,
    invalidMessage?: string,
}

export interface FieldIdentifierOptions {
    name?: string,
    prop: string,
    find?: string,

}

export interface FieldValidationOptions{
    enabled?: boolean,
    required?: boolean,
    min?: number | Date | string,
    max?: number | Date | string,
    pattern?: string,
    type?: string,
}

export interface FieldOptions extends FieldIdentifierOptions, FieldValidationOptions{}

export interface CheckEventMonitor{
    type: string,
    options: AddEventListenerOptions,
}

export type AP = AllProps;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>;

export type POA = [PAP | undefined, ActionOnEventConfigs<PAP, Actions>]



export interface Actions{
    onInvalidIf(self: this): Promise<void>;
    onCheckValidityOn(self: this): void;
    onCheckValidityOnInit(self: this): void;
}