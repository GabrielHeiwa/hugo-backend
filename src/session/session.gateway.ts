import { Injectable, Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from "socket.io"
import { SessionService } from './session.service';

@WebSocketGateway({
  cors: {
    origin: "*"
  }
})
export class SessionGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

  constructor(private readonly sessionService: SessionService) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("session.gateway")

  @SubscribeMessage('ssh-receiving-message')
  async handleMessage(client: Socket, payload: any): Promise<void> {
    

    // const output = await this.sessionService.sendCommand(payload, client);
    // this.server.emit("messageToClient", output, client.id);
    // this.logger.debug(output);
    // return;
  }

  sendMessage(message: string, socketId: string): void {
    this.server.emit("messageToClient", message, socketId);
  }

  handleConnection(client: Socket, ...args: any[]) {

    this.logger.log(`Client ${client.id} has been connect`)
  }
  
  handleDisconnect(client: Socket) {
    
    this.logger.log(`Client ${client.id} has been disconnect`)
  }

  afterInit(server: Server) {
    
    this.logger.debug(`Server has been init`)
  }


}
