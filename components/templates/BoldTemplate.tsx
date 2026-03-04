import React from 'react';
import { InvoiceData } from '@/types/invoice';
import { formatCurrency } from '@/lib/utils';

export default function BoldTemplate({ data }: { data: InvoiceData }) {
  const netto = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const moms = netto * (data.taxRate / 100);
  const total = netto + moms;

  return (
    <div className="bg-white shadow-xl print:shadow-none w-full max-w-[210mm] min-h-[297mm] relative flex flex-col text-slate-900 mx-auto font-sans overflow-hidden">
      {/* Header Banner */}
      <div 
        className="p-[20mm] print:p-0 print:px-[20mm] print:pt-[20mm] flex flex-col justify-between items-start text-white"
        style={{ backgroundColor: data.themeColor || '#1e293b' }}
      >
        <div className="flex justify-between w-full items-start mb-12">
          <div>
            {data.logoUrl ? (
              <img src={data.logoUrl} alt="Logo" className="max-h-20 object-contain bg-white p-3 rounded-lg shadow-md" />
            ) : (
              <h1 className="text-6xl font-black tracking-tighter uppercase">FAKTURA</h1>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm font-bold uppercase tracking-widest opacity-70 mb-1">Fakturanummer</p>
            <p className="text-4xl font-black tracking-tight">{data.invoiceNumber}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 w-full text-sm">
          <div>
            <p className="font-bold uppercase tracking-widest opacity-70 mb-2 text-xs">Fakturadatum</p>
            <p className="font-medium text-lg">{data.invoiceDate}</p>
          </div>
          {data.dueDate && (
            <div className="text-right">
              <p className="font-bold uppercase tracking-widest opacity-70 mb-2 text-xs">Förfallodatum</p>
              <p className="font-medium text-lg">{data.dueDate}</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-[20mm] print:p-0 print:px-[20mm] print:py-[10mm] flex-1 flex flex-col">
        {/* Addresses */}
        <div className="grid grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-xs font-black tracking-widest text-slate-400 uppercase mb-4 border-b-2 border-slate-100 pb-2">Från</h2>
            <p className="font-black text-xl text-slate-800 mb-2">{data.sender.name}</p>
            {data.sender.orgNr && <p className="text-sm font-medium text-slate-500 mb-1">Org.nr: {data.sender.orgNr}</p>}
            <p className="text-sm text-slate-600">{data.sender.address}</p>
            <p className="text-sm text-slate-600">{data.sender.zipCity}</p>
            {data.sender.email && <p className="text-sm mt-2 font-medium text-slate-600">{data.sender.email}</p>}
            {data.sender.phone && <p className="text-sm font-medium text-slate-600">{data.sender.phone}</p>}
          </div>
          <div>
            <h2 className="text-xs font-black tracking-widest text-slate-400 uppercase mb-4 border-b-2 border-slate-100 pb-2">Till</h2>
            <p className="font-black text-xl text-slate-800 mb-2">{data.receiver.name}</p>
            <p className="text-sm text-slate-600">{data.receiver.address}</p>
            <p className="text-sm text-slate-600">{data.receiver.zipCity}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-12">
          <div className="border-b-4 pb-3 mb-6 grid grid-cols-12 gap-4 text-xs font-black uppercase tracking-widest text-slate-800" style={{ borderColor: data.themeColor || '#1e293b' }}>
            <span className="col-span-6">Beskrivning</span>
            <span className="col-span-2 text-right">Antal</span>
            <span className="col-span-2 text-right">A-pris</span>
            <span className="col-span-2 text-right">Belopp</span>
          </div>
          {data.items.map((item) => (
            <div key={item.id} className="py-4 border-b border-slate-200 grid grid-cols-12 gap-4 text-sm">
              <span className="col-span-6 font-bold text-slate-800 text-base">{item.description}</span>
              <span className="col-span-2 text-right font-medium text-slate-600">{item.quantity}</span>
              <span className="col-span-2 text-right font-medium text-slate-600">{formatCurrency(item.unitPrice, data.currency)}</span>
              <span className="col-span-2 text-right font-black text-slate-900 text-base">{formatCurrency(item.quantity * item.unitPrice, data.currency)}</span>
            </div>
          ))}
        </div>

        {/* Totals Box */}
        <div className="flex justify-end mb-16">
          <div className="w-80 bg-slate-50 p-8 rounded-xl border-2 border-slate-100">
            <div className="flex justify-between text-sm py-2 text-slate-600 font-medium">
              <span>Netto</span>
              <span>{formatCurrency(netto, data.currency)}</span>
            </div>
            <div className="flex justify-between text-sm py-2 text-slate-600 font-medium">
              <span>Moms ({data.taxRate}%)</span>
              <span>{formatCurrency(moms, data.currency)}</span>
            </div>
            <div className="flex justify-between font-black text-2xl py-6 mt-4 border-t-2 border-slate-200 text-slate-900">
              <span>Att betala</span>
              <span style={{ color: data.themeColor || '#1e293b' }}>{formatCurrency(total, data.currency)}</span>
            </div>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="mb-8">
          <h2 className="text-xs font-black tracking-widest text-slate-400 uppercase mb-3">Betalningsvillkor</h2>
          <p className="text-sm font-medium text-slate-700">{data.paymentTerms}</p>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8 border-t-4 text-center" style={{ borderColor: data.themeColor || '#1e293b' }}>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            {data.sender.name} • {data.sender.orgNr} • {data.sender.address}, {data.sender.zipCity}
            {data.sender.website && ` • ${data.sender.website}`}
          </p>
        </div>
      </div>
    </div>
  );
}
