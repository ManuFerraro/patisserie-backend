import { UseGuards, applyDecorators } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserRoleGuard } from "../guards/user-role.guard";
import { RoleProtected } from "./rol-protected.decorator";
import { ValidRole } from "../interfaces/auth.interface";





export function Auth(...roles: ValidRole[]) {
    return applyDecorators(
      RoleProtected(...roles),
      UseGuards(AuthGuard(), UserRoleGuard),
    );
}