import React, { useState } from "react";

const InvoicePage = () => {

  const [formData, setFormData] = useState({
    invoiceDate: new Date().toISOString().slice(0, 10),

    billedTo: {
      name: "",
      address: "",
      placeOfSupply: "",
      transportMode: "",
      state: "",
      stateCode: "",
      gstIn: "",
    },

    items: [{ description: "", hsnCode: "", quantity: 0, rate: 0, amount: 0 }],

    freightCharge: 0,
  });

  /* ================= TAX RULE ================= */
  const getTaxByState = (stateCode) => {
    if (stateCode === "09") {
      return { cgst: 2.5, sgst: 2.5, igst: 0 };
    }
    return { cgst: 0, sgst: 0, igst: 5 };
  };

  /* ================= HANDLERS ================= */
  const handleChange = (e, section, field, index = null) => {
    const value = e.target.value;

    setFormData((prev) => {
      if (index !== null) {
        const items = [...prev.items];
        items[index][field] =
          field === "quantity" || field === "rate"
            ? Number(value) || 0
            : value;

        items[index].amount =
          items[index].quantity * items[index].rate;

        return { ...prev, items };
      }

      return {
        ...prev,
        [section]: { ...prev[section], [field]: value },
      };
    });
  };

  const addItem = () =>
    setFormData((p) => ({
      ...p,
      items: [...p.items, { description: "", hsnCode: "", quantity: 0, rate: 0, amount: 0 }],
    }));

  const removeItem = (i) =>
    setFormData((p) => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }));

  /* ================= PDF ================= */
  const generatePdf = async () => {
    const totalBeforeTax = formData.items.reduce((s, i) => s + i.amount, 0);

    const { cgst, sgst, igst } = getTaxByState(formData.billedTo.stateCode);

    const cgstAmt = (totalBeforeTax * cgst) / 100;
    const sgstAmt = (totalBeforeTax * sgst) / 100;
    const igstAmt = (totalBeforeTax * igst) / 100;

    const totalAfterTax = Math.round(
      totalBeforeTax + cgstAmt + sgstAmt + igstAmt + Number(formData.freightCharge)
    );

    const payload = {
      invoiceDate: formData.invoiceDate,

      receiver: { ...formData.billedTo },

      consignee: {
        ...formData.billedTo,
        code: formData.billedTo.stateCode,
      },

      items: formData.items.map((i, idx) => ({
        serialNo: idx + 1,
        description: i.description,
        hsnCode: i.hsnCode,
        quantity: i.quantity,
        rate: i.rate,
        amount: i.amount,
      })),

      tax: { cgstPercent: cgst, sgstPercent: sgst, igstPercent: igst },

      totalSummary: {
        totalBeforeTax,
        cgstAmount: cgstAmt,
        sgstAmount: sgstAmt,
        igstAmount: igstAmt,
        freightCharge: Number(formData.freightCharge),
        totalAfterTax,
      },
    };

    const res = await fetch("https://sgspadmin-production-prashant.up.railway.app/api/invoice/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/pdf" },
      body: JSON.stringify(payload),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "invoice.pdf";
    a.click();
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-primary mb-6 text-center">Create Invoice</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-secondary mb-4">Invoice Details</h2>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Invoice Date</label>
          <input
            type="date"
            value={formData.invoiceDate}
            onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
            className="block border p-2 w-full rounded-md"
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-secondary mb-4">Billed To</h2>
        {["name", "address", "placeOfSupply", "transportMode", "gstIn", "state", "stateCode"].map((f) => (
          <div key={f} className="mb-4">
            <label className="block text-sm font-medium mb-2 capitalize">{f.replace(/([A-Z])/g, " $1")}</label>
            <input
              placeholder={f}
              className="block border p-2 w-full rounded-md"
              value={formData.billedTo[f]}
              onChange={(e) => handleChange(e, "billedTo", f)}
            />
          </div>
        ))}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-secondary mb-4">Items</h2>
        {formData.items.map((i, idx) => (
          <div key={idx} className="flex gap-4 items-center mb-4">
            <input
              placeholder="Description"
              className="border p-2 flex-1 rounded-md"
              onChange={(e) => handleChange(e, "items", "description", idx)}
            />
            <input
              placeholder="HSN Code"
              className="border p-2 flex-1 rounded-md"
              onChange={(e) => handleChange(e, "items", "hsnCode", idx)}
            />
            <input
              type="number"
              placeholder="Quantity"
              className="border p-2 w-20 rounded-md"
              onChange={(e) => handleChange(e, "items", "quantity", idx)}
            />
            <input
              type="number"
              placeholder="Rate"
              className="border p-2 w-20 rounded-md"
              onChange={(e) => handleChange(e, "items", "rate", idx)}
            />
            <button
              onClick={() => removeItem(idx)}
              className="bg-red-500 text-white px-3 py-1 rounded-md"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addItem}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Add Item
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-secondary mb-4">Freight Charge</h2>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Freight Charge</label>
          <input
            className="block border p-2 w-full rounded-md"
            placeholder="Freight Charge"
            type="number"
            onChange={(e) => setFormData({ ...formData, freightCharge: e.target.value })}
          />
        </div>
      </div>

      <button
        onClick={generatePdf}
        className="w-full bg-green-600 text-white px-4 py-2 rounded-md text-lg"
      >
        Generate PDF
      </button>
    </div>
  );
};

export default InvoicePage;
