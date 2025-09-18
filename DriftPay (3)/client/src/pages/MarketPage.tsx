
import React, { useState, useCallback, useEffect } from 'react';

const shopItems = [
  {
    id: 'tokens100',
    name: '100 Dream Tokens',
    type: 'Token Pack',
    priceUSD: 0.99,
    description: 'A small boost for your journey.',
    icon: '💭',
  },
  {
    id: 'tokens150',
    name: '150 Dream Tokens',
    type: 'Token Pack',
    priceUSD: 1.99,
    description: 'A helpful pack of tokens.',
    icon: '🤔',
  },
  {
    id: 'tokens200',
    name: '200 Dream Tokens',
    type: 'Token Pack',
    priceUSD: 2.99,
    description: 'A solid pack of tokens.',
    icon: '✨',
  },
  {
    id: 'tokens500',
    name: '500 Dream Tokens',
    type: 'Token Pack',
    priceUSD: 4.99,
    description: 'A large collection of tokens.',
    icon: '🤯',
  },
  {
    id: 'tokens1000',
    name: '1000 Dream Tokens',
    type: 'Token Pack',
    priceUSD: 8.99,
    description: 'A massive infusion of tokens.',
    icon: '💎',
  },
  {
    id: 'tokens1000_allsounds',
    name: '1000 Tokens + All Sleep Sounds',
    type: 'Bundle',
    priceUSD: 9.99,
    description: 'The ultimate pack with 1000 tokens and unlocks all sleep sounds.',
    icon: '🎶',
  },
];

const MarketPage = () => {
  const [uid, setUid] = useState('default');
  const K = useCallback((k: string) => `dp_${uid}_${k}`, [uid]);
  
  const [unlocked, setUnlocked] = useState<Record<string, boolean>>({});
  const [purchaseStatus, setPurchaseStatus] = useState<{ [key: string]: { message: string; type: 'success' | 'error' } | null }>({});
  const [adCooldown, setAdCooldown] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentUid = params.get('uid') || 'default';
    setUid(currentUid);

    const savedUnlocked = localStorage.getItem(`dp_${currentUid}_unlocked`);
    if (savedUnlocked) {
      setUnlocked(JSON.parse(savedUnlocked));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(unlocked).length > 0) {
        localStorage.setItem(K('unlocked'), JSON.stringify(unlocked));
    }
  }, [unlocked, K]);

  useEffect(() => {
    const lastAdTime = Number(localStorage.getItem(K('ad_last_watch_time')) || 0);
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

  const handlePurchase = (itemId: string) => {
    console.log(`Simulating purchase for item: ${itemId}`);
    
    const item = shopItems.find(i => i.id === itemId);
    if (!item) return;

    let newUnlocked = { ...unlocked };
    let tokensToAdd = 0;

    switch(itemId) {
      case 'tokens100': tokensToAdd = 100; break;
      case 'tokens150': tokensToAdd = 150; break;
      case 'tokens200': tokensToAdd = 200; break;
      case 'tokens500': tokensToAdd = 500; break;
      case 'tokens1000': tokensToAdd = 1000; break;
      case 'tokens1000_allsounds': 
        tokensToAdd = 1000;
        newUnlocked['all_sounds'] = true;
        break;
    }

    const currentTokens = Number(localStorage.getItem(K('tokens')) || 0);
    localStorage.setItem(K('tokens'), String(currentTokens + tokensToAdd));
    
    setUnlocked(newUnlocked);
    
    setPurchaseStatus(prev => ({ ...prev, [itemId]: { message: `Purchase successful! You received: ${item.name}.`, type: 'success' } }));
    setTimeout(() => setPurchaseStatus(prev => ({ ...prev, [itemId]: null })), 5000);
  };

  const handleAdWatch = () => {
    if (adCooldown > 0) return;
    const tokensEarned = 5;
    const currentTokens = Number(localStorage.getItem(K('tokens')) || 0);
    localStorage.setItem(K('tokens'), String(currentTokens + tokensEarned));
    
    setPurchaseStatus(prev => ({ ...prev, ad: { message: `You earned ${tokensEarned} Dream Tokens!`, type: 'success' } }));
    
    const now = Date.now();
    localStorage.setItem(K('ad_last_watch_time'), String(now));
    setAdCooldown(7 * 60 * 1000);

    setTimeout(() => setPurchaseStatus(prev => ({ ...prev, ad: null })), 5000);
  };

  const formatCooldown = (ms: number) => {
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2 text-center">Moon Light Market</h1>
      <p className="tiny text-center mb-6">Unlock special soundscapes and upgrades.</p>

      <div className="card mb-4">
        <h2 className="text-lg font-semibold">Ad Reward</h2>
        <p className="tiny mb-2">Watch an ad to earn 5 Dream Tokens.</p>
        <button className="btn primary w-full" onClick={handleAdWatch} disabled={adCooldown > 0}>
          {adCooldown > 0 ? `Watch Ad in ${formatCooldown(adCooldown)}` : 'Watch Ad'}
        </button>
        {purchaseStatus.ad && (
          <div className={`text-center p-2 mt-2 text-sm rounded-md ${purchaseStatus.ad.type === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
            <p>{purchaseStatus.ad.message}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {shopItems.map(item => {
          const isItemUnlocked = item.id === 'tokens1000_allsounds' && unlocked['all_sounds'];
          return (
            <div key={item.id} className="card p-4 flex flex-col w-full">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl">{item.icon}</span>
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="tiny">{item.type}</p>
                </div>
              </div>
              <p className="tiny grow mb-4">{item.description}</p>
              {purchaseStatus[item.id] && (
                <div className={`text-center p-2 mb-2 text-sm rounded-md ${purchaseStatus[item.id]?.type === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                  <p>{purchaseStatus[item.id]?.message}</p>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold" style={{ color: 'var(--accent)' }}>${item.priceUSD.toFixed(2)}</span>
                <button 
                  className="btn primary"
                  onClick={() => handlePurchase(item.id)}
                  disabled={isItemUnlocked}
                >
                  {isItemUnlocked ? 'Unlocked' : 'Purchase'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketPage;
