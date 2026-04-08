import { BellIcon } from "@heroicons/react/24/outline";
import { useCurrentUser } from "@services/useCurrentUser";
import React, { useState, useEffect } from "react";
import {
  checkSubscription,
  unsubscribe,
  subscribeToCourse,
} from "@services/connections.js";

const BellButton = ({ subjectId }) => {
  const [subscriptionId, setSubscriptionId] = useState(null);
  const [userId, setUserId] = useState(null);
  const isSubscribed = subscriptionId !== null;
  const { userData } = useCurrentUser();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setUserId(userData.id);
        const subId = await checkSubscription(userData.id, subjectId);
        setSubscriptionId(subId);
      } catch (error) {
        console.error("Error al comprobar suscripción:", error);
      }
    };

    if (subjectId && userData) {
      cargarDatos();
    }
  }, [subjectId, userData]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) return;
    const previousSubscriptionId = subscriptionId;

    try {
      if (isSubscribed) {
        setSubscriptionId(null);
        await unsubscribe(previousSubscriptionId);
      } else {
        setSubscriptionId("temp");
        const newSubscription = await subscribeToCourse(userId, subjectId);
        setSubscriptionId(newSubscription.id);
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
