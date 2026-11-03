// criação do hook useClipboard.ts para copiar texto para a área de transferência

import { useState } from "react";

export const useClipboard = () => {
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const copyToClipboard = async (text: string) => {
        setError("");
        setCopied(false);

        // Em contextos não seguros (http) a API de clipboard pode não existir
        if (!navigator.clipboard) {
            setError("Não foi possível copiar: recurso indisponível neste navegador.");
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reseta o estado após 2 segundos
        }
        catch (err) {
            setCopied(false);
            setError("Falha ao copiar o link. Copie manualmente.");
            console.error("Falha ao copiar para a área de transferência: ", err);
        }
    };

    return { copied, error, copyToClipboard };
};