
import { useEffect } from 'react';

export const useNotifications = () => {
  useEffect(() => {
    const requestNotificationPermission = async () => {
      if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        await Notification.requestPermission();
      }
    };

    requestNotificationPermission();

    const showNotification = (title: string, body: string) => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body });
      }
    };

    // Hydration reminder
    const hydrationInterval = setInterval(() => {
      showNotification('DriftPay', 'Sip. Breathe. Drift. Your clarity begins with calm.');
    }, 3 * 60 * 60 * 1000); // Every 3 hours

    // Sleep reminder
    const checkSleepTime = () => {
      const now = new Date();
      const ninePM = new Date(now);
      ninePM.setHours(21, 0, 0, 0);

      if (now > ninePM) {
        ninePM.setDate(ninePM.getDate() + 1);
      }

      const timeToNinePM = ninePM.getTime() - now.getTime();

      setTimeout(() => {
        showNotification('DriftPay', 'Let go. The drift awaits. Start your sleep ritual.');
        // Check again for tomorrow
        setInterval(() => {
          showNotification('DriftPay', 'Let go. The drift awaits. Start your sleep ritual.');
        }, 24 * 60 * 60 * 1000);
      }, timeToNinePM);
    };

    checkSleepTime();

    return () => {
      clearInterval(hydrationInterval);
    };
  }, []);
};
