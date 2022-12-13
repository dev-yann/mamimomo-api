import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Product } from '../../products/entities/product.entity';
import { Category, Unit } from '@mamimomo/mamimomo-core';
import { Store } from '../../store/entities/store.entity';

define(Product, (faker: typeof Faker, context: { store: Store }) => {
  // un produit à besoin d'un user qui a un store

  const product = new Product();
  product.title = faker.commerce.product();
  product.description = faker.commerce.productName();
  product.stock = faker.random.number(20);
  product.image =
    'https://mamimomo-image.s3.fr-par.scw.cloud/static/default_thumbnail.jpg';
  product.store = context.store;
  product.unit = Unit.KG;
  product.category = Category.BEEF;
  product.price = faker.random.number(100);
  product.publish = true;

  return product;
});
