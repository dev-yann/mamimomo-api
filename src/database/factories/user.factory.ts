import * as Faker from 'faker';
import { User } from '../../user/entities/user.entity';
import { define, factory } from 'typeorm-seeding';
import { Organization } from '../../organizations/entities/organization.entity';
import * as bcrypt from 'bcrypt';

define(User, (faker: typeof Faker) => {
  const gender = faker.random.number(1);
  const firstName = faker.name.firstName(gender);
  const lastName = faker.name.lastName(gender);

  const user = new User();
  user.email = faker.internet.email(firstName, lastName);
  user.firstName = firstName;
  user.lastName = lastName;
  user.password = bcrypt.hashSync(faker.random.word(), bcrypt.genSaltSync());
  user.phone = faker.phone.phoneNumberFormat(3);
  user.organization = factory(Organization)() as any;
  user.birthday = new Date();
  user.nationality = 'FR';
  user.mangoPayId = '114750140';
  user.mangoPayWalletId = '114750260';
  user.countryOfResidence = 'FR';
  return user;
});
