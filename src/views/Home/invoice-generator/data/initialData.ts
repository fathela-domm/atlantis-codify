import { ProductLine, Invoice } from './types'

export const initialProductLine: ProductLine = {
  description: '',
  quantity: '1',
  rate: '0.00',
}

export const initialInvoice: Invoice = {
  logo: '',
  logoWidth: 100,
  title: 'INVOICE',
  companyName: '',
  name: '',
  companyAddress: '',
  companyAddress2: '',
  companyCountry: 'Kenya',
  billTo: 'Bill To:',
  clientName: '',
  clientAddress: '',
  clientAddress2: '',
  clientCountry: 'Kenya',
  invoiceTitleLabel: 'Invoice #',
  invoiceTitle: (Math.floor(Math.random() * 90000) + 10000).toString(),
  invoiceDateLabel: 'Date',
  invoiceDate: new Date().toDateString(),
  invoiceDueDateLabel: 'DueDate',
  invoiceDueDate: new Date(new Date().getTime() + 86400000 * 30).toDateString(),
  productLineDescription: 'Description',
  productLineQuantity: 'Quantity',
  productLineQuantityRate: 'Rate',
  productLineQuantityAmount: 'Amount',
  productLines: [
    { ...initialProductLine },
  ],
  subTotalLabel: 'Total',
  taxLabel: 'Sale Tax (10%)',
  totalLabel: 'TOTAL',
  currency: 'KSH:',
  notesLabel: 'Notes',
  notes: 'It was great doing business with you.',
  termLabel: 'Terms & Conditions',
  term: 'Please make the payment by the due date.',
}
