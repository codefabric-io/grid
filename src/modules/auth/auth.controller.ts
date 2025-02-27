import { Controller, Post, Request } from '@nestjs/common';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  @Post('protected')
  getProtectedData(@Request() req) {
    return { message: 'You have protected access!', user: req.user };
  }

  @Public()
  @Post('public-endpoint')
  publicEndpoint() {
    return { message: 'This is public! you can access without a token' };
  }
}
