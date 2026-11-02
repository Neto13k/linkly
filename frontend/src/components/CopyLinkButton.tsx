//Componente para copiar o link encurtado para a área de transferência

import React from "react";
import { useClipboard } from "../hooks/useClipboard";

interface CopyLinkButtonProps {
    link: string; // Propriedade que recebe o link a ser copiado
}

const CopyLinkButton: React.FC<CopyLinkButtonProps> = ({ link }) => { // Componente funcional que recebe o link como propriedade
    const { copied, copyToClipboard } = useClipboard();

    const handleCopy = () => { // Função para lidar com o evento de clique no botão
        copyToClipboard(link);
    };

    return ( // Retorna um botão que chama a função handleCopy ao ser clicado
        <button type="button" onClick={handleCopy}>
            {copied ? "Copiado!" : "Copiar Link"}
        </button>
    );
};

export default CopyLinkButton;