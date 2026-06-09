import React, { useMemo, useState } from 'react';
import { ShieldCheck, Lock, KeyRound, Wifi } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useRoleView } from '../../context/RoleViewContext';

export const SecurityPage: React.FC = () => {
  const { user } = useAuth();
  const { viewMode, setViewMode } = useRoleView();
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [otpStatus, setOtpStatus] = useState('');
  const [securityMessage, setSecurityMessage] = useState('Secure your account with a multi-step verification process.');

  const score = useMemo(() => {
    const criteria = [
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
      password.length >= 12,
    ];
    return criteria.filter(Boolean).length;
  }, [password]);

  const strengthLabel = useMemo(() => {
    switch (score) {
      case 5:
        return 'Very Strong';
      case 4:
        return 'Strong';
      case 3:
        return 'Moderate';
      case 2:
        return 'Weak';
      default:
        return 'Very Weak';
    }
  }, [score]);

  const strengthColor = useMemo(() => {
    if (score >= 4) return 'bg-success-500';
    if (score === 3) return 'bg-warning-500';
    return 'bg-error-500';
  }, [score]);

  const handleOtpChange = (index: number, value: string) => {
    const values = [...otp];
    values[index] = value.replace(/[^0-9]/g, '').slice(-1);
    setOtp(values);
  };

  const verifyOtp = () => {
    const code = otp.join('');
    if (code === '123456') {
      setOtpStatus('verified');
      setSecurityMessage('Two-factor authentication verified successfully.');
    } else {
      setOtpStatus('failed');
      setSecurityMessage('OTP did not match. Please try again with the code 123456.');
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-warning-100 px-3 py-1 text-sm font-medium text-warning-700">
            <ShieldCheck size={18} /> Security & Access
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">Account Security Suite</h1>
          <p className="text-gray-600">Protect your workspace with password metrics and an OTP verification ritual.</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="warning">View mode: {viewMode}</Badge>
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'investor' ? 'entrepreneur' : 'investor')}>
            Switch to {viewMode === 'investor' ? 'Entrepreneur' : 'Investor'} View
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Password strength analysis</h2>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Enter a secure password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
              />
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-3 flex items-center justify-between text-sm font-semibold text-gray-900">
                  <span>Password strength</span>
                  <span>{strengthLabel}</span>
                </div>
                <div className="h-3 rounded-full bg-gray-200">
                  <div className={`h-3 rounded-full ${strengthColor}`} style={{ width: `${(score / 5) * 100}%` }} />
                </div>
                <div className="mt-3 grid gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex h-2.5 w-2.5 rounded-full ${/[a-z]/.test(password) ? 'bg-success-500' : 'bg-gray-300'}`}></span>
                    Lowercase letter
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex h-2.5 w-2.5 rounded-full ${/[A-Z]/.test(password) ? 'bg-success-500' : 'bg-gray-300'}`}></span>
                    Uppercase letter
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex h-2.5 w-2.5 rounded-full ${/[0-9]/.test(password) ? 'bg-success-500' : 'bg-gray-300'}`}></span>
                    Number or symbol
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex h-2.5 w-2.5 rounded-full ${password.length >= 12 ? 'bg-success-500' : 'bg-gray-300'}`}></span>
                    12+ characters
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">2FA verification</h2>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Lock size={18} />
                <span>Multi-step login security for investor and entrepreneur workflows.</span>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-white p-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Two-factor authentication</p>
                  <p className="text-sm text-gray-500">{is2FAEnabled ? 'Enabled' : 'Disabled'}</p>
                </div>
                <Button variant={is2FAEnabled ? 'secondary' : 'success'} size="sm" onClick={() => setIs2FAEnabled(prev => !prev)}>
                  {is2FAEnabled ? 'Disable' : 'Enable'}
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <KeyRound size={18} /> Enter your 6-digit verification code
              </div>
              <div className="grid grid-cols-6 gap-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    type="text"
                    value={digit}
                    maxLength={1}
                    className="text-center font-semibold"
                    onChange={e => handleOtpChange(index, e.target.value)}
                  />
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <Button fullWidth onClick={verifyOtp}>Verify code</Button>
                <Button variant="outline" size="sm" onClick={() => setOtp(Array(6).fill(''))}>Reset</Button>
              </div>
              <p className={`mt-3 text-sm ${otpStatus === 'verified' ? 'text-success-700' : otpStatus === 'failed' ? 'text-error-700' : 'text-gray-600'}`}>{securityMessage}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-gray-700">
            <Wifi size={18} />
            <div>
              <p className="font-semibold">Role-based access design</p>
              <p className="text-sm text-gray-600">This workspace shows security flows that adapt for both investor and entrepreneur perspectives.</p>
            </div>
          </div>
          <Badge variant="primary">{viewMode === 'investor' ? 'Investor protection' : 'Entrepreneur security'}</Badge>
        </div>
      </div>
    </div>
  );
};
