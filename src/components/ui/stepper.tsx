"use client";

import { cn } from "@/lib/utils";
import { CheckIcon } from "@/assets/icons";

export interface Step {
  id: string;
  title: string;
  description?: string;
  optional?: boolean;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function Stepper({ steps, currentStep, className, orientation = "horizontal" }: StepperProps) {
  return (
    <nav
      className={cn(
        "flex",
        orientation === "vertical" ? "flex-col space-y-4" : "items-center justify-center space-x-8",
        className
      )}
      aria-label="Progress"
    >
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isUpcoming = index > currentStep;

        return (
          <div
            key={step.id}
            className={cn(
              "flex items-center",
              orientation === "vertical" ? "w-full" : "flex-shrink-0"
            )}
          >
            {/* Step Circle/Icon */}
            <div className="flex items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                  isCompleted && "border-primary bg-primary text-white",
                  isCurrent && "border-primary bg-white text-primary dark:bg-gray-dark",
                  isUpcoming && "border-gray-300 bg-white text-gray-500 dark:border-gray-600 dark:bg-gray-dark dark:text-gray-400"
                )}
              >
                {isCompleted ? (
                  <CheckIcon className="h-6 w-6" />
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>

              {/* Step Content */}
              <div className={cn("ml-4", orientation === "vertical" ? "min-w-0 flex-1" : "")}>
                <p
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isCompleted && "text-primary",
                    isCurrent && "text-primary",
                    isUpcoming && "text-gray-500 dark:text-gray-400"
                  )}
                >
                  {step.title}
                  {step.optional && (
                    <span className="ml-2 text-xs font-normal text-gray-500">
                      (Optional)
                    </span>
                  )}
                </p>
                {step.description && (
                  <p
                    className={cn(
                      "text-sm transition-colors",
                      isCompleted && "text-gray-600 dark:text-gray-300",
                      isCurrent && "text-gray-600 dark:text-gray-300",
                      isUpcoming && "text-gray-400 dark:text-gray-500"
                    )}
                  >
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  orientation === "vertical"
                    ? "ml-5 h-8 w-0.5"
                    : "h-0.5 w-16",
                  "transition-colors",
                  index < currentStep ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                )}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}

interface StepperContentProps {
  children: React.ReactNode;
  className?: string;
}

export function StepperContent({ children, className }: StepperContentProps) {
  return (
    <div className={cn("mt-8", className)}>
      {children}
    </div>
  );
}

interface StepperActionsProps {
  children: React.ReactNode;
  className?: string;
}

export function StepperActions({ children, className }: StepperActionsProps) {
  return (
    <div className={cn("flex items-center justify-between pt-6", className)}>
      {children}
    </div>
  );
}