import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Address } from '../../address/entities/address.entity';

define(Address, (faker: typeof Faker) => {
  const address = new Address();
  address.city = faker.address.city();
  address.street = faker.address.streetAddress();
  address.postalCode = faker.address.zipCode();
  return address;
});
