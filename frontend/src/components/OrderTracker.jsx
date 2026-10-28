/** Delivery progress for one order, as a row of steps. */
import Icon from "./Icon";
import { ORDER_STEPS, formatWhen } from "../services/orderStatus";

export default function OrderTracker({ order }) {
  if (order.status === "cancelled") {
    return (
      <p className="tracker-cancelled">
        This order was cancelled on {formatWhen(order.updated_at)}.
      </p>
    );
  }

  const currentIndex = Math.max(
    0,
    ORDER_STEPS.findIndex((step) => step.key === order.status),
  );

  return (
    <ol className="tracker" aria-label="Delivery progress">
      {ORDER_STEPS.map((step, index) => {
        const done = index <= currentIndex;
        const current = index === currentIndex;
        return (
          <li
            key={step.key}
            className={`tracker-step${done ? " is-done" : ""}${current ? " is-current" : ""}`}
            aria-current={current ? "step" : undefined}
          >
            <span className="tracker-dot">{done ? <Icon name="check" /> : null}</span>
            <span className="tracker-label">{step.label}</span>
            {current ? <span className="tracker-when">{formatWhen(order.updated_at)}</span> : null}
          </li>
        );
      })}
    </ol>
  );
}
