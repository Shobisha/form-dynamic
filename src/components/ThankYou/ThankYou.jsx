import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';
import CustomButton from '../ui/CustomButton';

const ThankYou = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm text-center">
            <Card.Body className="py-5">
              <FaCheckCircle size={80} className="text-success mb-4" />
              <h2 className="text-success mb-3">Thank You!</h2>
              <p className="text-muted mb-4">
                Your response has been submitted successfully. We appreciate your time and feedback.
              </p>
              <CustomButton
                variant="primary"
                onClick={() => window.close()}
              >
                Close Window
              </CustomButton>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ThankYou;