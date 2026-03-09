import React from "react"
import { useSelector } from "react-redux";

const steps = [
  { id: 1, label: "購物車" },
  { id: 2, label: "填寫資料" },
  { id: 3, label: "訂購完成" },
];

const Stepper = () => {
  const currentStep = useSelector(state => state.cart.currentStep);

  return (<>
    <section className="stepper">
      <div className="container">
        <div className="d-flex align-items-center justify-content-center">
          {
            steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="text-center flex-fill">
                  <div
                    className={`stepper-circle ${
                      step.id < currentStep
                        ? "complete"
                        : step.id === currentStep
                        ? "current"
                        : "unfinished"
                    }`}
                  >
                    { step.id < currentStep || currentStep === steps.length ? <i className="bi bi-check fs-3"></i> : step.id }
                  </div>
                  <div
                    className={`stepper-label ${
                      step.id < currentStep
                        ? "complete"
                        : step.id === currentStep
                        ? "current"
                        : "unfinished"
                    }`}
                  >
                    {step.label}
                  </div>
                </div>

                { index !== steps.length - 1 && <div className="stepper-line"></div> }
              </React.Fragment>
            ))
          }
        </div>
      </div>
    </section>
  </>);
}

export default Stepper;