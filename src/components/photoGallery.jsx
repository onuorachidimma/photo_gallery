import React, { useState, useEffect } from "react";

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("nature");
  const [page, setPage] = useState(1);

  const fetchPhotos = async (query, page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?page=${page}&query=${query}&client_id=${process.env.REACT_APP_UNSPLASH_API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setPhotos((prevPhotos) =>
        page === 1 ? data.results : [...prevPhotos, ...data.results]
      );
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos(searchQuery, page);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") return;
    setPage(1);
    fetchPhotos(searchQuery, 1);
  };

  const loadMorePhotos = () => {
    const newPage = page + 1;
    setPage(newPage);
    fetchPhotos(searchQuery, newPage);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4 text-center uppercase">
        Photo Gallery
      </h1>

      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex w-[90%] md:w-[50%] justify-center mx-auto ">
          <input
            type="text"
            placeholder="Search for photos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border  w-[60%] md:[80%] p-3 outline-0"
          />
          <button
            type="submit"
            className="bg-gray-600 text-white w-[40%] md:w-[20%] block p-3"
          >
            Search
          </button>
        </div>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}

      <div className="masonry-layout">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group overflow-hidden mb-2">
            <img
              src={photo.urls.small}
              alt={photo.alt_description}
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-end p-2 transition-opacity">
              <img
                src={photo.user.profile_image.small}
                alt={photo.user.name}
                className="w-8 h-8 rounded-full mr-2"
              />
              <p className="text-white text-sm">{photo.user.name}</p>
            </div>
          </div>
        ))}
      </div>

      {!loading && photos.length > 0 && (
        <div  className="text-center flex justify-center mt-4">
          <button
            onClick={loadMorePhotos}
            className="bg-gray-600 text-white block p-3"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
