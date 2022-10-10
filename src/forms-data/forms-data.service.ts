import { Injectable } from '@nestjs/common';

import { CreateFormsDatumDto, UpdateFormsDatumDto } from './dto';

@Injectable()
export class FormsDataService {
  create(createFormsDatumDto: CreateFormsDatumDto) {
    return 'This action adds a new formsDatum';
  }

  findAll() {
    return `This action returns all formsData`;
  }

  findOne(id: number) {
    return `This action returns a #${id} formsDatum`;
  }

  update(id: number, updateFormsDatumDto: UpdateFormsDatumDto) {
    return `This action updates a #${id} formsDatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} formsDatum`;
  }
}
