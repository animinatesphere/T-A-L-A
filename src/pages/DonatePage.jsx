import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Heart, ShieldCheck } from "lucide-react";
import "./DonatePage.css";

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
const FLUTTERWAVE_PUBLIC_KEY = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;

const gatewayScripts = [
  {
    src: "https://js.paystack.co/v1/inline.js",
    isReady: () => Boolean(window.PaystackPop),
  },
  {
    src: "https://checkout.flutterwave.com/v3.js",
    isReady: () => Boolean(window.FlutterwaveCheckout),
  },
];

const loadScript = ({ src, isReady }) => {
  if (isReady()) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${src}"]`);
    const script = existingScript || document.createElement("script");
    const onLoad = () => {
      if (isReady()) resolve();
      else reject(new Error("Payment service did not initialize."));
    };

    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", reject, { once: true });

    if (!existingScript) {
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    }
  });
};

const createReference = () =>
  `TALA-DONATION-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export default function DonatePage() {
  const [currency, setCurrency] = useState("NGN");
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gatewaysReady, setGatewaysReady] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    Promise.all(gatewayScripts.map(loadScript))
      .then(() => {
        if (isCurrent) setGatewaysReady(true);
      })
      .catch(() => {
        if (isCurrent) {
          setMessage({
            type: "error",
            text: "The payment services could not load. Refresh the page and try again.",
          });
        }
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const presetAmounts = currency === "NGN" ? [5000, 10000, 20000, 50000] : [10, 25, 50, 100];
  const symbol = currency === "NGN" ? "₦" : "$";
  const numericAmount = Number(amount);

  const completeDonation = (reference) => {
    setIsPaying(false);
    setMessage({
      type: "success",
      text: "Thank you for supporting independent African authors.",
      reference,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage(null);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setMessage({ type: "error", text: "Enter an amount greater than zero." });
      return;
    }

    if (currency === "NGN" && !Number.isInteger(numericAmount)) {
      setMessage({ type: "error", text: "Enter a whole-number amount in naira." });
      return;
    }

    if (!email.trim()) {
      setMessage({ type: "error", text: "Enter your email address to continue." });
      return;
    }

    if (!gatewaysReady) {
      setMessage({ type: "error", text: "The payment service is still loading. Try again shortly." });
      return;
    }

    const reference = createReference();
    setIsPaying(true);

    if (currency === "NGN") {
      if (!PAYSTACK_PUBLIC_KEY) {
        setIsPaying(false);
        setMessage({ type: "error", text: "Paystack is not configured. Please contact the site team." });
        return;
      }

      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: email.trim(),
        amount: Math.round(numericAmount * 100),
        currency: "NGN",
        ref: reference,
        callback: (response) => completeDonation(response.reference || reference),
        onClose: () => setIsPaying(false),
      });
      handler.openIframe();
      return;
    }

    if (!FLUTTERWAVE_PUBLIC_KEY) {
      setIsPaying(false);
      setMessage({ type: "error", text: "Flutterwave is not configured. Please contact the site team." });
      return;
    }

    window.FlutterwaveCheckout({
      public_key: FLUTTERWAVE_PUBLIC_KEY,
      tx_ref: reference,
      amount: numericAmount,
      currency: "USD",
      payment_options: "card,banktransfer",
      customer: {
        email: email.trim(),
        name: name.trim() || email.trim(),
      },
      customizations: {
        title: "The Africa Laureate Awards",
        description: "Support independent African authors",
      },
      callback: (response) => {
        if (response.status === "successful") {
          completeDonation(response.tx_ref || reference);
        } else {
          setIsPaying(false);
          setMessage({ type: "error", text: "The payment was not completed. You can try again." });
        }
      },
      onclose: () => setIsPaying(false),
    });
  };

  return (
    <main className="donate-page">
      <div className="donate-shell">
        <section className="donate-story" aria-labelledby="donate-heading">
          <p className="donate-eyebrow"><span /> A gift to African storytelling</p>
          <h1 id="donate-heading">Stories deserve<br />to travel further.</h1>
          <p className="donate-intro">
            Help The Africa Laureate Awards bring independent authors and their books to more readers.
          </p>
          <div className="donate-pillars" aria-label="Our mission">
            <div><span>01</span><strong>Discover new voices</strong></div>
            <div><span>02</span><strong>Celebrate great books</strong></div>
            <div><span>03</span><strong>Amplify African stories</strong></div>
          </div>
          <p className="donate-note">Every contribution helps keep this work moving.</p>
        </section>

        <section className="donation-panel" aria-labelledby="donation-title">
          <div className="donation-heading">
            <div>
              <p className="donation-kicker">Make a contribution</p>
              <h2 id="donation-title">Choose your amount</h2>
            </div>
            <Heart className="donation-heart" aria-hidden="true" />
          </div>

          <div className="currency-switch" role="group" aria-label="Choose donation currency">
            {["NGN", "USD"].map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={currency === option}
                onClick={() => {
                  setCurrency(option);
                  setAmount("");
                  setMessage(null);
                }}
              >
                <span>{option === "NGN" ? "₦" : "$"}</span>
                {option === "NGN" ? "Naira" : "US Dollar"}
              </button>
            ))}
          </div>

          <form className="donation-form" onSubmit={handleSubmit}>
            <label htmlFor="donation-amount">Donation amount <span>{currency}</span></label>
            <div className="amount-input-wrap">
              <span aria-hidden="true">{symbol}</span>
              <input
                id="donation-amount"
                type="number"
                inputMode="decimal"
                min={currency === "NGN" ? "1" : "0.01"}
                step={currency === "NGN" ? "1" : "0.01"}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Enter an amount"
                required
              />
            </div>

            <div className="amount-presets" aria-label="Suggested amounts">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  aria-pressed={Number(amount) === preset}
                  onClick={() => setAmount(String(preset))}
                >
                  {symbol}{preset.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="donor-fields">
              <div>
                <label htmlFor="donor-name">Name <span>Optional</span></label>
                <input
                  id="donor-name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="donor-email">Email address</label>
                <input
                  id="donor-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {message && (
              <div className={`donation-message ${message.type}`} role="status" aria-live="polite">
                {message.type === "success" ? <Check aria-hidden="true" /> : <span aria-hidden="true">!</span>}
                <div>
                  <p>{message.text}</p>
                  {message.reference && <p className="donation-reference">Reference: {message.reference}</p>}
                </div>
              </div>
            )}

            <button className="donate-submit" type="submit" disabled={isPaying || !gatewaysReady}>
              {isPaying ? "Waiting for payment..." : `Continue with ${currency === "NGN" ? "Paystack" : "Flutterwave"}`}
              {!isPaying && <ArrowUpRight aria-hidden="true" />}
            </button>
          </form>

          <div className="donation-security">
            <ShieldCheck aria-hidden="true" />
            <span>Secure checkout with {currency === "NGN" ? "Paystack" : "Flutterwave"}</span>
          </div>
          <p className="donation-footnote">You’ll complete your contribution in {currency === "NGN" ? "Nigerian naira" : "US dollars"}.</p>
        </section>
      </div>
    </main>
  );
}