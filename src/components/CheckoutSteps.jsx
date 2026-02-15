import React from "react";
import { CreditCard, MapPin, Truck } from "lucide-react";

const steps = [
  { id: 1, title: "Address", icon: MapPin },
  { id: 2, title: "Shipping", icon: Truck },
  { id: 3, title: "Payment", icon: CreditCard },
];

const CheckoutSteps = ({ activeStep = 1 }) => {
  return (
    <div className="w-full flex items-center justify-center gap-3 md:gap-7">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const active = step.id <= activeStep;

        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                  active
                    ? "bg-black border-black text-white"
                    : "bg-white border-gray-300 text-gray-500"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="hidden md:block">
                <p className="text-[11px] text-gray-500">Step {step.id}</p>
                <p
                  className={`text-sm ${
                    active ? "text-black font-semibold" : "text-gray-500"
                  }`}
                >
                  {step.title}
                </p>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className="w-8 md:w-14 h-px bg-gray-300" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default CheckoutSteps;
