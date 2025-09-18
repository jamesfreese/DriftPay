
import express from 'express';

const router = express.Router();

// This endpoint is currently disabled as per user request.
// It can be re-enabled when lightning address integrations are needed.
router.post('/claim', async (req, res) => {
  res.status(503).json({ message: 'Lightning address integration is temporarily disabled.' });
  return;

  /*
  const { lightningAddress, amount } = req.body;
  const apiKey = process.env.ZBD_API_KEY;

  if (!apiKey) {
    console.error('ZBD_API_KEY is not set.');
    res.status(500).json({ message: 'Server configuration error.' });
    return;
  }

  if (!lightningAddress || !amount) {
    res.status(400).json({ message: 'Lightning address and amount are required.' });
    return;
  }

  if (amount <= 0) {
    res.status(400).json({ message: 'Amount must be positive.' });
    return;
  }

  try {
    const zbdResponse = await fetch('https://api.zebedee.io/v0/ln-address/send-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey,
      },
      body: JSON.stringify({
        lnAddress: lightningAddress,
        amount: (amount * 1000).toString(), // ZBD API expects amount in millisats
        comment: 'Driftpay Rewards',
      }),
    });

    const data = await zbdResponse.json();

    if (!zbdResponse.ok || !data.success) {
      console.error('ZBD API Error:', data);
      throw new Error(data.message || 'Payment failed at ZBD.');
    }

    res.status(200).json({
      message: 'Payout successful!',
      amount: amount,
      transactionId: data.data.transactionId,
    });
  } catch (error) {
    console.error('Failed to process claim:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: `Failed to process claim: ${errorMessage}` });
  }
  */
});

export default router;
