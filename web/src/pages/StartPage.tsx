import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from 'react-bootstrap';
import LogoAlagoas from "../components/common/LogoAlagoas";

export default function StartPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/home");
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center min-vh-100"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <Container className="py-5 text-center">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className="mb-4">
              <LogoAlagoas />
            </div>

            <h1 className="display-5 fw-bold mb-4">
              Denúncia Anônima
            </h1>

            <p className="lead mb-5">
              Faça sua denúncia de forma segura e anônima.
              Sua identidade será preservada durante todo o processo.
            </p>

            <Button
              variant="primary"
              size="lg"
              onClick={handleStart}
              className="py-3 w-100 fs-5"
            >
              Iniciar Denúncia
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}