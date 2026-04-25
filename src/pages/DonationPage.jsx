import { useState } from "react";

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

    // Build Flutterwave standard payment link
    const txRef = `ALA-${Date.now()}`;
    const params = new URLSearchParams({
      public_key: FLUTTERWAVE_PUBLIC_KEY,
      tx_ref: txRef,
      amount: displayAmount,
      currency: "USD",
      payment_options: "card,mobilemoney,ussd",
      redirect_url: window.location.href,
      "customer[email]": email.trim(),
      "customer[name]": name.trim(),
      "customer[phone_number]": phone.trim() || "",
      "customizations[title]": "Africa Laureate Awards",
      "customizations[description]": `${frequency} donation — ${selectedTier || "Custom Amount"}`,
      "meta[frequency]": frequency,
      "meta[tier]": selectedTier || "Custom",
    });

    // Open Flutterwave hosted checkout in a new tab
    window.open(`https://checkout.flutterwave.com/v3/hosted/pay?${params.toString()}`, "_blank");

    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen w-full" style={{ fontFamily: "'DM Sans', sans-serif", background: "#f7f5f1" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatBadge {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 0.8s linear infinite; }
        .fade-up-0 { animation: fadeUp 0.5s 0.05s ease both; }
        .fade-up-1 { animation: fadeUp 0.5s 0.15s ease both; }
        .fade-up-2 { animation: fadeUp 0.5s 0.25s ease both; }
        .fade-up-3 { animation: fadeUp 0.5s 0.35s ease both; }
        .float-badge { animation: floatBadge 4s ease-in-out infinite; }
        .amt-card { transition: all 0.16s ease; cursor: pointer; }
        .amt-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(139,21,56,0.12); }
        .donate-btn { transition: all 0.18s ease; }
        .donate-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(107,12,34,0.38) !important; }
        .donate-btn:active:not(:disabled) { transform: translateY(0); }
        .donate-btn:disabled { opacity: 0.75; cursor: not-allowed; }
        .freq-btn { transition: all 0.18s ease; cursor: pointer; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .field-input { transition: border-color 0.18s; }
        .field-input:focus { outline: none; border-color: #8B1538 !important; box-shadow: 0 0 0 3px rgba(139,21,56,0.08); }
      `}</style>

      {/* HERO */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #6B0C22 0%, #8B1538 55%, #6B0C22 100%)", minHeight: 300 }}>
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #f5c842, transparent 70%)" }} />
        <div className="absolute -bottom-14 -left-14 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #c8922a, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(#f5c842 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

        <div className="relative z-10 flex flex-col items-center text-center px-6 py-16">
          <div className="float-badge mb-5 w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #c8922a, #f5c842)", boxShadow: "0 6px 28px rgba(200,146,42,0.45)" }}>
            <TrophyIcon />
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-10" style={{ background: "rgba(245,208,110,0.5)" }} />
            <span className="text-xs tracking-widest" style={{ color: "#f5d06e", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
              EXCELLENCE · HONOUR · AFRICA
            </span>
            <div className="h-px w-10" style={{ background: "rgba(245,208,110,0.5)" }} />
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.8rem", fontWeight: 600, color: "#fff", lineHeight: 1.2, marginBottom: "1rem" }}>
            Africa Laureate Awards
          </h1>
          <p className="max-w-md text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif" }}>
            The Africa Laureate Awards welcomes additional voluntary contributions with gratitude. To make your donation, please select the button below — you will be taken to The Africa Laureate Awards secure donation page, operated by{" "}
            <span style={{ color: "#f5d06e", fontWeight: 500 }}>Flutterwave</span>.
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-lg mx-auto px-4 pb-16 -mt-8 relative z-10">

        <div className="bg-white rounded-2xl overflow-hidden fade-up-0" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.10)", border: "1px solid rgba(139,21,56,0.1)" }}>
          <div className="h-1" style={{ background: "linear-gradient(90deg, #6B0C22 0%, #f5c842 50%, #6B0C22 100%)" }} />

          <div className="p-7">

            {/* Frequency */}
            <div className="mb-6 fade-up-1">
              <p className="text-xs tracking-widest font-medium mb-3" style={{ color: "#b0a090", fontFamily: "'DM Sans', sans-serif" }}>DONATION FREQUENCY</p>
              <div className="flex rounded-xl p-1 gap-1" style={{ background: "#f7f5f1", border: "1px solid #ede8de" }}>
                {FREQUENCIES.map((f) => (
                  <button key={f} onClick={() => setFrequency(f)} className="freq-btn flex-1 py-2.5 rounded-lg text-sm font-medium"
                    style={frequency === f
                      ? { background: "linear-gradient(135deg, #6B0C22, #8B1538)", color: "#fff", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 2px 10px rgba(107,12,34,0.3)" }
                      : { color: "#b0a090", fontFamily: "'DM Sans', sans-serif", background: "transparent" }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Amounts */}
            <div className="mb-6 fade-up-2">
              <p className="text-xs tracking-widest font-medium mb-3" style={{ color: "#b0a090", fontFamily: "'DM Sans', sans-serif" }}>SELECT AMOUNT</p>
              <div className="grid grid-cols-2 gap-3">
                {PRESET_AMOUNTS.map((a) => {
                  const active = !isCustom && selectedAmount === a.value;
                  return (
                    <button key={a.value} onClick={() => handlePreset(a.value)} className="amt-card rounded-xl px-4 py-4 text-left relative"
                      style={active ? { background: "#fff5f7", border: "2px solid #8B1538" } : { background: "#faf9f6", border: "1.5px solid #ede8de" }}>
                      {active && (
                        <span className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#8B1538" }}>
                          <CheckIcon />
                        </span>
                      )}
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 600, color: active ? "#6B0C22" : "#1f2937", display: "block" }}>{a.label}</span>
                      <span className="text-xs font-medium block mt-0.5" style={{ color: active ? "#8B1538" : "#c0b5a5", fontFamily: "'DM Sans', sans-serif" }}>{a.tier}</span>
                    </button>
                  );
                })}
              </div>

              <button onClick={handleCustom} className="amt-card w-full mt-3 rounded-xl px-4 py-4 flex items-center justify-between"
                style={isCustom ? { background: "#fff5f7", border: "2px solid #8B1538" } : { background: "#faf9f6", border: "1.5px solid #ede8de" }}>
                <div>
                  <span className="text-sm font-medium block" style={{ color: isCustom ? "#6B0C22" : "#9ca3af", fontFamily: "'DM Sans', sans-serif" }}>Other amount</span>
                  <span className="text-xs block mt-0.5" style={{ color: "#c0b5a5", fontFamily: "'DM Sans', sans-serif" }}>Enter any amount you wish</span>
                </div>
                {isCustom
                  ? <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#8B1538" }}><CheckIcon /></span>
                  : <span style={{ color: "#d1ccc0", fontSize: "1.4rem", fontWeight: 300 }}>+</span>}
              </button>

              {isCustom && (
                <div className="mt-3 relative">
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 600, color: "#8B1538", position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }}>$</span>
                  <input autoFocus type="number" min="1" placeholder="Enter amount" value={customAmount} onChange={(e) => setCustomAmount(e.target.value)}
                    className="field-input w-full pl-9 pr-4 py-4 rounded-xl"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 600, background: "#fff5f7", border: "2px solid #8B1538", color: "#6B0C22", caretColor: "#8B1538" }} />
                </div>
              )}
            </div>

            {/* Donor Details */}
            <div className="mb-6 space-y-3">
              <p className="text-xs tracking-widest font-medium" style={{ color: "#b0a090", fontFamily: "'DM Sans', sans-serif" }}>YOUR DETAILS</p>
              <input type="text" placeholder="Full name *" value={name} onChange={(e) => setName(e.target.value)}
                className="field-input w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: "#faf9f6", border: "1.5px solid #ede8de", color: "#1f2937", fontFamily: "'DM Sans', sans-serif" }} />
              <input type="email" placeholder="Email address *" value={email} onChange={(e) => setEmail(e.target.value)}
                className="field-input w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: "#faf9f6", border: "1.5px solid #ede8de", color: "#1f2937", fontFamily: "'DM Sans', sans-serif" }} />
              <input type="tel" placeholder="Phone number (optional)" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="field-input w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: "#faf9f6", border: "1.5px solid #ede8de", color: "#1f2937", fontFamily: "'DM Sans', sans-serif" }} />
            </div>

            {/* Summary */}
            <div className="rounded-xl px-5 py-4 mb-5 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #fff5f7, #ffeef2)", border: "1px solid rgba(139,21,56,0.18)" }}>
              <div>
                <p className="text-xs" style={{ color: "#b0a090", fontFamily: "'DM Sans', sans-serif" }}>{frequency} donation</p>
                {!isCustom && selectedTier && (
                  <p className="text-xs font-medium mt-1" style={{ color: "#8B1538", fontFamily: "'DM Sans', sans-serif" }}>★ {selectedTier}</p>
                )}
              </div>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 600, color: "#6B0C22" }}>{formattedAmount}</span>
            </div>

            {/* CTA */}
            <button onClick={handleDonate} disabled={loading} className="donate-btn w-full rounded-xl py-4 flex items-center justify-center gap-2.5 text-white font-medium text-base"
              style={{ background: "linear-gradient(135deg, #6B0C22, #8B1538)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.025em", boxShadow: "0 4px 20px rgba(107,12,34,0.3)" }}>
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                    <path d="M4 12a8 8 0 018-8" stroke="white" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                  Redirecting to Flutterwave…
                </>
              ) : (
                <>Donate {formattedAmount} via Flutterwave <ArrowIcon /></>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-3" style={{ color: "#c0b5a5" }}>
              <ShieldIcon />
              <span className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>Secured & encrypted · Powered by Flutterwave</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4 fade-up-3">
          {IMPACT_STATS.map((s) => (
            <div key={s.num} className="bg-white rounded-xl py-5 px-3 text-center" style={{ border: "1px solid rgba(139,21,56,0.12)", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 600, color: "#6B0C22", display: "block" }}>{s.num}</span>
              <span className="text-xs leading-tight block mt-1" style={{ color: "#b0a090", fontFamily: "'DM Sans', sans-serif" }}>{s.desc}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#c8bfb0", fontFamily: "'DM Sans', sans-serif" }}>
          © {new Date().getFullYear()} Africa Laureate Awards · All rights reserved
        </p>
      </div>
    </div>
  );
}