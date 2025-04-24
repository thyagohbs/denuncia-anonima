import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa';

export default function TrackerPage() {
    const navigate = useNavigate();
    const [protocolId, setProtocolId] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!protocolId.trim()) {
            setError('Por favor, informe o número de protocolo');
            return;
        }

        // Redirecionar para a página de detalhes passando o protocolo
        navigate('/track/report', { state: { protocol: protocolId } });
    };

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={10} lg={6}>
                    <div className="text-center mb-4">
                        <h1 className="fw-bold mb-3">Acompanhar Denúncia</h1>
                        <p className="text-muted">
                            Consulte o status da sua denúncia anônima utilizando o número de protocolo.
                        </p>
                    </div>

                    <Card className="shadow-sm">
                        <Card.Body className="p-4">
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="protocolInput">Número de Protocolo</Form.Label>
                                    <Form.Control
                                        id="protocolInput"
                                        type="text"
                                        value={protocolId}
                                        onChange={(e) => setProtocolId(e.target.value)}
                                        placeholder="Digite o número do protocolo"
                                        isInvalid={!!error}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {error}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <div className="d-grid gap-2 mt-4">
                                    <Button type="submit" variant="primary">
                                        Consultar <FaArrowRight className="ms-1" />
                                    </Button>
                                </div>
                            </Form>

                            <Alert variant="light" className="mt-4 mb-0 border">
                                <p className="mb-0 small">
                                    <strong>Importante:</strong> O número de protocolo foi fornecido no momento
                                    em que você concluiu sua denúncia. Guarde-o com segurança para acompanhar
                                    o status do seu caso.
                                </p>
                            </Alert>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}