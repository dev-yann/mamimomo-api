import { Seeder, Factory } from 'typeorm-seeding';
import { User } from '../../user/entities/user.entity';
import * as bcrypt from 'bcrypt';

export default class CreateTestUsers implements Seeder {
  public async run(factory: Factory): Promise<any> {
    // user pro => pro@mamimomo.com pro@mamimomo.com
    await factory(User)().create({
      email: 'pro@mamimomo.com',
      password: bcrypt.hashSync('pro@mamimomo.com', bcrypt.genSaltSync()),
    });
    // user app => app@mamimomo.com app@mamimomo.com
    await factory(User)().create({
      email: 'app@mamimomo.com',
      password: bcrypt.hashSync('app@mamimomo.com', bcrypt.genSaltSync()),
      organization: null,
      organizationId: null,
    });
  }
}
