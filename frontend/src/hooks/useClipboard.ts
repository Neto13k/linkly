// criação do hook useClipboard.ts para copiar texto para a área de transferência

import { useState } from "react";

export const useClipboard = () => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reseta o estado após 2 segundos
        }
        catch (err) {
            setCopied(false);
            console.error("Falha ao copiar para a área de transferência: ", err);
        }
    };

    return { copied, copyToClipboard };
};