/**
 * TextMentor - Assistente de Escrita com IA
 * Script principal para funcionalidades da interface
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicialização de variáveis e elementos
    const preloader = document.querySelector('.preloader');
    const editorInput = document.getElementById('editorInput');
    const editorOutput = document.getElementById('editorOutput');
    const charCounter = document.querySelector('.char-counter');
    const outputContainer = document.querySelector('.editor-output-container');
    const inputContainer = document.querySelector('.editor-input-container');
    const btnProcess = document.getElementById('btnProcess');
    const btnClear = document.getElementById('btnClear');
    const btnCopy = document.getElementById('btnCopy');
    const btnBack = document.getElementById('btnBack');
    const processingIndicator = document.querySelector('.processing-indicator');
    const toneSetting = document.getElementById('toneSetting');
    
    // Botões de ferramentas
    const btnGrammar = document.getElementById('btnGrammar');
    const btnRewrite = document.getElementById('btnRewrite');
    const btnSummarize = document.getElementById('btnSummarize');
    const btnSuggestions = document.getElementById('btnSuggestions');
    
    // Variável para armazenar a ferramenta ativa
    let activeTool = 'grammar'; // Valor padrão

    // Cursor personalizado
    const cursorElement = document.getElementById('custom-cursor');
    
    if (cursorElement) {
        document.addEventListener('mousemove', (e) => {
            cursorElement.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        });
    }

    // Ocultar preloader após o carregamento
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.style.opacity = '0';
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 500);
        }, 1000);
    });

    // Inicializar o typed.js para o efeito de digitação
    if (document.querySelector('.typed-text')) {
        const typed = new Typed('.typed-text', {
            strings: ['IA', 'Tecnologia', 'Simplicidade', 'Inovação'],
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 2000,
            loop: true
        });
    }

    // Inicializar o AOS (Animate on Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }

    // Adicionar classe scrolled ao navbar quando rolar a página
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Contador de caracteres no editor
    if (editorInput) {
        editorInput.addEventListener('input', function() {
            countCharacters();
        });
        
        // Contar caracteres inicialmente
        countCharacters();
    }

    function countCharacters() {
        const text = editorInput.value;
        const count = text.length;
        charCounter.textContent = `${count} caracteres`;
    }

    // Processar o texto com a IA
    if (btnProcess) {
        btnProcess.addEventListener('click', async function() {
            const text = editorInput.value.trim();
            
            if (!text) {
                showNotification('Por favor, digite ou cole um texto para processar.', 'error');
                return;
            }

            const tone = toneSetting.value;
            showProcessing(true);
            
            try {
                // Chamar o serviço de IA com base na ferramenta ativa
                let result;
                
                switch (activeTool) {
                    case 'grammar':
                        result = await AI.correctGrammar(text);
                        break;
                    case 'rewrite':
                        result = await AI.rewriteText(text, tone);
                        break;
                    case 'summarize':
                        result = await AI.summarizeText(text);
                        break;
                    case 'suggestions':
                        result = await AI.getSuggestions(text);
                        break;
                    default:
                        result = await AI.correctGrammar(text);
                }
                
                displayResult(result);
                saveToHistory(text, result, activeTool);
                
            } catch (error) {
                console.error('Erro ao processar texto:', error);
                showNotification('Ocorreu um erro ao processar o texto. Tente novamente.', 'error');
            } finally {
                showProcessing(false);
            }
        });
    }

    // Botões de ferramentas
    if (btnGrammar) {
        btnGrammar.addEventListener('click', function() {
            setActiveTool('grammar', this);
        });
    }
    
    if (btnRewrite) {
        btnRewrite.addEventListener('click', function() {
            setActiveTool('rewrite', this);
        });
    }
    
    if (btnSummarize) {
        btnSummarize.addEventListener('click', function() {
            setActiveTool('summarize', this);
        });
    }
    
    if (btnSuggestions) {
        btnSuggestions.addEventListener('click', function() {
            setActiveTool('suggestions', this);
        });
    }

    // Definir ferramenta ativa
    function setActiveTool(tool, button) {
        activeTool = tool;
        
        // Remover classe active de todos os botões
        document.querySelectorAll('.btn-tool').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Adicionar classe active ao botão clicado
        if (button) {
            button.classList.add('active');
        }
        
        // Mostrar/esconder seletor de tom para a ferramenta de reescrita
        const toneSelector = document.querySelector('.tone-selector');
        if (toneSelector) {
            toneSelector.style.display = tool === 'rewrite' ? 'flex' : 'none';
        }
    }
    
    // Inicializar o botão de correção como ativo por padrão
    setActiveTool('grammar', btnGrammar);

    // Limpar o editor
    if (btnClear) {
        btnClear.addEventListener('click', function() {
            editorInput.value = '';
            countCharacters();
            outputContainer.style.display = 'none';
            inputContainer.style.display = 'block';
        });
    }

    // Copiar resultado para o clipboard
    if (btnCopy) {
        btnCopy.addEventListener('click', function() {
            const textToCopy = editorOutput.textContent;
            
            navigator.clipboard.writeText(textToCopy).then(
                function() {
                    showNotification('Texto copiado para a área de transferência!', 'success');
                    btnCopy.classList.add('copy-success');
                    setTimeout(() => {
                        btnCopy.classList.remove('copy-success');
                    }, 1500);
                },
                function() {
                    showNotification('Não foi possível copiar o texto.', 'error');
                }
            );
        });
    }

    // Voltar para o editor de entrada
    if (btnBack) {
        btnBack.addEventListener('click', function() {
            outputContainer.style.display = 'none';
            inputContainer.style.display = 'block';
        });
    }

    // Exibir resultado do processamento
    function displayResult(result) {
        editorOutput.textContent = result;
        inputContainer.style.display = 'none';
        outputContainer.style.display = 'block';
    }

    // Mostrar/ocultar indicador de processamento
    function showProcessing(show) {
        processingIndicator.style.display = show ? 'flex' : 'none';
    }

    // Exibir notificação
    function showNotification(message, type = 'info') {
        // Verificar se já existe uma notificação
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Adicionar à página
        document.body.appendChild(notification);
        
        // Mostrar com animação
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remover após alguns segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Guardar histórico no localStorage
    function saveToHistory(originalText, processedText, toolType) {
        try {
            // Obter histórico existente ou criar novo
            let history = JSON.parse(localStorage.getItem('textMentorHistory')) || [];
            
            // Adicionar nova entrada
            history.unshift({
                date: new Date().toISOString(),
                original: originalText,
                processed: processedText,
                tool: toolType,
                tone: toolType === 'rewrite' ? toneSetting.value : null
            });
            
            // Limitar a 10 itens
            if (history.length > 10) {
                history = history.slice(0, 10);
            }
            
            // Salvar de volta ao localStorage
            localStorage.setItem('textMentorHistory', JSON.stringify(history));
        } catch (error) {
            console.error('Erro ao salvar no histórico:', error);
        }
    }

    // Adicionar event listeners para rolagem suave aos links de navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Fecha o menu mobile se estiver aberto
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Ajuste para o cabeçalho fixo
                    behavior: 'smooth'
                });
            }
        });
    });

    // Adicionar ordem de animação aos cards de recursos
    document.querySelectorAll('.skill-card').forEach((card, index) => {
        card.style.setProperty('--animation-order', index);
    });

    // Adicionar ordem de animação aos cards de projeto
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.setProperty('--animation-order', index);
    });
});
// Inicializar o gerenciador de histórico
if (typeof HistoryManager !== 'undefined') {
    // Inicializar o botão de histórico se existir
    const historyButton = document.querySelector('[data-bs-target="#historyModal"]');
    const historyModal = document.getElementById('historyModal');
    
    if (historyButton && historyModal) {
        HistoryManager.initHistoryButton(historyButton, historyModal);
    }
}
document.querySelector('.editor-toolbar').addEventListener('click', function(e) {
    if (e.target.matches('.btn-tool')) {
        const toolType = e.target.id.replace('btn', '').toLowerCase();
        setActiveTool(toolType, e.target);
    }
});
// Validar entrada do usuário
function validateInput(text) {
    // Limitar tamanho máximo
    const maxLength = TextMentorConfig.ai.processing.maxInputLength;
    if (text.length > maxLength) {
        showNotification(`O texto excede o limite máximo de ${maxLength} caracteres.`, 'warning');
        return false;
    }
    
    // Validar conteúdo (opcional)
    if (text.trim().length === 0) {
        showNotification('Por favor, digite ou cole um texto para processar.', 'error');
        return false;
    }
    
    return true;
}