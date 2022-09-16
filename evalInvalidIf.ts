import {PP, FieldOptions} from './types';

export function evalInvalidIf({proxy, invalidIf}: PP, target: HTMLFormElement){
    const messages: string[] = [];
    for(const criteria of invalidIf!){
        const {noneOf, } = criteria;
        if(noneOf === undefined) continue; // support other rules in the future
        const noneOfLookup: {[key: string]: FieldOptions} = {};
        const findBasedNoneOfs: FieldOptions[] = [];
        for(const field of noneOf){
            if(typeof field === 'string'){
                const split = field.split('.');
                noneOfLookup[field] = {
                    name: split[0],
                    prop: split[1] || 'value'
                };
            }else{
                const {name, find} = field;
                if(name !== undefined){
                    noneOfLookup[name] = field;
                }else if(find !== undefined){
                    findBasedNoneOfs.push(field);
                }else{
                    throw 'NI'; // not implemented
                }
            }
        }
        const elements = target.elements;
        let found = false;
        for(const input of elements){
            const inputT = input as HTMLInputElement;
            
            const name = inputT.name || inputT.id;
            if(name === undefined) continue;
            const fieldCriteria = noneOfLookup[name];
            if(fieldCriteria === undefined){
                continue;
            }
            const {prop, min, max, enabled, pattern} = fieldCriteria;
            const {type} = inputT;
            if(min !== undefined){
                switch(type){
                    case 'number':
                    case 'range':
                        if(inputT.valueAsNumber < min){
                            continue;
                        }
                        break;
                    case 'date':
                        if(inputT.valueAsDate! < min){
                            continue;
                        }
                        break;
                    default:
                        if(inputT.value < min){
                            continue;
                        }
                }
            }
            if(max !== undefined){
                switch(type){
                    case 'number':
                    case 'range':
                        if(inputT.valueAsNumber > max){
                            continue;
                        }
                        break;
                    case 'date':
                        if(inputT.valueAsDate! > max){
                            continue;
                        }
                        break;
                    default:
                        if(inputT.value > max){
                            continue;
                        }
                }
            }
            if(enabled){
                if(inputT.disabled) continue;
            }
            if((<any>inputT)[prop]){ //TODO support nested props
                found = true;
                break;
            }
            if(pattern !== undefined){
                const reg = new RegExp(pattern);
                if(inputT.value.match(reg)) continue;
            }
        }
        if(!found){
            for(const field of findBasedNoneOfs){
                const {find} = field;
                if(find === undefined) continue;
                const elements = Array.from(target.querySelectorAll(find));
                for(const element of elements){
                    if((<any>element)[field.prop]){ //TODO support nested props
                        found = true;
                        break;
                    }
                }
                if(found){
                    break;
                }
            }
        }
        if(!found){
            const {invalidMessage, instructions} = criteria;
            messages.push(invalidMessage || instructions || 'invalid');
        }

    }
    return messages;
}

