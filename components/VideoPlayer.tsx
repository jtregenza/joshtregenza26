'use client'
import React, { useState, useRef, useEffect } from 'react'
import styles from './style/videoplayer.module.css'
import VolcumeIcon from './svgs/volume-icon'
import MuteIcon from './svgs/mute-icon'
import { VHSEffect } from './VHSEffect'

type MediaType = 'youtube' | 'vimeo' | 'audio' | 'video'

interface MediaPlayerProps {
  mediaUrl: string
  mediaPoster?: string
}

export const MediaPlayer: React.FC<MediaPlayerProps> = ({ mediaUrl, mediaPoster }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [mediaType, setMediaType] = useState<MediaType>('video')
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const youtubePlayerRef = useRef<any>(null)
  const vimeoPlayerRef = useRef<any>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Detect media type from URL
  useEffect(() => {
    const detectedType = detectMediaType(mediaUrl)
    setMediaType(detectedType)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
  }, [mediaUrl])

  // Initialize YouTube Player API
  useEffect(() => {
    if (mediaType === 'youtube') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }

      const loadYouTubeAPI = () => {
        if (typeof window !== 'undefined' && (window as any).YT && (window as any).YT.Player) {
          initializeYouTubePlayer()
        } else {
          if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
            const tag = document.createElement('script')
            tag.src = 'https://www.youtube.com/iframe_api'
            const firstScriptTag = document.getElementsByTagName('script')[0]
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
          }
          ;(window as any).onYouTubeIframeAPIReady = initializeYouTubePlayer
        }
      }

      const initializeYouTubePlayer = () => {
        let attempts = 0
        const maxAttempts = 50

        const checkIframe = setInterval(() => {
          attempts++

          if (iframeRef.current && iframeRef.current.contentWindow) {
            clearInterval(checkIframe)

            try {
              youtubePlayerRef.current = new (window as any).YT.Player(iframeRef.current, {
                events: {
                  onReady: (event: any) => {
                    try {
                      const dur = event.target.getDuration()
                      if (typeof dur === 'number' && !isNaN(dur)) {
                        setDuration(dur)
                      }
                      startTimeTracking('youtube')
                    } catch (error) {
                      console.error('YouTube onReady error:', error)
                    }
                  },
                  onStateChange: (event: any) => {
                    try {
                      if (event.data === (window as any).YT.PlayerState.PLAYING) {
                        setIsPlaying(true)
                      } else if (event.data === (window as any).YT.PlayerState.PAUSED) {
                        setIsPlaying(false)
                      }
                    } catch (error) {
                      console.error('YouTube onStateChange error:', error)
                    }
                  },
                },
              })
            } catch (error) {
              console.error('YouTube player initialization error:', error)
            }
          } else if (attempts >= maxAttempts) {
            clearInterval(checkIframe)
            console.error('YouTube iframe failed to load')
          }
        }, 100)
      }

      loadYouTubeAPI()

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        youtubePlayerRef.current = null
      }
    }
  }, [mediaType, mediaUrl])

  // Initialize Vimeo Player
  useEffect(() => {
    if (mediaType === 'vimeo' && iframeRef.current) {
      const script = document.createElement('script')
      script.src = 'https://player.vimeo.com/api/player.js'
      script.onload = () => {
        const Player = (window as any).Vimeo.Player
        vimeoPlayerRef.current = new Player(iframeRef.current)

        vimeoPlayerRef.current.getDuration().then((dur: number) => {
          setDuration(dur)
        })

        vimeoPlayerRef.current.on('play', () => setIsPlaying(true))
        vimeoPlayerRef.current.on('pause', () => setIsPlaying(false))

        startTimeTracking('vimeo')
      }

      if (!document.querySelector('script[src="https://player.vimeo.com/api/player.js"]')) {
        document.head.appendChild(script)
      } else {
        const Player = (window as any).Vimeo.Player
        vimeoPlayerRef.current = new Player(iframeRef.current)

        vimeoPlayerRef.current.getDuration().then((dur: number) => {
          setDuration(dur)
        })

        vimeoPlayerRef.current.on('play', () => setIsPlaying(true))
        vimeoPlayerRef.current.on('pause', () => setIsPlaying(false))

        startTimeTracking('vimeo')
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [mediaType, mediaUrl])

  const startTimeTracking = (type: 'youtube' | 'vimeo') => {
    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      try {
        if (
          type === 'youtube' &&
          youtubePlayerRef.current &&
          typeof youtubePlayerRef.current.getCurrentTime === 'function'
        ) {
          const time = youtubePlayerRef.current.getCurrentTime()
          if (typeof time === 'number' && !isNaN(time)) {
            setCurrentTime(time)
          }
        } else if (type === 'vimeo' && vimeoPlayerRef.current) {
          vimeoPlayerRef.current.getCurrentTime().then((time: number) => {
            setCurrentTime(time)
          })
        }
      } catch (error) {
        console.error('Time tracking error:', error)
      }
    }, 100)
  }

  const handlePlayPause = () => {
    if (mediaType === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    } else if (mediaType === 'audio' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    } else if (mediaType === 'youtube' && youtubePlayerRef.current) {
      try {
        if (isPlaying) {
          youtubePlayerRef.current.pauseVideo()
        } else {
          youtubePlayerRef.current.playVideo()
        }
        setIsPlaying(!isPlaying)
      } catch (error) {
        console.error('YouTube player error:', error)
      }
    } else if (mediaType === 'vimeo' && vimeoPlayerRef.current) {
      if (isPlaying) {
        vimeoPlayerRef.current.pause()
      } else {
        vimeoPlayerRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    const ref = mediaType === 'audio' ? audioRef.current : videoRef.current
    if (ref) {
      setCurrentTime(ref.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    const ref = mediaType === 'audio' ? audioRef.current : videoRef.current
    if (ref) {
      setDuration(ref.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)

    try {
      if (mediaType === 'video' && videoRef.current) {
        videoRef.current.currentTime = newTime
      } else if (mediaType === 'audio' && audioRef.current) {
        audioRef.current.currentTime = newTime
      } else if (
        mediaType === 'youtube' &&
        youtubePlayerRef.current &&
        typeof youtubePlayerRef.current.seekTo === 'function'
      ) {
        youtubePlayerRef.current.seekTo(newTime, true)
      } else if (mediaType === 'vimeo' && vimeoPlayerRef.current) {
        vimeoPlayerRef.current.setCurrentTime(newTime)
      }
    } catch (error) {
      console.error('Seek error:', error)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)

    try {
      if (mediaType === 'video' && videoRef.current) {
        videoRef.current.volume = newVolume
      } else if (mediaType === 'audio' && audioRef.current) {
        audioRef.current.volume = newVolume
      } else if (
        mediaType === 'youtube' &&
        youtubePlayerRef.current &&
        typeof youtubePlayerRef.current.setVolume === 'function'
      ) {
        youtubePlayerRef.current.setVolume(newVolume * 100)
        if (newVolume === 0) {
          youtubePlayerRef.current.mute()
        } else {
          youtubePlayerRef.current.unMute()
        }
      } else if (mediaType === 'vimeo' && vimeoPlayerRef.current) {
        vimeoPlayerRef.current.setVolume(newVolume)
      }
    } catch (error) {
      console.error('Volume change error:', error)
    }
  }

  const toggleMute = () => {
    const newMutedState = !isMuted
    setIsMuted(newMutedState)

    try {
      if (mediaType === 'video' && videoRef.current) {
        videoRef.current.muted = newMutedState
      } else if (mediaType === 'audio' && audioRef.current) {
        audioRef.current.muted = newMutedState
      } else if (mediaType === 'youtube' && youtubePlayerRef.current) {
        if (
          typeof youtubePlayerRef.current.mute === 'function' &&
          typeof youtubePlayerRef.current.unMute === 'function'
        ) {
          if (newMutedState) {
            youtubePlayerRef.current.mute()
          } else {
            youtubePlayerRef.current.unMute()
          }
        }
      } else if (mediaType === 'vimeo' && vimeoPlayerRef.current) {
        vimeoPlayerRef.current.setVolume(newMutedState ? 0 : volume)
      }
    } catch (error) {
      console.error('Mute toggle error:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const renderMedia = () => {
    switch (mediaType) {
      case 'youtube':
        const youtubeId = extractYouTubeId(mediaUrl)
        return (
          <iframe
            ref={iframeRef}
            className={styles.video}
            src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&controls=0&modestbranding=1&rel=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )

      case 'vimeo':
        const vimeoId = extractVimeoId(mediaUrl)
        return (
          <iframe
            ref={iframeRef}
            className={styles.video}
            src={`https://player.vimeo.com/video/${vimeoId}?controls=0`}
            title="Vimeo video player"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        )

      case 'audio':
        return (
          <audio
            ref={audioRef}
            key={mediaUrl}
            className={styles.video}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={mediaUrl} type="audio/mpeg" />
            <source src={mediaUrl} type="audio/ogg" />
            <source src={mediaUrl} type="audio/wav" />
            Your browser does not support the audio tag.
          </audio>
        )

      case 'video':
      default:
        return (
          <video
            ref={videoRef}
            key={mediaUrl}
            poster={mediaPoster}
            className={styles.video}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )
    }
  }

  return (
    <>
    <div className={styles.outerArea}>
      {/* <TVOutArea /> */}
      <div className={styles.innerArea}>
        {/* <TVInArea /> */}
        <div className={styles.videoPlayerWrapper}>
          {renderMedia()}
          <VHSEffect />

        </div>
      </div>
    </div>
              <div className={styles.controls}>
            <button className={styles.playButton} onClick={handlePlayPause}>
              {isPlaying ? '⏸' : '▶'}
            </button>

            <span className={styles.time}>{formatTime(currentTime)}</span>

            <input
              type="range"
              className={styles.seekBar}
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
            />

            <span className={styles.time}>{formatTime(duration)}</span>

            <button className={styles.volumeButton} onClick={toggleMute}>
              {isMuted ? <MuteIcon /> : <VolcumeIcon />}
            </button>

            <input
              type="range"
              className={styles.volumeBar}
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
            />
          </div>
    </>
  )
}

// Auto-detect media type from URL
function detectMediaType(url: string): MediaType {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube'
  }
  if (url.includes('vimeo.com')) {
    return 'vimeo'
  }
  if (url.match(/\.(mp3|wav|ogg|m4a|aac)$/i)) {
    return 'audio'
  }
  if (url.match(/\.(mp4|webm|ogg|mov)$/i)) {
    return 'video'
  }
  return 'video' // Default fallback
}

// Helper function to extract YouTube video ID
function extractYouTubeId(url: string): string {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[7].length === 11 ? match[7] : url
}

// Helper function to extract Vimeo video ID
function extractVimeoId(url: string): string {
  const regExp = /vimeo.*\/(\d+)/i
  const match = url.match(regExp)
  return match ? match[1] : url
}