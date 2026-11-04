//Gerenciamento de links encurtados.
// Representa um link como retornado pelo backend; usado nas páginas e nos services.

// Cada campo corresponde a uma coluna da tabela links no backend:
// slug é o final personalizado da URL curta (único por usuário), destination_url é o
// destino do redirecionamento, click_count conta os acessos e created_at é a data de
// criação em formato ISO (serializada no JSON da resposta).
export interface Link {
    id: number;
    slug: string;
    destination_url: string;
    click_count: number;
    created_at: string;
}