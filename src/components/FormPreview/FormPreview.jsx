import { Container, Row, Col, Card, Form, Alert } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../context/FormContext';
import CustomButton from '../ui/CustomButton';

const FormPreview = () => {
  const { currentForm } = useForm();
  const navigate = useNavigate();

  const renderQuestion = (question, index) => {
    switch (question.type) {
      case 'short':
        return (
          <Form.Control
            type="text"
            placeholder="Enter your answer..."
            disabled
          />
        );
      case 'yesno':
        return (
          <div>
            <Form.Check
              type="radio"
              name={`question_${question.id}`}
              label="Yes"
              disabled
            />
            <Form.Check
              type="radio"
              name={`question_${question.id}`}
              label="No"
              disabled
            />
          </div>
        );
      case 'multiple':
        return (
          <div>
            {question.options.map((option, optIndex) => (
              <Form.Check
                key={optIndex}
                type="checkbox"
                label={option}
                disabled
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <div className="mb-3">
            <CustomButton
              variant="outline-secondary"
              onClick={() => navigate('/form-builder')}
              className="d-flex align-items-center gap-2"
            >
              <FaArrowLeft /> Back to Builder
            </CustomButton>
          </div>

          <Card className="shadow-sm">
            <Card.Header className="bg-primaryclr text-white">
              <h4 className="mb-0">Form Preview</h4>
            </Card.Header>
            <Card.Body>
              <Alert variant="info" className="mb-4">
                <strong>Preview Mode:</strong> This is how your form will appear to users. Form fields are disabled in preview mode.
              </Alert>

              <h2 className="text-center mb-4">{currentForm.title || 'Untitled Form'}</h2>

              <Form>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">
                    Email Address <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email address..."
                    disabled
                  />
                </Form.Group>

                {currentForm.questions.map((question, index) => (
                  <Card key={question.id} className="mb-3">
                    <Card.Body>
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          {index + 1}. {question.question}
                          {question.required && <span className="text-danger"> *</span>}
                        </Form.Label>
                        {renderQuestion(question, index)}
                      </Form.Group>
                    </Card.Body>
                  </Card>
                ))}

                <div className="text-center mt-4">
                  <CustomButton variant="success" size="lg" disabled>
                    Submit Response
                  </CustomButton>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FormPreview;