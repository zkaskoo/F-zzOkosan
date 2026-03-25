import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface ReqUser {
  id: string;
  email: string;
  name: string;
}

@Controller('recipes/:recipeId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Param('recipeId') recipeId: string,
    @Body() dto: CreateCommentDto,
    @Request() req: ExpressRequest & { user: ReqUser },
  ) {
    return this.commentsService.create(recipeId, req.user.id, dto);
  }

  @Get()
  findByRecipe(
    @Param('recipeId') recipeId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.commentsService.findByRecipe(recipeId, page || 1, limit || 20);
  }

  @Delete(':commentId')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('commentId') commentId: string,
    @Request() req: ExpressRequest & { user: ReqUser },
  ) {
    return this.commentsService.remove(commentId, req.user.id);
  }
}
