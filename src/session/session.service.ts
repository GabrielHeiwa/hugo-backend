import { Injectable, Logger } from '@nestjs/common';
import { Client } from "ssh2"
import { SessionGateway } from './session.gateway';
import { Socket } from 'socket.io';
import { Session } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSessionDto } from 'src/dto/session.dto';
import { randomUUID } from 'crypto';

type SshConnection = {
    host: string;
    port: number;
    username: string;
    password: string;
}

@Injectable()
export class SessionService {
    private client: Client = new Client();
    private logger: Logger = new Logger("session.service")

    constructor(private readonly prismaService: PrismaService) { }

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

    async createNewSession(sessionData: CreateSessionDto) {
        try {
            const { host, password, port, title, username } = sessionData;

            const session: Session = {
                id: randomUUID(),
                ip: host,
                password,
                port: port.toString(),
                title,
                username
            }

            const newSession = await this.prismaService.session.create({
                data: session,
            });

            return newSession;
        } catch (error: any) {
            this.logger.error("Houve um erro ao criar uma nova sessão.");
            throw error;
        }
    }

    async connectSession(sessionId: string) {
        // Get session data

        // Open connection to session

        // Send OK by WebSockets

        try {
            const { ip, port, username, password } = await this.prismaService.session.findUnique({
                where: {
                    id: sessionId
                }
            });

            const sshSettings: SshConnection = {
                host: ip,
                port: Number(port),
                username,
                password
            };
            
            const sshConnectionResponse = this.sshConnection(sshSettings);
            if (!sshConnectionResponse) throw new Error("Conexão SSH não estabelecida.");

            return true;

        } catch (error: any) {
            this.logger.error("Houve um erro ao connectar na sessão.");
            throw error;
        }
    }

    private async sshConnection(
        {
            host,
            password,
            port,
            username
        }: SshConnection
    ) {
        try {
            this.client.connect({
                host,
                port,
                username,
                password,
            });
    
            const response = await new Promise((resolve, reject) => {
                this.client.on("error", error => {
                    this.logger.error(error)
    
                    reject(error);
                })
        
                this.client.on("ready", () => {
                    this.logger.log('Client :: ready');
    
                    resolve(true)
                })
            });

            return response;
        } catch (error: any) {
            this.logger.error("Houve um erro na conexão SSH.");
            throw error;
        }
    }
}
