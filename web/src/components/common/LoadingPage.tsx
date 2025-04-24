import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

export default function LoadingPage() {
    return (
        <Container
            className="d-flex flex-column align-items-center justify-content-center"
            style={{
                height: '60vh',
                padding: '0.5rem'
            }}
        >
            <Spinner
                animation="border"
                role="status"
                variant="primary"
                style={{
                    width: '3rem',
                    height: '3rem',
                    borderWidth: '4px'
                }}
            >
                <span className="visually-hidden">Carregando...</span>
            </Spinner>
            <p className="mt-4 text-center">Carregando...</p>
        </Container>
    );
}