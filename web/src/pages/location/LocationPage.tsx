import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form, Tabs, Tab, Spinner } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import MapComponent from "./components/MapComponent";
import useReportStore from "../../store/useReportStore";
import axios from "axios";
import { getAddressFromCoordinates } from "../../services/geocodeService";

// Interface para os dados de endereço
interface AddressFormData {
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  complemento: string;
  pontoReferencia: string;
  cep: string;
}

// Interface para os erros de validação
interface AddressFormErrors {
  logradouro: string;
  bairro: string;
  cidade: string;
}

export default function LocationPage() {
  const navigate = useNavigate();
  const { setLocation } = useReportStore();
  const [activeTab, setActiveTab] = useState<string>("map");
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);

  // Estado para rastrear erros de validação
  const [formErrors, setFormErrors] = useState<AddressFormErrors>({
    logradouro: "",
    bairro: "",
    cidade: ""
  });

  // Estado para armazenar os dados detalhados do endereço
  const [addressForm, setAddressForm] = useState<AddressFormData>({
    logradouro: "",
    numero: "",
    bairro: "",
    cidade: "",
    complemento: "",
    pontoReferencia: "",
    cep: "",
  });

  // Atualiza os campos do formulário quando um ponto é marcado no mapa
  useEffect(() => {
    if (markerPosition && activeTab === "address") {
      fetchAddressFromCoordinates(markerPosition[0], markerPosition[1]);
    }
  }, [markerPosition, activeTab]);

  const handleBackClick = () => {
    navigate(-1);
  };

  // Função para validar os campos obrigatórios
  const validateForm = (): boolean => {
    const errors: AddressFormErrors = {
      logradouro: "",
      bairro: "",
      cidade: ""
    };

    let isValid = true;

    if (!addressForm.logradouro.trim()) {
      errors.logradouro = "O endereço é obrigatório";
      isValid = false;
    }

    if (!addressForm.bairro.trim()) {
      errors.bairro = "O bairro é obrigatório";
      isValid = false;
    }

    if (!addressForm.cidade.trim()) {
      errors.cidade = "A cidade é obrigatória";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleContinue = () => {
    setValidated(true);

    // Verificar se está na aba de endereço e validar o formulário
    if (activeTab === "address" && !validateForm()) {
      return;
    }

    // Verificar se temos um marcador no mapa ou se temos pelo menos os campos obrigatórios preenchidos
    if (markerPosition || (activeTab === "address" && addressForm.logradouro && addressForm.bairro && addressForm.cidade)) {
      // Criar uma string de endereço completa
      const fullAddress = `${addressForm.logradouro}, ${addressForm.numero || 'S/N'}, ${addressForm.bairro}, ${addressForm.cidade}${addressForm.complemento ? `, ${addressForm.complemento}` : ''}`;

      // Se não tiver marcador no mapa, mas tiver preenchido o endereço, podemos prosseguir mesmo sem coordenadas
      setLocation({
        latitude: markerPosition ? markerPosition[0] : 0,
        longitude: markerPosition ? markerPosition[1] : 0,
        endereco: fullAddress
      });

      navigate("/confirmation");
    } else {
      // Se estiver na aba do mapa e não tiver marcado nenhum ponto
      if (activeTab === "map") {
        alert("Por favor, selecione um local no mapa ou preencha o endereço manualmente.");
      }
    }
  };

  const handleMapClick = async (lat: number, lng: number) => {
    setMarkerPosition([lat, lng]);
    fetchAddressFromCoordinates(lat, lng);
    setActiveTab("address"); // Mudar para a aba de endereço após marcar no mapa
  };

  // Função para buscar endereço a partir de coordenadas
  const fetchAddressFromCoordinates = async (lat: number, lng: number) => {
    setIsLoading(true);
    try {
      const addressData = await getAddressFromCoordinates(lat, lng);

      if (addressData) {
        setAddress(addressData.endereco);

        // Preencher os campos do formulário
        setAddressForm({
          logradouro: addressData.rua || "",
          numero: addressData.numero || "",
          bairro: addressData.bairro || "",
          cidade: addressData.cidade || "",
          complemento: "",
          pontoReferencia: "",
          cep: "", // A API OpenCage geralmente não retorna CEP
        });

        // Limpar erros de validação quando preenchemos pelo mapa
        setFormErrors({
          logradouro: "",
          bairro: "",
          cidade: ""
        });
      }
    } catch (error) {
      console.error("Erro ao obter endereço:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para buscar endereço por CEP
  const handleCepSearch = async (cep: string) => {
    if (cep.length !== 8) return;

    setIsLoading(true);
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

      if (!response.data.erro) {
        setAddressForm({
          ...addressForm,
          logradouro: response.data.logradouro || "",
          bairro: response.data.bairro || "",
          cidade: response.data.localidade || "",
          cep: cep
        });

        // Definir o endereço formatado
        const formattedAddress = `${response.data.logradouro}, ${addressForm.numero}, ${response.data.bairro}, ${response.data.localidade}`;
        setAddress(formattedAddress);

        // Limpar erros de validação quando preenchemos pelo CEP
        setFormErrors({
          logradouro: "",
          bairro: "",
          cidade: ""
        });
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setAddressForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpar o erro deste campo específico se ele for preenchido
    if (name === 'logradouro' || name === 'bairro' || name === 'cidade') {
      if (value.trim()) {
        setFormErrors(prev => ({
          ...prev,
          [name]: ""
        }));
      }
    }

    // Se for o CEP e tiver 8 dígitos, buscar automaticamente
    if (name === "cep" && value.length === 8) {
      handleCepSearch(value);
    }
  };


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
            Localização da Ocorrência
          </h1>
        </div>
      </header>

      <Container className="py-4 flex-grow-1">
        <Row className="mb-4">
          <Col>
            <p>
              Indique o local onde ocorreu o fato denunciado. Você pode selecionar no mapa
              ou informar o endereço completo.
            </p>
          </Col>
        </Row>

        <Tabs
          activeKey={activeTab}
          onSelect={(k) => k && setActiveTab(k)}
          className="mb-4"
        >
          <Tab eventKey="map" title="Selecionar no Mapa">
            <div className="p-2">
              <MapComponent
                onClick={handleMapClick}
                markerPosition={markerPosition}
              />
            </div>
          </Tab>
          <Tab eventKey="address" title="Informar Endereço">
            <div className="p-3 border border-top-0 rounded-bottom">
              {isLoading && (
                <div className="text-center my-3">
                  <Spinner animation="border" variant="primary" size="sm" />
                  <span className="ms-2">Carregando informações...</span>
                </div>
              )}

              <Form className="form-horizontal" noValidate validated={validated}>
                <Form.Group as={Row} className="mb-3 align-items-center">
                  <Form.Label column sm={3} className="text-sm-end">
                    CEP
                  </Form.Label>
                  <Col sm={4}>
                    <Form.Control
                      type="text"
                      name="cep"
                      value={addressForm.cep}
                      onChange={handleInputChange}
                      maxLength={8}
                      placeholder="Digite o CEP (Não obrigatório)"
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3 align-items-center">
                  <Form.Label column sm={3} className="text-sm-end">
                    Endereço *
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="text"
                      name="logradouro"
                      value={addressForm.logradouro}
                      onChange={handleInputChange}
                      placeholder="Digite o endereço (Obrigatório)"
                      isInvalid={validated && !!formErrors.logradouro}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.logradouro}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3 align-items-center">
                  <Form.Label column sm={3} className="text-sm-end">
                    Número
                  </Form.Label>
                  <Col sm={3}>
                    <Form.Control
                      type="text"
                      name="numero"
                      value={addressForm.numero}
                      onChange={handleInputChange}
                      placeholder="Digite o número(Não é obrigatório)"
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3 align-items-center">
                  <Form.Label column sm={3} className="text-sm-end">
                    Bairro *
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="text"
                      name="bairro"
                      value={addressForm.bairro}
                      placeholder="Digite o bairro (Obrigatório)"
                      onChange={handleInputChange}
                      isInvalid={validated && !!formErrors.bairro}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.bairro}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3 align-items-center">
                  <Form.Label column sm={3} className="text-sm-end">
                    Cidade *
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="text"
                      name="cidade"
                      value={addressForm.cidade}
                      placeholder="Digite a cidade (Obrigatório)"
                      onChange={handleInputChange}
                      isInvalid={validated && !!formErrors.cidade}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.cidade}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3 align-items-center">
                  <Form.Label column sm={3} className="text-sm-end">
                    Complemento
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="text"
                      name="complemento"
                      value={addressForm.complemento}
                      placeholder="Digite o complemento (Não é obrigatório)"
                      onChange={handleInputChange}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3 align-items-center">
                  <Form.Label column sm={3} className="text-sm-end">
                    Ponto de Referência
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="text"
                      name="pontoReferencia"
                      value={addressForm.pontoReferencia}
                      placeholder="Digite o ponto de referência (Não é obrigatório)"
                      onChange={handleInputChange}
                    />
                  </Col>
                </Form.Group>

                {activeTab === "address" && (
                  <Row className="mb-0">
                    <Col sm={{ span: 9, offset: 3 }}>
                      <small className="text-muted">* Campos obrigatórios</small>
                    </Col>
                  </Row>
                )}
              </Form>
            </div>
          </Tab>
        </Tabs>

        <div className="d-flex justify-content-between mt-4">
          <Button
            variant="outline-secondary"
            onClick={handleBackClick}
          >
            Voltar
          </Button>
          <Button
            variant="primary"
            onClick={handleContinue}
            disabled={
              activeTab === "map"
                ? !markerPosition
                : !(addressForm.logradouro && addressForm.bairro && addressForm.cidade)
            }
          >
            Continuar
          </Button>
        </div>
      </Container>
    </div>
  );
}