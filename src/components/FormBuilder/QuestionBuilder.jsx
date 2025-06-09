import { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useForm } from '../../context/FormContext';
import CustomModal from '../ui/CustomModal';
import CustomButton from '../ui/CustomButton';
import NotificationModal from '../ui/NotificationModal';

const QuestionBuilder = ({ show, onHide, editingQuestion }) => {
  const { dispatch } = useForm();
  const [questionData, setQuestionData] = useState({
    type: 'short',
    question: '',
    options: [''],
    required: false
  });
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationData, setNotificationData] = useState({ title: '', message: '', variant: 'info' });

  const showNotification = (title, message, variant = 'info') => {
    setNotificationData({ title, message, variant });
    setShowNotificationModal(true);
  };

  useEffect(() => {
    if (editingQuestion) {
      setQuestionData({
        type: editingQuestion.type,
        question: editingQuestion.question,
        options: editingQuestion.options || [''],
        required: editingQuestion.required
      });
    } else {
      setQuestionData({
        type: 'short',
        question: '',
        options: [''],
        required: false
      });
    }
  }, [editingQuestion, show]);

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setQuestionData(prev => ({
      ...prev,
      type: newType,
      options: newType === 'multiple' ? [''] : []
    }));
  };

  const handleQuestionChange = (e) => {
    setQuestionData(prev => ({
      ...prev,
      question: e.target.value
    }));
  };

  const handleRequiredChange = (e) => {
    setQuestionData(prev => ({
      ...prev,
      required: e.target.checked
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...questionData.options];
    newOptions[index] = value;
    setQuestionData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const addOption = () => {
    setQuestionData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index) => {
    if (questionData.options.length > 1) {
      const newOptions = questionData.options.filter((_, i) => i !== index);
      setQuestionData(prev => ({
        ...prev,
        options: newOptions
      }));
    }
  };

  const handleSave = () => {
    if (!questionData.question.trim()) {
      showNotification('Validation Error', 'Please enter a question', 'warning');
      return;
    }

    if (questionData.type === 'multiple' && questionData.options.some(opt => !opt.trim())) {
      showNotification('Validation Error', 'Please fill all option fields', 'warning');
      return;
    }

    const questionPayload = {
      type: questionData.type,
      question: questionData.question.trim(),
      required: questionData.required,
      ...(questionData.type === 'multiple' && {
        options: questionData.options.filter(opt => opt.trim())
      })
    };

    if (editingQuestion) {
      dispatch({
        type: 'UPDATE_QUESTION',
        payload: {
          id: editingQuestion.id,
          data: questionPayload
        }
      });
      toast.success('Question updated successfully!');
    } else {
      dispatch({ type: 'ADD_QUESTION', payload: questionPayload });
      toast.success('Question added successfully!');
    }

    onHide();
  };

  return (
    <>
      <CustomModal
        show={show}
        onHide={onHide}
        title={editingQuestion ? 'Edit Question' : 'Add New Question'}
        size="lg"
        onConfirm={handleSave}
        confirmText={editingQuestion ? 'Update' : 'Add'}
      >
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Question Type</Form.Label>
            <Form.Select value={questionData.type} onChange={handleTypeChange}>
              <option value="short">Short Answer</option>
              <option value="yesno">Yes/No</option>
              <option value="multiple">Multiple Choice (Checkbox)</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Question</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter your question..."
              value={questionData.question}
              onChange={handleQuestionChange}
            />
          </Form.Group>

          {questionData.type === 'multiple' && (
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Options</Form.Label>
              {questionData.options.map((option, index) => (
                <Row key={index} className="mb-2">
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                    />
                  </Col>
                  <Col xs="auto">
                    <CustomButton
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeOption(index)}
                      disabled={questionData.options.length === 1}
                    >
                      <FaTrash />
                    </CustomButton>
                  </Col>
                </Row>
              ))}
              <CustomButton
                variant="outline-success"
                size="sm"
                onClick={addOption}
                className="d-flex align-items-center gap-2"
              >
                <FaPlus /> Add Option
              </CustomButton>
            </Form.Group>
          )}

          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Required Question"
              checked={questionData.required}
              onChange={handleRequiredChange}
            />
          </Form.Group>
        </Form>
      </CustomModal>

      <NotificationModal
        show={showNotificationModal}
        onHide={() => setShowNotificationModal(false)}
        title={notificationData.title}
        message={notificationData.message}
        variant={notificationData.variant}
      />
    </>
  );
};

export default QuestionBuilder;