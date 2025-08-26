"use client";

interface RaceResult {
  id: string;
  raceTitle: string;
  track: string;
  date: string;
  media?: Array<{
    id: string;
    type: "image" | "video";
    url: string;
    thumbnail: string;
    title: string;
    uploadedBy: string;
    uploadDate: string;
  }>;
}

interface MediaGalleryProps {
  races: RaceResult[];
}

export function MediaGallery({ races }: MediaGalleryProps) {
  const allMedia = races.flatMap(race => 
    race.media?.map(media => ({
      ...media,
      raceTitle: race.raceTitle,
      track: race.track,
      date: race.date
    })) || []
  );

  const images = allMedia.filter(media => media.type === "image");
  const videos = allMedia.filter(media => media.type === "video");

  return (
    <div className="space-y-6">
      {/* Media Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-stroke bg-white p-4 text-center shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="text-2xl font-bold text-dark dark:text-white">
            {allMedia.length}
          </div>
          <div className="text-sm text-dark-5 dark:text-dark-6">Total Media</div>
        </div>
        <div className="rounded-lg border border-stroke bg-white p-4 text-center shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="text-2xl font-bold text-blue">
            {images.length}
          </div>
          <div className="text-sm text-dark-5 dark:text-dark-6">Images</div>
        </div>
        <div className="rounded-lg border border-stroke bg-white p-4 text-center shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="text-2xl font-bold text-red">
            {videos.length}
          </div>
          <div className="text-sm text-dark-5 dark:text-dark-6">Videos</div>
        </div>
      </div>

      {/* Upload Button */}
      <div className="rounded-lg border border-stroke bg-white p-6 text-center shadow-card dark:border-stroke-dark dark:bg-gray-dark">
        <div className="text-4xl mb-4">📸</div>
        <h3 className="text-lg font-semibold text-dark dark:text-white mb-2">
          Share Your Racing Media
        </h3>
        <p className="text-dark-5 dark:text-dark-6 mb-4">
          Upload screenshots, videos, and race highlights to share with the community
        </p>
        <button className="rounded-lg bg-primary px-6 py-2 font-medium text-white transition hover:bg-primary/90">
          Upload Media
        </button>
      </div>

      {/* Media Gallery */}
      {allMedia.length > 0 ? (
        <div className="rounded-lg border border-stroke bg-white shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="border-b border-stroke p-6 dark:border-stroke-dark">
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              Media Gallery ({allMedia.length} items)
            </h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allMedia.map((media) => (
                <div
                  key={media.id}
                  className="group relative overflow-hidden rounded-lg border border-stroke bg-gray-1 transition-transform hover:scale-105 hover:shadow-lg dark:border-stroke-dark dark:bg-dark-2"
                >
                  {/* Media Preview */}
                  <div className="aspect-video relative">
                    {media.type === "image" ? (
                      <div className="flex h-full items-center justify-center bg-gray-2 dark:bg-dark-3">
                        <svg className="h-16 w-16 text-dark-4 dark:text-dark-7" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gray-2 dark:bg-dark-3">
                        <svg className="h-16 w-16 text-dark-4 dark:text-dark-7" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM15.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM8 15a1 1 0 100-2 1 1 0 000 2z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Media Type Badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`rounded px-2 py-1 text-xs font-medium text-white ${
                        media.type === "image" ? "bg-blue" : "bg-red"
                      }`}>
                        {media.type === "image" ? "📷 Photo" : "🎬 Video"}
                      </span>
                    </div>

                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                      <button className="rounded-lg bg-white/20 p-3 text-white backdrop-blur-sm transition hover:bg-white/30">
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Media Info */}
                  <div className="p-4">
                    <h4 className="font-semibold text-dark dark:text-white mb-1">
                      {media.title}
                    </h4>
                    <div className="text-sm text-dark-5 dark:text-dark-6 mb-2">
                      <div>{media.raceTitle}</div>
                      <div>{media.track}</div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-dark-4 dark:text-dark-7">
                      <span>By {media.uploadedBy}</span>
                      <span>{new Date(media.uploadDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-stroke bg-white p-8 text-center shadow-card dark:border-stroke-dark dark:bg-gray-dark">
          <div className="text-6xl mb-4">🖼️</div>
          <h3 className="text-lg font-medium text-dark dark:text-white mb-2">
            No Media Uploaded Yet
          </h3>
          <p className="text-dark-5 dark:text-dark-6">
            Be the first to share race photos and videos with the community!
          </p>
        </div>
      )}
    </div>
  );
}