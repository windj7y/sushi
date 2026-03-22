const FullPageLoading = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="loading-overlay">
      <img
        src="https://storage.googleapis.com/vue-course-api.appspot.com/wind-api/1774188482570.png"
        alt="loading animation"
        className="loading-img"
      />
      <div className="loading-text">載入中…</div>
    </div>
  );
};

export default FullPageLoading;