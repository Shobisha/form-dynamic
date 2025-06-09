import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useForm } from '../../context/FormContext';
import CustomButton from '../ui/CustomButton';
import NotificationModal from '../ui/NotificationModal';

const UserForm = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const { forms, dispatch } = useForm();
  const [formData, setFormData] = useState(null);
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationData, setNotificationData] = useState({ title: '', message: '', variant: 'info' });

  const showNotification = (title, message, variant = 'info') => {
    setNotificationData({ title, message, variant });
    setShowNotificationModal(true);
  };

  useEffect(() => {
    const form = forms.find(f => f.id === formId);
    if (form) {
      setFormData(form);
      // Initialize answers object
      const initialAnswers = {};
      form.questions.forEach(question => {
        if (question.type === 'multiple') {
          initialAnswers[question.id] = [];
        } else {
          initialAnswers[question.id] = '';
        }
      });
      setAnswers(initialAnswers);
    }
  }, [formId, forms]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleEmailConfirmChange = (e) => {
    setEmailConfirm(e.target.value);
  };

  const handleAnswerChange = (questionId, value, questionType) => {
    setAnswers(prev => {
      if (questionType === 'multiple') {
        const currentAnswers = prev[questionId] || [];
        const newAnswers = currentAnswers.includes(value)
          ? currentAnswers.filter(answer => answer !== value)
          : [...currentAnswers, value];
        return { ...prev, [questionId]: newAnswers };
      } else {
        return { ...prev, [questionId]: value };
      }
    });
  };

  const validateForm = () => {
    if (!email.trim()) {
      showNotification('Validation Error', 'Email is required', 'warning');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification('Validation Error', 'Please enter a valid email address', 'warning');
      return false;
    }

    if (!emailConfirm.trim()) {
      showNotification('Validation Error', 'Please confirm your email address', 'warning');
      return false;
    }

    if (email !== emailConfirm) {
      showNotification('Validation Error', 'Email addresses do not match', 'warning');
      return false;
    }

    for (const question of formData.questions) {
      if (question.required) {
        const answer = answers[question.id];
        if (question.type === 'multiple') {
          if (!answer || answer.length === 0) {
            showNotification('Validation Error', `Please answer the required question: ${question.question}`, 'warning');
            return false;
          }
        } else {
          if (!answer || !answer.trim()) {
            showNotification('Validation Error', `Please answer the required question: ${question.question}`, 'warning');
            return false;
          }
        }
      }
    }

    return true;
  };

  const handleReview = () => {
    if (!validateForm()) return;
    setShowReview(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      dispatch({
        type: 'SUBMIT_RESPONSE',
        payload: {
          formId,
          email,
          answers
        }
      });

      toast.success('Response submitted successfully!');
      navigate('/thank-you');
    } catch (error) {
      showNotification('Error', 'Failed to submit response. Please try again.', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question, index) => {
    switch (question.type) {
      case 'short':
        return (
          <Form.Control
            type="text"
            placeholder="Enter your answer..."
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value, question.type)}
          />
        );
      case 'yesno':
        return (
          <div>
            <Form.Check
              type="radio"
              name={`question_${question.id}`}
              label="Yes"
              checked={answers[question.id] === 'Yes'}
              onChange={() => handleAnswerChange(question.id, 'Yes', question.type)}
            />
            <Form.Check
              type="radio"
              name={`question_${question.id}`}
              label="No"
              checked={answers[question.id] === 'No'}
              onChange={() => handleAnswerChange(question.id, 'No', question.type)}
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
                checked={(answers[question.id] || []).includes(option)}
                onChange={() => handleAnswerChange(question.id, option, question.type)}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  if (!formData) {
    return (
      <Container className="py-4">
        <Row>
          <Col>
            <NotificationModal
              show={true}
              onHide={() => navigate('/')}
              title="Form Not Found"
              message="The form you're looking for doesn't exist or has been removed."
              variant="danger"
            />
          </Col>
        </Row>
      </Container>
    );
  }

  if (showReview) {
    return (
      <Container className="py-4">
        <Row>
          <Col>
            <Card className="shadow-sm">
              <Card.Header className="bg-warning text-dark">
                <h4 className="mb-0">Review Your Responses</h4>
              </Card.Header>
              <Card.Body>
                <div className="alert alert-warning">
                  Please review your responses carefully before submitting. You cannot edit them after submission.
                </div>

                <h5 className="mb-3">{formData.title}</h5>

                <div className="mb-4">
                  <strong>Email:</strong> {email}
                </div>

                {formData.questions.map((question, index) => (
                  <Card key={question.id} className="mb-3">
                    <Card.Body>
                      <h6>{index + 1}. {question.question}</h6>
                      <div className="text-muted">
                        <strong>Your Answer:</strong>{' '}
                        {question.type === 'multiple' 
                          ? (answers[question.id] || []).join(', ') || 'No answer'
                          : answers[question.id] || 'No answer'
                        }
                      </div>
                    </Card.Body>
                  </Card>
                ))}

                <div className="d-flex gap-2 justify-content-center">
                  <CustomButton
                    variant="outline-secondary"
                    onClick={() => setShowReview(false)}
                  >
                    Back to Edit
                  </CustomButton>
                  <CustomButton
                    variant="success"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
                  </CustomButton>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <NotificationModal
          show={showNotificationModal}
          onHide={() => setShowNotificationModal(false)}
          title={notificationData.title}
          message={notificationData.message}
          variant={notificationData.variant}
        />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-primaryclr text-white">
              <h4 className="mb-0">{formData.title}</h4>
              <small className="text-light">Form ID: userform/{formId}</small>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Email Address <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">
                    Confirm Email Address <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Confirm your email address..."
                    value={emailConfirm}
                    onChange={handleEmailConfirmChange}
                    required
                  />
                  {email && emailConfirm && email !== emailConfirm && (
                    <Form.Text className="text-danger">
                      Email addresses do not match
                    </Form.Text>
                  )}
                </Form.Group>

                {formData.questions.map((question, index) => (
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
                  <CustomButton
                    variant="primary"
                    size="lg"
                    onClick={handleReview}
                  >
                    Review Responses
                  </CustomButton>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <NotificationModal
        show={showNotificationModal}
        onHide={() => setShowNotificationModal(false)}
        title={notificationData.title}
        message={notificationData.message}
        variant={notificationData.variant}
      />
    </Container>
  );
};

export default UserForm;