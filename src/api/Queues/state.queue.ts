export class StateQueue {
  private static queueName = 'authReceiver';

  constructor() { 
    
  }

  public static channel: any;

  private static sendToQueue({ channel, msg }: { channel: any, msg?: any }) {
    channel.sendToQueue(StateQueue.queueName, Buffer.from(msg));
  }
}