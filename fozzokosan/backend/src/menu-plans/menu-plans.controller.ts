import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { MenuPlansService } from './menu-plans.service';
import { CreateMenuPlanDto, AddMenuItemDto } from './dto/create-menu-plan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface ReqUser {
  id: string;
  email: string;
  name: string;
}

@Controller('menu-plans')
@UseGuards(JwtAuthGuard)
export class MenuPlansController {
  constructor(private readonly menuPlansService: MenuPlansService) {}

  @Post()
  create(
    @Body() dto: CreateMenuPlanDto,
    @Request() req: ExpressRequest & { user: ReqUser },
  ) {
    return this.menuPlansService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Request() req: ExpressRequest & { user: ReqUser }) {
    return this.menuPlansService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req: ExpressRequest & { user: ReqUser },
  ) {
    return this.menuPlansService.findOne(id, req.user.id);
  }

  @Post(':id/items')
  addItem(
    @Param('id') id: string,
    @Body() dto: AddMenuItemDto,
    @Request() req: ExpressRequest & { user: ReqUser },
  ) {
    return this.menuPlansService.addItem(id, dto, req.user.id);
  }

  @Delete(':id/items/:itemId')
  removeItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Request() req: ExpressRequest & { user: ReqUser },
  ) {
    return this.menuPlansService.removeItem(id, itemId, req.user.id);
  }

  @Post(':id/shopping-list')
  generateShoppingList(
    @Param('id') id: string,
    @Request() req: ExpressRequest & { user: ReqUser },
  ) {
    return this.menuPlansService.generateShoppingList(id, req.user.id);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: ExpressRequest & { user: ReqUser },
  ) {
    return this.menuPlansService.remove(id, req.user.id);
  }
}
