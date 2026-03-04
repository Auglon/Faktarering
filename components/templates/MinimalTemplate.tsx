import React from 'react';
import { InvoiceData } from '@/types/invoice';
import { formatCurrency } from '@/lib/utils';

export default function MinimalTemplate({ data }: { data: InvoiceData }) {
  const netto = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const moms = netto * (data.taxRate / 100);
  const total = netto + moms;

  return (
    <div className="bg-white shadow-xl print:shadow-none w-full max-w-[210mm] min-h-[297mm] p-[20mm] print:p-0 relative flex flex-col text-slate-900 mx-auto font-sans">
      {/* Header */}
      <div className="flex justify-between items-end mb-16">
        <div>
          {data.logoUrl ? (
            <img src={data.logoUrl} alt="Logo" className="max-h-12 object-contain mb-6 grayscale" />
          ) : (
            <h1 className="text-3xl font-light tracking-widest text-slate-800 mb-6 uppercase">FAKTURA</h1>
          )}
          <div className="text-sm text-slate-500 space-y-1">
            <p className="font-medium text-slate-800">{data.sender.name}</p>
            <p>{data.sender.address}</p>
            <p>{data.sender.zipCity}</p>
            {data.sender.orgNr && <p>Org.nr: {data.sender.orgNr}</p>}
          </div>
        </div>
        <div className="text-right text-sm text-slate-500 space-y-2">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Fakturanummer</p>
            <p className="text-lg font-medium text-slate-800">{data.invoiceNumber}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Datum</p>
            <p className="text-slate-800">{data.invoiceDate}</p>
          </div>
          {data.dueDate && (
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Förfallodatum</p>
              <p className="text-slate-800">{data.dueDate}</p>
            </div>
          )}
        </div>
      </div>

      {/* Receiver */}
      <div className="mb-16">
        <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">Faktureras till</p>
        <p className="font-medium text-lg text-slate-800">{data.receiver.name}</p>
        <p className="text-slate-500 mt-1">{data.receiver.address}</p>
        <p className="text-slate-500">{data.receiver.zipCity}</p>
      </div>

      {/* Items Table */}
      <div className="mb-12">
        <div className="border-b border-slate-200 pb-3 mb-4 grid grid-cols-12 gap-4 text-xs uppercase tracking-widest text-slate-400">
          <span className="col-span-6">Beskrivning</span>
          <span className="col-span-2 text-right">Antal</span>
          <span className="col-span-2 text-right">A-pris</span>
          <span className="col-span-2 text-right">Belopp</span>
        </div>
        {data.items.map((item) => (
          <div key={item.id} className="py-3 border-b border-slate-50 grid grid-cols-12 gap-4 text-sm text-slate-600">
            <span className="col-span-6 text-slate-800">{item.description}</span>
            <span className="col-span-2 text-right">{item.quantity}</span>
            <span className="col-span-2 text-right">{formatCurrency(item.unitPrice, data.currency)}</span>
            <span className="col-span-2 text-right text-slate-800">{formatCurrency(item.quantity * item.unitPrice, data.currency)}</span>
          </div>
        ))}
      </div>

      {/* Totals Box */}
      <div className="flex justify-end mb-16">
        <div className="w-64">
          <div className="flex justify-between text-sm py-2 text-slate-500">
            <span>Netto</span>
            <span>{formatCurrency(netto, data.currency)}</span>
          </div>
          <div className="flex justify-between text-sm py-2 text-slate-500">
            <span>Moms ({data.taxRate}%)</span>
            <span>{formatCurrency(moms, data.currency)}</span>
          </div>
          <div className="flex justify-between font-medium text-xl py-4 border-t border-slate-200 mt-2 text-slate-800">
            <span>Att betala</span>
            <span>{formatCurrency(total, data.currency)}</span>
          </div>
        </div>
      </div>

      {/* Payment Terms */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Betalningsvillkor</p>
        <p className="text-sm text-slate-600">{data.paymentTerms}</p>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8 border-t border-slate-100 text-center flex flex-col items-center justify-center gap-1">
        <p className="text-xs text-slate-400 tracking-wide">
          {data.sender.name} | {data.sender.orgNr}
        </p>
        <p className="text-xs text-slate-400 tracking-wide">
          {data.sender.address}, {data.sender.zipCity}
        </p>
        {(data.sender.email || data.sender.phone || data.sender.website) && (
          <p className="text-xs text-slate-400 tracking-wide mt-1">
            {[data.sender.email, data.sender.phone, data.sender.website].filter(Boolean).join(' | ')}
          </p>
        )}
      </div>
    </div>
  );
}
