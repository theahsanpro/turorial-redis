import { client } from "./client";
import { SchemaFieldTypes } from "redis";
import { itemsIndexKey, itemKey } from "$services/keys";

export const createIndexes = async () => {
    const indexes = await client.ft._list();
    const exist = indexes.find(index => index == itemsIndexKey());

    if (exist) {
        return;
    }

    return client.ft.create(
        itemsIndexKey(),
        {
            name: {
                type: SchemaFieldTypes.TEXT,
                sortable: true
            },
            description: {
                type: SchemaFieldTypes.TEXT,
                sortable: false
            },
            ownerId: {
                type: SchemaFieldTypes.TAG,
                sortable: false
            },
            endingAt: {
                type: SchemaFieldTypes.NUMERIC,
                sortable: true
            },
            bids: {
                type: SchemaFieldTypes.NUMERIC,
                sortable: true
            },
            views: {
                type: SchemaFieldTypes.NUMERIC,
                sortable: true
            },
            price: {
                type: SchemaFieldTypes.NUMERIC,
                sortable: true
            },
            likes: {
                type: SchemaFieldTypes.NUMERIC,
                sortable: true
            }
        } as any,
        {
            ON: 'HASH',
            PREFIX: itemKey('')
        }
    ) 
};
