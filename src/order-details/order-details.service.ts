import { Injectable } from '@nestjs/common';
import { IOrderDetail, IProduct } from '@mamimomo/mamimomo-core';
import * as currency from 'currency.js';
@Injectable()
export class OrderDetailsService {
  generateOrderDetails(
    products: {
      product: IProduct;
      quantity: number;
    }[],
  ): IOrderDetail[] {
    return products.map((product) => {
      return {
        title: product.product.title,
        description: product.product.description,
        price: currency(product.product.price).intValue,
        total: currency(product.product.price * product.quantity).intValue,
        quantity: product.quantity,
        productId: product.product.id,
        product: product.product,
        unit: product.product.unit,
        category: product.product.category,
        orderId: null,
      };
    });
  }
}
