import { Modal } from 'react-bootstrap';
import CustomButton from './CustomButton';

const CustomModal = ({ 
  show, 
  onHide, 
  title, 
  children, 
  size = 'md',
  confirmText = 'Save',
  cancelText = 'Cancel',
  onConfirm,
  showFooter = true,
  confirmVariant = 'primary'
}) => {
  return (
    <Modal show={show} onHide={onHide} size={size} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
      {showFooter && (
        <Modal.Footer>
          <CustomButton variant="secondary" onClick={onHide}>
            {cancelText}
          </CustomButton>
          {onConfirm && (
            <CustomButton variant={confirmVariant} onClick={onConfirm}>
              {confirmText}
            </CustomButton>
          )}
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default CustomModal;