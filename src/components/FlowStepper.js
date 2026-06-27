'use client';

/**
 * Flow stepper dots showing participant progress
 */
const STEP_LABELS = [
  '信息', '同意', '筛查', '基线', '学习活动', '后测', '完成',
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
