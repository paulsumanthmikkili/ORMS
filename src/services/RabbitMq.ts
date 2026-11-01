import amqp from 'amqplib';

export const Creation = async (name:string,email:string,password:string,username:string| undefined,userType:string) => {
    const data={
        name,
        email,
        password,
        username,
        userType
    }
    console.log(data)
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const exchangerName = "Register";
    const exchangerType = "direct";
    const Queueuname = "Resgister_Queueu";
    const routingKey = "user_data"

    //exchanger
    await channel.assertExchange(exchangerName, exchangerType, { durable: false });
    //creating queu
    await channel.assertQueue(Queueuname, { durable: false });
    //binding the queue
    await channel.bindQueue(Queueuname, exchangerName, routingKey);

    //publish
    await channel.publish(exchangerName, routingKey, Buffer.from(JSON.stringify(data)))

}



