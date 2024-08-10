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
    <div>
      <h1>Photo Gallery</h1>

      <form onSubmit={handleSearch}>
        <div>
          <input
            type="text"
            placeholder="Search for photos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </div>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}

      <div>
        {photos.map((photo) => (
          <div key={photo.id}>
            <img
              src={photo.urls.small}
              alt={photo.alt_description}
            />
            <div>
              <img
                src={photo.user.profile_image.small}
                alt={photo.user.name}
              />
              <p>{photo.user.name}</p>
            </div>
          </div>
        ))}
      </div>

      {!loading && photos.length > 0 && (
        <div>
          <button onClick={loadMorePhotos}>Load More</button>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
