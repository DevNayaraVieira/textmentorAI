/**
 * TextMentor - Arquivo de Configuração
 * 
 * Centralize todas as configurações personalizáveis aqui para facilitar
 * a manutenção e personalização do aplicativo.
 */

const TextMentorConfig = {
    /**
     * Configurações da API de IA
     */
    ai: {
        // API principal (HuggingFace)
        huggingface: {
            apiUrl: 'https://api-inference.huggingface.co/models/',
            textModel: 'google/flan-t5-base',
            grammarModel: 'vennify/t5-base-grammar-correction',
            apiKey: '', // Deixe vazio para usar sem autenticação (com limites)
        },
        
        // Opções de processamento
        processing: {
            useLocalFallback: true, // Usar processamento local quando a API falhar
            maxInputLength: 2000,   // Limite máximo de caracteres para entrada
            maxOutputLength: 500,   // Limite para saída de resumos
            timeout: 10000          // Tempo máximo de espera pela API (ms)
        }
    },
    
    /**
     * Configurações de armazenamento local
     */
    storage: {
        historyKey: 'textMentorHistory',
        themeKey: 'theme',
        toolUsageKey: 'textMentorToolUsage',
        maxHistoryItems: 10
    },
    
    /**
     * Configurações de interface
     */
    ui: {
        // Delay para animações (ms)
        preloaderDelay: 1000,
        notificationDuration: 3000,
        
        // Opções para o efeito de digitação
        typedOptions: {
            strings: ['IA', 'tecnologia', 'simplicidade', 'inovação'],
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 2000,
            loop: true
        },
        
        // Opções para animações AOS
        aosOptions: {
            duration: 800,
            easing: 'ease-in-out',
            once: true
        }
    },
    
    /**
     * Configurações de tom para reescrita
     */
    tones: {
        professional: {
            label: 'Profissional',
            description: 'Linguagem formal e objetiva para ambientes de trabalho'
        },
        casual: {
            label: 'Casual',
            description: 'Tom relaxado e conversacional para comunicações informais'
        },
        academic: {
            label: 'Acadêmico',
            description: 'Estilo técnico e formal para contextos educacionais e científicos'
        },
        friendly: {
            label: 'Amigável',
            description: 'Tom caloroso e acessível para comunicação pessoal'
        },
        formal: {
            label: 'Formal',
            description: 'Linguagem extremamente formal para documentos oficiais'
        }
    }
};