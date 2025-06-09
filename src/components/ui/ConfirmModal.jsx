import CustomModal from './CustomModal';

const ConfirmModal = ({ 
  show, 
  onHide, 
  title, 
  message, 
  onConfirm,
  confirmText = 'Confirm',
  confirmVariant = 'danger'
}) => {
  return (
    <CustomModal
      show={show}
      onHide={onHide}
      title={title}
      confirmText={confirmText}
      confirmVariant={confirmVariant}
      onConfirm={onConfirm}
    >
      <p>{message}</p>
    </CustomModal>
  );
};

export default ConfirmModal;