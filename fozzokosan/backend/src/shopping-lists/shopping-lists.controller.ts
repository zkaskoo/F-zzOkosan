import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { ShoppingListsService } from './shopping-lists.service';
import { CreateShoppingListDto } from './dto/create-shopping-list.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface ReqUser {
  id: string;
  email: string;
  name: string;
}

@Controller('shopping-lists')
@UseGuards(JwtAuthGuard)
export class ShoppingListsController {
  constructor(private readonly shoppingListsService: ShoppingListsService) {}

  @Post()
  generate(
    @Body() dto: CreateShoppingListDto,
    @Request() req: ExpressRequest & { user: ReqUser },
  ) {
    return this.shoppingListsService.generate(dto, req.user.id);
  }

  @Get()
  findAll(@Request() req: ExpressRequest & { user: ReqUser }) {
    return this.shoppingListsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req: ExpressRequest & { user: ReqUser },
  ) {
    return this.shoppingListsService.findOne(id, req.user.id);
  }

  @Patch(':id/items/:itemId/toggle')
  toggleItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Request() req: ExpressRequest & { user: ReqUser },
  ) {
    return this.shoppingListsService.toggleItem(id, itemId, req.user.id);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: ExpressRequest & { user: ReqUser },
  ) {
    return this.shoppingListsService.remove(id, req.user.id);
  }
}
