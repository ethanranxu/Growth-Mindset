'use client';

/**
 * Flow stepper dots showing participant progress
 */
const STEP_LABELS = [
  'Information', 'Consent', 'Eligibility', 'Baseline', 'Online activity', 'Post-test', 'Completed',
];

export default function FlowStepper({ currentStep = 0 }) {
  return (
    <div className="flow-stepper" role="progressbar" aria-valuenow={currentStep} aria-valuemax={STEP_LABELS.length - 1}>
      {STEP_LABELS.map((label, i) => (
        <div
          key={label}
          className={`flow-step ${i === currentStep ? 'flow-step--active' : ''} ${i < currentStep ? 'flow-step--completed' : ''}`}
          title={label}
        />
      ))}
    </div>
  );
}
