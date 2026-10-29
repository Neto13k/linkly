//Gerenciamento de links encurtados.

export interface Link {
    id: number;
    slug: string;
    destination_url: string;
    click_count: number;
    created_at: string;
}