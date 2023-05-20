import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig, EnhancementInfo} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA} from './types';
import {register} from 'be-hive/register.js';

export class BeFormidable  extends BE<AP, Actions, HTMLFormElement> implements Actions{
    #originalCheckValidity!: () => boolean;

    override async attach(enhancedElement: HTMLFormElement, enhancementInfo: EnhancementInfo) {
        const checkValidity = enhancedElement.checkValidity;
        this.#originalCheckValidity = checkValidity.bind(enhancedElement);
        await super.attach(enhancedElement, enhancementInfo);
    }

    async onInvalidIf(self: this) {
        const {invalidIf, enhancedElement} = self;
        const {evalInvalidIf} = await import('./evalInvalidIf.js');
        enhancedElement.checkValidity = () => {
            if(!this.#originalCheckValidity()){
                self.objections = ['']; //TODO:  Gather all the invalid messages
                self.isValid = false;
                return false;
            }
            const messages = evalInvalidIf(self, enhancedElement);
            const valid = messages.length === 0;
            this.markStatus(enhancedElement, valid);
            self.objections = messages;
            self.isValid = valid;
            return valid;
        }
        self.checkValidityAttached = true;
        self.resolved = true;
    }

    markStatus(target:HTMLFormElement, valid: boolean){
        if(valid){
            target.classList.remove('invalid');
            target.classList.add('valid');
        }else{
            target.classList.remove('valid');
            target.classList.add('invalid');
        }
    }

    onCheckValidityOn(self: this): void {
        const {checkValidityOn, enhancedElement} = self;
        this.disconnect();
        this.#abortControllers = [];

        if(typeof checkValidityOn === 'string'){
            const abortController = new AbortController();
            this.#abortControllers.push(abortController);
            enhancedElement.addEventListener(checkValidityOn, e => {
                enhancedElement.checkValidity();
            }, {signal: abortController.signal});
        }else{
            for(const checkOn of checkValidityOn!){
                const abortController = new AbortController();
                this.#abortControllers.push(abortController);
                if(typeof checkOn === 'string'){
                    enhancedElement.addEventListener(checkOn, e => {
                        enhancedElement.checkValidity();
                    }, {signal: abortController.signal});
                }else{
                    const options = {...checkOn.options || {}, signal: abortController.signal}
                    enhancedElement.addEventListener(checkOn.type, e => {
                        enhancedElement.checkValidity();
                    }, options);
                }
            }
        }
    }

    onCheckValidityOnInit(self: this): void {
        const {enhancedElement} = self;
        enhancedElement.checkValidity();
    }
    
    #abortControllers: AbortController[] | undefined;
    disconnect(){
        if(this.#abortControllers !== undefined){
            for(const abortController of this.#abortControllers){
                abortController.abort();
            }
        }
    }
    override detach(detachedElement: HTMLFormElement): void {
        this.disconnect();
    }
}

export interface BeFormidable extends AllProps{}

const tagName = 'be-formidable';
const ifWantsToBe = 'formidable';
const upgrade = 'form';

const xe = new XE<AP, Actions>({
    config:{
        tagName,
        propDefaults: {
            ...propDefaults,
            checkValidityOnInit: true,
        }, 
        propInfo: {
            ...propInfo
        },
        actions: {
            
        }
    },
    superclass: BeFormidable
});

register(ifWantsToBe, upgrade, tagName);