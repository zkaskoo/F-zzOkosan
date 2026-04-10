import { Module } from '@nestjs/common';
import { MenuPlansService } from './menu-plans.service';
import { MenuPlansController } from './menu-plans.controller';
import { ShoppingListsModule } from '../shopping-lists/shopping-lists.module';

@Module({
  imports: [ShoppingListsModule],
  controllers: [MenuPlansController],
  providers: [MenuPlansService],
})
export class MenuPlansModule {}
