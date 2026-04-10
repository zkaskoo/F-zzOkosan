import { Controller, Post, Get, Param, UseGuards, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { FollowsService } from './follows.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface ReqUser { id: string; email: string; name: string }

@Controller('users/:userId/follow')
@UseGuards(JwtAuthGuard)
export class FollowsController {
  constructor(private followsService: FollowsService) {}

  @Post()
  toggle(
    @Param('userId') userId: string,
    @Request() req: ExpressRequest & { user: ReqUser },
  ) {
    return this.followsService.toggle(req.user.id, userId);
  }

  @Get()
  status(
    @Param('userId') userId: string,
    @Request() req: ExpressRequest & { user: ReqUser },
  ) {
    return this.followsService.getStatus(req.user.id, userId);
  }
}
