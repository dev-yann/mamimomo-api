import * as Faker from 'faker';
import { Organization } from '../../organizations/entities/organization.entity';
import { define } from 'typeorm-seeding';

define(Organization, (faker: typeof Faker) => {
  const organization = new Organization();
  organization.title = faker.name.title();
  organization.description = faker.company.catchPhraseDescriptor();
  return organization;
});
