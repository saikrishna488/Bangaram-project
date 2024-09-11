import React, { useState } from 'react';
import Modal from 'react-modal';

const QuizModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSubmit = () => {
    // Handle quiz submission and reward coins
    closeModal();
  };

  return (
    <>
      <button onClick={openModal} className="bg-gold text-black py-2 px-4 rounded-full">Play Quiz</button>

      <Modal isOpen={isOpen} onRequestClose={closeModal} contentLabel="Quiz Modal">
        <div className="bg-black text-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl mb-4">Answer the Quiz</h2>
          {/* Add quiz questions */}
          <button onClick={handleSubmit} className="bg-gold py-2 px-4 mt-4 rounded-full">Submit Quiz</button>
        </div>
      </Modal>
    </>
  );
};

export default QuizModal;
