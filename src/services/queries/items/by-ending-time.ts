import { client } from "$services/redis";
import { itemKey, itemEndingAtKey } from "$services/keys";
import { deserialize } from "./deserialize";

export const itemsByEndingTime = async (
	order: 'DESC' | 'ASC' = 'DESC',
	offset = 0,
	count = 10
) => {
	const ids = await client.zRange(
		itemEndingAtKey(),
		Date.now(),
		'+inf',
		{
			BY: 'SCORE',
			LIMIT: {
				offset,
				count
			}
		});

	const result = await Promise.all(ids.map(id => client.hGetAll(itemKey(id))))
	
	return result.map((item, i) => deserialize(ids[i], item));
};
