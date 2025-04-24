import { Container, Card, Button } from "react-bootstrap";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";

export default function NotFoundPage() {
  return (
    <Container className="my-5 d-flex flex-column align-items-center">
      <Card
        className="text-center shadow-sm p-4"
        style={{ maxWidth: "500px" }}
      >
        <Card.Body>
          <FaExclamationTriangle
            className="text-warning mb-3"
            size={50}
          />

          <h1 className="h3 mb-3">Página não encontrada</h1>

          <p className="lead mb-4">
            Desculpe, a página que você está procurando não existe.
          </p>

          <Button
            // as={Link}
            //to="/"
            variant="primary"
          >
            <FaHome className="me-2" />
            Voltar para Início
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}