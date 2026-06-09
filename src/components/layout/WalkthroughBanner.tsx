import React, { useState } from 'react';
import { Info, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';

const steps = [
  {
    label: 'Calendar Setup',
    description: 'Review weekly availability, add meeting slots and manage requests directly from the schedule dashboard.',
  },
  {
    label: 'Video Call Hub',
    description: 'Start a mock video session, toggle audio/video controls, and preview the screen share pane.',
  },
  {
    label: 'Document Chamber',
    description: 'Review contracts, annotate status badges, and sign PDF previews with the electronic signature pad.',
  },
  {
    label: 'Payments & Security',
    description: 'Track wallet flows, simulate deposits/transfers and verify account protection with the OTP meter.',
  },
];

export const WalkthroughBanner: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const moveStep = (direction: 'next' | 'prev') => {
    setCurrentStep(prev => {
      if (direction === 'next') {
        return prev === steps.length - 1 ? 0 : prev + 1;
      }
      return prev === 0 ? 0 : prev - 1;
    });
  };

  return (
    <div className="rounded-2xl bg-primary-50 border border-primary-100 p-5 shadow-sm animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
            <Info size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary-700">Collaborative Nexus Walkthrough</p>
            <h3 className="text-lg font-semibold text-gray-900">Explore the new collaboration workflow</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-gray-500">Step {currentStep + 1} of {steps.length}</span>
          <div className="h-2 w-40 overflow-hidden rounded-full bg-white ring-1 ring-inset ring-gray-200">
            <div
              className="h-full rounded-full bg-primary-600 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900">{steps[currentStep].label}</h4>
          <p className="mt-2 text-sm text-gray-600">{steps[currentStep].description}</p>
        </div>
        <div className="flex flex-col justify-between rounded-2xl bg-white p-4 border border-gray-200">
          <div>
            <p className="text-sm text-gray-500">Need a quick guide?</p>
            <p className="mt-2 text-sm text-gray-700">Use the navigation sidebar to jump directly into calendar, video calling, documents, payments, and security modules.</p>
          </div>
          <div className="mt-4 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => moveStep('prev')}>
              Back
            </Button>
            <Button size="sm" onClick={() => moveStep('next')}>
              {currentStep === steps.length - 1 ? 'Restart Tour' : 'Next Step'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
