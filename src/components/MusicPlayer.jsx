import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";

// ✅ Custom hook to manage audio
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

  // ✅ Fetch API on mount (Jamendo)
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
      loadAudio(musicTrack[currentTrackIndex].src);
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
    <div className="w-[100%] md:flex-1 flex border-2 border-white flex-col p-3 pb-5 rounded-2xl">
      {/* ✅ Main Player */}
      <div
        className="Hero relative h-[100%] w-[100%] md:flex-1 flex justify-end border-2 border-white flex-col p-5 rounded-2xl"
        style={{
          backgroundImage: memoizedCurrentTrack.cover
            ? `url(${memoizedCurrentTrack.cover})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0 bg-black"
          style={{ backgroundColor: "white", opacity: 0.3, zIndex: 1 }}
        ></div>
        <div className="controls relative z-2 w-full p-5 flex flex-col items-center justify-end gap-5 bottom-0">
          <p className="text-white text-shadow-lg font-bold text-center text-3xl">
            {memoizedCurrentTrack.title || "Loading..."}
          </p>
          <div className="flex gap-3">
            <button
              onClick={playPrevious}
              className="btn btn-circle text-2xl bg-orange-400 text-white hover:bg-orange-500"
              disabled={isLoading}
            >
              <i className="fa-solid fa-backward"></i>
            </button>
            <button
              className="btn btn-circle text-2xl bg-orange-400 text-white hover:bg-orange-500"
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
              className="btn btn-circle text-2xl bg-orange-400 text-white hover:bg-orange-500"
              disabled={isLoading}
            >
              <i className="fa-solid fa-forward"></i>
            </button>
          </div>
          {isLoading && <p className="text-white text-sm">Loading audio...</p>}
        </div>
      </div>

      {/* ✅ Playlist */}
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

// ✅ Track Item component
const TrackItem = React.memo(({ audio, index, isActive, onSelect }) => (
  <li
    onClick={() => onSelect(index)}
    className={`music shadow-lg rounded-2xl border-2 cursor-pointer hover:shadow-2xl hover:bg-gray-200 border-white p-3 mt-2 mb-2 transition-all ${
      isActive ? "bg-orange-100 border-orange-400" : ""
    }`}
  >
    <div className="grid grid-cols-5 items-center w-full gap-3">
      <div className="flex justify-center">
        <img
          src={audio.cover}
          alt="musicCover"
          className="w-[50px] h-[50px] rounded-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="col-span-4">
        <p className="text-xl font-semibold text-orange-400">{audio.title}</p>
        <p className="text-sm text-gray-500">{audio.size}</p>
      </div>
    </div>
  </li>
));

TrackItem.displayName = "TrackItem";

export default MusicPlayer;
