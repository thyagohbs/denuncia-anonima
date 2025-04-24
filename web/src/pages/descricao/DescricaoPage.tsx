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
    Col,
    Form
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

export default function DescricaoPage() {
    const navigate = useNavigate();
    const { reportType, location } = useReportStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validated, setValidated] = useState(false);

    // Estados para os campos de descrição
    const [descricaoOcorrido, setDescricaoOcorrido] = useState("");
    const [descricaoSuspeito, setDescricaoSuspeito] = useState("");

    if (!reportType || !location) {
        navigate('/');
        return null;
    }

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validar campos obrigatórios
        const form = e.currentTarget as HTMLFormElement;
        if (!form.checkValidity() || !descricaoOcorrido || !descricaoSuspeito) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await submitDenuncia({
                tipo: reportType,
                localizacao: {
                    endereco: location?.endereco || "",
                    latitude: location?.latitude,
                    longitude: location?.longitude
                },
                descricaoOcorrido: descricaoOcorrido,
                descricaoSuspeito: descricaoSuspeito
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
                    Descrição da Denúncia
                </h1>
            </header>

            <Container className="py-4 flex-grow-1">
                <h2 className="h5 mb-4">
                    Revise e complete sua denúncia
                </h2>

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
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

                            <ListGroup.Item className="p-4">
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold">Fale sobre o ocorrido: *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        placeholder="Descreva detalhadamente o que aconteceu..."
                                        value={descricaoOcorrido}
                                        onChange={(e) => setDescricaoOcorrido(e.target.value)}
                                        isInvalid={validated && !descricaoOcorrido}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        A descrição do ocorrido é obrigatória.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label className="fw-bold">Fale sobre o suspeito: *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        placeholder="Descreva características do suspeito, como aparência, roupas, altura, etc..."
                                        value={descricaoSuspeito}
                                        onChange={(e) => setDescricaoSuspeito(e.target.value)}
                                        isInvalid={validated && !descricaoSuspeito}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        A descrição do suspeito é obrigatória.
                                    </Form.Control.Feedback>
                                </Form.Group>
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
                                type="button"
                            >
                                <FaArrowLeft className="me-2" />
                                Voltar
                            </Button>

                            <Button
                                variant="primary"
                                type="submit"
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
                </Form>
            </Container>
        </div>
    );
}