import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
    await client.hSet('car1', {
        color: 'red',
        year: 1940
    });
    await client.hSet('car2', {
        color: 'Black',
        year: 1950
    });
    await client.hSet('car3', {
        color: 'Yellow',
        year: 1960
    });

    // Example to get single hash
    // const car = await client.hGetAll('car#1213');
    // console.log(car)


    // Example for Pipelining
    const command = [1,2,3].map((id) => {
        return client.hGetAll('car'+id);
    })

    const results = await Promise.all(command)

    console.log(results)

};
run();
