import { useState, useEffect } from "react";

const FLUTTERWAVE_PUBLIC_KEY = "FLWPUBK-454bd6769e18e2102daaf9a567da00b3-X";

const PRESET_AMOUNTS = [
  { value: 100, label: "$100", tier: "Supporter" },
  { value: 500, label: "$500", tier: "Champion" },
  { value: 1000, label: "$1,000", tier: "Patron" },
  { value: 5000, label: "$5,000", tier: "Grand Patron" },
];

const FREQUENCIES = ["One-time", "Monthly", "Annually"];

const IMPACT_STATS = [
  { num: "142+", desc: "Laureates honoured across Africa" },
  { num: "28", desc: "Countries represented" },
  { num: "$2M+", desc: "Awards & grants disbursed" },
];

const TrophyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <rect x="6" y="2" width="12" height="13" rx="2" />
    <path d="M9 21h6M12 17v4M7.5 21h9" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-4 h-4">
    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-3 h-3">
    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function DonationPage() {
  const [frequency, setFrequency] = useState("One-time");

  useEffect(() => {
    const flutterwaveScript = document.createElement("script");
    flutterwaveScript.src = "https://checkout.flutterwave.com/v3.js";
    flutterwaveScript.async = true;
    document.body.appendChild(flutterwaveScript);

    return () => {
      document.body.removeChild(flutterwaveScript);
    };
  }, []);
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [isCustom, setIsCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const displayAmount = isCustom
    ? customAmount ? parseFloat(customAmount) : 0
    : selectedAmount;

  const formattedAmount = displayAmount
    ? `$${Number(displayAmount).toLocaleString()}`
    : "$0";

  const selectedTier = PRESET_AMOUNTS.find((a) => a.value === selectedAmount)?.tier;

  const handlePreset = (val) => {
    setSelectedAmount(val);
    setIsCustom(false);
    setCustomAmount("");
  };

  const handleCustom = () => {
    setIsCustom(true);
    setSelectedAmount(null);
  };

  const sendEmailNotification = async (txRef) => {
    try {
      const formData = new FormData();

      // Web3Forms API key
      formData.append("access_key", "7ad34e05-087f-49d6-b593-0a57134ddf96");

      // Email details
      formData.append(
        "subject",
        `New Donation Received from ${name.trim()}`,
      );
      formData.append("from_name", "T.A.L.A. Donation System");

      // Prepare email body
      const emailBody = `
New Donation Received

DONOR INFORMATION:
- Name: ${name.trim()}
- Email: ${email.trim()}
- Phone: ${phone.trim() || "N/A"}

DONATION DETAILS:
- Amount: $${displayAmount}
- Frequency: ${frequency}
- Tier: ${selectedTier || "Custom Amount"}

PAYMENT INFORMATION:
- Reference: ${txRef}
- Status: successful
      `;

      formData.append("message", emailBody);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        console.log("Email notification sent successfully");
      } else {
        console.error("Failed to send email notification");
      }
    } catch (error) {
      console.error("Error sending email notification:", error);
    }
  };

  const handleDonate = () => {
    if (!displayAmount || displayAmount <= 0) {
      alert("Please select or enter a donation amount.");
      return;
    }
    if (!name.trim()) {
      alert("Please enter your full name.");
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    const txRef = `ALA-${Date.now()}`;

    const modal = window.FlutterwaveCheckout({
      public_key: FLUTTERWAVE_PUBLIC_KEY,
      tx_ref: txRef,
      amount: displayAmount,
      currency: "USD",
      payment_options: "card,mobilemoney,ussd",
      customer: {
        email: email.trim(),
        name: name.trim(),
        phone_number: phone.trim() || "",
      },
      customizations: {
        title: "Africa Laureate Awards",
        description: `${frequency} donation — ${selectedTier || "Custom Amount"}`,
      },
      meta: {
        frequency: frequency,
        tier: selectedTier || "Custom",
      },
      callback: function (data) {
        console.log("Payment successful:", data);
        if (data.status === "successful" || data.status === "completed") {
          sendEmailNotification(data.tx_ref);
          alert("Thank you for your donation!");
          // Clear form
          setName("");
          setEmail("");
          setPhone("");
          setCustomAmount("");
          setIsCustom(false);
        }
        modal.close();
        setLoading(false);
      },
      onclose: function () {
        console.log("Payment window closed");
        setLoading(false);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HERO HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#6B0C22] rounded-full mb-4">
            <TrophyIcon />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Support Africa Laureate Awards
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-lg">
            The Africa Laureate Awards welcomes additional voluntary contributions with gratitude. Your support helps us honor excellence across the continent.
          </p>
        </div>

        {/* DONATION FORM */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mb-8">
          <div className="space-y-8">
            
            {/* Frequency Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-4">
                Donation Frequency
              </label>
              <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                {FREQUENCIES.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFrequency(f)}
                    className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-colors ${
                      frequency === f
                        ? "bg-[#6B0C22] text-white shadow"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-4">
                Select Amount
              </label>
              <div className="grid grid-cols-2 gap-4">
                {PRESET_AMOUNTS.map((a) => {
                  const active = !isCustom && selectedAmount === a.value;
                  return (
                    <button
                      key={a.value}
                      onClick={() => handlePreset(a.value)}
                      className={`rounded-xl px-4 py-6 text-center transition-all ${
                        active
                          ? "bg-[#fff5f7] border-2 border-[#6B0C22]"
                          : "bg-white border border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <span className={`block text-2xl font-bold ${active ? "text-[#6B0C22]" : "text-gray-900"}`}>
                        {a.label}
                      </span>
                      <span className={`block text-sm mt-1 font-medium ${active ? "text-[#6B0C22]" : "text-gray-500"}`}>
                        {a.tier}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleCustom}
                className={`w-full mt-4 rounded-xl px-4 py-4 flex items-center justify-between transition-all ${
                  isCustom
                    ? "bg-[#fff5f7] border-2 border-[#6B0C22]"
                    : "bg-white border border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="text-left">
                  <span className={`block text-lg font-bold ${isCustom ? "text-[#6B0C22]" : "text-gray-900"}`}>
                    Custom Amount
                  </span>
                  <span className={`block text-sm font-medium ${isCustom ? "text-[#6B0C22]" : "text-gray-500"}`}>
                    Enter any amount you wish
                  </span>
                </div>
                {isCustom ? (
                  <div className="w-6 h-6 rounded-full bg-[#6B0C22] flex items-center justify-center">
                    <CheckIcon />
                  </div>
                ) : (
                  <span className="text-gray-400 text-2xl font-light">+</span>
                )}
              </button>

              {isCustom && (
                <div className="mt-4 relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-900">
                    $
                  </span>
                  <input
                    autoFocus
                    type="number"
                    min="1"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 text-xl font-bold text-gray-900 border-2 border-[#6B0C22] rounded-xl focus:ring-4 focus:ring-[#fff5f7] outline-none"
                  />
                </div>
              )}
            </div>

            {/* Donor Details */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-4">
                Your Details
              </label>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] focus:border-transparent outline-none bg-gray-50"
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] focus:border-transparent outline-none bg-gray-50"
                />
                <input
                  type="tel"
                  placeholder="Phone Number (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B0C22] focus:border-transparent outline-none bg-gray-50"
                />
              </div>
            </div>

            {/* Summary & Checkout */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-600 font-medium">{frequency} Donation</p>
                  {!isCustom && selectedTier && (
                    <p className="text-[#6B0C22] font-semibold text-sm">★ {selectedTier}</p>
                  )}
                </div>
                <span className="text-3xl font-bold text-gray-900">{formattedAmount}</span>
              </div>

              <button
                onClick={handleDonate}
                disabled={loading}
                className="w-full px-6 py-4 bg-linear-to-r from-[#6B0C22] to-[#4a0818] text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                      <path d="M4 12a8 8 0 018-8" stroke="white" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>Donate {formattedAmount} Securely</>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-gray-500 text-sm font-medium">
                <ShieldIcon />
                <span>Secured & encrypted · Powered by Flutterwave</span>
              </div>
            </div>

          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {IMPACT_STATS.map((s) => (
            <div key={s.num} className="bg-white rounded-xl py-6 px-4 text-center shadow-lg border border-gray-100">
              <span className="block text-3xl font-bold text-[#6B0C22] mb-1">{s.num}</span>
              <span className="block text-sm text-gray-600 font-medium">{s.desc}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 font-medium mb-12">
          © {new Date().getFullYear()} Africa Laureate Awards · All rights reserved
        </p>

      </div>
    </div>
  );
}