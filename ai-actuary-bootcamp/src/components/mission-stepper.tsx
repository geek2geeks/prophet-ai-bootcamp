"use client";

import * as React from "react";
import { BookOpen, Hammer, Rocket, LayoutDashboard, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type StepId = "overview" | "learn" | "build" | "submit";

interface MissionStepperProps {
  overview: React.ReactNode;
  learn: React.ReactNode;
  build: React.ReactNode;
  submit: React.ReactNode;
}

type StepConfig = {
  id: StepId;
  label: string;
  icon: React.ReactNode;
};

const steps: StepConfig[] = [
  { id: "overview", label: "Visão Geral", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "learn", label: "Aprender", icon: <BookOpen className="h-4 w-4" /> },
  { id: "build", label: "Praticar", icon: <Hammer className="h-4 w-4" /> },
  { id: "submit", label: "Entregar", icon: <Rocket className="h-4 w-4" /> },
];

export function MissionStepper({ overview, learn, build, submit }: MissionStepperProps) {
  const [currentStep, setCurrentStep] = React.useState<StepId>("overview");

  const currentIdx = steps.findIndex((s) => s.id === currentStep);
  const currentStepConfig = steps[currentIdx] ?? steps[0];

  const goNext = () => {
    if (currentIdx < steps.length - 1) {
      setCurrentStep(steps[currentIdx + 1].id);
    }
  };

  const goPrev = () => {
    if (currentIdx > 0) {
      setCurrentStep(steps[currentIdx - 1].id);
    }
  };

  const panels: Record<StepId, React.ReactNode> = {
    overview,
    learn,
    build,
    submit,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="sticky top-[86px] z-20 -mx-4 bg-[#fafaf9]/95 px-4 py-3 backdrop-blur-md sm:top-[102px] sm:mx-0 sm:px-0">
        <nav className="flex items-center gap-1.5 overflow-x-auto rounded-[1.4rem] bg-white p-2 shadow-sm ring-1 ring-slate-200 sm:gap-2">
          {steps.map((step) => {
            const isActive = currentStep === step.id;
            const stepIdx = steps.findIndex((s) => s.id === step.id);
            const isCompleted = stepIdx < currentIdx;

            return (
              <button
                type="button"
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "flex min-w-[4.5rem] flex-1 shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all sm:min-w-0 sm:flex-row sm:gap-2 sm:px-4 sm:py-2.5",
                  isActive
                    ? "bg-slate-900 text-white shadow-md"
                    : isCompleted
                      ? "bg-emerald-50 text-emerald-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <span className="flex-shrink-0">{step.icon}</span>
                <span className="hidden text-xs sm:inline-block sm:text-sm">{step.label}</span>
                <span
                  className={cn(
                    "block text-[10px] font-bold sm:hidden",
                    isActive ? "text-white/80" : isCompleted ? "text-emerald-700" : "text-slate-400"
                  )}
                >
                  {stepIdx + 1}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="mt-2 flex items-center justify-between px-1 sm:hidden">
          <span className="text-sm font-semibold text-slate-700">{currentStepConfig.label}</span>
          <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Etapa {currentIdx + 1}/{steps.length}
          </span>
        </div>
      </div>

      <div className="min-h-[50vh] pb-20 sm:pb-0">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">{panels[currentStep]}</div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-slate-200 bg-white/95 p-3 backdrop-blur-sm sm:static sm:border-0 sm:bg-transparent sm:p-0">
        <div className="mx-auto flex w-full max-w-md items-center justify-between gap-3 rounded-[1.35rem] sm:max-w-none sm:border sm:border-[var(--border)] sm:bg-white/80 sm:p-4 sm:shadow-[0_12px_30px_rgba(47,41,34,0.05)]">
          <button
            type="button"
            onClick={goPrev}
            disabled={currentStep === "overview"}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
              currentStep === "overview"
                ? "invisible"
                : "text-slate-600 hover:bg-slate-100 active:bg-slate-200"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              {currentIdx + 1} / {steps.length}
            </span>
          </div>

          <button
            type="button"
            onClick={goNext}
            disabled={currentStep === "submit"}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all",
              currentStep === "submit"
                ? "invisible"
                : "bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-700"
            )}
          >
            <span className="hidden sm:inline">Próximo</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
