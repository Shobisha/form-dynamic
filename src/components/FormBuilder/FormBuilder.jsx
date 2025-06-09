import { useState } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import { FaPlus, FaSave, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from '../../context/FormContext';
import CustomButton from '../ui/CustomButton';
import NotificationModal from '../ui/NotificationModal';
import QuestionBuilder from './QuestionBuilder';
import QuestionList from './QuestionList';

const FormBuilder = () => {
  const { currentForm, dispatch } = useForm();
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationData, setNotificationData] = useState({ title: '', message: '', variant: 'info' });
  const navigate = useNavigate();

  const showNotification = (title, message, variant = 'info') => {
    setNotificationData({ title, message, variant });
    setShowNotificationModal(true);
  };

  const handleTitleChange = (e) => {
    dispatch({ type: 'SET_FORM_TITLE', payload: e.target.value });
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setShowQuestionModal(true);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setShowQuestionModal(true);
  };

  const handleDeleteQuestion = (questionId) => {
    dispatch({ type: 'DELETE_QUESTION', payload: questionId });
    toast.success('Question deleted successfully!');
  };

  const handleSaveForm = () => {
    if (!currentForm.title.trim()) {
      showNotification('Validation Error', 'Please enter a form title', 'warning');
      return;
    }
    if (currentForm.questions.length === 0) {
      showNotification('Validation Error', 'Please add at least one question', 'warning');
      return;
    }

    dispatch({ type: 'SAVE_FORM' });
    toast.success('Form saved successfully!');
    navigate('/admin/forms');
  };

  const handlePreview = () => {
    if (!currentForm.title.trim()) {
      showNotification('Validation Error', 'Please enter a form title', 'warning');
      return;
    }
    navigate('/form-preview');
  };

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-primaryclr text-white">
              <h4 className="mb-0">Form Builder</h4>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Form Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter form title..."
                  value={currentForm.title}
                  onChange={handleTitleChange}
                  className="form-control-lg"
                />
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Questions ({currentForm.questions.length})</h5>
                <CustomButton 
                  variant="success" 
                  onClick={handleAddQuestion}
                  className="d-flex align-items-center gap-2"
                >
                  <FaPlus /> Add Question
                </CustomButton>
              </div>

              <QuestionList
                questions={currentForm.questions}
                onEdit={handleEditQuestion}
                onDelete={handleDeleteQuestion}
              />

              <div className="d-flex gap-2 mt-4">
                <CustomButton 
                  variant="outline-primary" 
                  onClick={handlePreview}
                  className="d-flex align-items-center gap-2"
                >
                  <FaEye /> Preview
                </CustomButton>
                <CustomButton 
                  variant="primary" 
                  onClick={handleSaveForm}
                  className="d-flex align-items-center gap-2"
                >
                  <FaSave /> Save Form
                </CustomButton>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <QuestionBuilder
        show={showQuestionModal}
        onHide={() => setShowQuestionModal(false)}
        editingQuestion={editingQuestion}
      />

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

export default FormBuilder;