import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { each, at } from 'lodash';
import { getManager } from 'typeorm';

@ValidatorConstraint({ name: 'unique', async: true })
export class UniqueConstraint implements ValidatorConstraintInterface {
  async validate(
    value: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const [entityClass, queryCondition] = validationArguments.constraints;
    const parameters = {
      value: value,
    };
    const queryBuilder = getManager()
      .getRepository(entityClass)
      .createQueryBuilder('entity');

    queryBuilder.select(queryCondition.select).where(queryCondition.where);

    const parametersQuery = [];
    each(queryCondition.parameters, (val: any, property: any) => {
      const find = at(parameters, val);
      parametersQuery[property] = find[0];
    });

    const entity = await queryBuilder.setParameters(parametersQuery).getOne();
    if (entity) {
      return false;
    } else {
      return true;
    }
  }
}
