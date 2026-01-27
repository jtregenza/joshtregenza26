'use client';
import { useState, useEffect } from 'react';
import styles from './style/Ticker.module.css';

interface TickerProps {
  cmsMessages: readonly string[];
}

export default function Ticker({ cmsMessages = [] }: TickerProps) {
    console.log('Ticker received messages:', cmsMessages);
  const [tickerMessages, setTickerMessages] = useState<string[]>([]);

  useEffect(() => {
    const updateMessages = async () => {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Australia/Brisbane'
      });
      
      const day = now.toLocaleDateString('en-US', { 
        weekday: 'long',
        timeZone: 'Australia/Brisbane'
      });

      const dynamicMessages = [
        `🕐 ${day} - ${time} Brisbane Time`,
      ];

      // Fetch weather
      const weather = await fetchWeather();
      if (weather) dynamicMessages.push(weather);


        console.log('Dynamic messages:', dynamicMessages);
        console.log('CMS messages:', cmsMessages);
        
        const allMessages = [...dynamicMessages, ...cmsMessages];
        // Shuffle/randomize the array
        const shuffled = allMessages.sort(() => Math.random() - 0.5);
        
        setTickerMessages(shuffled);
    };

    updateMessages();

    const interval = setInterval(updateMessages, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [cmsMessages]);

  // Duplicate messages for seamless loop
  const duplicatedMessages = [...tickerMessages, ...tickerMessages, ...tickerMessages];

  return (
    <div className={styles.tickerWrap}>
      <div className={styles.ticker}>
        {duplicatedMessages.map((message, index) => (
          <div key={index} className={styles.tickerItem}>
            {message}
          </div>
        ))}
      </div>
    </div>
  );
}

// Fetch weather data
async function fetchWeather(): Promise<string | null> {
  try {
    const response = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=-27.47&longitude=153.03&current_weather=true',
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );
    const data = await response.json();
    const temp = Math.round(data.current_weather.temperature);
    const weatherCode = data.current_weather.weathercode;
    
    const weatherEmoji = getWeatherEmoji(weatherCode);
    return `${weatherEmoji} ${temp}°C in Brisbane`;
  } catch (error) {
    console.error('Weather fetch error:', error);
    return null;
  }
}

function getWeatherEmoji(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '🌨️';
  if (code <= 82) return '🌧️';
  return '⛈️';
}

