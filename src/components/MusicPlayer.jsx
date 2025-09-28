import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";

// Custom hook to manage audio
const useAudioManager = () => {
  const audioRef = useRef(new Audio());
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadAudio = useCallback((src) => {
    setIsLoading(true);
    setIsLoaded(false);

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const newAudio = new Audio(src);
    audioRef.current = newAudio;

    newAudio.addEventListener("canplaythrough", () => {
      setIsLoaded(true);
      setIsLoading(false);
    });

    newAudio.addEventListener("error", () => {
      setIsLoaded(false);
      setIsLoading(false);
    });
  }, []);

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
  }, []);

  return { audioRef, isLoaded, isLoading, loadAudio, cleanup };
};

const MusicPlayer = () => {
  const [musicTrack, setMusicTrack] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [visibleTracks, setVisibleTracks] = useState(8);

  const { audioRef, isLoaded, isLoading, loadAudio, cleanup } =
    useAudioManager();

  // Fetch API on mount (Jamendo)
  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const res = await fetch(
          `https://api.jamendo.com/v3.0/tracks/?client_id=4ccab416&format=json&limit=20&tags=ambient`
        );
        const data = await res.json();

        const formatted = data.results.map((track, i) => ({
          title: track.name || `Relaxing Track ${i + 1}`,
          src: track.audio, // MP3 stream
          cover: track.album_image || "https://via.placeholder.com/150",
          size: track.duration
            ? `${Math.round(track.duration / 60)} min`
            : "Unknown",
        }));

        setMusicTrack(formatted);
      } catch (err) {
        console.error("Error fetching music:", err);
      }
    };

    fetchMusic();
  }, []);

  useEffect(() => {
    if (musicTrack.length > 0) {
      const wasPlaying = isPlaying;
      loadAudio(musicTrack[currentTrackIndex].src);

      // If we were playing before switching tracks, continue playing the new track
      if (wasPlaying) {
        // We need to wait for the audio to be loaded before playing
        const playWhenReady = () => {
          if (audioRef.current && audioRef.current.readyState >= 3) {
            audioRef.current.play().catch((error) => {
              console.error("Failed to play audio:", error);
              setIsPlaying(false);
            });
          } else {
            // If not ready yet, try again after a short delay
            setTimeout(playWhenReady, 100);
          }
        };

        // Small delay to ensure audio is properly loaded
        setTimeout(playWhenReady, 50);
      }
    }
  }, [currentTrackIndex, musicTrack, loadAudio]);

  useEffect(() => cleanup, [cleanup]);

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
  }, [musicTrack]);

  const playPrevious = useCallback(() => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex === 0 ? musicTrack.length - 1 : prevIndex - 1
    );
  }, [musicTrack]);

  const handleTrackSelect = useCallback((index) => {
    setCurrentTrackIndex(index);
  }, []);

  const handleScroll = useCallback(
    (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setVisibleTracks((prev) => Math.min(prev + 4, musicTrack.length));
      }
    },
    [musicTrack]
  );

  const currentTrack = musicTrack[currentTrackIndex] || {};
  const memoizedCurrentTrack = useMemo(
    () => currentTrack,
    [currentTrackIndex, musicTrack]
  );

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
    [visibleTracks, currentTrackIndex, musicTrack, handleTrackSelect]
  );

  return (
    <div className="w-[95%] mx-auto bg-gradient-to-br from-white via-orange-50 to-white rounded-3xl shadow-2xl overflow-hidden border-2 border-orange-100">
      {/* Modern Player Header */}
      <div className="bg-orange-400/10 backdrop-blur-sm p-6 border-b border-orange-200/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={
                  memoizedCurrentTrack.cover || "https://via.placeholder.com/60"
                }
                alt="Album art"
                className="w-16 h-16 rounded-2xl object-cover shadow-lg ring-2 ring-orange-200"
              />
              {isPlaying && (
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-orange-400 to-orange-500 opacity-75 blur animate-pulse"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-orange-900 font-semibold text-lg truncate">
                {memoizedCurrentTrack.title || "Loading..."}
              </h3>
              <p className="text-orange-600 text-sm">
                {memoizedCurrentTrack.size || "Unknown"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <div
              className={`w-2 h-2 rounded-full ${
                isPlaying ? "bg-orange-500 animate-pulse" : "bg-gray-400"
              }`}
            ></div>
            <span className="text-xs text-orange-700">
              {isPlaying ? "Playing" : "Paused"}
            </span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-6 mt-6">
          <button
            onClick={playPrevious}
            disabled={isLoading}
            className="p-3 rounded-full bg-orange-100 hover:bg-orange-200 transition-all duration-200 text-orange-600 disabled:opacity-50 shadow-md"
          >
            <i className="fa-solid fa-backward text-lg"></i>
          </button>

          <button
            onClick={togglePlay}
            disabled={!isLoaded || isLoading}
            className="p-4 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 transition-all duration-200 text-white shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            {isLoading ? (
              <i className="fa-solid fa-spinner fa-spin text-xl"></i>
            ) : isPlaying ? (
              <i className="fa-solid fa-pause text-xl"></i>
            ) : (
              <i className="fa-solid fa-play text-xl ml-1"></i>
            )}
          </button>

          <button
            onClick={playNext}
            disabled={isLoading}
            className="p-3 rounded-full bg-orange-100 hover:bg-orange-200 transition-all duration-200 text-orange-600 disabled:opacity-50 shadow-md"
          >
            <i className="fa-solid fa-forward text-lg"></i>
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center mt-4">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce mr-1"></div>
            <div
              className="w-2 h-2 bg-orange-400 rounded-full animate-bounce mr-1"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <span className="text-orange-700 text-sm ml-3">
              Loading audio...
            </span>
          </div>
        )}
      </div>

      {/* Modern Playlist */}
      <div className="bg-white/80 backdrop-blur-sm">
        <div className="px-6 py-4 border-b border-orange-200">
          <h4 className="text-orange-900 font-semibold text-lg flex items-center">
            <i className="fa-solid fa-music mr-2 text-orange-500"></i>
            Playlist
          </h4>
        </div>

        <div
          className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-transparent"
          onScroll={handleScroll}
        >
          <div className="px-4 py-2">
            {trackList}
            {visibleTracks < musicTrack.length && (
              <div className="text-center py-4">
                <div className="inline-flex items-center text-orange-500 text-sm">
                  <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse mr-2"></div>
                  Scroll to load more tracks
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Track Item component
const TrackItem = React.memo(({ audio, index, isActive, onSelect }) => (
  <div
    onClick={() => onSelect(index)}
    className={`group cursor-pointer rounded-xl p-3 mb-2 transition-all duration-200 hover:bg-orange-50 ${
      isActive
        ? "bg-gradient-to-r from-orange-100 to-orange-50 border border-orange-300"
        : "hover:bg-orange-25"
    }`}
  >
    <div className="flex items-center space-x-3">
      <div className="relative flex-shrink-0">
        <img
          src={audio.cover}
          alt="Track cover"
          className="w-12 h-12 rounded-lg object-cover shadow-sm"
          loading="lazy"
        />
        {isActive && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-400/30 to-orange-300/30 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-sm"></div>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`font-medium text-sm truncate transition-colors ${
            isActive
              ? "text-orange-800"
              : "text-gray-800 group-hover:text-orange-700"
          }`}
        >
          {audio.title}
        </p>
        <p
          className={`text-xs truncate transition-colors ${
            isActive
              ? "text-orange-600"
              : "text-gray-500 group-hover:text-orange-500"
          }`}
        >
          {audio.size}
        </p>
      </div>

      {isActive && (
        <div className="flex-shrink-0">
          <div className="w-4 h-4 flex items-center justify-center">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  </div>
));

TrackItem.displayName = "TrackItem";

export default MusicPlayer;
