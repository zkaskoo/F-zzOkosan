import { Controller, Get, Query } from '@nestjs/common';
import { UnitsService } from './units.service';
import { ConvertQueryDto } from './dto/convert-query.dto';

@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get('convert')
  convert(@Query() query: ConvertQueryDto) {
    const parsed = this.unitsService.parseQuantity(query.quantity);
    return this.unitsService.convertToBase(parsed.value, query.unit);
  }

  @Get('supported')
  getSupportedConversions() {
    return this.unitsService.getSupportedConversions();
  }
}
