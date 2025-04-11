import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ReportTypeForm from '../ReportTypeForm';
import { ReportType } from '../../../../store/useReportStore';

// Mock do zustand store
vi.mock('../../../../store/useReportStore', () => ({
    default: () => ({
        formData: {
            tipo: ReportType.OUTROS,
        },
        updateFormData: vi.fn(),
    }),
    ReportType,
}));

describe('ReportTypeForm', () => {
    it('renders all report type options', () => {
        const onNext = vi.fn();
        render(<ReportTypeForm onNext={onNext} />);

        // Verificar se todos os tipos de denúncia estão sendo renderizados
        expect(screen.getByLabelText(/furto/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/roubo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/agressão/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/dano ao patrimônio/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/outros/i)).toBeInTheDocument();
    });

    it('calls onNext when form is submitted', async () => {
        const onNext = vi.fn();
        render(<ReportTypeForm onNext={onNext} />);

        // Selecionar uma opção
        fireEvent.click(screen.getByLabelText(/furto/i));

        // Submeter o formulário
        fireEvent.click(screen.getByRole('button', { name: /próximo/i }));

        // Verificar se onNext foi chamado
        expect(onNext).toHaveBeenCalledTimes(1);
    });

    it('shows validation error when no option is selected', async () => {
        const onNext = vi.fn();

        // Mock de um valor inicial diferente para forçar validação
        vi.mocked(useReportStore).mockReturnValue({
            formData: { tipo: undefined as unknown as ReportType },
            updateFormData: vi.fn(),
        });

        render(<ReportTypeForm onNext={onNext} />);

        // Submeter o formulário sem selecionar opção
        fireEvent.click(screen.getByRole('button', { name: /próximo/i }));

        // Verificar se a mensagem de erro aparece e onNext não é chamado
        expect(screen.getByText(/selecione um tipo de denúncia/i)).toBeInTheDocument();
        expect(onNext).not.toHaveBeenCalled();
    });
});