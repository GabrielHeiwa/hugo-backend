import { Injectable, Logger } from '@nestjs/common';
import { Client } from "ssh2"
import { SessionGateway } from './session.gateway';
import { Socket } from 'socket.io';

@Injectable()
export class SessionService {
    private client: Client = new Client();
    private logger: Logger = new Logger("session.service")

    constructor() { }

    otherMethod() {
        return "otherMethod"
    }

    async conn() {
        this.client.connect({
            host: "192.168.0.70",
            port: 22,
            username: "root",
            password: "pazehlindo",

        });

        await new Promise((resolve, reject) => {
            this.client.on("error", error => {
                this.logger.error(error)

                reject(error);
            })
    
            this.client.on("ready", () => {
                this.logger.log('Client :: ready');

                resolve(true)
            })
        })
    }

    async sendCommand(command: string, socket: Socket) {
        let content = "";
        await this.conn()

        await new Promise((resolve, reject) => {
            this.client.exec(command, {}, (err, channel) => {
                if (err) {
                    this.logger.error("Error to send a command")
    
                    return;
                }
    
                channel.on("data", (message: string) => {
                    content += message;
                });
    
                channel.on("exit", () => {
                    resolve(true)
                })
            })
        })

        return content;
    }
}
