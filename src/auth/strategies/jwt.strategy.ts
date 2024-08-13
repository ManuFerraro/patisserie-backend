import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import {  User } from "@prisma/client";
import { JwtPayload } from "../interfaces/jwt.payload.interface";
import { PrismaService } from "src/prisma/prisma.service";





@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {
    constructor(
        private readonly prismaService: PrismaService,
        configService: ConfigService,
    ) {
        super({
               secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }


    async validate(payload: JwtPayload): Promise<User> {
        const { id } = payload;
        const userId = Number(id);

        const user = await this.prismaService.user.findUnique({
            where: { id: userId }
        });
        console.log('USSSSSSSSSSER', user)
        if (!user)
            throw new UnauthorizedException('Token not valid')

        return user;
    }
}