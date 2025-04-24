import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';

interface LocationState {
    protocol?: string;
}

export default function SuccessPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;

    // Verificar se temos o protocolo
    useEffect(() => {
        if (!state?.protocol) {
            navigate('/start');
        }
    }, [state, navigate]);

    if (!state?.protocol) {
        return null;
    }

    const handleGoToTracker = () => {
        navigate('/track', { state: { protocol: state.protocol } });
    };

    const handleGoToStart = () => {
        navigate('/start');
    };

    return (
        <div
            className="d-flex flex-column justify-content-center min-vh-100"
            style={{ backgroundColor: "#f8f9fa", padding: "1rem 0" }}
        >
            <Container className="py-4 py-md-5" style={{ maxWidth: "800px" }}>
                <Card className="shadow-sm rounded text-center p-3 p-md-5">
                    <Card.Body>
                        <div className="d-flex justify-content-center mb-4">
                            <FaCheckCircle
                                className="text-success"
                                size={window.innerWidth < 768 ? 64 : 96}
                            />
                        </div>

                        <h1 className="fw-bold mb-2 text-success h2">
                            Denúncia Registrada com Sucesso
                        </h1>

                        <p className="lead mb-4 text-secondary">
                            Sua denúncia foi recebida e será analisada.
                        </p>

                        <div
                            className="p-4 mb-4 rounded"
                            style={{ backgroundColor: "#f8f9fa" }}
                        >
                            <p className="fw-bold mb-1 text-secondary">
                                Número de Protocolo:
                            </p>
                            <h2 className="h3 text-primary">
                                {state.protocol}
                            </h2>
                            <p className="text-muted small mt-3">
                                Guarde este número para acompanhar o status da sua denúncia
                            </p>
                        </div>

                        <Row className="justify-content-center mt-4 g-3">
                            <Col xs={12} sm="auto">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={handleGoToTracker}
                                    className="w-100"
                                >
                                    Acompanhar Denúncia
                                </Button>
                            </Col>
                            <Col xs={12} sm="auto">
                                <Button
                                    variant="outline-secondary"
                                    size="lg"
                                    onClick={handleGoToStart}
                                    className="w-100"
                                >
                                    Voltar ao Início
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}