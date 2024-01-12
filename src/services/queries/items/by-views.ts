import { itemKey, itemByViewKey } from "$services/keys";
import { client } from "$services/redis";
import { deserialize } from "./deserialize";

export const itemsByViews = async (
    order: 'DESC' | 'ASC' = 'DESC', 
    offset = 0, 
    count = 10
) => {
    let results: any = await client.sort(
        itemByViewKey(),
        {
            GET: [
                '#',
                `${itemKey('*')}->name`,
                `${itemKey('*')}->views`,
                `${itemKey('*')}->endingAt`,
                `${itemKey('*')}->imageUrl`,
                `${itemKey('*')}->price`,
            ],
            BY: 'score', // disabling sorting
            DIRECTION: order,
            LIMIT: {
                offset,
                count
            }
        }
    );

    const items = [];
    while(results.length) {
        const [id, name, views, endingAt, imageUrl, price, ...rest] = results;
        const item = deserialize(id, { name, views, endingAt, imageUrl, price });
        items.push(item);
        results = rest;
    }

    return items;
};
