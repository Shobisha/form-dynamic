import { Button } from 'react-bootstrap';

const CustomButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={`custom-btn ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;