import { BellIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import {
  checkSubscription,
  unsubscribe,
  subscribeToCourse,
} from "../../services/connections-courses";

export interface BellButtonProps {
  courseId: number;
}

const BellButton = ({ courseId }: BellButtonProps) => {
  const [subscriptionId, setSubscriptionId] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const isSubscribed = subscriptionId !== null;

  useEffect(() => {
    if (!courseId) return;
    checkSubscription(courseId)
      .then(setSubscriptionId)
      .catch((error) => console.error("Error al comprobar suscripción:", error));
  }, [courseId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;
    setPending(true);

    try {
      if (isSubscribed) {
        await unsubscribe(subscriptionId!);
        setSubscriptionId(null);
      } else {
        const newSubscription = await subscribeToCourse({ course: courseId });
        setSubscriptionId(newSubscription?.id ?? null);
      }
    } catch (error) {
      console.error("Error al hacer toggle:", error);
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={pending}
      className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-all
        ${pending ? "opacity-40 cursor-not-allowed" : ""}
        ${
          isSubscribed
            ? "bg-yellow-100 text-yellow-600 shadow-inner"
            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
        }`}
    >
      <BellIcon className={`w-6 h-6 ${isSubscribed ? "fill-current" : ""}`} />
    </button>
  );
};

export default BellButton;
