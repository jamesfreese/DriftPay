
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const StatsPage = () => {
  const navigate = useNavigate();
  const [uid, setUid] = useState('default');
  const K = useCallback((k: string) => `dp_${uid}_${k}`, [uid]);

  const [totalTokens, setTotalTokens] = useState(0);
  const [satsBalance, setSatsBalance] = useState(0);
  const [tokensToConvert, setTokensToConvert] = useState('');
  const [claimStatus, setClaimStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const isEligibleForConversion = totalTokens >= 25;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentUid = params.get('uid') || 'default';
    setUid(currentUid);

    const tokens = Number(localStorage.getItem(`dp_${currentUid}_tokens`) || 0);
    const sats = Number(localStorage.getItem(`dp_${currentUid}_sats_balance`) || 0);
    
    setTotalTokens(tokens);
    setSatsBalance(sats);
  }, []);

  const handleConvertToSats = () => {
    if (!isEligibleForConversion) {
      setClaimStatus({ message: 'You need at least 25 Dream Tokens to convert.', type: 'error' });
      return;
    }

    const amount = parseInt(tokensToConvert, 10);
    if (isNaN(amount) || amount <= 0) {
      setClaimStatus({ message: 'Please enter a valid number of tokens to convert.', type: 'error' });
      return;
    }
    if (amount < 25) {
      setClaimStatus({ message: 'Minimum conversion is 25 Dream Tokens.', type: 'error' });
      return;
    }
    if (amount > totalTokens) {
      setClaimStatus({ message: 'You do not have enough tokens.', type: 'error' });
      return;
    }

    const satsEarned = Math.floor(amount / 10);
    if (satsEarned < 1) {
        setClaimStatus({ message: 'Conversion results in less than 1 SAT. Please convert more tokens.', type: 'error' });
        return;
    }

    const newTotalTokens = totalTokens - amount;
    const newSatsBalance = satsBalance + satsEarned;

    setTotalTokens(newTotalTokens);
    setSatsBalance(newSatsBalance);

    localStorage.setItem(K('tokens'), String(newTotalTokens));
    localStorage.setItem(K('sats_balance'), String(newSatsBalance));
    window.dispatchEvent(new Event('storage'));

    setClaimStatus({ message: `Successfully converted ${amount} tokens to ${satsEarned} SATs.`, type: 'success' });
    setTokensToConvert('');
    setTimeout(() => setClaimStatus(null), 5000);
  };

  const handleFillMax = () => {
    setTokensToConvert(String(totalTokens));
  };

  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-2xl font-bold mb-4">Bitcoin Rewards</h1>
      <div className="flex flex-col gap-4 w-full">
        <div className="card text-center p-4">
          <h2 className="text-lg font-semibold">Dream Tokens</h2>
          <p className="text-4xl font-bold" style={{ color: 'var(--warn)' }}>{totalTokens}</p>
          <p className="tiny mt-2">Earned from sleep sessions and rituals.</p>
        </div>
        <div className="card text-center p-4">
          <h2 className="text-lg font-semibold">SAT Balance</h2>
          <p className="text-4xl font-bold" style={{ color: 'var(--good)' }}>{satsBalance.toLocaleString()}</p>
          <p className="tiny mt-2">Your Bitcoin rewards.</p>
        </div>
      </div>

      <div className="card mt-6 p-4 w-full">
        <h2 className="text-lg font-semibold mb-2">Claim Rewards</h2>
        {!isEligibleForConversion ? (
            <p className="tiny mb-4 text-amber-400">
                You need to accumulate at least 25 Dream Tokens to unlock conversions. Keep drifting!
            </p>
        ) : (
            <>
                <p className="tiny mb-4">Enter amount to convert. Minimum 25 Dream Tokens. 10 Dream Tokens = 1 SAT.</p>
                <div className="flex flex-col gap-2">
                <Label htmlFor="tokens-to-convert" className="text-left">Tokens to Convert</Label>
                <div className="relative">
                  <Input
                      id="tokens-to-convert"
                      type="number"
                      placeholder={`e.g., 100 (Max: ${totalTokens})`}
                      value={tokensToConvert}
                      onChange={(e) => setTokensToConvert(e.target.value)}
                      className="bg-transparent pr-16"
                  />
                  <Button onClick={handleFillMax} variant="link" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 text-xs">
                    Max
                  </Button>
                </div>
                <Button onClick={handleConvertToSats} className="btn primary mt-2">
                    Convert Tokens to SATs
                </Button>
                </div>
            </>
        )}
        {claimStatus && (
          <p className={`tiny mt-2 text-center ${claimStatus.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
            {claimStatus.message}
          </p>
        )}
        <div className="text-center mt-4">
          <a href="https://blockdyor.com/zbd-review/" target="_blank" rel="noopener noreferrer" className="text-sm underline">
            What are SATs, ZBD, and Bitcoin wallets?
          </a>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
