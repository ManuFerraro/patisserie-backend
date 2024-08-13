import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";
import { User } from "@prisma/client";






export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
    
        const req = ctx.switchToHttp().getRequest();
        const user: User = req.user;

        if (!user)
            throw new InternalServerErrorException('User not found (request)');


       return ( !data ) ? user : user[data];

    }
);