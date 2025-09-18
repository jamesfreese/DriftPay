
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ConvertPage = () => {
  const navigate = useNavigate();
  const [uid, setUid] = useState('default');
  const K = useCallback((k: string) => `dp_${uid}_${k}`, [uid]);

  const [totalTokens, setTotalTokens] = useState(0);
  const [lightningAddress, setLightningAddress] = useState('');
  const [claimStatus, setClaimStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);

  // For now, we'll use a static tier. This can be dynamic later.
  const ritualTier = 'Deep Drift'; 
  const conversionRate = ritualTier === 'Deep Drift' ? 50 : 30;
  const tokensToConvert = Math.min(50, Math.max(5, totalTokens));
  const satsToReceive = tokensToConvert * conversionRate;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentUid = params.get('uid') || 'default';
    setUid(currentUid);

    const tokens = Number(localStorage.getItem(`dp_${currentUid}_tokens`) || 0);
    const address = localStorage.getItem(`dp_${currentUid}_lightningAddress`) || '';
    
    setTotalTokens(tokens);
    setLightningAddress(address);

    if (tokens < 5) {
        navigate('/stats');
    }
  }, [navigate]);

  const handleClaim = async () => {
    if (!lightningAddress) {
      setClaimStatus({ message: 'Lightning address is required. Please set it on the Stats page.', type: 'error' });
      return;
    }

    setIsClaiming(true);
    setClaimStatus(null);

    try {
      const response = await fetch('/api/rewards/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lightningAddress,
          amount: satsToReceive, // Sending the final SATs amount
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Claim failed');
      }

      const newTotalTokens = totalTokens - tokensToConvert;
      setTotalTokens(newTotalTokens);
      localStorage.setItem(K('tokens'), String(newTotalTokens));

      setClaimStatus({ message: `Success! ${satsToReceive} SATs are on their way.`, type: 'success' });
      
      setTimeout(() => navigate('/stats'), 3000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setClaimStatus({ message: `Error: ${errorMessage}`, type: 'error' });
    } finally {
      setIsClaiming(false);
    }
  };

  if (totalTokens < 5) {
      return (
          <div className="card text-center">
              <h1 className="text-xl font-bold mb-4">Not enough tokens</h1>
              <p className="mb-4">You need at least 5 Dream Tokens to perform a conversion.</p>
              <Button onClick={() => navigate('/stats')} className="btn primary">Back to Stats</Button>
          </div>
      )
  }

  if (claimStatus?.type === 'success') {
    return (
        <div className="card text-center">
            <h1 className="text-xl font-bold mb-4">Ritual Complete</h1>
            <p className="text-green-400">{claimStatus.message}</p>
        </div>
    )
  }

  return (
    <div className="card text-center">
      <h1 className="text-xl font-bold mb-4">You’ve chosen to convert your Dream tokens into SATs.</h1>
      <p className="tiny mb-4">Each token carries the weight of your rest, your reflection, your quiet victories beneath the stars.</p>
      
      <div className="text-left my-6 space-y-2">
        <p>🌀 Emotional Drift: {tokensToConvert} Dream tokens detected</p>
        <p>🔗 Ritual Tier: {ritualTier}</p>
        <p>💫 Conversion Rate: {conversionRate} SATs per token</p>
        <p className="font-bold">💰 Total Reward: {satsToReceive} SATs</p>
      </div>

      <p className="tiny my-4">Before we proceed, take a breath.</p>
      <p className="italic my-4">This isn’t just a transaction—it’s a release. A moment of grace, crystallized into value.</p>
      <p className="font-bold my-4">Do you wish to complete this ritual?</p>

      {claimStatus?.type === 'error' && (
          <p className="text-red-400 my-4">{claimStatus.message}</p>
      )}

      <div className="flex justify-center gap-4 mt-6">
        <Button onClick={handleClaim} disabled={isClaiming} className="btn primary">
          {isClaiming ? 'Releasing...' : 'Convert & Release'}
        </Button>
        <Button onClick={() => navigate('/stats')} className="btn ghost">
          Hold & Reflect
        </Button>
      </div>
    </div>
  );
};

export default ConvertPage;
