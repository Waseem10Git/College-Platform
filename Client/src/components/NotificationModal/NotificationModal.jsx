import React from 'react';
import Modal from 'react-modal';
import './NotificationModal.css'

Modal.setAppElement('#root'); // Ensure accessibility

const NotificationModal = ({ isOpen, message, onClose }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Notification"
            className="notification-modal"
            overlayClassName="notification-modal-overlay"
        >
            <div className="notification-modal-content">
                <h2>Notification</h2>
                <p>{message}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </Modal>
    );
};

export default NotificationModal;
