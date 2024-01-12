import type { CreateItemAttrs } from '$services/types';
import { client } from '$services/redis';
import { serialize } from './serialize';
import { deserialize } from './deserialize';
import { genId } from '$services/utils';
import { itemKey, itemByViewKey, itemEndingAtKey, itemByPriceKey } from '$services/keys';

export const getItem = async (id: string) => {
    const item = await client.hGetAll(itemKey(id));

    if(Object.keys(item).length === 0) {
        return null;
    }

    return deserialize(id, item);
};

export const getItems = async (ids: string[]) => {
    const command = ids.map((id) => {
        return client.hGetAll(itemKey(id));
    })

    const results = await Promise.all(command);

    return results.map((result,i) => {
        if(Object.keys(result).length === 0) {
            return null;
        }

        return deserialize(ids[i], result);
    })
};

export const createItem = async (attrs: CreateItemAttrs, userId: string) => {
    const id = genId();
    const searalized = serialize(attrs);
    
    await Promise.all([
        client.hSet(itemKey(id), searalized),
        client.zAdd(itemByViewKey(), {
            value: id,
            score: 0
        }),
        client.zAdd(itemEndingAtKey(), {
            value: id,
            score: attrs.endingAt.toMillis()
        }),
        client.zAdd(itemByPriceKey(),{
            value: id,
            score: 0
        })
    ])

    return id;
};
