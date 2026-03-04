'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Printer, Wand2, Globe, Palette, LayoutTemplate } from 'lucide-react';
import { InvoiceData, InvoiceItem } from '@/types/invoice';
import ClassicTemplate from '@/components/templates/ClassicTemplate';
import ModernTemplate from '@/components/templates/ModernTemplate';
import MinimalTemplate from '@/components/templates/MinimalTemplate';
import BoldTemplate from '@/components/templates/BoldTemplate';
import { extractCompanyInfo } from './actions';

const defaultData: InvoiceData = {
  invoiceNumber: "2026-03",
  invoiceDate: "2026-01-23",
  dueDate: "2026-02-23",
  logoUrl: "",
  themeColor: "#0f172a",
  template: "classic",
  sender: {
    name: "Lece AB",
    orgNr: "556896-5999",
    address: "Minnebergsvägen 1",
    zipCity: "167 41 Bromma",
    email: "info@lece.se",
    phone: "08-123 45 67",
    website: "www.lece.se"
  },
  receiver: {
    name: "Bolagsjuristerna i Sverige AB",
    address: "Armfeltsgatan 1C",
    zipCity: "115 34 Stockholm",
  },
  items: [
    { id: "1", description: "Konsulttjänster", quantity: 1, unitPrice: 12500 }
  ],
  taxRate: 25,
  paymentTerms: "Betalning sker kontant",
  currency: "SEK"
};

const THEME_COLORS = [
  "#0f172a", // Slate 900
  "#3b82f6", // Blue 500
  "#10b981", // Emerald 500
  "#f59e0b", // Amber 500
  "#ef4444", // Red 500
  "#8b5cf6", // Violet 500
  "#ec4899", // Pink 500
  "#14b8a6", // Teal 500
];

export default function InvoiceGenerator() {
  const [data, setData] = useState<InvoiceData>(defaultData);
  const [urlInput, setUrlInput] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);

  const updateData = (field: keyof InvoiceData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const updateSender = (field: keyof InvoiceData['sender'], value: string) => {
    setData(prev => ({ ...prev, sender: { ...prev.sender, [field]: value } }));
  };

  const updateReceiver = (field: keyof InvoiceData['receiver'], value: string) => {
    setData(prev => ({ ...prev, receiver: { ...prev.receiver, [field]: value } }));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addItem = () => {
    setData(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now().toString(), description: "", quantity: 1, unitPrice: 0 }]
    }));
  };

  const removeItem = (id: string) => {
    setData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleUrlBranding = async () => {
    if (!urlInput) return;
    setIsExtracting(true);
    try {
      // 1. Set Logo URL using Clearbit
      const domain = new URL(urlInput.startsWith('http') ? urlInput : `https://${urlInput}`).hostname;
      const logoUrl = `https://logo.clearbit.com/${domain}`;
      
      // 2. Extract company info using Gemini
      const info = await extractCompanyInfo(urlInput);
      
      setData(prev => ({
        ...prev,
        logoUrl,
        sender: {
          ...prev.sender,
          name: info?.name || prev.sender.name,
          orgNr: info?.orgNr || prev.sender.orgNr,
          address: info?.address || prev.sender.address,
          zipCity: info?.zipCity || prev.sender.zipCity,
          website: domain
        }
      }));
    } catch (error) {
      console.error("Failed to brand from URL", error);
    } finally {
      setIsExtracting(false);
    }
  };

  const generateExample = () => {
    setData({
      invoiceNumber: "2026-04",
      invoiceDate: "2026-02-15",
      dueDate: "2026-03-17",
      logoUrl: "https://logo.clearbit.com/spotify.com",
      themeColor: "#10b981",
      template: "modern",
      sender: {
        name: "Spotify AB",
        orgNr: "556703-7485",
        address: "Regeringsgatan 19",
        zipCity: "111 53 Stockholm",
        email: "billing@spotify.com",
        phone: "08-123 45 67",
        website: "www.spotify.com"
      },
      receiver: {
        name: "Designbyrån Kreativ AB",
        address: "Kungsgatan 10",
        zipCity: "411 19 Göteborg",
      },
      items: [
        { id: "1", description: "Enterprise License (Annual)", quantity: 50, unitPrice: 1200 },
        { id: "2", description: "Premium Support Setup", quantity: 1, unitPrice: 5000 }
      ],
      taxRate: 25,
      paymentTerms: "30 dagar netto",
      currency: "SEK"
    });
  };

  const renderTemplate = () => {
    switch (data.template) {
      case 'modern': return <ModernTemplate data={data} />;
      case 'minimal': return <MinimalTemplate data={data} />;
      case 'bold': return <BoldTemplate data={data} />;
      case 'classic':
      default: return <ClassicTemplate data={data} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar Form */}
      <div className="w-full md:w-[450px] bg-white border-r border-slate-200 flex flex-col h-screen print:hidden shadow-lg z-10">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h1 className="font-bold text-lg text-slate-800">Faktura Config</h1>
          <div className="flex gap-2">
            <button onClick={generateExample} className="flex items-center gap-1 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors text-sm font-medium" title="Generate Example">
              <Wand2 size={16} />
              <span className="hidden sm:inline">Example</span>
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-1 px-3 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors text-sm font-medium" title="Save as PDF">
              <Printer size={16} />
              <span>PDF</span>
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 space-y-8">
          
          {/* URL Branding */}
          <section className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
              <Globe size={18} /> Auto-Brand from URL
            </h3>
            <p className="text-xs text-indigo-700 mb-3">Enter your website URL to automatically fetch logo and company details.</p>
            <div className="flex gap-2">
              <input 
                type="url" 
                placeholder="https://example.com" 
                className="flex-1 border border-indigo-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUrlBranding()}
              />
              <button 
                onClick={handleUrlBranding}
                disabled={isExtracting || !urlInput}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {isExtracting ? 'Fetching...' : 'Fetch'}
              </button>
            </div>
          </section>

          {/* Design Settings */}
          <section>
            <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
              <LayoutTemplate size={18} /> Design
            </h3>
            
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Template</label>
              <div className="grid grid-cols-2 gap-2">
                {['classic', 'modern', 'minimal', 'bold'].map((tpl) => (
                  <button
                    key={tpl}
                    onClick={() => updateData('template', tpl)}
                    className={`px-3 py-2 rounded-md text-sm font-medium capitalize border transition-all ${
                      data.template === tpl 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {tpl}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2 flex items-center gap-1">
                <Palette size={14} /> Theme Color
              </label>
              <div className="flex flex-wrap gap-2">
                {THEME_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => updateData('themeColor', color)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${data.themeColor === color ? 'scale-110 border-slate-900' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
                <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-slate-200">
                  <input 
                    type="color" 
                    value={data.themeColor} 
                    onChange={(e) => updateData('themeColor', e.target.value)}
                    className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <Input label="Logo URL" value={data.logoUrl} onChange={(e: any) => updateData('logoUrl', e.target.value)} placeholder="https://..." />
          </section>

          <section>
            <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Document</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Invoice Number" value={data.invoiceNumber} onChange={(e: any) => updateData('invoiceNumber', e.target.value)} />
              <Input label="Currency" value={data.currency} onChange={(e: any) => updateData('currency', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Invoice Date" type="date" value={data.invoiceDate} onChange={(e: any) => updateData('invoiceDate', e.target.value)} />
              <Input label="Due Date" type="date" value={data.dueDate} onChange={(e: any) => updateData('dueDate', e.target.value)} />
            </div>
          </section>

          <section>
            <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Sender</h3>
            <Input label="Company Name" value={data.sender.name} onChange={(e: any) => updateSender('name', e.target.value)} />
            <Input label="Org.nr" value={data.sender.orgNr} onChange={(e: any) => updateSender('orgNr', e.target.value)} />
            <Input label="Address" value={data.sender.address} onChange={(e: any) => updateSender('address', e.target.value)} />
            <Input label="Zip & City" value={data.sender.zipCity} onChange={(e: any) => updateSender('zipCity', e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Email" type="email" value={data.sender.email} onChange={(e: any) => updateSender('email', e.target.value)} />
              <Input label="Phone" value={data.sender.phone} onChange={(e: any) => updateSender('phone', e.target.value)} />
            </div>
            <Input label="Website" value={data.sender.website} onChange={(e: any) => updateSender('website', e.target.value)} />
          </section>

          <section>
            <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Receiver</h3>
            <Input label="Company Name" value={data.receiver.name} onChange={(e: any) => updateReceiver('name', e.target.value)} />
            <Input label="Address" value={data.receiver.address} onChange={(e: any) => updateReceiver('address', e.target.value)} />
            <Input label="Zip & City" value={data.receiver.zipCity} onChange={(e: any) => updateReceiver('zipCity', e.target.value)} />
          </section>

          <section>
            <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Items</h3>
            {data.items.map((item) => (
              <div key={item.id} className="flex flex-col gap-2 mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
                  <button onClick={() => removeItem(item.id)} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                <input 
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                  placeholder="Item description" 
                  value={item.description} 
                  onChange={e => updateItem(item.id, 'description', e.target.value)} 
                />
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Quantity</label>
                    <input 
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                      type="number" 
                      min="1"
                      value={item.quantity} 
                      onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))} 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Unit Price</label>
                    <input 
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                      type="number" 
                      value={item.unitPrice} 
                      onChange={e => updateItem(item.id, 'unitPrice', Number(e.target.value))} 
                    />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addItem} className="flex items-center justify-center w-full gap-1 text-sm text-indigo-600 font-medium hover:text-indigo-700 mt-2 px-3 py-2 border border-dashed border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors">
              <Plus size={16} /> Add Item
            </button>
          </section>

          <section>
            <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Settings</h3>
            <Input label="Tax Rate (%)" type="number" value={data.taxRate} onChange={(e: any) => updateData('taxRate', Number(e.target.value))} />
            <Input label="Payment Terms" value={data.paymentTerms} onChange={(e: any) => updateData('paymentTerms', e.target.value)} />
          </section>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center items-start print:p-0 print:overflow-visible print:block bg-slate-100 print:bg-white">
        {renderTemplate()}
      </div>
    </div>
  );
}

const Input = ({ label, value, onChange, type = "text", placeholder, ...props }: any) => (
  <div className="flex flex-col gap-1.5 mb-4">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
    <input
      type={type}
      className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
    />
  </div>
);

