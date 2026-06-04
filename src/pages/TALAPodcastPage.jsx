import React, { useState, useEffect } from "react";
import {
  Play,
  Podcast,
  Music2,
  ExternalLink,
  Calendar,
  Clock,
} from "lucide-react";

// Replace with your Supabase URL and anon key
const API_URL = "https://www.theafricalaureateawards.org/api";
const BASE_URL = "";

export default function TALAPodcastPage() {
  const [podcasts, setPodcasts] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [selectedPodcast, setSelectedPodcast] = useState(null);

  useEffect(() => {
    setIsVisible(true);
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    try {
      const response = await fetch(`${API_URL}/podcasts`);
      const result = await response.json();
      setPodcasts(result.data);
    } catch (error) {
      console.error("Error fetching podcasts:", error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${BASE_URL}${url}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className={`bg-gradient-to-br from-[#6B0C22] to-[#4a0818] text-white py-20 md:py-32 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
              <Podcast className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Author Spotlight Podcast
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Listen to inspiring conversations with T.A.L.A. award-winning
              authors about their writing journey and creative process
            </p>
          </div>
        </div>
      </section>

      {/* Featured/Latest Episode */}
      {podcasts.length > 0 && (
        <section
          className={`py-16 bg-white transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-[#6B0C22] to-[#4a0818] rounded-2xl overflow-hidden shadow-2xl">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="aspect-square md:aspect-auto relative">
                  {podcasts[0].cover_image_url ? (
                    <img
                      src={getImageUrl(podcasts[0].cover_image_url)}
                      alt={podcasts[0].title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/10 flex items-center justify-center">
                      <Music2 className="w-24 h-24 text-white/50" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white text-[#6B0C22] px-4 py-2 rounded-full font-bold">
                    Latest Episode
                  </div>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center text-white">
                  <div className="text-sm font-semibold mb-2 text-gray-200">
                    EPISODE {podcasts[0].episode_number}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {podcasts[0].title}
                  </h2>
                  <p className="text-xl mb-2 text-gray-200">
                    with {podcasts[0].guest_name}
                  </p>
                  {podcasts[0].duration && (
                    <div className="flex items-center gap-2 mb-4 text-gray-200">
                      <Clock className="w-4 h-4" />
                      <span>{podcasts[0].duration}</span>
                    </div>
                  )}
                  <p className="text-gray-200 mb-6 leading-relaxed">
                    {podcasts[0].description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {podcasts[0].spotify_url && (
                      <a
                        href={podcasts[0].spotify_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-[#6B0C22] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
                      >
                        <Play className="w-5 h-5" />
                        Spotify
                      </a>
                    )}
                    {podcasts[0].apple_podcast_url && (
                      <a
                        href={podcasts[0].apple_podcast_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center gap-2"
                      >
                        <Play className="w-5 h-5" />
                        Apple
                      </a>
                    )}
                    {podcasts[0].youtube_url && (
                      <a
                        href={podcasts[0].youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center gap-2"
                      >
                        <Play className="w-5 h-5" />
                        YouTube
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Episodes */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            All Episodes
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-[#6B0C22] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading episodes...</p>
            </div>
          ) : podcasts.length === 0 ? (
            <div className="text-center py-12">
              <Podcast className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                No episodes available yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {podcasts.map((podcast, idx) => (
                <div
                  key={podcast.id}
                  className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 group ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${400 + idx * 100}ms` }}
                >
                  <div className="aspect-video relative overflow-hidden bg-gray-200">
                    {podcast.cover_image_url ? (
                      <img
                        src={getImageUrl(podcast.cover_image_url)}
                        alt={podcast.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music2 className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-[#6B0C22] text-white px-3 py-1 rounded-full text-sm font-bold">
                      Ep {podcast.episode_number}
                    </div>
                    {podcast.duration && (
                      <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {podcast.duration}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2 line-clamp-2">
                      {podcast.title}
                    </h3>
                    <p className="text-gray-600 mb-3 font-medium">
                      with {podcast.guest_name}
                    </p>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                      {podcast.description}
                    </p>

                    {podcast.published_date && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                        <Calendar className="w-4 h-4" />
                        {formatDate(podcast.published_date)}
                      </div>
                    )}

                    <div className="flex gap-2">
                      {podcast.spotify_url && (
                        <a
                          href={podcast.spotify_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-[#6B0C22] text-white py-2 px-3 rounded-lg text-center font-semibold hover:bg-[#8B1530] transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <Play className="w-4 h-4" />
                          Listen
                        </a>
                      )}
                      {podcast.youtube_url && (
                        <a
                          href={podcast.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                          title="Watch on YouTube"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Subscribe Section */}
      <section
        className={`py-16 md:py-24 bg-gradient-to-br from-[#6B0C22] to-[#4a0818] text-white transition-all duration-1000 delay-600 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Podcast className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Never Miss an Episode
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Subscribe to T.A.L.A. Author Spotlight on your favorite podcast
            platform
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-white text-[#6B0C22] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              Spotify
            </button>
            <button className="bg-white text-[#6B0C22] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              Apple Podcasts
            </button>
            <button className="bg-white text-[#6B0C22] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              YouTube
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
