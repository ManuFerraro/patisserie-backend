import { SetMetadata } from "@nestjs/common";
import { ValidRole } from "../interfaces/auth.interface";






export const META_ROLES = 'roles';



export const RoleProtected = (...args: ValidRole[]) => {
  return SetMetadata(META_ROLES, args.length > 0 ? args : null)
} 