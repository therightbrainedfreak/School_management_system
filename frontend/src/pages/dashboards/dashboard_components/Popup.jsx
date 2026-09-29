import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { IoIosCloseCircleOutline } from "react-icons/io";

function Popup({ isOpen, onClose, title, children }) {
  const dialogRef = useRef(null);

  // Synchronize the native HTML dialog state with the React isOpen prop
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal(); // Opens the dialog and locks focus inside it
    } else {
      dialog.close();
    }
  }, [isOpen]);

  // Handle clicking outside the popup content box to close it
  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  // Prevent rendering if not open (optimizes memory)
  if (!isOpen) return null;

  return createPortal(
    <dialog 
      ref={dialogRef} 
      onClose={onClose} 
      onClick={handleBackdropClick}
      className="custom-popup rounded-2xl p-6 fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 min-w-60"
    >
      <div className="popup-header">
        <h3 className='text-xl'>{title}</h3>
        {/* <button className="popup-close-btn" onClick={onClose} aria-label="Close popup">
          <IoIosCloseCircleOutline size={"24px"}/>
        </button> */}
      </div>
      
      <div className="popup-content">
        {children}
      </div>
    </dialog>,
    document.body // Renders directly at the bottom of <body>
  );
}

export default Popup