import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { userKey, usernameUniquqKey, usernameKey } from '$services/keys';

export const getUserByUsername = async (username: string) => {
    // USe the username argument to look up the person ID
    // with the username sorted set
    const decimalId = await client.zScore(usernameKey(), username);

    // make sure we actully got an ID from the lookup
    if(!decimalId) {
        throw new Error('User does not exist');
    }

    // Take the id and convert it back to hex
    const id = decimalId.toString(16)

    // use the id to look up the user's hash
    const user = await client.hGetAll(userKey(id));

    // Deserialize adn return hash
    return deserialize(id, user);
};

export const getUserById = async (id: string) => {
    const user = await client.hGetAll(userKey(id));
    return deserialize(id, user);
};

export const createUser = async (attrs: CreateUserAttrs) => {
    const id = genId(); // Hexadecimal value

    const exist = await client.sIsMember(usernameUniquqKey(), attrs.username);

    if (exist) {
        throw new Error('Username is taken!');
    }

    await client.hSet(userKey(id), searalize(attrs));
    await client.sAdd(usernameUniquqKey(), attrs.username);
    await client.zAdd(usernameKey(), {
        value: attrs.username,
        score: parseInt(id, 16)
    })

    return id;
};

const searalize = (user: CreateUserAttrs) => {
    return {
        username: user.username,
        password: user.password
    }
}

const deserialize = (id: string, user: {[key: string]: string}) => {
    return {
        id: id,
        username: user.username,
        password: user.password
    }
}