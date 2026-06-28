'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getMaxModule, setMaxModule } from '@/lib/session';

/**
 * ModuleStepper — Visual progress indicator for Learning Modules 1 to 5.
 * Completed / previously reached modules are clickable for review.
 */
export default function ModuleStepper({ currentModule = 1 }) {
  const router = useRouter();
  const pathname = usePathname();
  const moduleType = pathname?.includes('/module/control') ? 'control' : 'gmi';
  const [maxModule, setMaxModuleState] = useState(1);

  useEffect(() => {
    setMaxModule(currentModule);
    setMaxModuleState(getMaxModule());
  }, [currentModule]);

  const steps = [
    { num: 1, label: 'Module 1' },
    { num: 2, label: 'Module 2' },
    { num: 3, label: 'Module 3' },
    { num: 4, label: 'Module 4' },
    { num: 5, label: 'Module 5' },
  ];

  return (
    <div className="flex justify-center items-center w-full max-w-4xl mx-auto mb-8 relative select-none">
      <div className="absolute top-[24px] md:top-[30px] left-[10%] right-[10%] border-t-2 border-dotted border-gray-300 z-0" />
      {steps.map((step) => {
        const isActive = step.num === currentModule;
        const isCompleted = step.num < currentModule;
        const isClickable = step.num < currentModule && step.num <= maxModule;

        let circleClasses = 'bg-[#f4f6f8] text-[#94a3b8] border border-gray-200';
        let labelClasses = 'text-[#94a3b8] font-medium';

        if (isActive) {
          circleClasses = 'bg-[#006764] text-white border-2 border-white ring-4 ring-[#eaf4f0] shadow-md scale-105';
          labelClasses = 'text-[#006764] font-bold';
        } else if (isCompleted) {
          circleClasses = 'bg-[#006764] text-white border-2 border-white group-hover:bg-[#005250] group-hover:scale-105 shadow-sm';
          labelClasses = 'text-[#006764] font-semibold group-hover:underline';
        }

        return (
          <div
            key={step.num}
            onClick={() => {
              if (isClickable) {
                router.push(`/module/${moduleType}/${step.num}`);
              }
            }}
            className={`flex flex-col items-center w-1/5 relative z-10 transition-transform ${
              isClickable ? 'cursor-pointer group' : 'pointer-events-none'
            }`}
            title={isClickable ? `Review ${step.label}` : step.label}
          >
            <div
              className={`w-[46px] h-[46px] md:w-[60px] md:h-[60px] rounded-full flex items-center justify-center font-bold text-xl md:text-2xl mb-2 shadow-sm transition-all duration-300 ${circleClasses}`}
            >
              {isCompleted ? '✓' : step.num}
            </div>
            <span className={`text-xs md:text-sm text-center transition-colors duration-300 ${labelClasses}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
