export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

export type InvoiceData = {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  logoUrl: string;
  themeColor: string;
  template: 'classic' | 'modern' | 'minimal' | 'bold';
  sender: {
    name: string;
    orgNr: string;
    address: string;
    zipCity: string;
    email: string;
    phone: string;
    website: string;
  };
  receiver: {
    name: string;
    address: string;
    zipCity: string;
  };
  items: InvoiceItem[];
  taxRate: number;
  paymentTerms: string;
  currency: string;
};
