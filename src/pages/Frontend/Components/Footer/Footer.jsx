import React from "react";
import { Container, Col, Row } from "reactstrap";
import "./footer.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="py-3 bg-warning text-dark">
      <Container>
        <Row>
          <Col className="text-center">
            <p className="mb-0">&copy; {year} All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
