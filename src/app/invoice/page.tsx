"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useReactToPrint } from "react-to-print";
import { Receipt, Download, FileText, Calendar, DollarSign, Building, Plus, Trash2 } from "lucide-react";

interface Deliverable {
  id: string;
  description: string;
  rate: number;
  quantity: number;
}

export default function InvoicePage() {
  const { data: session, status } = useSession();
  const componentRef = useRef<HTMLDivElement>(null);

  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [brandName, setBrandName] = useState("");
  const [brandEmail, setBrandEmail] = useState("");
  const [brandAddress, setBrandAddress] = useState("");
  
  const [deliverables, setDeliverables] = useState<Deliverable[]>([
    { id: "1", description: "1x TikTok Video (60s)", rate: 500, quantity: 1 }
  ]);

  if (status === "unauthenticated") {
    redirect("/");
  }

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Invoice_${invoiceNumber}_${brandName || "Brand"}`,
  });

  const addDeliverable = () => {
    setDeliverables([...deliverables, { id: Math.random().toString(), description: "", rate: 0, quantity: 1 }]);
  };

  const removeDeliverable = (id: string) => {
    if (deliverables.length === 1) return;
    setDeliverables(deliverables.filter(d => d.id !== id));
  };

  const updateDeliverable = (id: string, field: keyof Deliverable, value: any) => {
    setDeliverables(deliverables.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const calculateTotal = () => {
    return deliverables.reduce((total, d) => total + (d.rate * d.quantity), 0);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-pulse w-8 h-8 rounded-full bg-[#10b981]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-10 flex justify-between items-center shadow-sm">
        <Link href="/" className="font-black text-xl tracking-tight text-gray-900" style={{ fontFamily: 'var(--font-outfit)' }}>
          RISER.
        </Link>
        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
           <Receipt className="w-4 h-4 text-emerald-600" />
           <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Invoicing</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Form Controls */}
        <div className="lg:col-span-5 space-y-6 overflow-y-auto max-h-[calc(100vh-100px)] pr-2 pb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-1" style={{ fontFamily: 'var(--font-outfit)' }}>
              Invoice Generator
            </h1>
            <p className="text-gray-500 text-sm">Create and download professional invoices instantly.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-5">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <FileText className="w-4 h-4 text-emerald-500" /> Invoice Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Invoice Number</label>
                <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-emerald-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-emerald-500 outline-none" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-5">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Building className="w-4 h-4 text-emerald-500" /> Bill To (Brand)
            </h3>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Brand Name</label>
              <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="e.g. Gymshark" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Brand Email</label>
              <input type="email" value={brandEmail} onChange={(e) => setBrandEmail(e.target.value)} placeholder="contact@brand.com" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Brand Address</label>
              <textarea value={brandAddress} onChange={(e) => setBrandAddress(e.target.value)} placeholder="123 Brand St, City, Country" rows={2} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-emerald-500 outline-none resize-none" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-5">
            <h3 className="font-bold text-gray-900 flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-500" /> Deliverables</span>
            </h3>
            
            <div className="space-y-3">
              {deliverables.map((d, i) => (
                <div key={d.id} className="flex items-start gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="flex-1 space-y-3">
                    <input 
                      type="text" 
                      value={d.description} 
                      onChange={(e) => updateDeliverable(d.id, "description", e.target.value)} 
                      placeholder="Description" 
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-900 focus:ring-1 focus:ring-emerald-500 outline-none" 
                    />
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Rate ($)</label>
                        <input 
                          type="number" 
                          value={d.rate} 
                          onChange={(e) => updateDeliverable(d.id, "rate", Number(e.target.value))} 
                          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-900 focus:ring-1 focus:ring-emerald-500 outline-none" 
                        />
                      </div>
                      <div className="w-20">
                        <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Qty</label>
                        <input 
                          type="number" 
                          value={d.quantity} 
                          onChange={(e) => updateDeliverable(d.id, "quantity", Number(e.target.value))} 
                          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-900 focus:ring-1 focus:ring-emerald-500 outline-none" 
                        />
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeDeliverable(d.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-8">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <button 
              onClick={addDeliverable} 
              className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>
        </div>

        {/* Right: Preview & Print */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full flex justify-end mb-4">
            <button 
              onClick={() => handlePrint()}
              className="bg-[#10b981] hover:bg-[#059669] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>

          <style jsx global>{`
            @media print {
              @page { margin: 0; size: auto; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          `}</style>

          {/* A4 Paper Container for Print Preview */}
          <div className="bg-white shadow-xl rounded-sm w-full max-w-[794px] min-h-[1123px] p-10 sm:p-16 border border-gray-200 overflow-hidden relative print:shadow-none print:border-none print:p-10 print:m-0 print:min-h-0 print:max-w-none print:h-auto print:w-full" ref={componentRef}>
            
            {/* INVOICE HEADER */}
            <div className="flex justify-between items-start mb-16">
              <div>
                <h2 className="font-black text-3xl tracking-tight text-gray-900 mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>RISER.</h2>
                <p className="text-gray-500 text-sm font-medium">{session?.user?.name || "Creator Name"}</p>
                <p className="text-gray-500 text-sm font-medium">{session?.user?.email}</p>
              </div>
              <div className="text-right">
                <h1 className="text-4xl font-bold text-gray-200 uppercase tracking-widest mb-2">Invoice</h1>
                <p className="text-gray-900 font-bold">{invoiceNumber}</p>
                <p className="text-gray-500 text-sm mt-1">Date: {date}</p>
                {dueDate && <p className="text-gray-500 text-sm">Due: {dueDate}</p>}
              </div>
            </div>

            {/* BILL TO */}
            <div className="mb-12">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">Bill To</h3>
              <p className="text-lg font-bold text-gray-900">{brandName || "Brand Name"}</p>
              {brandEmail && <p className="text-gray-600 text-sm mt-1">{brandEmail}</p>}
              {brandAddress && <p className="text-gray-600 text-sm mt-1 whitespace-pre-line">{brandAddress}</p>}
            </div>

            {/* LINE ITEMS */}
            <table className="w-full mb-12">
              <thead>
                <tr className="border-b-2 border-gray-900">
                  <th className="text-left py-3 text-sm font-bold text-gray-900 uppercase">Description</th>
                  <th className="text-center py-3 text-sm font-bold text-gray-900 uppercase w-24">Rate</th>
                  <th className="text-center py-3 text-sm font-bold text-gray-900 uppercase w-20">Qty</th>
                  <th className="text-right py-3 text-sm font-bold text-gray-900 uppercase w-32">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deliverables.map((d) => (
                  <tr key={d.id}>
                    <td className="py-4 text-gray-800">{d.description || "—"}</td>
                    <td className="py-4 text-center text-gray-600">${d.rate.toLocaleString()}</td>
                    <td className="py-4 text-center text-gray-600">{d.quantity}</td>
                    <td className="py-4 text-right font-medium text-gray-900">${(d.rate * d.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* TOTALS */}
            <div className="flex justify-end">
              <div className="w-72">
                <div className="flex justify-between py-2 border-b border-gray-100 text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>${calculateTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-4 text-xl font-bold text-gray-900 border-b-2 border-gray-900">
                  <span>Total</span>
                  <span>${calculateTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="absolute bottom-16 left-16 right-16 border-t border-gray-200 pt-8 text-center">
              <p className="text-gray-400 text-sm font-medium">Thank you for your business!</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
