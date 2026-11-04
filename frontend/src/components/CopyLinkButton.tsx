//Componente para copiar o link encurtado para a área de transferência
// Renderiza o botão de cópia e, quando a cópia falha, uma mensagem de erro acessível
// (role="alert"), garantindo que a falha seja percebida também por leitores de tela.

import React from "react";
import { useClipboard } from "../hooks/useClipboard";

interface CopyLinkButtonProps {
    link: string; // Propriedade que recebe o link a ser copiado
}

const CopyLinkButton: React.FC<CopyLinkButtonProps> = ({ link }) => { // Componente funcional que recebe o link como propriedade
    const { copied, error, copyToClipboard } = useClipboard();

    const handleCopy = () => { // Função para lidar com o evento de clique no botão
        copyToClipboard(link);
    };

    return ( // Retorna um botão que chama a função handleCopy ao ser clicado
        <>
            <button type="button" className="btn btn--secondary" onClick={handleCopy}>
                {copied ? "Copiado!" : "Copiar Link"}
            </button>
            {error && <p className="alert alert--error" role="alert">{error}</p>}
        </>
    );
};

export default CopyLinkButton;