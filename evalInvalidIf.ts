import {BeFormidableProps, FieldOptions} from './types';

export function evalInvalidIf({proxy, invalidIf}: BeFormidableProps, target: HTMLFormElement){
    const messages: string[] = [];
    for(const criteria of invalidIf){
        const {noneOf} = criteria;
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
            const inputT = input as HTMLFormElement;
            const name = inputT.name || inputT.id;
            if(name === undefined) continue;
            const field = noneOfLookup[name];
            if(field === undefined){
                continue;
            }
            if(inputT[field.prop]){ //TODO support nested props
                found = true;
                break;
            }
        }
        if(!found){
            for(const field of findBasedNoneOfs){
                const {find} = field;
                const elements = Array.from(target.querySelectorAll(find));
                for(const element of elements){
                    if(element[field.prop]){ //TODO support nested props
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
            messages.push(invalidMessage || instructions);
        }

    }
    return messages;
}

