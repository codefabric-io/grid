import { Controller, Post, Get, Request, UseGuards } from '@nestjs/common';

import { Public } from './public.decorator';
import { Roles } from './roles.decorator';
import { Permissions } from './permissions.decorator';

import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { PermissionsGuard } from './permissions.guard';

import { Role } from './roles.enum';



@Controller('auth')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class AuthController {

  // The following are samples on how to protect routes
  // there are Public, Protected (Default) routes.
  // Within protected routes, there is Role based and permission based route protection (ACL)
  
  @Post('protected')
  getProtectedData(@Request() req) {
    return { message: 'You have protected access!', user: req.user };
  }

  @Public()
  @Post('public-endpoint')
  publicEndpoint() {
    return { message: 'This is public! you can access without a token' };
  }

  @Get('admin-only')
  @Roles(Role.Supervisor, Role.SuperRole) // Restrict access to these roles
  getAdminData(@Request() req) {
    return { message: 'Only supervisors or super-role users can see this', user: req.user };
  }

  @Get('tasks')
  @Permissions('GET /tasks-service/*') // Only allow if user has this permission
  getTasks() {
    return { message: 'You have permission to view tasks' };
  }
}
