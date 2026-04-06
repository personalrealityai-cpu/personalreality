import React, { useEffect, useMemo, useState } from "react";

/**
 * Personalreality AI — iOS-style DEMO (single-file React)
 * - Fake auth + onboarding
 * - Bottom tab nav
 * - Premium gating (Free / Clarity+ / Pro)
 * - LocalStorage persistence
 *
 * Drop into a React app as App.jsx (Tailwind recommended).
 */

const LS_KEY = "personalreality_demo_v1";

const TIERS = {
  FREE: "Free",
  CLARITY: "Clarity+",
  PRO: "PersonalrealityPro",
};

const tierOrder = [TIERS.FREE, TIERS.CLARITY, TIERS.PRO];

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Icon({ name, className }) {
  // Tiny inline icon set (SF-symbol-ish vibe)
  const common = "w-5 h-5";
  switch (name) {
    case "house":
      return (
        <svg className={cx(common, className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 10v10h14V10" />
        </svg>
      );
    case "chat":
      return (
        <svg className={cx(common, className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        </svg>
      );
    case "spark":
      return (
        <svg className={cx(common, className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l1.5 6L20 10l-6.5 2L12 18l-1.5-6L4 10l6.5-2z" />
        </svg>
      );
    case "map":
      return (
        <svg className={cx(common, className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3z" />
          <path d="M9 3v15" />
          <path d="M15 6v15" />
        </svg>
      );
    case "person":
      return (
        <svg className={cx(common, className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21a8 8 0 0 0-16 0" />
          <circle cx="12" cy="8" r="4" />
        </svg>
      );
    case "lock":
      return (
        <svg className={cx(common, className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 1 1 8 0v3" />
        </svg>
      );
    case "chev":
      return (
        <svg className={cx(common, className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      );
    default:
      return null;
  }
}

function Pill({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-white/10 text-white",
    free: "bg-white/10 text-white",
    clarity: "bg-white/15 text-white",
    pro: "bg-white/20 text-white",
  };
  return (
    <span className={cx("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", tones[tone])}>{children}</span>
  );
}

function IOSCard({ children, className }) {
  return (
    <div className={cx("rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-sm", className)}>
      {children}
    </div>
  );
}

function IOSButton({ children, variant = "primary", className, ...props }) {
  const styles =
    variant === "primary"
      ? "bg-white text-black hover:bg-white/90"
      : variant === "ghost"
      ? "bg-transparent text-white hover:bg-white/10 border border-white/15"
      : "bg-white/10 text-white hover:bg-white/15";
  return (
    <button
      className={cx(
        "inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition active:scale-[0.99]",
        styles,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function IOSInput({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-sm text-white/80">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        className="w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/25"
      />
    </label>
  );
}

function Chip({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "rounded-full px-3.5 py-2 text-sm border transition",
        active ? "bg-white text-black border-white" : "bg-white/10 text-white border-white/10 hover:bg-white/15"
      )}
    >
      {children}
    </button>
  );
}

function Sheet({ open, title, children, onClose, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-md">
        <div className="rounded-t-3xl bg-zinc-950 border border-white/10 shadow-2xl">
          <div className="px-5 pt-3">
            <div className="mx-auto h-1.5 w-10 rounded-full bg-white/20" />
          </div>
          <div className="px-5 pt-4 pb-3">
            <div className="text-lg font-semibold text-white">{title}</div>
          </div>
          <div className="px-5 pb-5">{children}</div>
          {footer ? <div className="px-5 pb-6">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}

function TopBar({ title, right }) {
  return (
    <div className="sticky top-0 z-40 bg-gradient-to-b from-zinc-950/95 to-zinc-950/60 backdrop-blur-md">
      <div className="mx-auto max-w-md px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold text-white tracking-tight">{title}</div>
          <div className="flex items-center gap-2">{right}</div>
        </div>
      </div>
    </div>
  );
}

function TabBar({ tab, setTab, gated, onGatedTap }) {
  const items = [
    { id: "home", label: "Home", icon: "house" },
    { id: "chat", label: "Chat", icon: "chat" },
    { id: "insights", label: "Insights", icon: "spark" },
    { id: "decisions", label: "Decisions", icon: "map" },
    { id: "profile", label: "Profile", icon: "person" },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-40">
      <div className="mx-auto max-w-md px-4 pb-4">
        <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg">
          <div className="grid grid-cols-5">
            {items.map((it) => {
              const isActive = tab === it.id;
              const isLocked = gated[it.id];
              return (
                <button
                  key={it.id}
                  onClick={() => {
                    if (isLocked) return onGatedTap(it.id);
                    setTab(it.id);
                  }}
                  className={cx(
                    "py-3.5 flex flex-col items-center justify-center gap-1",
                    isActive ? "text-white" : "text-white/70"
                  )}
                >
                  <div className="relative">
                    <Icon name={it.icon} className={cx(isActive ? "opacity-100" : "opacity-85")} />
                    {isLocked ? (
                      <span className="absolute -right-2 -top-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-black">
                        <Icon name="lock" className="w-3 h-3" />
                      </span>
                    ) : null}
                  </div>
                  <div className="text-[11px] font-medium">{it.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function PricingCards({ tier, setTier }) {
  const cards = [
    {
      id: TIERS.FREE,
      title: "Free",
      price: "$0",
      bullets: ["Basic AI chat", "Daily insights", "Starter suggestions"],
    },
    {
      id: TIERS.CLARITY,
      title: "Clarity+",
      price: "$9 / mo",
      bullets: ["Decision mapping", "Weekly reports", "Full suggestion library"],
    },
    {
      id: TIERS.PRO,
      title: "PersonalrealityPro",
      price: "$19 / mo",
      bullets: ["Birth chart context", "Goal mapping", "Priority features"],
    },
  ];
  return (
    <div className="space-y-3">
      {cards.map((c) => {
        const selected = tier === c.id;
        return (
          <button
            key={c.id}
            onClick={() => setTier(c.id)}
            className={cx(
              "w-full text-left rounded-2xl p-4 border transition",
              selected ? "bg-white text-black border-white" : "bg-white/10 text-white border-white/10 hover:bg-white/15"
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-base font-semibold">{c.title}</div>
                <div className={cx("text-sm", selected ? "text-black/70" : "text-white/70")}>{c.price}</div>
              </div>
              {selected ? <span className="text-xs font-semibold">Selected</span> : null}
            </div>
            <div className="mt-3 space-y-1">
              {c.bullets.map((b) => (
                <div key={b} className={cx("text-sm", selected ? "text-black/80" : "text-white/75")}>
                  • {b}
                </div>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="mx-auto max-w-md px-5 pt-10 pb-24">
        <div className="mb-8">
          <div className="text-4xl font-bold text-white tracking-tight">{mode === "login" ? "Welcome back" : "Create your Personalreality"}</div>
          <div className="mt-2 text-white/70">An AI clarity companion that helps you decide, align, and move.</div>
        </div>

        <div className="space-y-4">
          {mode === "signup" ? (
            <IOSInput label="Name" value={name} onChange={setName} placeholder="Erin" />
          ) : null}
          <IOSInput label="Email" value={email} onChange={setEmail} placeholder="you@email.com" type="email" />
          <IOSInput label="Password" value={password} onChange={setPassword} placeholder="••••••••" type="password" />

          <IOSButton
            className="w-full"
            onClick={() => {
              const safeName = (name || "Friend").trim() || "Friend";
              onLogin({ email: email.trim(), name: mode === "signup" ? safeName : "Friend" });
            }}
          >
            Continue
          </IOSButton>

          <div className="flex items-center justify-between text-sm">
            <button
              className="text-white/80 hover:text-white"
              onClick={() => setMode((m) => (m === "login" ? "signup" : "login"))}
            >
              {mode === "login" ? "Create account" : "I already have an account"}
            </button>
            <span className="text-white/40">Demo</span>
          </div>
        </div>

        <div className="mt-10 text-xs text-white/45">
          By continuing you agree to the demo terms. (This is a UI prototype; no real auth.)
        </div>
      </div>
    </div>
  );
}

function Onboarding({ open, onClose, profile, setProfile, tier, setTier }) {
  const steps = ["Welcome", "About you", "Intent", "Personality", "Plan"];
  const [step, setStep] = useState(0);

  const goals = ["Confidence", "Career", "Relationships", "Health", "Money", "Identity"];
  const challenges = ["Overthinking", "Burnout", "Indecision", "Low motivation", "Anxiety", "People-pleasing"];

  useEffect(() => {
    if (!open) setStep(0);
  }, [open]);

  const footer = (
    <div className="flex gap-2">
      <IOSButton
        variant="ghost"
        className="flex-1"
        onClick={() => {
          if (step === 0) return onClose();
          setStep((s) => Math.max(0, s - 1));
        }}
      >
        {step === 0 ? "Not now" : "Back"}
      </IOSButton>
      <IOSButton
        className="flex-1"
        onClick={() => {
          if (step < steps.length - 1) setStep((s) => s + 1);
          else onClose();
        }}
      >
        {step < steps.length - 1 ? "Continue" : "Finish"}
      </IOSButton>
    </div>
  );

  return (
    <Sheet
      open={open}
      title={"Setup"}
      onClose={onClose}
      footer={
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {steps.map((_, i) => (
              <div key={i} className={cx("h-1.5 flex-1 rounded-full", i <= step ? "bg-white" : "bg-white/15")} />
            ))}
          </div>
          {footer}
        </div>
      }
    >
      {step === 0 ? (
        <div className="space-y-3">
          <div className="text-white/80">Let’s personalize your clarity companion in under 60 seconds.</div>
          <IOSCard className="p-4">
            <div className="text-white font-semibold">What you’ll get</div>
            <div className="mt-2 text-white/75 text-sm">• Daily insights tailored to your goals</div>
            <div className="text-white/75 text-sm">• A chat that reflects your values</div>
            <div className="text-white/75 text-sm">• Premium tools when you’re ready</div>
          </IOSCard>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-4">
          <IOSInput
            label="Name"
            value={profile.name}
            onChange={(v) => setProfile((p) => ({ ...p, name: v }))}
            placeholder="Erin"
          />
          <IOSInput
            label="Age"
            value={profile.age}
            onChange={(v) => setProfile((p) => ({ ...p, age: v.replace(/[^0-9]/g, "").slice(0, 2) }))}
            placeholder="32"
          />
          <IOSInput
            label="Location"
            value={profile.location}
            onChange={(v) => setProfile((p) => ({ ...p, location: v }))}
            placeholder="San Francisco"
          />
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-4">
          <div>
            <div className="text-sm text-white/80 mb-2">Goals</div>
            <div className="flex flex-wrap gap-2">
              {goals.map((g) => (
                <Chip
                  key={g}
                  active={profile.goals.includes(g)}
                  onClick={() =>
                    setProfile((p) => ({
                      ...p,
                      goals: p.goals.includes(g) ? p.goals.filter((x) => x !== g) : [...p.goals, g],
                    }))
                  }
                >
                  {g}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm text-white/80 mb-2">Challenges</div>
            <div className="flex flex-wrap gap-2">
              {challenges.map((c) => (
                <Chip
                  key={c}
                  active={profile.challenges.includes(c)}
                  onClick={() =>
                    setProfile((p) => ({
                      ...p,
                      challenges: p.challenges.includes(c) ? p.challenges.filter((x) => x !== c) : [...p.challenges, c],
                    }))
                  }
                >
                  {c}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-4">
          <div className="text-white/80 text-sm">Quick personality snapshot (demo):</div>
          <IOSCard className="p-4">
            <div className="text-white font-semibold">Decision style</div>
            <div className="mt-2 text-white/75 text-sm">How much do you prefer logic vs intuition?</div>
            <input
              type="range"
              min="0"
              max="100"
              value={profile.personality}
              onChange={(e) => setProfile((p) => ({ ...p, personality: Number(e.target.value) }))}
              className="mt-3 w-full"
            />
            <div className="mt-2 flex justify-between text-xs text-white/60">
              <span>Intuition</span>
              <span>Logic</span>
            </div>
          </IOSCard>
          <IOSInput
            label="Zodiac sign"
            value={profile.zodiac}
            onChange={(v) => setProfile((p) => ({ ...p, zodiac: v }))}
            placeholder="Aries"
          />
          <div className="text-xs text-white/55">Pro can add birth time + birth chart context.</div>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="space-y-4">
          <div className="text-white/80 text-sm">Choose a plan (you can change anytime):</div>
          <PricingCards tier={tier} setTier={setTier} />
        </div>
      ) : null}
    </Sheet>
  );
}

function UpgradeSheet({ open, onClose, onUpgrade, reason }) {
  return (
    <Sheet
      open={open}
      title={"Unlock this feature"}
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          <IOSButton variant="ghost" className="flex-1" onClick={onClose}>
            Not now
          </IOSButton>
          <IOSButton className="flex-1" onClick={onUpgrade}>
            Upgrade
          </IOSButton>
        </div>
      }
    >
      <div className="space-y-3">
        <div className="text-white/80">{reason}</div>
        <IOSCard className="p-4">
          <div className="text-white font-semibold">Clarity+ includes</div>
          <div className="mt-2 text-white/75 text-sm">• Decision Mapping (values-based)</div>
          <div className="text-white/75 text-sm">• Weekly reports</div>
          <div className="text-white/75 text-sm">• Full suggestion library</div>
        </IOSCard>
        <div className="text-xs text-white/55">Demo upgrades instantly (no billing).</div>
      </div>
    </Sheet>
  );
}

function HomeScreen({ profile, tier, openOnboarding, openUpgrade }) {
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const tierTone = tier === TIERS.PRO ? "pro" : tier === TIERS.CLARITY ? "clarity" : "free";

  return (
    <div className="px-5 pb-28">
      <div className="flex items-center justify-between mt-2">
        <div className="text-white/70 text-sm">{profile.location ? profile.location : ""}</div>
        <Pill tone={tierTone}>{tier}</Pill>
      </div>

      <IOSCard className="mt-4 p-4">
        <div className="text-white font-semibold">Today’s Clarity</div>
        <div className="mt-2 text-white/75 text-sm">• Pick one goal and make it the only win today.</div>
        <div className="text-white/75 text-sm">• Your next decision gets easier if you name the value behind it.</div>
        <div className="text-white/75 text-sm">• Ask the chat: “What would my best self do in 7 minutes?”</div>
        <div className="mt-4 flex gap-2">
          <IOSButton variant="ghost" className="flex-1" onClick={openOnboarding}>
            Edit setup
          </IOSButton>
          <IOSButton className="flex-1" onClick={() => openUpgrade("Unlock more insights + weekly reports.")}>Upgrade</IOSButton>
        </div>
      </IOSCard>

      <IOSCard className="mt-3 p-4">
        <div className="text-white font-semibold">Your Pattern Snapshot</div>
        <div className="mt-2 text-white/75 text-sm">• You decide faster when you write it out.</div>
        <div className="text-white/75 text-sm">• When you’re stuck, it’s usually a values conflict.</div>
        <div className="mt-3 text-xs text-white/55">Based on your selected goals: {profile.goals.length ? profile.goals.join(", ") : "(none yet)"}</div>
      </IOSCard>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {[
          { title: "AI Chat", desc: "Get clarity now", locked: false },
          { title: "Daily Insights", desc: "Suggestions & patterns", locked: false },
          { title: "Decision Map", desc: "Values-based tool", locked: tier === TIERS.FREE },
          { title: "Goal Map", desc: "Milestones & priorities", locked: tier !== TIERS.PRO },
        ].map((c) => (
          <button
            key={c.title}
            onClick={() => {
              if (c.locked) openUpgrade("This tool is part of a premium plan.");
            }}
            className="text-left"
          >
            <IOSCard className="p-4 h-full">
              <div className="flex items-center justify-between">
                <div className="text-white font-semibold">{c.title}</div>
                {c.locked ? <Icon name="lock" className="text-white/80" /> : <Icon name="chev" className="text-white/60" />}
              </div>
              <div className="mt-2 text-white/70 text-sm">{c.desc}</div>
              {c.locked ? <div className="mt-2 text-xs text-white/50">Tap to upgrade</div> : null}
            </IOSCard>
          </button>
        ))}
      </div>

      <div className="mt-6 text-white/60 text-sm">
        {greeting}, <span className="text-white font-semibold">{profile.name || "Friend"}</span>.
      </div>
    </div>
  );
}

function ChatScreen({ tier, messages, setMessages, openUpgrade }) {
  const [input, setInput] = useState("");

  const quick = ["Help me decide", "Reframe this", "What am I avoiding?", "Plan my week"]; 

async function send(text) {
  const t = text.trim();
  if (!t) return;

  const userMessage = { role: "user", text: t };
  const nextMessages = [...messages, userMessage];

  setMessages(nextMessages);
  setInput("");

  // temporary thinking bubble
  setMessages((prev) => [...prev, { role: "ai", text: "..." }]);

  try {
    const res = await fetch("http://localhost:8787/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: nextMessages.map((m) => ({
          role: m.role === "ai" ? "assistant" : "user",
          content: m.text,
        })),
      }),
    });

    const data = await res.json();

    setMessages((prev) => {
      const withoutThinking = prev.slice(0, -1);
      return [
        ...withoutThinking,
        { role: "ai", text: data.text || "No response." },
      ];
    });
  } catch (err) {
    setMessages((prev) => {
      const withoutThinking = prev.slice(0, -1);
      return [
        ...withoutThinking,
        { role: "ai", text: "Error connecting to AI." },
      ];
    });
    console.error(err);
  }
}
  return (
    <div className="px-5 pb-28">
      <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
        {quick.map((q) => (
          <button key={q} onClick={() => send(q)} className="shrink-0">
            <Pill>{q}</Pill>
          </button>
        ))}
        {tier === TIERS.FREE ? (
          <button onClick={() => openUpgrade("Turn on Decision Mode with Clarity+.")} className="shrink-0">
            <Pill>Decision Mode 🔒</Pill>
          </button>
        ) : (
          <Pill>Decision Mode ✓</Pill>
        )}
        {tier !== TIERS.PRO ? (
          <button onClick={() => openUpgrade("Birth chart context is Pro.")} className="shrink-0">
            <Pill>Birth Chart 🔒</Pill>
          </button>
        ) : (
          <Pill>Birth Chart ✓</Pill>
        )}
      </div>

      <div className="mt-2 space-y-3">
        {messages.length === 0 ? (
          <IOSCard className="p-4">
            <div className="text-white font-semibold">Ask anything</div>
            <div className="mt-2 text-white/75 text-sm">Try: “I’m stuck between two options — help me choose.”</div>
          </IOSCard>
        ) : null}

        {messages.map((m, idx) => {
          const isUser = m.role === "user";
          return (
            <div key={idx} className={cx("flex", isUser ? "justify-end" : "justify-start")}>
              <div
                className={cx(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  isUser ? "bg-white text-black" : "bg-white/10 text-white border border-white/10"
                )}
              >
                {m.text}
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed inset-x-0 bottom-20 z-30">
        <div className="mx-auto max-w-md px-4">
          <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 p-2 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for clarity…"
              className="flex-1 bg-transparent px-3 py-2 text-white placeholder:text-white/40 outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") send(input);
              }}
            />
            <IOSButton className="px-4 py-2" onClick={() => send(input)}>
              Send
            </IOSButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightsScreen({ tier, openUpgrade }) {
  const lockedLibrary = tier === TIERS.FREE;

  return (
    <div className="px-5 pb-28">
      <IOSCard className="mt-3 p-4">
        <div className="flex items-center justify-between">
          <div className="text-white font-semibold">Daily</div>
          <Pill>{new Date().toLocaleDateString()}</Pill>
        </div>
        <div className="mt-3 space-y-2 text-white/75 text-sm">
          <div>• If you feel overwhelmed, reduce the decision to: “what is the next 10%?”</div>
          <div>• Choose one boundary and keep it gentle but firm.</div>
          <div>• Ask: “What am I trying to avoid feeling?”</div>
        </div>
      </IOSCard>

      <IOSCard className="mt-3 p-4">
        <div className="flex items-center justify-between">
          <div className="text-white font-semibold">Library</div>
          {lockedLibrary ? <Icon name="lock" className="text-white/80" /> : null}
        </div>
        <div className="mt-2 text-white/70 text-sm">
          {lockedLibrary ? "Full library is part of Clarity+." : "Browse your full suggestions library."}
        </div>
        <div className="mt-4">
          <IOSButton
            className="w-full"
            onClick={() => {
              if (lockedLibrary) openUpgrade("Unlock the full insights library with Clarity+.");
            }}
            variant={lockedLibrary ? "primary" : "ghost"}
          >
            {lockedLibrary ? "Upgrade to unlock" : "Open library"}
          </IOSButton>
        </div>
      </IOSCard>

      <IOSCard className="mt-3 p-4">
        <div className="text-white font-semibold">Patterns</div>
        <div className="mt-2 text-white/75 text-sm">• Most-used themes: clarity, boundaries, momentum</div>
        <div className="text-white/75 text-sm">• Peak clarity time: mornings (demo)</div>
        <div className="text-white/75 text-sm">• Best nudge: write it down first</div>
      </IOSCard>
    </div>
  );
}

function DecisionsScreen({ tier, openUpgrade }) {
  const locked = tier === TIERS.FREE;
  const [title, setTitle] = useState("Should I move or stay?");
  const [optA, setOptA] = useState("Move");
  const [optB, setOptB] = useState("Stay");
  const [values, setValues] = useState(["Peace", "Growth"]);

  const allValues = ["Peace", "Freedom", "Growth", "Money", "Love", "Health", "Fun", "Stability"];

  return (
    <div className="px-5 pb-28">
      <IOSCard className="mt-3 p-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="text-white font-semibold">Decision Mapping</div>
          {locked ? <Pill>Clarity+ 🔒</Pill> : <Pill>Active</Pill>}
        </div>

        <div className={cx("mt-3 space-y-4", locked && "opacity-40 pointer-events-none select-none")}
        >
          <IOSInput label="Decision" value={title} onChange={setTitle} />
          <div className="grid grid-cols-2 gap-3">
            <IOSInput label="Option A" value={optA} onChange={setOptA} />
            <IOSInput label="Option B" value={optB} onChange={setOptB} />
          </div>
          <div>
            <div className="mb-2 text-sm text-white/80">Values</div>
            <div className="flex flex-wrap gap-2">
              {allValues.map((v) => (
                <Chip
                  key={v}
                  active={values.includes(v)}
                  onClick={() => setValues((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]))}
                >
                  {v}
                </Chip>
              ))}
            </div>
          </div>
          <IOSCard className="p-4">
            <div className="text-white font-semibold">Demo output</div>
            <div className="mt-2 text-white/75 text-sm">
              Based on your top values ({values.slice(0, 3).join(", ") || "—"}), the best-fit next step is to run a 7-day
              experiment for <span className="text-white font-semibold">{optA}</span> and compare stress + energy.
            </div>
          </IOSCard>
        </div>

        {locked ? (
          <div className="absolute inset-0 flex items-end justify-center p-4">
            <div className="w-full">
              <IOSButton className="w-full" onClick={() => openUpgrade("Decision Mapping is a Clarity+ feature.")}>Upgrade to Clarity+</IOSButton>
            </div>
          </div>
        ) : null}
      </IOSCard>

      {tier !== TIERS.PRO ? (
        <IOSCard className="mt-3 p-4">
          <div className="flex items-center justify-between">
            <div className="text-white font-semibold">Goal Mapping</div>
            <Pill>Pro 🔒</Pill>
          </div>
          <div className="mt-2 text-white/70 text-sm">Turn your goals into milestones with priorities.</div>
          <div className="mt-4">
            <IOSButton className="w-full" onClick={() => openUpgrade("Goal Mapping is part of PersonalrealityPro.")}>Upgrade to Pro</IOSButton>
          </div>
        </IOSCard>
      ) : (
        <IOSCard className="mt-3 p-4">
          <div className="text-white font-semibold">Goal Mapping</div>
          <div className="mt-2 text-white/75 text-sm">Pro demo: milestone canvas coming next.</div>
        </IOSCard>
      )}
    </div>
  );
}

function ProfileScreen({ profile, setProfile, tier, setTier, onLogout, openOnboarding }) {
  return (
    <div className="px-5 pb-28">
      <IOSCard className="mt-3 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-lg font-semibold">{profile.name || "Friend"}</div>
            <div className="text-white/70 text-sm">{profile.email || ""}</div>
          </div>
          <Pill>{tier}</Pill>
        </div>
        <div className="mt-4 flex gap-2">
          <IOSButton variant="ghost" className="flex-1" onClick={openOnboarding}>Edit setup</IOSButton>
          <IOSButton className="flex-1" onClick={onLogout}>Log out</IOSButton>
        </div>
      </IOSCard>

      <IOSCard className="mt-3 p-4">
        <div className="text-white font-semibold">Subscription</div>
        <div className="mt-2 text-white/70 text-sm">Switch tiers (demo instantly applies):</div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {tierOrder.map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={cx(
                "rounded-2xl px-3 py-3 text-sm font-semibold border",
                tier === t ? "bg-white text-black border-white" : "bg-white/10 text-white border-white/10 hover:bg-white/15"
              )}
            >
              {t === TIERS.PRO ? "Pro" : t === TIERS.CLARITY ? "Clarity+" : "Free"}
            </button>
          ))}
        </div>
      </IOSCard>

      <IOSCard className="mt-3 p-4">
        <div className="text-white font-semibold">Personalization</div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <IOSInput label="Location" value={profile.location} onChange={(v) => setProfile((p) => ({ ...p, location: v }))} />
          <IOSInput label="Zodiac" value={profile.zodiac} onChange={(v) => setProfile((p) => ({ ...p, zodiac: v }))} />
        </div>
        <div className="mt-3 text-white/70 text-sm">Goals: {profile.goals.length ? profile.goals.join(", ") : "—"}</div>
        <div className="text-white/70 text-sm">Challenges: {profile.challenges.length ? profile.challenges.join(", ") : "—"}</div>
      </IOSCard>

      <IOSCard className="mt-3 p-4">
        <div className="text-white font-semibold">Privacy</div>
        <div className="mt-2 text-white/70 text-sm">Clear saved demo data from this browser.</div>
        <div className="mt-4">
          <IOSButton
            variant="ghost"
            className="w-full"
            onClick={() => {
              localStorage.removeItem(LS_KEY);
              window.location.reload();
            }}
          >
            Clear data
          </IOSButton>
        </div>
      </IOSCard>
    </div>
  );
}

function demoReply(userText, tier) {
  const base = "Here’s a clarity move: name the value, then choose the smallest next action.";
  const decision = "If you’re stuck, list 2 options and score them by: peace, growth, stability. Then pick the one you can test in 7 days.";
  const pro = "(Pro) If you want, we can layer in birth chart context + your long-term goal map to see which option aligns best.";

  const t = userText.toLowerCase();
  if (t.includes("decide") || t.includes("choice") || t.includes("option")) {
    return tier === TIERS.FREE ? decision : tier === TIERS.CLARITY ? decision + "\n\nClarity+: Want me to build a decision map with your values?" : decision + "\n\n" + pro;
  }
  if (t.includes("avoid") || t.includes("anxiety") || t.includes("overthink")) {
    return "Try this: set a 6-minute timer. Write the fear in one sentence. Then write one sentence of truth. Then pick one action you can finish today.";
  }
  if (t.includes("plan") || t.includes("week")) {
    return "Pick 1 outcome for the week, 3 priorities, then schedule two 25-minute blocks for the hardest thing. Everything else is optional.";
  }
  return base;
}

export default function App() {
  const [hydrated, setHydrated] = useState(false);
const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [auth, setAuth] = useState({ loggedIn: false });
  const [tier, setTier] = useState(TIERS.FREE);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    age: "",
    location: "",
    goals: [],
    challenges: [],
    zodiac: "",
    personality: 50,
  });
  const [tab, setTab] = useState("home");
  const [messages, setMessages] = useState([]);

  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("Unlock premium.");

  useEffect(() => {
    const s = loadState();
    if (s) {
      setAuth(s.auth || { loggedIn: false });
      setTier(s.tier || TIERS.FREE);
      setProfile((p) => ({ ...p, ...(s.profile || {}) }));
      setTab(s.tab || "home");
      setMessages(s.messages || []);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveState({ auth, tier, profile, tab, messages });
  }, [auth, tier, profile, tab, messages, hydrated]);

  const gated = useMemo(() => {
    return {
      home: false,
      chat: false,
      insights: false,
      decisions: tier === TIERS.FREE, // Clarity+ required
      profile: false,
    };
  }, [tier]);

  function openUpgrade(reason) {
    setUpgradeReason(reason);
    setUpgradeOpen(true);
  }

  if (!hydrated) {
    return <div className="min-h-screen bg-zinc-950" />;
  }

  if (!auth.loggedIn) {
    // Wait for hydration
if (!hydrated) {
  return null;
}

// Show login screen if not logged in
if (!auth.loggedIn) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md p-6 rounded-3xl bg-white/10 border border-white/10">
        <h1 className="text-2xl font-semibold mb-4">Welcome back</h1>

        <button
          className="w-full rounded-xl bg-white text-black py-3 font-semibold"
          onClick={() => setAuth({ loggedIn: true })}
        >
          Demo login
        </button>
      </div>
    </div>
  );
}
    return (
      <Login
        onLogin={({ email, name }) => {
          setAuth({ loggedIn: true });
          setProfile((p) => ({ ...p, email, name }));
          setOnboardingOpen(true);
        }}
      />
    );
  }

  const Screen = () => {
    if (tab === "home") {
      return (
        <>
          <TopBar
            title="Home"
            right={
              <button
                onClick={() => setOnboardingOpen(true)}
                className="rounded-2xl bg-white/10 border border-white/10 px-3 py-2 text-sm text-white hover:bg-white/15"
              >
                Setup
              </button>
            }
          />
          <HomeScreen profile={profile} tier={tier} openOnboarding={() => setOnboardingOpen(true)} openUpgrade={openUpgrade} />
        </>
      );
    }
    if (tab === "chat") {
      return (
        <>
          <TopBar title="Chat" right={<Pill>{tier === TIERS.PRO ? "Pro" : tier === TIERS.CLARITY ? "Clarity+" : "Free"}</Pill>} />
          <ChatScreen tier={tier} messages={messages} setMessages={setMessages} openUpgrade={openUpgrade} />
        </>
      );
    }
    if (tab === "insights") {
      return (
        <>
          <TopBar title="Insights" right={<Pill>Daily</Pill>} />
          <InsightsScreen tier={tier} openUpgrade={openUpgrade} />
        </>
      );
    }
    if (tab === "decisions") {
      return (
        <>
          <TopBar title="Decisions" right={<Pill>{tier === TIERS.FREE ? "Locked" : "Ready"}</Pill>} />
          <DecisionsScreen tier={tier} openUpgrade={openUpgrade} />
        </>
      );
    }
    return (
      <>
        <TopBar title="Profile" right={<Pill>{tier === TIERS.PRO ? "Pro" : tier === TIERS.CLARITY ? "Clarity+" : "Free"}</Pill>} />
        <ProfileScreen
          profile={profile}
          setProfile={setProfile}
          tier={tier}
          setTier={setTier}
          openOnboarding={() => setOnboardingOpen(true)}
          onLogout={() => {
            setAuth({ loggedIn: false });
            setTier(TIERS.FREE);
            setProfile({ name: "", email: "", age: "", location: "", goals: [], challenges: [], zodiac: "", personality: 50 });
            setMessages([]);
            setTab("home");
            localStorage.removeItem(LS_KEY);
          }}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* subtle iOS-ish gradient */}
      <div className="pointer-events-none fixed inset-0 opacity-70">
        <div className="absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-56 -left-24 h-[340px] w-[340px] rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative">
        <div className="mx-auto max-w-md min-h-screen">
          <Screen />
        </div>

        <TabBar
          tab={tab}
          setTab={setTab}
          gated={gated}
          onGatedTap={() => openUpgrade("Decisions is a Clarity+ feature.")}
        />

        <Onboarding
          open={onboardingOpen}
          onClose={() => setOnboardingOpen(false)}
          profile={profile}
          setProfile={setProfile}
          tier={tier}
          setTier={setTier}
        />

        <UpgradeSheet
          open={upgradeOpen}
          reason={upgradeReason}
          onClose={() => setUpgradeOpen(false)}
          onUpgrade={() => {
            setTier(TIERS.CLARITY);
            setUpgradeOpen(false);
            setTab("decisions");
          }}
        />
      </div>
    </div>
  );
}
