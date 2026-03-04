import React from 'react';
import { InvoiceData } from '@/types/invoice';
import { formatCurrency } from '@/lib/utils';

export default function ClassicTemplate({ data }: { data: InvoiceData }) {
  const netto = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const moms = netto * (data.taxRate / 100);
  const total = netto + moms;

  return (
    <div className="bg-white shadow-xl print:shadow-none w-full max-w-[210mm] min-h-[297mm] p-[20mm] print:p-0 relative flex flex-col text-slate-900 mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          {data.logoUrl ? (
            <img src={data.logoUrl} alt="Logo" className="max-h-16 object-contain mb-4" />
          ) : (
            <h1 className="text-5xl font-bold tracking-tight text-slate-900">FAKTURA</h1>
          )}
        </div>
        <div className="text-right text-sm text-slate-600 space-y-1 mt-2">
          {data.logoUrl && <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">FAKTURA</h1>}
          <p>Fakturanummer: {data.invoiceNumber}</p>
          <p>Fakturadatum: {data.invoiceDate}</p>
          {data.dueDate && <p>Förfallodatum: {data.dueDate}</p>}
        </div>
      </div>

      {/* Thick Divider */}
      <div className="border-t-[3px] mt-6 mb-8" style={{ borderColor: data.themeColor || '#0f172a' }}></div>

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-12">
        <div>
          <h2 className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-2">Avsändare</h2>
          <p className="font-bold text-base">{data.sender.name}</p>
          {data.sender.orgNr && <p className="text-sm mt-1">Org.nr: {data.sender.orgNr}</p>}
          <p className="text-sm">{data.sender.address}</p>
          <p className="text-sm">{data.sender.zipCity}</p>
          {data.sender.email && <p className="text-sm mt-1">{data.sender.email}</p>}
          {data.sender.phone && <p className="text-sm">{data.sender.phone}</p>}
        </div>
        <div>
          <h2 className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-2">Mottagare</h2>
          <p className="font-bold text-base">{data.receiver.name}</p>
          <p className="text-sm mt-1">{data.receiver.address}</p>
          <p className="text-sm">{data.receiver.zipCity}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mt-12">
        <div className="text-white text-sm font-bold py-2 px-4 grid grid-cols-12 gap-4" style={{ backgroundColor: data.themeColor || '#1a1e2d' }}>
          <span className="col-span-6">Beskrivning</span>
          <span className="col-span-2 text-right">Antal</span>
          <span className="col-span-2 text-right">A-pris</span>
          <span className="col-span-2 text-right">Belopp</span>
        </div>
        {data.items.map((item) => (
          <div key={item.id} className="bg-[#f3f4f6] text-sm py-3 px-4 grid grid-cols-12 gap-4 mt-1">
            <span className="col-span-6">{item.description}</span>
            <span className="col-span-2 text-right">{item.quantity}</span>
            <span className="col-span-2 text-right">{formatCurrency(item.unitPrice, data.currency)}</span>
            <span className="col-span-2 text-right">{formatCurrency(item.quantity * item.unitPrice, data.currency)}</span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mt-8 flex justify-end">
        <div className="w-72">
          <div className="border-t border-slate-200 mb-2"></div>
          <div className="flex justify-between text-sm py-1 text-slate-600">
            <span>Netto</span>
            <span>{formatCurrency(netto, data.currency)}</span>
          </div>
          <div className="flex justify-between text-sm py-1 text-slate-600">
            <span>Moms ({data.taxRate}%)</span>
            <span>{formatCurrency(moms, data.currency)}</span>
          </div>
          <div className="border-t-2 mt-2 mb-2" style={{ borderColor: data.themeColor || '#0f172a' }}></div>
          <div className="flex justify-between font-bold text-lg py-1">
            <span>Att betala</span>
            <span>{formatCurrency(total, data.currency)}</span>
          </div>
          <div className="border-b-2 mt-2" style={{ borderColor: data.themeColor || '#0f172a' }}></div>
        </div>
      </div>

      {/* Payment Terms */}
      <div className="mt-16">
        <div className="border-t border-slate-200 mb-6"></div>
        <h2 className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-2">Betalningsvillkor</h2>
        <p className="text-sm">{data.paymentTerms}</p>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8">
        <div className="border-t border-slate-200 mb-4"></div>
        <p className="text-xs text-slate-500 text-center">
          {data.sender.name} | Org.nr: {data.sender.orgNr} | {data.sender.address}, {data.sender.zipCity}
          {data.sender.website && ` | ${data.sender.website}`}
        </p>
      </div>
    </div>
  );
}
