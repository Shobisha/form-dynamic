import { Card, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaAsterisk } from 'react-icons/fa';
import CustomButton from '../ui/CustomButton';

const QuestionList = ({ questions, onEdit, onDelete }) => {
  const getQuestionTypeLabel = (type) => {
    switch (type) {
      case 'short':
        return 'Short Answer';
      case 'yesno':
        return 'Yes/No';
      case 'multiple':
        return 'Multiple Choice';
      default:
        return type;
    }
  };

  const getQuestionTypeBadgeVariant = (type) => {
    switch (type) {
      case 'short':
        return 'primary';
      case 'yesno':
        return 'success';
      case 'multiple':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  if (questions.length === 0) {
    return (
      <Card className="text-center py-5">
        <Card.Body>
          <p className="text-muted mb-0">No questions added yet. Click "Add Question" to get started.</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="questions-list">
      {questions.map((question, index) => (
        <Card key={question.id} className="mb-3 border-start border-primary border-3">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Badge bg={getQuestionTypeBadgeVariant(question.type)}>
                    {getQuestionTypeLabel(question.type)}
                  </Badge>
                  {question.required && (
                    <Badge bg="danger">
                      <FaAsterisk className="me-1" size={8} />
                      Required
                    </Badge>
                  )}
                </div>
                <h6 className="mb-2">
                  {index + 1}. {question.question}
                </h6>
                {question.type === 'multiple' && question.options && (
                  <ul className="mb-0 text-muted">
                    {question.options.map((option, optIndex) => (
                      <li key={optIndex}>{option}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="d-flex gap-2">
                <CustomButton
                  variant="outline-primary"
                  size="sm"
                  onClick={() => onEdit(question)}
                  title="Edit Question"
                >
                  <FaEdit />
                </CustomButton>
                <CustomButton
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onDelete(question.id)}
                  title="Delete Question"
                >
                  <FaTrash />
                </CustomButton>
              </div>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default QuestionList;