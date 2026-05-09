import { BellIcon } from "@heroicons/react/24/outline";
import { useCurrentUser } from "../../services/useCurrentUser";
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
  const [userId, setUserId] = useState(null);
  const isSubscribed = subscriptionId !== null;
  const { userData } = useCurrentUser();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setUserId(userData.id);
        const subId = await checkSubscription(userData.id, courseId);
        setSubscriptionId(subId);
      } catch (error) {
        console.error("Error al comprobar suscripción:", error);
      }
    };

    if (courseId && userData) {
      cargarDatos();
    }
  }, [courseId, userData]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) return;
    const previousSubscriptionId = subscriptionId;

    try {
      if (isSubscribed ) {
        setSubscriptionId(null);
        await unsubscribe(previousSubscriptionId!);
      } else {
        const newSubscription = await subscribeToCourse({ user: userId, course: courseId });
        if (newSubscription) {
          setSubscriptionId(newSubscription.id);
        } else {
          setSubscriptionId(null);
        }
      }
    } catch (error) {
      console.error("Error al hacer toggle:", error);
      setSubscriptionId(previousSubscriptionId);
    }
  };
  return (
    <button
      onClick={handleToggle}
      className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-all
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
