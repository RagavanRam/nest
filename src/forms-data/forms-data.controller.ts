import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { FormsDataService } from './forms-data.service';
import { CreateFormsDatumDto, UpdateFormsDatumDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('forms-data')
@Controller('forms-data')
export class FormsDataController {
  constructor(private readonly formsDataService: FormsDataService) {}

  @Post()
  create(@Body() createFormsDatumDto: CreateFormsDatumDto) {
    return this.formsDataService.create(createFormsDatumDto);
  }

  @Get()
  findAll() {
    return this.formsDataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formsDataService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFormsDatumDto: UpdateFormsDatumDto,
  ) {
    return this.formsDataService.update(+id, updateFormsDatumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formsDataService.remove(+id);
  }
}
