import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Card,
  ListGroup,
  Alert,
  Spinner,
  Row,
  Col
} from "react-bootstrap";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import useReportStore from "../../store/useReportStore";
import { submitDenuncia } from "../../services/api";

const typeLabels: Record<string, string> = {
  'FURTO': 'Furto',
  'ROUBO': 'Roubo',
  'AGRESSAO': 'Agressão',
  'DANO_AO_PATRIMONIO': 'Dano ao Patrimônio',
  'OUTROS': 'Outros'
};

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const { reportType, location } = useReportStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!reportType || !location) {
    navigate('/');
    return null;
  }

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await submitDenuncia({
        tipo: reportType,
        localizacao: {
          endereco: location?.endereco || "",
          latitude: location?.latitude,
          longitude: location?.longitude
        }
      });

      navigate('/sucesso', {
        state: { protocolo: response.protocolo }
      });
    } catch (err) {
      console.error('Erro ao enviar denúncia:', err);
      setError('Ocorreu um erro ao enviar a denúncia. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="bg-primary text-white p-3 d-flex align-items-center">
        <Button
          variant="link"
          className="text-white p-1"
          onClick={handleBackClick}
          aria-label="Voltar"
        >
          <FaArrowLeft />
        </Button>
        <h1 className="h5 mb-0 ms-2">
          Confirmação da Denúncia
        </h1>
      </header>

      <Container className="py-4 flex-grow-1">
        <h2 className="h5 mb-4">
          Revise os dados da sua denúncia
        </h2>

        <Card className="mb-4">
          <ListGroup variant="flush">
            <ListGroup.Item className="p-4">
              <p className="fw-bold mb-1">Tipo de Denúncia</p>
              <p className="mb-0">{typeLabels[reportType] || reportType}</p>
            </ListGroup.Item>

            <ListGroup.Item className="p-4">
              <p className="fw-bold mb-1">Local da Ocorrência</p>
              <p className="mb-0">
                {location?.endereco
                  ? location.endereco
                  : `Latitude: ${location?.latitude?.toFixed(6)}, Longitude: ${location?.longitude?.toFixed(6)}`}
              </p>
            </ListGroup.Item>
          </ListGroup>
        </Card>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Row className="mt-4">
          <Col className="d-flex justify-content-between">
            <Button
              variant="outline-secondary"
              onClick={handleBackClick}
            >
              <FaArrowLeft className="me-2" />
              Voltar
            </Button>

            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane className="me-2" />
                  <span>Enviar Denúncia</span>
                </>
              )}
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}