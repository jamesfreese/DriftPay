import React, { useState, useEffect, useRef, useCallback } from "react";

// --------- Config ----------
const DRIFTSCAPES = [
  {
    id: "storm",
    name: "Storm Drift",
    sub: "Thunder & Rain",
    defaultUnlocked: true,
    src: "https://cdn.pixabay.com/download/audio/2022/11/22/audio_246951b4e3.mp3",
    icon: "🌩️",
    unlockHint: "Available now",
  },
  {
    id: "whisper",
    name: "Whisper Drift",
    sub: "Forest Wind",
    defaultUnlocked: true,
    src: "https://cdn.pixabay.com/download/audio/2022/08/24/audio_a7a46a2a11.mp3",
    icon: "🌲",
    unlockHint: "Available now",
  },
  {
    id: "flow",
    name: "Flow Drift",
    sub: "Hydration Oasis",
    defaultUnlocked: false,
    src: "https://cdn.pixabay.com/download/audio/2022/02/07/audio_28ccb50b5c.mp3",
    icon: "💧",
    unlockHint: "Log hydration today",
  },
  {
    id: "tide",
    name: "Tide Drift",
    sub: "Beach Waves",
    defaultUnlocked: false,
    src: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_3f9b4b6f3f.mp3?filename=sea-396080.mp3",
    icon: "🌊",
    unlockHint: "3-night streak",
  },
  {
    id: "echo",
    name: "Echo Drift",
    sub: "Ambient Music",
    defaultUnlocked: false,
    src: "https://cdn.pixabay.com/download/audio/2022/05/20/audio_a08b303c3a.mp3",
    icon: "🎶",
    unlockHint: "Journal 5 times",
  },
  {
    id: "blank",
    name: "Blank Drift",
    sub: "White Noise",
    defaultUnlocked: false,
    src: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1b989e3c33.mp3",
    icon: "⚪",
    unlockHint: "Any session ≥ 6 hrs",
  },
];

const todayStr = () => new Date().toISOString().slice(0, 10);

const DriftpayPage = () => {
  const [uid, setUid] = useState("default");
  const K = useCallback((k: string) => `dp_${uid}_${k}`, [uid]);

  const [selectedSounds, setSelectedSounds] = useState<string[]>(() => {
    const saved = localStorage.getItem(K("selectedSounds"));
    return saved ? JSON.parse(saved) : ["whisper"];
  });
  const [unlocked, setUnlocked] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(K("unlocked"));
    if (saved) return JSON.parse(saved);
    const defaults: Record<string, boolean> = {};
    DRIFTSCAPES.forEach((s) => (defaults[s.id] = !!s.defaultUnlocked));
    return defaults;
  });
  const [totalTokens, setTotalTokens] = useState(() =>
    Number(localStorage.getItem(K("tokens")) || 0),
  );
  const [streak, setStreak] = useState(() =>
    Number(localStorage.getItem(K("streak")) || 0),
  );
  const [lastSleepDate, setLastSleepDate] = useState(
    () => localStorage.getItem(K("lastSleepDate")) || null,
  );
  const [dailySleptMs, setDailySleptMs] = useState(() =>
    Number(localStorage.getItem(K("dailySleptMs")) || 0),
  );

  const [hydrationDate, setHydrationDate] = useState(
    () => localStorage.getItem(K("hydrationDate")) || "",
  );
  const [hydrationStreak, setHydrationStreak] = useState(() =>
    Number(localStorage.getItem(K("hydrationStreak")) || 0),
  );
  const [isHydrated, setIsHydrated] = useState(false);
  const [hydrationCooldown, setHydrationCooldown] = useState(0);
  const [hydrationCount, setHydrationCount] = useState(0);

  const [sessionActive, setSessionActive] = useState(false);
  const [sessionMs, setSessionMs] = useState(0);
  const [sessionMessage, setSessionMessage] = useState(
    "Start a session to drift with your selected sound.",
  );
  const [showJournal, setShowJournal] = useState(false);
  const [journalTimer, setJournalTimer] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [journalText, setJournalText] = useState("");
  const [insightResult, setInsightResult] = useState({
    poetic: "",
    tokens: 0,
    hours: 0,
  });
  const [isMuted, setIsMuted] = useState(false);
  const [adCooldown, setAdCooldown] = useState(0);
  const [adRewardStatus, setAdRewardStatus] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const playerRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const tickIntervalRef = useRef<number | null>(null);
  const lastTickRef = useRef(0);
  const journalTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUid(params.get("uid") || "default");
  }, []);

  useEffect(() => {
    localStorage.setItem(K("selectedSounds"), JSON.stringify(selectedSounds));
  }, [selectedSounds, K]);
  useEffect(() => {
    localStorage.setItem(K("unlocked"), JSON.stringify(unlocked));
  }, [unlocked, K]);
  useEffect(() => {
    localStorage.setItem(K("tokens"), String(totalTokens));
  }, [totalTokens, K]);
  useEffect(() => {
    localStorage.setItem(K("streak"), String(streak));
  }, [streak, K]);
  useEffect(() => {
    if (lastSleepDate) localStorage.setItem(K("lastSleepDate"), lastSleepDate);
  }, [lastSleepDate, K]);
  useEffect(() => {
    localStorage.setItem(K("dailySleptMs"), String(dailySleptMs));
  }, [dailySleptMs, K]);
  useEffect(() => {
    localStorage.setItem(K("hydrationDate"), hydrationDate);
  }, [hydrationDate, K]);
  useEffect(() => {
    localStorage.setItem(K("hydrationStreak"), String(hydrationStreak));
  }, [hydrationStreak, K]);

  useEffect(() => {
    Object.values(playerRefs.current).forEach((player) => {
      if (player) {
        player.muted = isMuted;
      }
    });
  }, [isMuted]);

  useEffect(() => {
    const activePlayers = selectedSounds
      .map((id) => playerRefs.current[id])
      .filter(Boolean);
    const inactivePlayers = Object.entries(playerRefs.current)
      .filter(([id]) => !selectedSounds.includes(id))
      .map(([, player]) => player)
      .filter(Boolean);

    if (sessionActive) {
      activePlayers.forEach((player) => player?.play().catch(() => {}));
      inactivePlayers.forEach((player) => player?.pause());
    } else {
      Object.values(playerRefs.current).forEach((player) => player?.pause());
    }
  }, [selectedSounds, sessionActive]);

  useEffect(() => {
    const isHydratedToday = hydrationDate === todayStr();
    setIsHydrated(isHydratedToday);
    if (!isHydratedToday) {
      setHydrationCount(0);
      localStorage.setItem(K("hydrationCount"), "0");
    } else {
      setHydrationCount(Number(localStorage.getItem(K("hydrationCount")) || 0));
    }
  }, [hydrationDate, K]);

  useEffect(() => {
    const lastHydrationTime = Number(
      localStorage.getItem(K("lastHydrationTime")) || 0,
    );
    const now = Date.now();
    const cooldownDuration = 3 * 60 * 60 * 1000; // 3 hours
    const timePassed = now - lastHydrationTime;

    if (lastHydrationTime > 0 && timePassed < cooldownDuration) {
      setHydrationCooldown(cooldownDuration - timePassed);
    }

    const interval = setInterval(() => {
      setHydrationCooldown((prev) => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [K]);

  useEffect(() => {
    const lastAdTime = Number(
      localStorage.getItem(K("ad_last_watch_time")) || 0,
    );
    const now = Date.now();
    const sevenMinutes = 7 * 60 * 1000;
    const timePassed = now - lastAdTime;

    if (timePassed < sevenMinutes) {
      setAdCooldown(sevenMinutes - timePassed);
    }

    const interval = setInterval(() => {
      setAdCooldown((prev) => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [K]);

  useEffect(() => {
    const today = todayStr();
    if (!lastSleepDate || lastSleepDate !== today) {
      setDailySleptMs(0);
    }
  }, [lastSleepDate]);

  const handleHydrate = () => {
    if (hydrationCooldown > 0) return;

    const today = todayStr();
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .slice(0, 10);

    let newStreak = 1;
    if (hydrationDate === yesterday) {
      newStreak = hydrationStreak + 1;
    } else if (hydrationDate !== today) {
      newStreak = 1;
    } else {
      newStreak = hydrationStreak;
    }
    setHydrationStreak(newStreak);
    setHydrationDate(today);

    const now = Date.now();
    localStorage.setItem(K("lastHydrationTime"), String(now));
    setHydrationCooldown(3 * 60 * 60 * 1000);

    let message = `Hydration logged! Breathe in slowly. Let the drift settle your chest. Exhale with ease.`;

    if (unlocked["flow"]) {
      const satsEarned = 5 + Math.min(10, newStreak - 1);
      const currentSats = Number(localStorage.getItem(K("sats_balance")) || 0);
      const newSats = currentSats + satsEarned;
      localStorage.setItem(K("sats_balance"), String(newSats));
      window.dispatchEvent(new Event("storage"));
      message += ` You earned ${satsEarned} sats!`;
    }

    setUnlocked((prev) => ({ ...prev, flow: true }));
    setSessionMessage(message);
  };

  const startSession = () => {
    if (dailySleptMs / 3600000 >= 10) {
      alert("Daily cap reached (10h). Drift again tomorrow.");
      return;
    }
    setSessionActive(true);
    setSessionMs(0);
    setShowJournal(false);
    setShowResult(false);

    const currentHours = dailySleptMs / 3600000;
    if (currentHours < 3) {
      setSessionMessage(
        "You’ve started the drift. Even short rests matter — 😴 Sleep tight, don’t let the 🪲Bit-bugs bite.",
      );
    } else if (currentHours < 5) {
      setSessionMessage(
        "Three or four hours? You’re halfway to halfway. The mempool’s raising an eyebrow — maybe even a second one. 🧐",
      );
    } else if (currentHours < 7) {
      setSessionMessage(
        "Five or six hours — clarity is forming. Your sats are syncing. 🧘‍♂️",
      );
    } else if (currentHours < 9) {
      setSessionMessage(
        "Seven or eight hours — you’re basically a sleep validator. The halving gods nod in approval. 🙌",
      );
    } else {
      setSessionMessage(
        "Nine or ten hours — you’ve transcended. ₿ The Bitcoin protocol bows to your devotion.",
      );
    }

    lastTickRef.current = Date.now();

    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    tickIntervalRef.current = window.setInterval(() => {
      const now = Date.now();
      setSessionMs((prev) => prev + (now - lastTickRef.current));
      lastTickRef.current = now;
    }, 500);
  };

  const stopSession = () => {
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    setSessionActive(false);

    const todayRemainingMs = Math.max(0, 10 * 3600000 - dailySleptMs);
    const creditedMs = Math.min(todayRemainingMs, sessionMs);
    const sessionHours = creditedMs / 3600000;

    setDailySleptMs((prev) => prev + creditedMs);
    setLastSleepDate(todayStr());

    if (sessionHours < 3) {
      setSessionMessage(
        "That’s barely a blink. 🐶 Doge says: much nap, very short. Come on, you deserve real rest.",
      );
    } else if (sessionHours < 5) {
      setSessionMessage(
        "You’re not just resting — you’re negotiating with gravity. Keep going. 🛌",
      );
    } else if (sessionHours < 7) {
      setSessionMessage(
        "You’ve earned real rest. Each hour restores your rhythm. ⏳",
      );
    } else if (sessionHours < 9) {
      setSessionMessage(
        "You’ve completed the ritual. Clarity awaits. Breathe and be still. 🌕",
      );
    } else {
      setSessionMessage(
        "You’ve mastered the ritual. You woke up. That’s the first victory. 🥇",
      );
    }

    if (sessionHours >= 8) {
      setTotalTokens((t) => t + 1);
      setSessionMessage(
        "You’ve honored the full drift. Ten hours of rest — that’s devotion. Clarity blooms, and the world feels softer. 🌅 Breathe in. You made it back. +1 Dream Token! 🪙",
      );
    }

    setShowJournal(true);
    setJournalTimer(420); // 7 minutes
    if (journalTimerRef.current) clearInterval(journalTimerRef.current);
    journalTimerRef.current = window.setInterval(() => {
      setJournalTimer((prev) => {
        if (prev <= 1) {
          if (journalTimerRef.current) clearInterval(journalTimerRef.current);
          setShowJournal(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const computeInsight = async () => {
    if (journalTimerRef.current) clearInterval(journalTimerRef.current);
    setJournalTimer(0);

    const hours = sessionMs / 3600000;
    const tokens = Math.floor(hours);

    const newUnlocked = { ...unlocked };
    if (hours >= 6) newUnlocked["blank"] = true;
    if (streak >= 3) newUnlocked["tide"] = true;

    const journalEntries = JSON.parse(
      localStorage.getItem(K("journal_entries")) || "[]",
    );
    if (journalEntries.length + 1 >= 5) newUnlocked["echo"] = true;
    setUnlocked(newUnlocked);

    const lastStreakDate = localStorage.getItem(K("lastStreakDate"));
    if (hours >= 8 && lastStreakDate !== todayStr()) {
      setStreak((s) => s + 1);
      localStorage.setItem(K("lastStreakDate"), todayStr());
    }

    setTotalTokens((t) => t + tokens);

    const poetic = "Your dreams have been recorded.";
    setInsightResult({ poetic, tokens, hours });

    try {
      const response = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: uid,
          text: journalText,
          poeticLine: poetic,
          tokensEarned: tokens,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setSessionMessage(`Journal Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Failed to save journal entry:", error);
      setSessionMessage("Failed to save journal entry.");
    }

    setShowResult(true);
    setShowJournal(false);
    setJournalText("");
  };

  const handleAdWatch = () => {
    if (adCooldown > 0) return;
    const tokensEarned = 5;
    setTotalTokens((t) => t + tokensEarned);

    setAdRewardStatus({
      message: `You earned ${tokensEarned} Dream Tokens!`,
      type: "success",
    });

    const now = Date.now();
    localStorage.setItem(K("ad_last_watch_time"), String(now));
    setAdCooldown(7 * 60 * 1000);

    setTimeout(() => setAdRewardStatus(null), 5000);
  };

  const handleSelectSound = (soundId: string) => {
    const sound = DRIFTSCAPES.find((s) => s.id === soundId);
    if (!sound) return;

    const isLocked = !unlocked[sound.id] && !unlocked["all_sounds"];
    if (isLocked) {
      setSessionMessage(sound.unlockHint);
      return;
    }

    setSelectedSounds((prev) => {
      if (prev.includes(soundId)) {
        return prev.filter((id) => id !== soundId);
      }
      if (prev.length < 3) {
        return [...prev, soundId];
      }
      setSessionMessage("You can select up to 3 Driftscapes at a time.");
      setTimeout(() => setSessionMessage(""), 3000);
      return prev;
    });
  };

  const msToHms = (ms: number) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const formatCooldown = (ms: number) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    if (h > 0)
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const dailyHours = dailySleptMs / 3600000;
  const capPercent = Math.min(100, (dailyHours / 10) * 100);

  const selectedDriftscapeNames = selectedSounds
    .map((id) => DRIFTSCAPES.find((s) => s.id === id)?.name)
    .filter(Boolean)
    .join(", ");

  return (
    <div className="flex flex-col items-center text-center">
      <img
        src="/logo.jpeg"
        alt="DriftPay Logo"
        className="w-24 h-24 mx-auto mb-4 mr-[0px] ml-[0px] rounded-tl-[15px] rounded-tr-[15px] rounded-br-[15px] rounded-bl-[15px] object-contain"
      />

      <div className="card w-full">
        <div
          className="row"
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <strong>Hydration check</strong>
          <span
            className="pill"
            style={{ color: isHydrated ? "var(--good)" : undefined }}
          >
            {isHydrated ? `Streak: ${hydrationStreak}` : "Not logged"}
          </span>
        </div>
        <p className="tiny">
          Log daily hydration. After unlocking Flow Drift, earn 5 SATs + 1 per
          streak day (max +10).
        </p>
        <div className="bar my-2">
          <div
            className="fill"
            style={{
              width: `${hydrationCooldown > 0 ? (1 - hydrationCooldown / (3 * 60 * 60 * 1000)) * 100 : 0}%`,
              background: "var(--accent)",
            }}
          ></div>
        </div>
        <div className="row justify-center items-center">
          <button
            className="btn"
            onClick={handleHydrate}
            disabled={hydrationCooldown > 0}
          >
            Hydrate (8 oz)
          </button>
          {hydrationCooldown > 0 && (
            <div className="tiny ml-2">
              Next ritual in: {formatCooldown(hydrationCooldown)}
            </div>
          )}
        </div>
      </div>

      {showJournal && (
        <div className="card w-full">
          <div className="flex justify-between items-center">
            <strong>Dream journal</strong>
            <span className="pill">{formatCooldown(journalTimer * 1000)}</span>
          </div>
          <p className="tiny">
            200 characters max. Symbols guide your insight.
          </p>
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            maxLength={200}
            placeholder="Fragments, images, feelings..."
          ></textarea>
          <div className="row justify-center" style={{ marginTop: "8px" }}>
            <button className="btn primary" onClick={computeInsight}>
              Reveal insight
            </button>
          </div>
        </div>
      )}

      <h2
        className="text-lg mt-6 mb-2 text-center font-[800]"
        style={{ color: "var(--ink)" }}
      >
        Catch some Zzz’s.. Mine with ease. ⛏️
      </h2>

      <div className="card w-full">
        <div
          className="row"
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <strong>Sleep Meter</strong>
          <span className="pill">{msToHms(sessionMs)}</span>
        </div>
        <p className="tiny">
          Earn 1 Dream Token per hour of sleep, up to 10 hours daily.
        </p>
        <div className="bar my-2">
          <div
            className="fill"
            style={{
              width: `${capPercent}%`,
              background: "var(--accent)",
            }}
          ></div>
        </div>
        <div className="row justify-center">
          <button
            className="btn primary"
            onClick={startSession}
            disabled={sessionActive || dailyHours >= 10}
          >
            Start Drift
          </button>
          <button
            className="btn ghost"
            onClick={stopSession}
            disabled={!sessionActive}
          >
            Wake Up
          </button>
          <button className="btn" onClick={() => setIsMuted((m) => !m)}>
            {isMuted ? "Unmute" : "Mute"}
          </button>
        </div>
      </div>

      <div className="card w-full">
        <div
          className="row"
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "6px",
          }}
        >
          <strong>Choose your Driftscape(s)</strong>
          <span className="tiny">
            {selectedDriftscapeNames || "None selected"}
          </span>
        </div>
        <div className="grid">
          {DRIFTSCAPES.map((s) => {
            const isLocked = !unlocked[s.id] && !unlocked["all_sounds"];
            return (
              <button
                key={s.id}
                className={`tile ${isLocked ? "locked" : ""} ${selectedSounds.includes(s.id) ? "playing" : ""}`}
                onClick={() => handleSelectSound(s.id)}
              >
                <div style={{ fontSize: "24px" }}>{s.icon}</div>
                <div className="name">{s.name}</div>
                <div className="hint">{s.sub}</div>
                {isLocked && <div className="lock">Locked</div>}
              </button>
            );
          })}
        </div>
        {DRIFTSCAPES.map((s) => (
          <audio
            key={s.id}
            ref={(el) => (playerRefs.current[s.id] = el)}
            src={s.src}
            preload="auto"
            loop
            muted={isMuted}
          ></audio>
        ))}
      </div>

      {showResult && (
        <div className="card w-full">
          <div className="insight">{insightResult.poetic}</div>
          <p className="tiny" style={{ margin: "8px 0 0" }}>
            You drifted {insightResult.hours.toFixed(2)} hrs • Dream tokens: +
            {insightResult.tokens}
          </p>
        </div>
      )}

      <div className="card w-full mt-4">
        <h2 className="text-lg font-semibold">Ad Reward</h2>
        <p className="tiny mb-2">Watch an ad to earn 5 Dream Tokens.</p>
        <button
          className="btn primary w-full"
          onClick={handleAdWatch}
          disabled={adCooldown > 0}
        >
          {adCooldown > 0
            ? `Watch Ad in ${formatCooldown(adCooldown)}`
            : "Watch Ad"}
        </button>
        {adRewardStatus && (
          <div
            className={`text-center p-2 mt-2 text-sm rounded-md ${adRewardStatus.type === "success" ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"}`}
          >
            <p>{adRewardStatus.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriftpayPage;
