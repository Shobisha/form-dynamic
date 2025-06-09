import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaHome, FaPlus } from 'react-icons/fa';

const NavigationBar = () => {
  return (
    <Navbar expand="lg"
    // fixed="top"
     className="custom-navbar shadow-sm " >
      <Container>
        <Navbar.Brand href="/">
          <strong>Dynamic Form</strong>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{color:"white"}} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <LinkContainer to="/admin/forms">
              <Nav.Link>
                <FaHome className="me-1" /> Dashboard
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/form-builder">
              <Nav.Link>
                <FaPlus className="me-1" /> Create Form
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
