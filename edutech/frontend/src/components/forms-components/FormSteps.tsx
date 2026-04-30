import { NavLink } from "react-router-dom";

export interface Step {
  name: string | number;
  path: string;
}

interface StepperProps {
  steps: Step[];
}

export default function FromSteps({ steps }: StepperProps) {
  return (
    <div className="flex items-center justify-center w-full mb-16 mt-8">
      {steps.map((step, index) => {
        const isLastStep = index === steps.length - 1;

        return (
          <div key={index} className="flex items-center">
            
            <NavLink
              to={step.path}
              className={({ isActive }) =>
                `w-14 h-14 rounded-full flex items-center justify-center transition-colors shadow-sm text-xl font-medium ${
                  isActive
                    ? 'bg-blue-50 border-2 border-blue-500 text-blue-600'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`
              }
            >
              {step.name}
            </NavLink>

            {!isLastStep && (
              <div className="h-[2px] bg-gray-300 w-32 sm:w-48 lg:w-64"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}