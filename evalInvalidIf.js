// @ts-check
/** @import {Actions, PAP,  AP, BAP} from './ts-refs/be-formidable/types' */;

/**
 * 
 * @param {BAP} self 
 * @returns 
 */
export function evalInvalidIf(self) {
    const {invalidIf, enhancedElement} = self;
    const activeInvalidCssClasses = [];
    const inactiveInvalidCssClasses = [];
    for (const criteria of invalidIf) {
        const { noneOf, invalidCssClass} = criteria;
        if (noneOf === undefined)
            continue; // support other rules in the future
        const noneOfLookup = {};
        const findBasedNoneOfs = [];
        for (const field of noneOf) {
            if (typeof field === 'string') {
                const split = field.split('.');
                noneOfLookup[field] = {
                    name: split[0],
                    prop: split[1] || 'value'
                };
            }
            else {
                const { name, find } = field;
                if (name !== undefined) {
                    noneOfLookup[name] = field;
                }
                else if (find !== undefined) {
                    findBasedNoneOfs.push(field);
                }
                else {
                    throw 'NI'; // not implemented
                }
            }
        }
        const elements = enhancedElement.elements;
        let found = false;
        for (const input of elements) {
            if(input instanceof HTMLInputElement){
                const name = input.name || input.id;
                if (name === undefined)
                    continue;
                const fieldCriteria = noneOfLookup[name];
                if (fieldCriteria === undefined) {
                    continue;
                }
                const { prop, min, max, enabled, pattern } = fieldCriteria;
                const { type } = input;
                if (min !== undefined) {
                    switch (type) {
                        case 'number':
                        case 'range':
                            if (input.valueAsNumber < min) {
                                continue;
                            }
                            break;
                        case 'date':
                            if (input.valueAsDate && input.valueAsDate < min) {
                                continue;
                            }
                            break;
                        default:
                            if (input.value < min) {
                                continue;
                            }
                    }
                }
                if (max !== undefined) {
                    switch (type) {
                        case 'number':
                        case 'range':
                            if (input.valueAsNumber > max) {
                                continue;
                            }
                            break;
                        case 'date':
                            if (input.valueAsDate && input.valueAsDate > max) {
                                continue;
                            }
                            break;
                        default:
                            if (input.value > max) {
                                continue;
                            }
                    }
                }
                if (enabled) {
                    if (input.disabled)
                        continue;
                }
                if (input[prop]) { //TODO support nested props
                    found = true;
                    break;
                }
                if (pattern !== undefined) {
                    const reg = new RegExp(pattern);
                    if (input.value.match(reg))
                        continue;
                }
            }

        }
        if (!found) {
            for (const field of findBasedNoneOfs) {
                const { find } = field;
                if (find === undefined)
                    continue;
                const elements = Array.from(enhancedElement.querySelectorAll(find));
                for (const element of elements) {
                    if (element[field.prop]) { //TODO support nested props
                        found = true;
                        break;
                    }
                }
                if (found) {
                    break;
                }
            }
        }
        if (!found) {
            activeInvalidCssClasses.push(invalidCssClass || 'invalid');
        }else{
            inactiveInvalidCssClasses.push(invalidCssClass || 'invalid');
        }
    }
    return {
        activeInvalidCssClasses,
        inactiveInvalidCssClasses
    };
}
