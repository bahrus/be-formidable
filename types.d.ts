import {BeDecoratedProps} from 'be-decorated/types';
import {IObserve} from 'be-observant/types';
export interface BeFormidableVirtualProps{
    invalidIf: FormCriteria[],
    problems: string[],
}

export interface FormCriteria{
    noneOf: string[],
    message: string,
}

export interface BeFormidableProps extends BeFormidableVirtualProps{
    proxy: HTMLFormElement & BeFormidableVirtualProps;
}

export interface BeFormidableActions{
    intro(proxy: HTMLFormElement & BeFormidableVirtualProps, target: HTMLFormElement, beDecorProps: BeDecoratedProps): void;
}