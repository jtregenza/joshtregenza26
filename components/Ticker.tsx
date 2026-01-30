// components/Ticker.tsx
'use client';
import { useState, useEffect } from 'react';
import styles from './style/Ticker.module.css';

interface TickerProps {
  cmsMessages?: readonly string[];
}

interface WeatherData {
  temp: number;
  icon: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy';
}

export default function Ticker({ cmsMessages = [] }: TickerProps) {
  const [tickerMessages, setTickerMessages] = useState<string[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);

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
        `${day} - ${time} Brisbane Time`,
      ];

      // Fetch weather
      const weatherData = await fetchWeather();
      if (weatherData) {
        setWeather(weatherData);
        dynamicMessages.push(`WEATHER_PLACEHOLDER`); // We'll replace this with the component
      }

      // Combine dynamic messages with CMS messages
      const allMessages = [...dynamicMessages, ...cmsMessages];
      
      // Shuffle the array
      const shuffled = shuffleArray(allMessages);
      
      setTickerMessages(shuffled);
    };

    updateMessages();
    const interval = setInterval(updateMessages, 60000);
    return () => clearInterval(interval);
  }, [cmsMessages]);

  // Duplicate messages for seamless loop
  const duplicatedMessages = [...tickerMessages, ...tickerMessages, ...tickerMessages];

  return (
    <div className={styles.tickerWrap}>
      <div className={styles.ticker}>
        {duplicatedMessages.map((message, index) => (
          <div key={index} className={styles.tickerItem}>
            {message === 'WEATHER_PLACEHOLDER' && weather ? (
              <span className={styles.weatherItem}>
                <WeatherIcon type={weather.icon} />
                {weather.temp}°C in Brisbane
              </span>
            ) : (
              message
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Weather Icon Component
function WeatherIcon({ type }: { type: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' }) {
  const icons = {
    sunny: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    ),
    cloudy: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
      </svg>
    ),
    rainy: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="8" y1="19" x2="8" y2="21"/>
        <line x1="8" y1="13" x2="8" y2="15"/>
        <line x1="16" y1="19" x2="16" y2="21"/>
        <line x1="16" y1="13" x2="16" y2="15"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="12" y1="15" x2="12" y2="17"/>
        <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/>
      </svg>
    ),
    snowy: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/>
        <line x1="8" y1="16" x2="8" y2="16"/>
        <line x1="8" y1="20" x2="8" y2="20"/>
        <line x1="12" y1="18" x2="12" y2="18"/>
        <line x1="12" y1="22" x2="12" y2="22"/>
        <line x1="16" y1="16" x2="16" y2="16"/>
        <line x1="16" y1="20" x2="16" y2="20"/>
      </svg>
    ),
    stormy: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/>
        <polyline points="13 11 9 17 15 17 11 23"/>
      </svg>
    ),
  };

  return <span className={styles.weatherIcon}>{icons[type]}</span>;
}

// Fetch weather data
async function fetchWeather(): Promise<WeatherData | null> {
  try {
    const response = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=-27.47&longitude=153.03&current_weather=true',
      { cache: 'no-store' }
    );
    const data = await response.json();
    const temp = Math.round(data.current_weather.temperature);
    const weatherCode = data.current_weather.weathercode;
    
    const icon = getWeatherIcon(weatherCode);
    return { temp, icon };
  } catch (error) {
    console.error('Weather fetch error:', error);
    return null;
  }
}

function getWeatherIcon(code: number): 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' {
  if (code === 0) return 'sunny';
  if (code <= 3) return 'cloudy';
  if (code <= 67) return 'rainy';
  if (code <= 77) return 'snowy';
  if (code <= 82) return 'rainy';
  return 'stormy';
}

// Shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}