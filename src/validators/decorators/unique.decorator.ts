import { registerDecorator, ValidationOptions } from 'class-validator';
import { EntitySchema, ObjectType } from 'typeorm';
import { UniqueConstraint } from '../constraints/unique.constraint';

type UniqueConstraintInterface<E> = [
  ObjectType<E> | EntitySchema<E> | string,
  {
    select: string;
    where: string;
    parameters: Record<string, any>;
  },
];

export function Unique<E>(
  property: UniqueConstraintInterface<E>,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: property,
      options: validationOptions,
      validator: UniqueConstraint,
    });
  };
}
