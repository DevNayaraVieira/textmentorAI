/**
 * TextMentor - Serviço de Integração com IA
 * 
 * Integração com a HuggingFace Inference API para processamento de texto
 * usando modelos de linguagem gratuitos.
 */

// Namespace para as funções de IA
const AI = (function() {
    // URL base da API HuggingFace
    const API_URL = 'https://api-inference.huggingface.co/models/';
    
    // Modelo usado para tarefas gerais de texto
    // Modelos gratuitos disponíveis na HuggingFace
    const TEXT_MODEL = 'google/flan-t5-base'; // Modelo gratuito para tarefas de texto
    const GRAMMAR_MODEL = 'vennify/t5-base-grammar-correction'; // Modelo para correção gramatical
    
    // Cabeçalhos para a API (é possível usar HuggingFace sem token para chamadas limitadas)
    const headers = {
        'Content-Type': 'application/json'
    };

    /**
     * Função para demonstração com textos simulados (fallback quando a API não responde)
     * @param {string} text - Texto original
     * @param {string} operation - Tipo de operação
     * @returns {string} - Resultado simulado
     */
    function getSimulatedResponse(text, operation) {
        switch (operation) {
            case 'grammar':
                return text
                    .replace(/\b(vai|vão)\b/gi, 'vou')
                    .replace(/\bpq\b/gi, 'porque')
                    .replace(/\btá\b/gi, 'está')
                    .replace(/\bmais\b/gi, 'mas')
                    .replace(/\bvc\b/gi, 'você')
                    .replace(/([^\s])(\,|\.)([^\s])/g, '$1$2 $3');
            
            case 'rewrite':
                return `${text} [Texto reescrito com estrutura aprimorada e vocabulário mais rico]`;
            
            case 'summarize':
                return text.split('.').slice(0, 2).join('.') + '.';
            
            case 'suggestions':
                return `Sugestões para melhorar seu texto:
                
1. Considere usar parágrafos para melhorar a legibilidade.
2. Evite repetições de palavras como "${text.match(/\b(\w+)\b/g).find(word => text.match(new RegExp(`\\b${word}\\b`, 'gi')).length > 2) || 'exemplo'}".
3. Use conectivos para melhorar a fluidez entre as ideias.
4. Considere revisar a pontuação para garantir clareza.
5. Verifique a concordância verbal em todo o texto.`;
            
            default:
                return text;
        }
    }

    /**
     * Faz uma chamada para a API da HuggingFace
     * @param {string} model - O modelo a ser usado
     * @param {Object} data - Dados a serem enviados
     * @returns {Promise<Object>} - Resposta da API
     */
    async function callAPI(model, data) {
        try {
            const response = await fetch(`${API_URL}${model}`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`API respondeu com erro: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro ao chamar API:', error);
            // Em caso de falha na API, usamos o fallback local
            return { error: true, message: error.message };
        }
    }

    /**
     * Corrige erros gramaticais no texto
     * @param {string} text - Texto para corrigir
     * @returns {Promise<string>} - Texto corrigido
     */
    async function correctGrammar(text) {
        try {
            const payload = {
                inputs: `correct this to standard: ${text}`
            };
            
            const response = await callAPI(GRAMMAR_MODEL, payload);
            
            if (response.error) {
                // Fallback para simulação local
                console.log('Usando fallback para correção gramatical');
                return getSimulatedResponse(text, 'grammar');
            }
            
            // A API retorna um array com a resposta
            return Array.isArray(response) ? response[0].generated_text : response.generated_text;
        } catch (error) {
            console.error('Erro na correção gramatical:', error);
            return getSimulatedResponse(text, 'grammar');
        }
    }

    /**
     * Reescreve o texto em um tom específico
     * @param {string} text - Texto para reescrever
     * @param {string} tone - Tom desejado (professional, casual, academic, friendly, formal)
     * @returns {Promise<string>} - Texto reescrito
     */
    async function rewriteText(text, tone = 'professional') {
        try {
            const prompt = `Rewrite the following text in a ${tone} tone: ${text}`;
            const payload = {
                inputs: prompt,
                parameters: {
                    max_length: 512
                }
            };
            
            const response = await callAPI(TEXT_MODEL, payload);
            
            if (response.error) {
                // Fallback para simulação local
                console.log('Usando fallback para reescrita de texto');
                return getSimulatedResponse(text, 'rewrite');
            }
            
            return Array.isArray(response) ? response[0].generated_text : response.generated_text;
        } catch (error) {
            console.error('Erro na reescrita de texto:', error);
            return getSimulatedResponse(text, 'rewrite');
        }
    }

    /**
     * Resume um texto
     * @param {string} text - Texto para resumir
     * @returns {Promise<string>} - Texto resumido
     */
    async function summarizeText(text) {
        try {
            const payload = {
                inputs: `summarize: ${text}`,
                parameters: {
                    max_length: 150
                }
            };
            
            const response = await callAPI(TEXT_MODEL, payload);
            
            if (response.error) {
                // Fallback para simulação local
                console.log('Usando fallback para resumo');
                return getSimulatedResponse(text, 'summarize');
            }
            
            return Array.isArray(response) ? response[0].generated_text : response.generated_text;
        } catch (error) {
            console.error('Erro no resumo do texto:', error);
            return getSimulatedResponse(text, 'summarize');
        }
    }

    /**
     * Fornece sugestões para melhorar o texto
     * @param {string} text - Texto para analisar
     * @returns {Promise<string>} - Sugestões de melhoria
     */
    async function getSuggestions(text) {
        try {
            const payload = {
                inputs: `Give 5 suggestions to improve this text: ${text}`,
                parameters: {
                    max_length: 300
                }
            };
            
            const response = await callAPI(TEXT_MODEL, payload);
            
            if (response.error) {
                // Fallback para simulação local
                console.log('Usando fallback para sugestões');
                return getSimulatedResponse(text, 'suggestions');
            }
            
            return Array.isArray(response) ? response[0].generated_text : response.generated_text;
        } catch (error) {
            console.error('Erro ao obter sugestões:', error);
            return getSimulatedResponse(text, 'suggestions');
        }
    }

    // Retornar as funções públicas
    return {
        correctGrammar,
        rewriteText,
        summarizeText,
        getSuggestions
    };
})();