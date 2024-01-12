import { client } from "$services/redis";
import { deserialize } from "./deserialize";
import { itemsIndexKey } from "$services/keys";

export const searchItems = async (term: string, size: number = 5) => {
    const cleaned = term
        .replaceAll(/[^a-zA-Z0-9 ]/g, '')
        .trim()
        .split(' ')
        .map(word => word ? `%${word}%` : '')
        .join(' ')

    // Look at cleaned and make sure it is valid
    if (cleaned === '') {
        return [];
    }

    const query = `(@name:(${cleaned}) => { $weight: 5.0 }) | (@description:(${cleaned}))`;

    // Use the client to do an actual search
    const result = await client.ft.search(
        itemsIndexKey(),
        query, {
        LIMIT: {
            from: 10,
            size: size
        }
    });

    // Desearialize and return the result
    return result.documents.map(({ id, value }) => deserialize(id, value))
};