import { BellIcon } from '@heroicons/react/24/outline';

import React, { useState, useEffect } from 'react';
import { isSubscribed as checkSubscription, getUserId, unsuscribe, subscribeToCourse } from "@services/connections.js";
import { data } from 'react-router-dom';

const BellButton = ({ subjectId, className = "" }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
const [userId, setUserId] = useState(null); 

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const idReal = await getUserId(); 
        setUserId(idReal); 
        const status = await checkSubscription(idReal, subjectId); 
        setIsSubscribed(status);
      } catch (error) {
        console.error("Error al comprobar suscripción:", error);
      }
    };

    if (subjectId) {
      cargarDatos();
    }
  }, [subjectId]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) return;
    const newState = !isSubscribed;
    setIsSubscribed(newState); 
    try {
      if (newState) {
        await subscribeToCourse(userId, subjectId);
      } else {
        await unsuscribe(userId, subjectId); 
      }
    } catch (error) {
      console.error("Error al hacer toggle:", error);
      setIsSubscribed(!newState); 
    }
  };
  return (
    <button 
      onClick={handleToggle}
      className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-all
        ${isSubscribed 
          ? 'bg-yellow-100 text-yellow-600 shadow-inner' 
          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
        } ${className}`}
    >
      <BellIcon className={`w-6 h-6 ${isSubscribed ? 'fill-current' : ''}`} />
    </button>
  );
};

export default BellButton;