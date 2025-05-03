import React, { useState } from 'react';
import VideoModal from './VideoModal'; // adjust the path if necessary

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const youtubeEmbedUrl = "https://www.youtube.com/watch?v=DNorANPnsaU"; // example embed URL

  return (
    <div className="p-6">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Open Video Modal
      </button>

      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoUrl={youtubeEmbedUrl}
      />
    </div>
  );
}

export default VideoModal;