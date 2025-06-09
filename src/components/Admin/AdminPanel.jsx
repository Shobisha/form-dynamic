import { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Tabs, Tab } from 'react-bootstrap';
import { FaUsers, FaClipboardList, FaEye, FaTrash, FaLink } from 'react-icons/fa';
import { useForm } from '../../context/FormContext';
import { toast } from 'react-toastify';
import CustomButton from '../ui/CustomButton';
import ConfirmModal from '../ui/ConfirmModal';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { forms, responses, dispatch } = useForm();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);
  const navigate = useNavigate();


  const getFormResponses = (formId) => {
    return responses.filter(response => response.formId === formId);
  };

  const handleDeleteForm = (formId) => {
    setFormToDelete(formId);
    setShowDeleteModal(true);
  };

  const confirmDeleteForm = () => {
    if (formToDelete) {
      dispatch({ type: 'DELETE_FORM', payload: formToDelete });
      toast.success('Form deleted successfully!');
      setShowDeleteModal(false);
      setFormToDelete(null);
    }
  };

  const copyFormLink = (formId) => {
    const link = `${window.location.origin}/userform/${formId}`;
    navigator.clipboard.writeText(link);
    toast.success('Form link copied to clipboard!');
  };

  const FormsList = () => (
    <Card className="shadow-sm">
      <Card.Header className="bg-primaryclr text-white">
        <h5 className="mb-0">
          <FaClipboardList className="me-2" />
          Forms ({forms.length})
        </h5>
      </Card.Header>
      <Card.Body className="p-0">
        {forms.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted mb-0">No forms created yet.</p>
          </div>
        ) : (
          <Table responsive striped hover className="mb-0">
            <thead>
              <tr>
                <th>Form Title</th>
                <th>Questions</th>
                <th>Responses</th>
                <th>Created</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {forms.map(form => {
                const formResponses = getFormResponses(form.id);
                return (
                  <tr key={form.id}>
                    <td className="fw-bold">{form.title}</td>
                    <td>{form.questions.length}</td>
                    <td>
                      <Badge bg="info">{formResponses.length}</Badge>
                    </td>
                    <td>{new Date(form.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Badge bg={form.isPublished ? 'success' : 'warning'}>
                        {form.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <CustomButton
                          variant="outline-primary"
                          size="sm"
                          onClick={() => copyFormLink(form.id)}
                          title="Copy Form Link"
                        >
                          <FaLink />
                        </CustomButton>
                        <CustomButton
                          variant="outline-info"
                          size="sm"
                          onClick={() => window.open(`/userform/${form.id}`, '_blank')}
                          title="View Form"
                        >
                          <FaEye />
                        </CustomButton>
                        <CustomButton
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteForm(form.id)}
                          title="Delete Form"
                        >
                          <FaTrash />
                        </CustomButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );

  const ResponsesList = () => (
    <Card className="shadow-sm">
      <Card.Header className="bg-success text-white">
        <h5 className="mb-0">
          <FaUsers className="me-2" />
          All Responses ({responses.length})
        </h5>
      </Card.Header>
      <Card.Body className="p-0">
        {responses.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted mb-0">No responses received yet.</p>
          </div>
        ) : (
          <Table responsive striped hover className="mb-0">
            <thead>
              <tr>
                <th>Form Title</th>
                <th>Email</th>
                <th>Submitted</th>
                <th>Answers</th>
              </tr>
            </thead>
            <tbody>
              {responses.map(response => {
                const form = forms.find(f => f.id === response.formId);
                return (
                  <tr key={response.id}>
                    <td className="fw-bold">{form ? form.title : 'Unknown Form'}</td>
                    <td>{response.email}</td>
                    <td>{new Date(response.submittedAt).toLocaleString()}</td>
                    <td>
                      <details>
                        <summary className="text-primary" style={{ cursor: 'pointer' }}>
                          View Answers ({Object.keys(response.answers).length})
                        </summary>
                        <div className="mt-2">
                          {Object.entries(response.answers).map(([questionId, answer]) => {
                            const question = form?.questions.find(q => q.id === questionId);
                            return (
                              <div key={questionId} className="mb-2 p-2 bg-light rounded">
                                <strong>{question ? question.question : 'Unknown Question'}:</strong>
                                <br />
                                <span className="text-muted">
                                  {Array.isArray(answer) ? answer.join(', ') : String(answer)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </details>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Admin Panel</h2>
<CustomButton
  onClick={() => navigate('/form-builder')}
  style={{ backgroundColor: 'var(--violet)', borderColor: 'var(--violet)', color: '#fff' }}
>
  Create New Form
</CustomButton>

          </div>

          <Row className="mb-4">
            <Col md={4}>
              <Card className="text-center">
                <Card.Body>
                  <FaClipboardList size={40} className="text-primary mb-2" />
                  <h3 className="text-primary">{forms.length}</h3>
                  <p className="text-muted">Total Forms</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center border-success">
                <Card.Body>
                  <FaUsers size={40} className="text-success mb-2" />
                  <h3 className="text-success">{responses.length}</h3>
                  <p className="text-muted">Total Responses</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center border-info">
                <Card.Body>
                  <FaEye size={40} className="text-info mb-2" />
                  <h3 className="text-info">
                    {responses.length > 0 ? (responses.length / forms.length).toFixed(1) : 0}
                  </h3>
                  <p className="text-muted">Avg. Responses per Form</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Tabs defaultActiveKey="forms" className="mb-3">
            <Tab eventKey="forms" title="Forms">
              <FormsList />
            </Tab>
            <Tab eventKey="responses" title="Responses">
              <ResponsesList />
            </Tab>
          </Tabs>
        </Col>
      </Row>

      <ConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        title="Delete Form"
        message="Are you sure you want to delete this form? This action cannot be undone and will also delete all associated responses."
        onConfirm={confirmDeleteForm}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </Container>
  );
};

export default AdminPanel;