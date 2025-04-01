/**
 * TextMentor - Módulo de Testes de IA Local
 * 
 * Este arquivo permite testar as funcionalidades de IA localmente,
 * sem depender da API externa. Útil para desenvolvimento e demonstração.
 */

const TestAI = (function() {
    // Simulações de processamento básico (regras simples)
    const basicGrammarRules = [
        { pattern: /\b(vai|vão)\b/gi, replacement: 'vou' },
        { pattern: /\bpq\b/gi, replacement: 'porque' },
        { pattern: /\btá\b/gi, replacement: 'está' },
        { pattern: /\bmais\b/gi, replacement: 'mas' },
        { pattern: /\bvc\b/gi, replacement: 'você' },
        { pattern: /([^\s])(\,|\.)([^\s])/g, replacement: '$1$2 $3' },
        { pattern: /\bq\b/gi, replacement: 'que' },
        { pattern: /\bkd\b/gi, replacement: 'quando' },
        { pattern: /\bmto\b/gi, replacement: 'muito' },
        { pattern: /\bobg\b/gi, replacement: 'obrigado' },
        { pattern: /\bblz\b/gi, replacement: 'beleza' }
    ];
    
    /**
     * Simula a correção gramatical básica
     * @param {string} text - Texto para corrigir
     * @returns {string} - Texto corrigido
     */
    function simulateGrammarCorrection(text) {
        // Aplicar regras básicas
        let correctedText = text;
        basicGrammarRules.forEach(rule => {
            correctedText = correctedText.replace(rule.pattern, rule.replacement);
        });
        
        // Corrigir iniciais de frases
        correctedText = correctedText.replace(/([.!?]\s+)([a-z])/g, (match, p1, p2) => {
            return p1 + p2.toUpperCase();
        });
        
        // Adicionar ponto final se não houver
        if (!/[.!?]$/.test(correctedText)) {
            correctedText = correctedText + '.';
        }
        
        return correctedText;
    }
    
    /**
     * Simula a reescrita de texto em diferentes tons
     * @param {string} text - Texto para reescrever
     * @param {string} tone - Tom desejado
     * @returns {string} - Texto reescrito
     */
    function simulateRewrite(text, tone = 'professional') {
        // Adicionar introduções baseadas no tom
        const introByTone = {
            professional: 'Em contexto profissional, ',
            casual: 'De modo descontraído, ',
            academic: 'Sob perspectiva acadêmica, ',
            friendly: 'De maneira amigável, ',
            formal: 'Em termos formais, '
        };
        
        // Simulação de reescrita (muito simples)
        const intro = introByTone[tone] || '';
        const adjustedText = text
            .replace(/eu acho/gi, tone === 'professional' ? 'considero' : 
                     tone === 'academic' ? 'postulo' : 'penso')
            .replace(/muito bom/gi, tone === 'professional' ? 'altamente eficaz' : 
                     tone === 'academic' ? 'significativamente positivo' : 'excelente')
            .replace(/ruim/gi, tone === 'professional' ? 'desfavorável' : 
                     tone === 'academic' ? 'negativo' : 'insatisfatório');
        
        // Capitalizar primeira letra
        const firstChar = adjustedText.charAt(0).toUpperCase();
        const restOfText = adjustedText.slice(1);
        
        return intro + firstChar + restOfText;
    }
    
    /**
     * Simula o resumo de texto
     * @param {string} text - Texto para resumir
     * @returns {string} - Texto resumido
     */
    function simulateSummarize(text) {
        // Simular resumo pegando primeiras frases
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        let summary;
        if (sentences.length <= 2) {
            // Texto muito curto, usar completo
            summary = text;
        } else {
            // Pegar 30% das frases (pelo menos 2)
            const sentencesToInclude = Math.max(2, Math.floor(sentences.length * 0.3));
            summary = sentences.slice(0, sentencesToInclude).join('. ') + '.';
        }
        
        return 'Resumo: ' + summary;
    }
    
    /**
     * Simula sugestões para melhoria do texto
     * @param {string} text - Texto para analisar
     * @returns {string} - Sugestões
     */
    function simulateSuggestions(text) {
        const wordCount = text.split(/\s+/).length;
        const charCount = text.length;
        
        // Identificar repetições
        const words = text.match(/\b(\w+)\b/g) || [];
        const wordFrequency = {};
        words.forEach(word => {
            if (word.length > 3) { // Ignorar palavras muito curtas
                wordFrequency[word.toLowerCase()] = (wordFrequency[word.toLowerCase()] || 0) + 1;
            }
        });
        
        const repeatedWords = Object.keys(wordFrequency)
            .filter(word => wordFrequency[word] > 2)
            .slice(0, 3); // Pegar até 3 palavras repetidas
        
        // Gerar sugestões
        let suggestions = `Sugestões para melhorar seu texto:\n\n`;
        
        // Sugestão 1: Estrutura
        if (text.indexOf('\n') === -1 && wordCount > 50) {
            suggestions += `1. Considere quebrar o texto em parágrafos para melhorar a legibilidade.\n\n`;
        } else {
            suggestions += `1. A estrutura do texto está boa. Continue utilizando parágrafos para organizar suas ideias.\n\n`;
        }
        
        // Sugestão 2: Repetições
        if (repeatedWords.length > 0) {
            suggestions += `2. Evite repetir palavras como "${repeatedWords.join('", "')}". Utilize sinônimos para enriquecer o vocabulário.\n\n`;
        } else {
            suggestions += `2. Seu texto apresenta boa variedade de vocabulário.\n\n`;
        }
        
        // Sugestão 3: Comprimento
        if (wordCount < 20) {
            suggestions += `3. O texto está muito curto (${wordCount} palavras). Considere desenvolver mais suas ideias.\n\n`;
        } else if (wordCount > 200) {
            suggestions += `3. O texto está um pouco longo (${wordCount} palavras). Considere torná-lo mais conciso para maior impacto.\n\n`;
        } else {
            suggestions += `3. O comprimento do texto é adequado (${wordCount} palavras).\n\n`;
        }
        
        // Sugestão 4: Conectivos
        if (text.toLowerCase().indexOf(' portanto') === -1 && 
            text.toLowerCase().indexOf(' entretanto') === -1 && 
            text.toLowerCase().indexOf(' contudo') === -1) {
            suggestions += `4. Considere usar conectivos como "portanto", "entretanto" e "contudo" para melhorar a coesão entre ideias.\n\n`;
        } else {
            suggestions += `4. Bom uso de conectivos para estabelecer relações entre ideias.\n\n`;
        }
        
        // Sugestão 5: Conclusão
        suggestions += `5. Verifique se seu texto tem uma conclusão clara que reforce sua mensagem principal.\n\n`;
        
        return suggestions;
    }
    
    /**
     * Aplica um delay simulando processamento da API
     * @param {number} delayMs - Delay em milissegundos
     * @returns {Promise} - Promessa que resolve após o delay
     */
    function delay(delayMs = 1000) {
        return new Promise(resolve => setTimeout(resolve, delayMs));
    }
    
    /**
     * Simula processamento com IA com delay realista
     * @param {string} text - Texto para processar
     * @param {string} operation - Operação a ser realizada
     * @param {string} tone - Tom (para reescrita)
     * @returns {Promise<string>} - Texto processado
     */
    async function simulateProcessing(text, operation, tone = null) {
        // Simular delay de API (entre 1-3 segundos)
        const processingTime = Math.random() * 2000 + 1000;
        await delay(processingTime);
        
        // Processar com base na operação solicitada
        switch (operation) {
            case 'grammar':
                return simulateGrammarCorrection(text);
            case 'rewrite':
                return simulateRewrite(text, tone);
            case 'summarize':
                return simulateSummarize(text);
            case 'suggestions':
                return simulateSuggestions(text);
            default:
                return text;
        }
    }
    
    // Retornar API pública
    return {
        correctGrammar: text => simulateProcessing(text, 'grammar'),
        rewriteText: (text, tone) => simulateProcessing(text, 'rewrite', tone),
        summarizeText: text => simulateProcessing(text, 'summarize'),
        getSuggestions: text => simulateProcessing(text, 'suggestions')
    };
})();

// Substituir o módulo AI pelo TestAI para teste local completo
// (descomente esta linha para testes sem API)
// window.AI = TestAI;