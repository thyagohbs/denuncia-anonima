import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaBan, FaSadTear, FaFemale, FaMicrophone, FaGavel, FaArrowLeft } from 'react-icons/fa';
import useReportStore, { ReportType } from '../../store/useReportStore';

export default function HomePage() {
    const [selected, setSelected] = useState<string | null>(null);
    const navigate = useNavigate();
    const { setReportType } = useReportStore();

    const handleTypeSelect = (type: string) => {
        setSelected(type);
        setReportType(type as ReportType);
        setTimeout(() => navigate("/local"), 300);
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    // Tipos de denúncia
    const denunciaTypes = [
        {
            type: 'VIOLENCIA_FISICA',
            label: 'Violência Física',
            description: 'Agressões físicas, ameaças, intimidação',
            icon: <FaSadTear size={32} />
        },
        {
            type: 'VIOLENCIA_SEXUAL',
            label: 'Violência Sexual',
            description: 'Assédio, importunação ou abuso sexual',
            icon: <FaFemale size={32} />
        },
        {
            type: 'AMEACA',
            label: 'Ameaça',
            description: 'Intimidação, coação ou difamação',
            icon: <FaMicrophone size={32} />
        },
        {
            type: 'INTOLERANCIA',
            label: 'Intolerância',
            description: 'Discriminação racial, religiosa, sexual ou social',
            icon: <FaBan size={32} />
        },
        {
            type: 'ABUSO_AUTORIDADE',
            label: 'Abuso de Autoridade',
            description: 'Uso indevido de poder hierárquico ou funcional',
            icon: <FaGavel size={32} />
        }
    ];

    return (
        <div className="d-flex flex-column min-vh-100">
            <header className="bg-primary text-white">
                <div className="d-flex align-items-center py-2 px-3">
                    <Button
                        variant="link"
                        className="text-white p-1"
                        onClick={handleBackClick}
                        aria-label="voltar"
                    >
                        <FaArrowLeft />
                    </Button>
                    <h1 className="h5 mb-0 ms-2 flex-grow-1">
                        Denúncia Anônima
                    </h1>
                </div>
            </header>

            <Container className="py-4 flex-grow-1">
                <h2 className="text-center mb-4">
                    Selecione o tipo de denúncia
                </h2>

                <hr className="my-4" />

                <Row xs={1} md={2} className="g-4">
                    {denunciaTypes.map((item) => (
                        <Col key={item.type}>
                            <Card
                                onClick={() => handleTypeSelect(item.type)}
                                className={`h-100 cursor-pointer transition-all ${selected === item.type ? 'border-primary border-2' : ''}`}
                                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                            >
                                <Card.Header className="pb-0">
                                    <div className="d-flex align-items-center">
                                        <div className="me-3 text-primary">
                                            {item.icon}
                                        </div>
                                        <h3 className="h5 mb-0">{item.label}</h3>
                                    </div>
                                </Card.Header>
                                <Card.Body className="pt-2">
                                    <Card.Text>{item.description}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
}