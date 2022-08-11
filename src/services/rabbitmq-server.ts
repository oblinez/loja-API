import { Channel, connect, Connection } from "amqplib";

export default class RabbitMQServer {

  private conn: Connection;
  private channel: Channel;
  private opt = { credentials: require('amqplib').credentials.plain('admin', 'admin') };
  private uri: string = `amqp://192.168.0.22`;

  constructor(private data?: String) {
    this.start();
  }

  async start(): Promise<void> {
    this.conn = await connect(this.uri, this.opt);
    this.channel = await this.conn.createChannel();
  }

  async sendMessage( args:{ queue: string, message: string } ): Promise<void> {
    return await this.channel.sendToQueue(args.queue, Buffer.from(args.message));
  }

  async consumeMessage( args:{ queue: string, callback: (msg: any) => void } ): Promise<void> {
    return await this.channel.consume(args.queue, (msg) => {
      args.callback(msg);
      this.channel.ack(msg);
    });
  }
}