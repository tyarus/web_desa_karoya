'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Step {
  id: number;
  label: string;
  description?: string;
}

interface UMKMStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function UMKMStepper({ steps, currentStep, onStepClick }: UMKMStepperProps) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isClickable = onStepClick && (isCompleted || currentStep > step.id - 1);

          return (
            <li key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                {/* Step Circle */}
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-200',
                    isCompleted && 'border-white/50 bg-white/20 text-white backdrop-blur',
                    isCurrent && 'border-white bg-white text-[#1B4332] shadow-lg ring-4 ring-white/30',
                    !isCompleted && !isCurrent && 'border-white/30 bg-white/10 text-white/50'
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </button>

                {/* Step Label */}
                <span
                  className={cn(
                    'mt-2 text-xs font-semibold transition-colors',
                    isCompleted && 'text-white/80',
                    isCurrent && 'text-white',
                    !isCompleted && !isCurrent && 'text-white/50'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'mx-2 h-1 flex-1 rounded-full transition-colors duration-300',
                    currentStep > step.id ? 'bg-white/80' : 'bg-white/20'
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Progress bar variant for mobile
export function UMKMStepperProgress({
  steps,
  currentStep
}: {
  steps: Step[];
  currentStep: number;
}) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-white">
          Langkah {currentStep} dari {steps.length}
        </span>
        <span className="text-white/80">{steps[currentStep - 1]?.label}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-white shadow-lg transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
