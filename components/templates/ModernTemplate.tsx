import React from 'react';
import { InvoiceData } from '@/types/invoice';
import { formatCurrency } from '@/lib/utils';

export default function ModernTemplate({ data }: { data: InvoiceData }) {
  const netto = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const moms = netto * (data.taxRate / 100);
  const total = netto + moms;

  return (
    <div className="bg-white shadow-xl print:shadow-none w-full max-w-[210mm] min-h-[297mm] relative flex flex-col text-slate-800 mx-auto overflow-hidden">
      {/* Header Banner */}
      <div 
        className="h-40 w-full p-[20mm] flex justify-between items-start text-white"
        style={{ backgroundColor: data.themeColor || '#3b82f6' }}
      >
        <div>
          {data.logoUrl ? (
            <img src={data.logoUrl} alt="Logo" className="max-h-16 object-contain bg-white/90 p-2 rounded" />
          ) : (
            <h1 className="text-4xl font-bold tracking-tight">FAKTURA</h1>
          )}
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold opacity-90">Fakturanummer</p>
          <p className="text-2xl font-bold">{data.invoiceNumber}</p>
        </div>
      </div>

      <div className="p-[20mm] flex-1 flex flex-col">
        {/* Dates & Info */}
        <div className="flex justify-end gap-8 mb-12 text-sm">
          <div>
            <p className="text-slate-500 uppercase text-xs font-bold mb-1">Fakturadatum</p>
            <p className="font-medium">{data.invoiceDate}</p>
          </div>
          {data.dueDate && (
            <div>
              <p className="text-slate-500 uppercase text-xs font-bold mb-1">Förfallodatum</p>
              <p className="font-medium">{data.dueDate}</p>
            </div>
          )}
        </div>

        {/* Addresses */}
        <div className="flex justify-between mb-12 bg-slate-50 p-6 rounded-lg border border-slate-100">
          <div>
            <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-3">Från</h2>
            <p className="font-bold text-lg text-slate-800">{data.sender.name}</p>
            {data.sender.orgNr && <p className="text-sm mt-1 text-slate-600">Org.nr: {data.sender.orgNr}</p>}
            <p className="text-sm text-slate-600">{data.sender.address}</p>
            <p className="text-sm text-slate-600">{data.sender.zipCity}</p>
            {data.sender.email && <p className="text-sm mt-1 text-slate-600">{data.sender.email}</p>}
          </div>
          <div className="text-right">
            <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-3">Till</h2>
            <p className="font-bold text-lg text-slate-800">{data.receiver.name}</p>
            <p className="text-sm mt-1 text-slate-600">{data.receiver.address}</p>
            <p className="text-sm text-slate-600">{data.receiver.zipCity}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <div className="border-b-2 pb-2 mb-4 grid grid-cols-12 gap-4 text-sm font-bold text-slate-500 uppercase tracking-wider" style={{ borderColor: data.themeColor || '#3b82f6' }}>
            <span className="col-span-6">Beskrivning</span>
            <span className="col-span-2 text-right">Antal</span>
            <span className="col-span-2 text-right">A-pris</span>
            <span className="col-span-2 text-right">Belopp</span>
          </div>
          {data.items.map((item) => (
            <div key={item.id} className="py-3 border-b border-slate-100 grid grid-cols-12 gap-4 text-sm">
              <span className="col-span-6 font-medium text-slate-700">{item.description}</span>
              <span className="col-span-2 text-right text-slate-600">{item.quantity}</span>
              <span className="col-span-2 text-right text-slate-600">{formatCurrency(item.unitPrice, data.currency)}</span>
              <span className="col-span-2 text-right font-medium text-slate-800">{formatCurrency(item.quantity * item.unitPrice, data.currency)}</span>
            </div>
          ))}
        </div>

        {/* Totals Box */}
        <div className="flex justify-end mb-12">
          <div className="w-80 bg-slate-50 rounded-lg p-6 border border-slate-100">
            <div className="flex justify-between text-sm py-2 text-slate-600 border-b border-slate-200">
              <span>Netto</span>
              <span>{formatCurrency(netto, data.currency)}</span>
            </div>
            <div className="flex justify-between text-sm py-2 text-slate-600 border-b border-slate-200">
              <span>Moms ({data.taxRate}%)</span>
              <span>{formatCurrency(moms, data.currency)}</span>
            </div>
            <div className="flex justify-between font-bold text-xl py-4" style={{ color: data.themeColor || '#3b82f6' }}>
              <span>Att betala</span>
              <span>{formatCurrency(total, data.currency)}</span>
            </div>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="mb-8">
          <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">Betalningsvillkor</h2>
          <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded border border-slate-100 inline-block">{data.paymentTerms}</p>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-500">
            <span className="font-bold">{data.sender.name}</span> • {data.sender.orgNr} • {data.sender.address}, {data.sender.zipCity}
            {data.sender.website && ` • ${data.sender.website}`}
          </p>
        </div>
      </div>
    </div>
  );
}
