import * as Faker from 'faker';
import { Store } from '../../store/entities/store.entity';
import { define } from 'typeorm-seeding';
import { User } from '../../user/entities/user.entity';
import { Address } from '../../address/entities/address.entity';

define(Store, (
  faker: typeof Faker,
  context: { user: User; address: Address },
) => {
  const store = new Store();
  store.description = faker.company.catchPhraseDescriptor();
  store.name = faker.company.companyName();

  const oneOrZero = Math.random() > 0.5 ? 1 : 0; // Paris or Nancy
  const coordinates = [
    oneOrZero === 0 ? 2.3488 : 6.184417,
    oneOrZero === 0 ? 48.8534 : 48.692054,
  ];
  store.coordinates = {
    type: 'Point',
    coordinates: coordinates,
  };
  store.user = context.user;
  store.address = context.address;
  store.image =
    'https://mamimomo-image.s3.fr-par.scw.cloud/static/default_thumbnail.jpg'; // default
  store.publish = true;
  return store;
});
