import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";

// Optimized music track data with file size information
const musicTrack = [
  {
    title: "Inner Horizon",
    src: "/Music/Music_1.mp3",
    cover: "/Music/cover/musicPic1.jpg",
    size: "18MB",
  },
  {
    title: "Echoes of Light",
    src: "/Music/Music_2.ogg",
    cover: "/Music/cover/musicPic2.jpg",
    size: "2.1MB",
  },
  {
    title: "Soul River",
    src: "/Music/Music_3.wav",
    cover: "/Music/cover/musicPic3.jpg",
    size: "57MB",
  },
  {
    title: "Moments Between",
    src: "/Music/Music_4.mp3",
    cover: "/Music/cover/musicPic4.jpg",
    size: "3.9MB",
  },
  {
    title: "Infinite Pause",
    src: "/Music/Music_5.wav",
    cover: "/Music/cover/musicPic5.jpg",
    size: "46MB",
  },
  {
    title: "Beyond Thought",
    src: "/Music/Music_6.mp3",
    cover: "/Music/cover/musicPic6.jpg",
    size: "1.1MB",
  },
  {
    title: "Crystalline Mind",
    src: "/Music/Music_7.wav",
    cover: "/Music/cover/musicPic7.jpg",
    size: "25MB",
  },
  {
    title: "The Quiet Path",
    src: "/Music/Music_8.mp3",
    cover: "/Music/cover/musicPic8.jpg",
    size: "1.1MB",
  },
  {
    title: "Forest of Silence",
    src: "/Music/Music_9.wav",
    cover: "/Music/cover/musicPic9.jpg",
    size: "20MB",
  },
  {
    title: "Tranquil Flow",
    src: "/Music/Music_10.mp3",
    cover: "/Music/cover/musicPic10.jpg",
    size: "1.7MB",
  },
  {
    title: "Parallel Breather",
    src: "/Music/Music_13.mp3",
    cover: "/Music/cover/musicPic14.jpg",
    size: "28MB",
  },
  {
    title: "Instrumental calmness",
    src: "/Music/Music_14.mp3",
    cover: "/Music/cover/musicPic13.jpg",
    size: "939KB",
  },
  {
    title: "Floating Presence",
    src: "/Music/Music_15.mp3",
    cover: "/Music/cover/musicPic21.jpg",
    size: "4.6MB",
  },
  {
    title: "Sacred Air",
    src: "/Music/Music_16.mp3",
    cover: "/Music/cover/musicPic22.jpg",
    size: "3.8MB",
  },
  {
    title: "Whispers of Stillness",
    src: "/Music/Music_17.mp3",
    cover: "/Music/cover/musicPic17.jpg",
    size: "3.8MB",
  },
  {
    title: "Still Waters Rising",
    src: "/Music/Music_18.mp3",
    cover: "/Music/cover/musicPic18.jpg",
    size: "19MB",
  },
];

// Lazy loading hook for images
const useLazyImage = (src) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    img.onerror = () => {
      setIsLoading(false);
    };
    img.src = src;
  }, [src]);

  return { imageSrc, isLoading };
};

// Optimized audio manager
const useAudioManager = () => {
  const audioRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadAudio = useCallback((src) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    setIsLoading(true);
    setIsLoaded(false);

    const audio = new Audio();
    audio.preload = "metadata"; // Only load metadata initially

    audio.onloadedmetadata = () => {
      setIsLoaded(true);
      setIsLoading(false);
    };

    audio.onerror = () => {
      setIsLoading(false);
      console.error("Failed to load audio:", src);
    };

    audio.src = src;
    audioRef.current = audio;
  }, []);

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return { audioRef, isLoaded, isLoading, loadAudio, cleanup };
};

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [visibleTracks, setVisibleTracks] = useState(8); // Show only first 8 tracks initially

  const { audioRef, isLoaded, isLoading, loadAudio, cleanup } =
    useAudioManager();
  const currentTrack = musicTrack[currentTrackIndex];
  const { imageSrc: coverImage, isLoading: imageLoading } = useLazyImage(
    currentTrack.cover
  );

  // Memoize current track to prevent unnecessary re-renders
  const memoizedCurrentTrack = useMemo(() => currentTrack, [currentTrackIndex]);

  // Load audio when track changes
  useEffect(() => {
    loadAudio(musicTrack[currentTrackIndex].src);
  }, [currentTrackIndex, loadAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !isLoaded) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Failed to play audio:", error);
      });
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, isLoaded]);

  const playNext = useCallback(() => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex === musicTrack.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  const playPrevious = useCallback(() => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex === 0 ? musicTrack.length - 1 : prevIndex - 1
    );
  }, []);

  const handleTrackSelect = useCallback((index) => {
    setCurrentTrackIndex(index);
  }, []);

  // Load more tracks when scrolling
  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      setVisibleTracks((prev) => Math.min(prev + 4, musicTrack.length));
    }
  }, []);

  // Memoize track list to prevent unnecessary re-renders
  const trackList = useMemo(
    () =>
      musicTrack
        .slice(0, visibleTracks)
        .map((audio, index) => (
          <TrackItem
            key={index}
            audio={audio}
            index={index}
            isActive={index === currentTrackIndex}
            onSelect={handleTrackSelect}
          />
        )),
    [visibleTracks, currentTrackIndex, handleTrackSelect]
  );

  return (
    <div className="w-[100%] md:flex-1 flex border-2 border-white flex-col p-3 pb-5 rounded-2xl">
      <div
        className="Hero relative h-[100%] w-[100%] md:flex-1 flex justify-end border-2 border-white flex-col p-5 rounded-2xl"
        style={{
          backgroundImage: coverImage ? `url(${coverImage})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-500">Loading...</div>
          </div>
        )}
        <div
          className="absolute inset-0 bg-black"
          style={{
            backgroundColor: "white",
            opacity: 0.3,
            zIndex: 1,
          }}
        ></div>
        <div className="controls relative z-2 w-full p-5 flex flex-col items-center justify-end gap-5 bottom-0">
          <p className="text-white text-shadow-lg font-bold text-center text-3xl">
            {currentTrack.title}
          </p>
          <div className="flex gap-3">
            <button
              onClick={playPrevious}
              className="btn btn-circle text-2xl text-center bg-orange-400 text-white hover:bg-orange-500 transition-colors"
              disabled={isLoading}
            >
              <i className="fa-solid fa-backward"></i>
            </button>
            <button
              className="btn btn-circle text-2xl text-center bg-orange-400 text-white hover:bg-orange-500 transition-colors"
              onClick={togglePlay}
              disabled={!isLoaded || isLoading}
            >
              {isLoading ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : isPlaying ? (
                <i className="fa-solid fa-pause"></i>
              ) : (
                <i className="fa-solid fa-play"></i>
              )}
            </button>
            <button
              onClick={playNext}
              className="btn btn-circle text-center text-2xl bg-orange-400 text-white hover:bg-orange-500 transition-colors"
              disabled={isLoading}
            >
              <i className="fa-solid fa-forward"></i>
            </button>
          </div>
          {isLoading && <p className="text-white text-sm">Loading audio...</p>}
        </div>
      </div>
      <div
        className="musicList h-[460px] overflow-y-scroll shadow-lg rounded-2xl border-2 border-white p-5 mt-5 mb-5"
        onScroll={handleScroll}
      >
        <ul>{trackList}</ul>
        {visibleTracks < musicTrack.length && (
          <div className="text-center text-gray-500 mt-4">
            Scroll to load more tracks...
          </div>
        )}
      </div>
    </div>
  );
};

// Separate component for track items to optimize re-renders
const TrackItem = React.memo(({ audio, index, isActive, onSelect }) => {
  const { imageSrc, isLoading } = useLazyImage(audio.cover);

  return (
    <li
      onClick={() => onSelect(index)}
      className={`music shadow-lg rounded-2xl border-2 cursor-pointer hover:shadow-2xl hover:bg-gray-200 border-white p-3 mt-2 mb-2 transition-all ${
        isActive ? "bg-orange-100 border-orange-400" : ""
      }`}
    >
      <div className="grid grid-cols-5 items-center w-full gap-3">
        <div className="flex justify-center">
          {isLoading ? (
            <div className="w-[50px] h-[50px] rounded-full bg-gray-200 animate-pulse"></div>
          ) : (
            <img
              src={imageSrc || audio.cover}
              alt="musicCover"
              className="w-[50px] h-[50px] rounded-full object-cover"
              loading="lazy"
            />
          )}
        </div>
        <div className="col-span-4">
          <p className="text-xl font-semibold text-orange-400">{audio.title}</p>
          <p className="text-sm text-gray-500">{audio.size}</p>
        </div>
      </div>
    </li>
  );
});

TrackItem.displayName = "TrackItem";

export default MusicPlayer;
