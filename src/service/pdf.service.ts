import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class PdfService {
  async createInvoice(order: Order): Promise<Buffer> {
    const invoicePayload = await this.generatePayloadInvoice(order);

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        bufferPages: true,
      });

      this.generateHeader(doc);
      this.generateCustomerInformation(doc, invoicePayload);
      this.generateInvoiceTable(doc, invoicePayload);
      this.generateFooter(doc);

      // customize your PDF document
      doc.end();

      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
    });

    return pdfBuffer;
  }

  async generatePayloadInvoice(order: Order) {
    return {
      shipping: {
        name: `${order.customer.firstName} ${order.customer.lastName}`,
      },
      items: order.orderDetails.map((orderDetail) => {
        return {
          item: orderDetail.product.title,
          description: orderDetail.product.description,
          quantity: orderDetail.quantity,
          amount: orderDetail.total,
        };
      }),
      subtotal: order.total,
      paid: order.total,
      invoice_nr: order.id,
    };
  }

  generateHeader(doc) {
    doc
      .image('assets/logo.png', 50, 45, { width: 50 })
      .fillColor('#444444')
      .fontSize(10)
      .text('Mamimomo.', 200, 50, { align: 'right' })
      .text('122 rue Jean-Jaurès', 200, 65, { align: 'right' })
      .text('54230, Neuves-Maisons', 200, 80, { align: 'right' })
      .moveDown();
  }

  generateCustomerInformation(doc, invoice) {
    doc.fillColor('#444444').fontSize(20).text('Facture', 50, 160);

    this.generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
      .fontSize(10)
      .text(invoice.shipping.name, 50, customerInformationTop)
      .text('Numéro de commande:', 50, customerInformationTop + 15)
      .font('Helvetica-Bold')
      .text(invoice.invoice_nr, 200, customerInformationTop + 15)
      .font('Helvetica')
      .text('Date de paiement:', 50, customerInformationTop + 30)
      .text(this.formatDate(new Date()), 200, customerInformationTop + 30)
      .moveDown();

    this.generateHr(doc, 252);
  }

  generateInvoiceTable(doc, invoice) {
    let i;
    const invoiceTableTop = 330;

    doc.font('Helvetica-Bold');
    this.generateTableRow(
      doc,
      invoiceTableTop,
      'Produit',
      'Description',
      'Prix unitaire',
      'Quantité',
      'Total',
    );
    this.generateHr(doc, invoiceTableTop + 20);
    doc.font('Helvetica');

    for (i = 0; i < invoice.items.length; i++) {
      const item = invoice.items[i];
      const position = invoiceTableTop + (i + 1) * 30;
      this.generateTableRow(
        doc,
        position,
        item.item,
        item.description,
        this.formatCurrency(item.amount / item.quantity),
        item.quantity,
        this.formatCurrency(item.amount),
      );

      this.generateHr(doc, position + 20);
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    this.generateTableRow(
      doc,
      subtotalPosition,
      '',
      '',
      'Total',
      '',
      this.formatCurrency(invoice.subtotal),
    );

    const paidToDatePosition = subtotalPosition + 20;
    this.generateTableRow(
      doc,
      paidToDatePosition,
      '',
      '',
      'Payé',
      '',
      this.formatCurrency(invoice.paid),
    );

    const duePosition = paidToDatePosition + 25;
    doc.font('Helvetica-Bold');
    this.generateTableRow(
      doc,
      duePosition,
      '',
      '',
      'Restant',
      '',
      this.formatCurrency(invoice.subtotal - invoice.paid),
    );
    doc.font('Helvetica');
  }

  generateFooter(doc) {
    doc.fontSize(10).text('Merci pour votre soutien ❤️', 50, 780, {
      align: 'center',
      width: 500,
    });
  }

  generateTableRow(doc, y, item, description, unitCost, quantity, lineTotal) {
    doc
      .fontSize(10)
      .text(item, 50, y)
      .text(description, 150, y)
      .text(unitCost, 280, y, { width: 90, align: 'right' })
      .text(quantity, 370, y, { width: 90, align: 'right' })
      .text(lineTotal, 0, y, { align: 'right' });
  }

  generateHr(doc, y) {
    doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }

  formatCurrency(cents) {
    return (cents / 100).toFixed(2) + '€';
  }

  formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + '/' + month + '/' + day;
  }
}
