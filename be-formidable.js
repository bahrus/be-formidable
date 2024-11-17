// @ts-check
import { BE } from 'be-enhanced/BE.js';
import { propInfo, resolved, rejected } from 'be-enhanced/cc.js';
import {dispatchEvent as de} from 'trans-render/positractions/dispatchEvent.js';

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

        },
        compacts:{

        },
        actions: {

        }
    }

    /**
     * @type {AbortController | undefined;}
     */
    #abortController;

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
        return /** @type {PAP} */({
            resolved: true
        });
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