import CustomModal from './CustomModal';

const NotificationModal = ({ 
  show, 
  onHide, 
  title, 
  message, 
  variant = 'info'
}) => {
  return (
    <CustomModal
      show={show}
      onHide={onHide}
      title={title}
      confirmText="OK"
      confirmVariant={variant}
      onConfirm={onHide}
      showFooter={true}
    >
      <p>{message}</p>
    </CustomModal>
  );
};

export default NotificationModal;