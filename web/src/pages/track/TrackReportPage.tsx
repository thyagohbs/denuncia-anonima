import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Container,
    Row,
    Col,
    Button,
    Card,
    Form,
    Spinner,
    Alert,
    Badge
} from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import api from '../../services/api';
import axios from 'axios';

// Interface para o status de denúncia
interface Report {
    protocolo: string;
    tipo: string;
    status: string;
    detalhes: string;
    criadoEm: string;
    atualizadoEm: string;
}

// Mapeamento de status para exibição
const statusLabels: Record<string, string> = {
    'recebida': 'Recebida',
    'em_analise': 'Em Análise',
    'em_investigacao': 'Em Investigação',
    'concluida': 'Concluída',
    'arquivada': 'Arquivada'
};

// Mapeamento de cores para os status
const statusVariants: Record<string, string> = {
    'recebida': 'info',
    'em_analise': 'primary',
    'em_investigacao': 'warning',
    'concluida': 'success',
    'arquivada': 'secondary'
};

export default function TrackReportPage() {
    const location = useLocation();
    const [protocolId, setProtocolId] = useState('');
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState<Report | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Verificar se recebemos um protocolo da navegação
    useEffect(() => {
        if (location.state?.protocol) {
            setProtocolId(location.state.protocol);
            handleSearch(location.state.protocol);
        }
    }, [location.state]);

    const handleSearch = async (protocol = protocolId) => {
        if (!protocol.trim()) {
            setError('Por favor, informe o número de protocolo');
            return;
        }

        setLoading(true);
        setError(null);
        setReport(null);

        try {
            const response = await api.get(`/reports/protocolo/${protocol}`);
            setReport(response.data);
        } catch (err: unknown) {
            console.error('Erro ao buscar denúncia:', err);

            // Verificar se é um erro do Axios
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.status === 404
                        ? 'Denúncia não encontrada. Verifique o número de protocolo.'
                        : 'Ocorreu um erro ao buscar sua denúncia. Por favor, tente novamente.'
                );
            } else {
                setError('Ocorreu um erro inesperado. Por favor, tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <h1 className="text-center fw-bold mb-3">Consultar Denúncia</h1>

                    <p className="text-center mb-4">
                        Verifique o status da sua denúncia utilizando o número de protocolo recebido.
                    </p>

                    <Card className="shadow-sm mb-4">
                        <Card.Body className="p-4">
                            <Row className="align-items-start g-2">
                                <Col>
                                    <Form.Group>
                                        <Form.Control
                                            id="protocol"
                                            placeholder="Digite o número de protocolo recebido"
                                            value={protocolId}
                                            onChange={(e) => setProtocolId(e.target.value)}
                                            aria-label="Número de Protocolo"
                                        />
                                        <Form.Label htmlFor="protocol">Número de Protocolo</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col xs="auto">
                                    <Button
                                        variant="primary"
                                        onClick={() => handleSearch()}
                                        disabled={loading}
                                        style={{ height: '38px' }}
                                    >
                                        {loading ? (
                                            <Spinner size="sm" animation="border" role="status" className="me-1">
                                                <span className="visually-hidden">Carregando...</span>
                                            </Spinner>
                                        ) : (
                                            <FaSearch className="me-1" />
                                        )}
                                        Buscar
                                    </Button>
                                </Col>
                            </Row>

                            {error && (
                                <Alert variant="danger" className="mt-3 mb-0">
                                    {error}
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>

                    {loading && (
                        <div className="text-center my-4">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Carregando...</span>
                            </Spinner>
                        </div>
                    )}

                    {report && (
                        <Card className="shadow-sm">
                            <Card.Body className="p-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h2 className="h5 mb-0">
                                        Protocolo: {report.protocolo}
                                    </h2>
                                    <Badge
                                        bg={statusVariants[report.status] || "secondary"}
                                        pill
                                        className="px-3 py-2"
                                    >
                                        {statusLabels[report.status] || report.status}
                                    </Badge>
                                </div>

                                <hr className="my-3" />

                                <div className="mb-3">
                                    <p className="text-muted mb-1 small">Tipo de Denúncia</p>
                                    <p className="mb-0">
                                        {report.tipo.charAt(0).toUpperCase() + report.tipo.slice(1).replace('_', ' ')}
                                    </p>
                                </div>

                                <div className="mb-3">
                                    <p className="text-muted mb-1 small">Data de Registro</p>
                                    <p className="mb-0">
                                        {formatDate(report.criadoEm)}
                                    </p>
                                </div>

                                <div className="mb-3">
                                    <p className="text-muted mb-1 small">Última Atualização</p>
                                    <p className="mb-0">
                                        {formatDate(report.atualizadoEm)}
                                    </p>
                                </div>

                                <Alert variant="info" className="mt-4 mb-0">
                                    <p className="mb-0 small">
                                        Acompanhe regularmente o status da sua denúncia utilizando o número de protocolo fornecido.
                                        As atualizações serão refletidas nesta página.
                                    </p>
                                </Alert>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
}