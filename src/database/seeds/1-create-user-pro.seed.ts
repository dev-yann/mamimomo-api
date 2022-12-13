import { Seeder, Factory } from 'typeorm-seeding';
import { Product } from '../../products/entities/product.entity';
import { Store } from '../../store/entities/store.entity';
import { Address } from '../../address/entities/address.entity';
import { User } from '../../user/entities/user.entity';

export default class CreateUserProSeeder implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const users = await factory(User)().createMany(25);
    for (const user of users) {
      const address = await factory(Address)().create();
      const store = await factory(Store)({ user, address }).create();
      await factory(Product)({ store }).createMany(25); // 25 products for 1 User and one Store
    }
  }
}
