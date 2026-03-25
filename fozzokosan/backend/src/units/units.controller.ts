import { Controller, Get, Query } from '@nestjs/common';
import { UnitsService } from './units.service';

@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get('convert')
  convert(
    @Query('quantity') quantity: string,
    @Query('unit') unit: string,
  ) {
    const parsed = this.unitsService.parseQuantity(quantity);
    return this.unitsService.convertToBase(parsed.value, unit);
  }

  @Get('supported')
  getSupportedConversions() {
    return this.unitsService.getSupportedConversions();
  }
}
