
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StarryBackground from '../components/ShootingStars';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [authError, setAuthError] = useState('');

  const from = location.state?.from?.pathname || "/";

  const validatePassword = (pass: string) => {
    if (pass === "Earningisfun7!") {
      setPasswordError("Can't use the provided example password Major!");
      return false;
    }
    if (pass.length < 8 || pass.length > 25) {
      setPasswordError("Whoops! Password must be 8-25 characters long.");
      return false;
    }
    if (!/[a-zA-Z]/.test(pass)) {
      setPasswordError("Bummer! must contain at least one letter. Try again fellow dreamer!");
      return false;
    }
    if (!/\d/.test(pass)) {
      setPasswordError("Shoot! must contain one number! Try again please");
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) {
      setPasswordError("Houston we have a problem! Must contain one special character");
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleAuthAction = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!termsAccepted) {
      return;
    }

    if (isSigningUp) {
      if (!validatePassword(password)) {
        return;
      }
      // In a real app, you'd call a registration API endpoint here.
      // For now, we'll just log the user in.
    } else {
      // Login logic
      if (email.toLowerCase() === 'jfreeseofficial@gmail.com') {
        if (password !== 'SleepDriftersZ92!') {
          setAuthError('Invalid credentials for admin user.');
          return;
        }
      }
      // For other users, any password is fine for this mock setup
    }
    
    localStorage.setItem('isLoggedIn', 'true');
    if (email.toLowerCase() === 'jfreeseofficial@gmail.com') {
      localStorage.setItem('owner', 'King Coffee');
    }
    localStorage.setItem('email', email);
    
    navigate(from, { replace: true });
  };

  return (
    <div className="driftpay-theme min-h-screen flex items-center justify-center">
      <StarryBackground />
      <div className="wrap text-center z-10">
        <div className="inline-block">
          <img src="/logo.jpeg" alt="DriftPay Logo" className="w-48 h-48 mx-auto" />
        </div>
        
        {isSigningUp && (
          <p className="card max-w-sm mx-auto text-sm">
            Welcome, dreamer. Begin your drift by creating your account — your rituals earn real Bitcoin, one moment of clarity at a time.
          </p>
        )}

        <form onSubmit={handleAuthAction} className="card max-w-sm mx-auto mt-4 text-left">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-transparent" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-transparent" />
              {isSigningUp && (
                <p className="tiny mt-2">
                  8-25 characters, at least one number, and one special character (Example: Earningisfun7!)
                </p>
              )}
              {passwordError && <p className="tiny text-red-400 mt-2">{passwordError}</p>}
              {authError && <p className="tiny text-red-400 mt-2">{authError}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-6">
            <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(checked) => setTermsAccepted(checked as boolean)} />
            <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              I accept the drift — and the{' '}
              <Dialog>
                <DialogTrigger asChild>
                  <span className="underline cursor-pointer">terms that guide it.</span>
                </DialogTrigger>
                <DialogContent className="text-white bg-gray-900 border-gray-700 max-w-[90vw] sm:max-w-md rounded-lg">
                  <DialogHeader>
                    <DialogTitle className="text-base text-center">🚀 DriftPay Terms of Service (Astronaut Edition)</DialogTitle>
                  </DialogHeader>
                  <div className="prose prose-invert text-sm max-h-60 overflow-y-auto pr-4 text-gray-300 space-y-4 mt-4">
                    <div>
                      <p><strong>🪐 Account Registration</strong></p>
                      <p>To board the DriftPay shuttle, you’ll need a valid email and a secure password.<br />
                      Accounts are personal and non-transferable — no stowaways allowed.<br />
                      Admins monitor the launchpad for safety.<br />
                      <strong>We do NOT share your data. We do NOT send spam.</strong><br />
                      We’re here to hydrate your soul, not your inbox.</p>
                    </div>
                    <div>
                      <p><strong>🌌 Usage & Eligibility</strong></p>
                      <p>DriftPay is for personal wellness missions only.<br />
                      No hacking the mainframe, no unauthorized wormholes.<br />
                      All shop transactions use <strong>Dream Tokens</strong> — the official currency of emotional clarity.</p>
                    </div>
                    <div>
                      <p><strong>💰 Rewards & Purchases</strong></p>
                      <p>Dream Tokens can be earned through rituals or purchased from the Moon Light Market.<br />
                      Minimum conversion for SATs payout: <strong>10 Dream Tokens = 1 SAT</strong><br />
                      (e.g., 150 Dream Tokens = 15 SATs — that’s astronaut math).<br />
                      All purchases, conversions, and rewards are final.<br />
                      No refunds from the crypto cosmos!</p>
                    </div>
                    <div>
                      <p><strong>🔐 Privacy & Data</strong></p>
                      <p>Your sleep logs, hydration rituals, and journal entries are stored securely in our lunar vault.<br />
                      We don’t collect sensitive data, and we never beam your info to third parties.<br />
                      By using DriftPay, you agree to basic data storage for product improvement and community wellness.<br />
                      No surveillance satellites here — just gentle stars.</p>
                    </div>
                    <div>
                      <p><strong>📲 App Experience</strong></p>
                      <p>DriftPay includes push notifications, hydration reminders, sleep tracking, and journaling.<br />
                      Feedback is welcome, but trolls will be ejected into deep space (with love).<br />
                      We moderate for clarity, kindness, and cosmic vibes.</p>
                    </div>
                    <div>
                      <p><strong>🛑 Termination</strong></p>
                      <p>Admins reserve the right to suspend accounts for abuse, non-payment, or rule violations.<br />
                      If you crash the ship, we’ll review your flight log.<br />
                      Disputes can be emailed to support for prompt resolution — no black holes.</p>
                    </div>
                    <div>
                      <p><strong>📱 Mobile Accessibility</strong></p>
                      <p>DriftPay is optimized for mobile devices, from pocket rockets to space tablets.<br />
                      Terms, privacy info, and product details adapt to all screen sizes — even tiny moon phones.</p>
                    </div>
                    <div>
                      <p><strong>🧠 Education</strong></p>
                      <p>We offer general info on Bitcoin wallets and reward mechanics.<br />
                      We do <strong>not</strong> offer financial advice — just emotional clarity and poetic push notifications.</p>
                    </div>
                    <div>
                      <p><strong>⚠️ Limitation of Liability</strong></p>
                      <p>DriftPay is provided “as is.”<br />
                      We’re not liable for cosmic disruptions, lost wellness data, or third-party asteroid strikes.<br />
                      Use the app with intention, hydration, and a sense of humor.</p>
                    </div>
                    <div className="text-center">
                      <p>🌙 Thanks for flying DriftPay.<br />
                      THE DRIFTPAY TEAM<br />
                      May your rituals be gentle, your sleep deep, and your SATs plentiful.</p>
                    </div>
                  </div>
                  <div className="mt-6 text-center text-sm">
                    <a href="https://blockdyor.com/zbd-review/" target="_blank" rel="noopener noreferrer" className="underline">
                      What are SATs, ZBD, and Bitcoin wallets?
                    </a>
                  </div>
                </DialogContent>
              </Dialog>
            </label>
          </div>

          <Button type="submit" disabled={!termsAccepted} className="w-full mt-6 btn primary">
            {isSigningUp ? 'Create Account' : 'Continue'}
          </Button>
          
          <div className="text-center mt-4">
            <Button variant="link" onClick={() => setIsSigningUp(!isSigningUp)} className="text-sm text-muted-foreground">
              {isSigningUp ? 'Already have an account? Log in' : "Don't have an account? Create one"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
