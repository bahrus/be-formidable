// @ts-check
import { BE } from 'be-enhanced/BE.js';
import { propInfo, resolved, rejected } from 'be-enhanced/cc.js';
import {dispatchEvent as de} from 'trans-render/positractions/dispatchEvent.js';
import {evalInvalidIf} from './evalInvalidIf.js';

/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types.d.ts' */
/** @import {Actions, PAP,  AP, BAP} from './ts-refs/be-formidable/types' */;

/**
 * @implements {Actions}
 * @implements {EventListenerObject}
 * 
 * 
 */
class BeFormidable extends BE {
    /**
     * @type {BEConfig<BAP, Actions & IEnhancement, any>}
     */
    static config = {
        propDefaults:{
            checkValidityOnInit: true,
            checkValidityOn: 'input',
            updateCnt: 0,
        },
        propInfo: {
            ...propInfo,
            invalidIf: {},
            isValid: {}
        },
        compacts:{
            //when_checkValidityOn_changes_invoke_hydrate: 0,
            when_isValid_changes_invoke_markStatus: 0,
            when_updateCnt_changes_invoke_checkValidity: 0,
        },
        actions: {
            hydrate:{
                ifAllOf: ['checkValidityOn'],
                ifAtLeastOneOf: ['invalidIf']
            },
        }
    }

    /**
     * @type {AbortController | undefined;}
     */
    #abortController;

    #attachedCheckValidity = false;

    /**
     * @type {() => boolean}
     */
    #originalCheckValidity;
    /**
     * 
     * @param {BAP} self 
     */
    async hydrate(self){
        this.#disconnect();
        this.#abortController = new AbortController();
        const signal = this.#abortController.signal;
        const {checkValidityOn, enhancedElement} = self;
        
        if(typeof checkValidityOn === 'string'){
            enhancedElement.addEventListener(checkValidityOn, this, {signal})
        }else{
            for(const checkOn of checkValidityOn){
                if(typeof checkOn === 'string'){
                    enhancedElement.addEventListener(checkOn, this, {signal});
                }else{
                    const options = {...checkOn.options || {}, signal}
                    enhancedElement.addEventListener(checkOn.type, this, options);
                }
            }
        }
        if(!this.#attachedCheckValidity){
            const checkValidity = enhancedElement.checkValidity;
            this.#originalCheckValidity = checkValidity.bind(enhancedElement);
            enhancedElement.checkValidity = () => {
                if(!this.#originalCheckValidity()){
                    self.objections = ['']; //TODO:  Gather all the invalid messages
                    self.isValid = false;
                    return false;
                }
                
                const objections = evalInvalidIf(self);
                const valid = objections.length === 0;
                self.objections = objections;
                self.isValid = valid;
                return valid;
            }
            this.#attachedCheckValidity = true;
        }
        enhancedElement.checkValidity();
        return /** @type {PAP} */({
            resolved: true
        });
    }

    /**
     * 
     * @param {BAP} self 
     */
    checkValidity(self){
        const {enhancedElement} = self;
        enhancedElement.checkValidity();
    }

    /**
     * 
     * @param {BAP} self 
     */
    markStatus(self){
        const {enhancedElement, isValid} = self;
        if(isValid){
            enhancedElement.classList.remove('invalid');
            enhancedElement.classList.add('valid');
        }else{
            enhancedElement.classList.remove('valid');
            enhancedElement.classList.add('invalid');
        }
    }



    /**
     * 
     * @param {Event=} e
     */
    handleEvent(e){
        const self = /** @type {BAP} *//** @type {any} */(this);
        if(e?.type === 'submit'){
            e.preventDefault();
        }
        self.updateCnt++;
    }

    #disconnect(){
        if(this.#abortController !== undefined){
            this.#abortController.abort();
        }
    }
}

await BeFormidable.bootUp();
export {BeFormidable};