/**
 * TextMentor - Gerenciador de Histórico de Edições
 * 
 * Este módulo gerencia o histórico das edições realizadas pelo usuário,
 * permitindo visualizar, restaurar e excluir entradas do histórico.
 */

const HistoryManager = (function() {
    // Chave para armazenamento no localStorage
    const STORAGE_KEY = 'textMentorHistory';
    
    // Número máximo de entradas no histórico
    const MAX_HISTORY_ITEMS = 10;
    
    // Elementos DOM (serão inicializados quando necessário)
    let historyContainer;
    let historyModal;
    let emptyHistoryMessage;
    
    /**
     * Adiciona uma nova entrada ao histórico
     * @param {string} originalText - Texto original
     * @param {string} processedText - Texto processado
     * @param {string} toolType - Tipo de ferramenta utilizada
     * @param {string} tone - Tom utilizado (para reescrita)
     */
    function addToHistory(originalText, processedText, toolType, tone = null) {
        try {
            // Limitar o tamanho dos textos para economizar espaço
            const maxLength = 1000;
            const truncatedOriginal = originalText.length > maxLength 
                ? originalText.substring(0, maxLength) + '...' 
                : originalText;
            
            const truncatedProcessed = processedText.length > maxLength 
                ? processedText.substring(0, maxLength) + '...' 
                : processedText;
            
            // Obter histórico existente ou criar novo
            let history = getHistory();
            
            // Adicionar nova entrada
            history.unshift({
                id: generateId(),
                date: new Date().toISOString(),
                original: truncatedOriginal,
                processed: truncatedProcessed,
                tool: toolType,
                tone: toolType === 'rewrite' ? tone : null
            });
            
            // Limitar ao número máximo de itens
            if (history.length > MAX_HISTORY_ITEMS) {
                history = history.slice(0, MAX_HISTORY_ITEMS);
            }
            
            // Salvar de volta ao localStorage
            saveHistory(history);
            
            // Atualizar a contagem de uso da ferramenta
            updateToolUsageCount(toolType);
            
            return true;
        } catch (error) {
            console.error('Erro ao salvar no histórico:', error);
            return false;
        }
    }
    
    /**
     * Gera um ID único para entrada do histórico
     * @returns {string} ID único
     */
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
    
    /**
     * Recupera o histórico completo
     * @returns {Array} Array de entradas do histórico
     */
    function getHistory() {
        try {
            const historyJson = localStorage.getItem(STORAGE_KEY);
            return historyJson ? JSON.parse(historyJson) : [];
        } catch (error) {
            console.error('Erro ao recuperar histórico:', error);
            return [];
        }
    }
    
    /**
     * Salva o histórico no localStorage
     * @param {Array} history - Array de entradas do histórico
     */
    function saveHistory(history) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        } catch (error) {
            console.error('Erro ao salvar histórico:', error);
        }
    }
    
    /**
     * Remove uma entrada do histórico
     * @param {string} id - ID da entrada a ser removida
     * @returns {boolean} Verdadeiro se removido com sucesso
     */
    function removeFromHistory(id) {
        try {
            let history = getHistory();
            const initialLength = history.length;
            
            // Filtrar a entrada pelo ID
            history = history.filter(item => item.id !== id);
            
            // Salvar apenas se houve alteração
            if (history.length !== initialLength) {
                saveHistory(history);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Erro ao remover do histórico:', error);
            return false;
        }
    }
    
    /**
     * Limpa todo o histórico
     * @returns {boolean} Verdadeiro se limpo com sucesso
     */
    function clearHistory() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Erro ao limpar histórico:', error);
            return false;
        }
    }
    
    /**
     * Atualiza a contagem de uso da ferramenta
     * @param {string} toolType - Tipo de ferramenta utilizada
     */
    function updateToolUsageCount(toolType) {
        try {
            // Obter contagens existentes
            const countsJson = localStorage.getItem('textMentorToolUsage');
            const counts = countsJson ? JSON.parse(countsJson) : {};
            
            // Incrementar contagem
            counts[toolType] = (counts[toolType] || 0) + 1;
            
            // Salvar de volta
            localStorage.setItem('textMentorToolUsage', JSON.stringify(counts));
            
            // Atualizar atributos de data nos botões, se existirem
            const toolButton = document.getElementById(`btn${toolType.charAt(0).toUpperCase() + toolType.slice(1)}`);
            if (toolButton) {
                toolButton.setAttribute('data-usage', counts[toolType]);
            }
        } catch (error) {
            console.error('Erro ao atualizar contagem de uso:', error);
        }
    }
    
    /**
     * Inicializa as contagens de uso das ferramentas na interface
     */
    function initToolUsageCounts() {
        try {
            const countsJson = localStorage.getItem('textMentorToolUsage');
            if (!countsJson) return;
            
            const counts = JSON.parse(countsJson);
            
            // Atualizar contadores nos botões
            Object.keys(counts).forEach(tool => {
                const buttonId = `btn${tool.charAt(0).toUpperCase() + tool.slice(1)}`;
                const button = document.getElementById(buttonId);
                if (button) {
                    button.setAttribute('data-usage', counts[tool]);
                }
            });
        } catch (error) {
            console.error('Erro ao inicializar contadores:', error);
        }
    }
    
    /**
     * Renderiza a lista de histórico em um container
     * @param {HTMLElement} container - Elemento onde o histórico será renderizado
     */
    function renderHistory(container) {
        if (!container) return;
        
        // Armazenar referência
        historyContainer = container;
        
        // Limpar conteúdo existente
        container.innerHTML = '';
        
        // Obter histórico
        const history = getHistory();
        
        // Criar mensagem para histórico vazio
        emptyHistoryMessage = document.createElement('div');
        emptyHistoryMessage.className = 'empty-history-message';
        emptyHistoryMessage.textContent = 'Seu histórico está vazio. As edições de texto aparecerão aqui.';
        
        // Verificar se há itens no histórico
        if (history.length === 0) {
            container.appendChild(emptyHistoryMessage);
            return;
        }
        
        // Criar e adicionar cada item
        history.forEach(item => {
            const historyItem = createHistoryItemElement(item);
            container.appendChild(historyItem);
        });
    }
    
    /**
     * Cria um elemento HTML para um item do histórico
     * @param {Object} item - Item do histórico
     * @returns {HTMLElement} Elemento criado
     */
    function createHistoryItemElement(item) {
        const date = new Date(item.date);
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        
        // Determinar o nome da ferramenta
        let toolName = 'Desconhecido';
        switch (item.tool) {
            case 'grammar': toolName = 'Correção Gramatical'; break;
            case 'rewrite': toolName = 'Reescrita'; break;
            case 'summarize': toolName = 'Resumo'; break;
            case 'suggestions': toolName = 'Sugestões'; break;
        }
        
        // Criar o elemento
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.dataset.id = item.id;
        
        // Adicionar conteúdo
        historyItem.innerHTML = `
            <div class="history-meta">
                <span class="history-date">${formattedDate}</span>
                <span class="history-tool">${toolName}${item.tone ? ` (${item.tone})` : ''}</span>
            </div>
            <div class="history-text">${item.original}</div>
            <div class="history-text">${item.processed}</div>
            <div class="history-actions">
                <button class="btn btn-sm btn-rosa history-btn btn-restore">
                    <i class="fas fa-redo-alt"></i> Restaurar
                </button>
                <button class="btn btn-sm btn-outline-dark history-btn btn-delete">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        `;
        
        // Adicionar event listeners
        const restoreButton = historyItem.querySelector('.btn-restore');
        const deleteButton = historyItem.querySelector('.btn-delete');
        
        restoreButton.addEventListener('click', () => {
            restoreFromHistory(item);
        });
        
        deleteButton.addEventListener('click', () => {
            removeHistoryItem(item.id);
        });
        
        return historyItem;
    }
    
    /**
     * Remove um item do histórico e atualiza a UI
     * @param {string} id - ID do item a ser removido
     */
    function removeHistoryItem(id) {
        if (removeFromHistory(id)) {
            // Encontrar e remover o elemento da UI
            const item = historyContainer.querySelector(`[data-id="${id}"]`);
            if (item) {
                item.classList.add('fade-out');
                setTimeout(() => {
                    item.remove();
                    
                    // Verificar se o histórico ficou vazio
                    if (historyContainer.children.length === 0) {
                        historyContainer.appendChild(emptyHistoryMessage);
                    }
                }, 300);
            }
        }
    }
    
    /**
     * Restaura um texto do histórico para o editor
     * @param {Object} item - Item do histórico a ser restaurado
     */
    function restoreFromHistory(item) {
        // Verificar se o editor existe
        const editorInput = document.getElementById('editorInput');
        if (!editorInput) return;
        
        // Restaurar o texto original
        editorInput.value = item.original;
        
        // Disparar evento de input para atualizar contador de caracteres
        const event = new Event('input', { bubbles: true });
        editorInput.dispatchEvent(event);
        
        // Fechar o modal de histórico, se existir
        if (historyModal && typeof bootstrap !== 'undefined') {
            const bsModal = bootstrap.Modal.getInstance(historyModal);
            if (bsModal) bsModal.hide();
        }
        
        // Rolar até o editor
        const editorSection = document.getElementById('editor');
        if (editorSection) {
            window.scrollTo({
                top: editorSection.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    }
    
    /**
     * Inicializa o botão para abrir o histórico
     * @param {HTMLElement} button - Botão para abrir o histórico
     * @param {HTMLElement} modal - Elemento modal do histórico
     */
    function initHistoryButton(button, modal) {
        if (!button || !modal) return;
        
        historyModal = modal;
        
        button.addEventListener('click', () => {
            const historyList = modal.querySelector('.history-list');
            if (historyList) {
                renderHistory(historyList);
            }
        });
        
        // Botão para limpar todo o histórico
        const clearButton = modal.querySelector('.btn-clear-history');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                if (confirm('Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.')) {
                    clearHistory();
                    const historyList = modal.querySelector('.history-list');
                    if (historyList) {
                        renderHistory(historyList);
                    }
                }
            });
        }
    }
    
    // Inicializar ao carregar o documento
    document.addEventListener('DOMContentLoaded', function() {
        initToolUsageCounts();
    });
    
    // Retornar API pública
    return {
        addToHistory,
        getHistory,
        removeFromHistory,
        clearHistory,
        renderHistory,
        initHistoryButton
    };
})();