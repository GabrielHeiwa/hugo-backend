import { Body, Controller, HttpStatus, Logger, Post, Res } from '@nestjs/common';
import { CreateSessionDto } from 'src/dto/session.dto';
import { SessionService } from './session.service';
import { Response } from 'express';

@Controller('session')
export class SessionController {

    private logger: Logger = new Logger("session.controller");

    constructor(private readonly sessionService: SessionService) {}

    @Post("create")
    async create(@Res() res: Response, @Body() createSessionData: CreateSessionDto ) {
        try {

            const session = await this.sessionService.createNewSession(createSessionData);

            return res.status(HttpStatus.CREATED).json(session);

        } catch (error: any) {
            this.logger.error("Houve um erro ao criar uma sessão.");
            throw error;
        }
    }

}
