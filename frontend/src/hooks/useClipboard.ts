// criação do hook useClipboard.ts para copiar texto para a área de transferência
// Expõe o estado `copied` (feedback temporário de sucesso) e `error` (motivo da falha),
// permitindo que o componente informe o usuário em vez de falhar silenciosamente.

import { useState } from "react";

export const useClipboard = () => {
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    // Copia o texto informado, limpando os estados anteriores e tratando dois cenários de falha:
    // 1) API indisponível (contextos não seguros, ex.: http); 2) exceção ao escrever no clipboard.
    const copyToClipboard = async (text: string) => {
        setError("");
        setCopied(false);

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

    // Consumido por componentes como CopyLinkButton: `copied` para o rótulo e `error` para o alerta
    return { copied, error, copyToClipboard };
};