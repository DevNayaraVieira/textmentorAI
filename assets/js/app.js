/**
 * TextMentor - Script de Inicialização da Aplicação
 * 
 * Este arquivo serve como ponto central para a inicialização de todos
 * os componentes do aplicativo, seguindo um padrão organizado.
 */

// Namespace global da aplicação
const TextMentor = (function() {
    // Componentes do aplicativo
    const components = {
        editor: null,
        theme: null,
        history: null,
        cursor: null,
        ai: null
    };
    
    /**
     * Inicializa todos os componentes do aplicativo
     */
    function init() {
        // Inicializar o tema primeiro para garantir consistência visual
        initTheme();
        
        // Inicializar cursor personalizado
        initCursor();
        
        // Inicializar componentes de UI
        initUIComponents();
        
        // Inicializar serviços e recursos
        initServices();
        
        // Registrar eventos globais
        registerGlobalEvents();
        
        console.log('TextMentor inicializado com sucesso!');
    }
    
    /**
     * Inicializa o tema da aplicação
     */
    function initTheme() {
        // Código de inicialização do tema
        components.theme = ThemeSwitcher.init();
    }
    
    /**
     * Inicializa o cursor personalizado
     */
    function initCursor() {
        // Código de inicialização do cursor
        components.cursor = CursorManager.init();
    }
    
    /**
     * Inicializa componentes de interface
     */
    function initUIComponents() {
        // Inicializar editor
        components.editor = EditorManager.init({
            inputSelector: '#editorInput',
            outputSelector: '#editorOutput',
            processButtonSelector: '#btnProcess',
            toolbarSelector: '.editor-toolbar'
        });
        
        // Inicializar histórico
        components.history = HistoryManager;
        
        // Inicializar modal de histórico
        const historyButton = document.querySelector('[data-bs-target="#historyModal"]');
        const historyModal = document.getElementById('historyModal');
        if (historyButton && historyModal) {
            HistoryManager.initHistoryButton(historyButton, historyModal);
        }
        
        // Inicializar efeitos visuais
        initVisualEffects();
    }
    
    /**
     * Inicializa serviços e recursos
     */
    function initServices() {
        // Inicializar serviço de IA
        components.ai = window.AI || TestAI;
    }
    
    /**
     * Inicializa efeitos visuais
     */
    function initVisualEffects() {
        // Inicializar Typed.js para o efeito de digitação
        if (document.querySelector('.typed-text')) {
            const typed = new Typed('.typed-text', TextMentorConfig.ui.typedOptions);
        }
        
        // Inicializar AOS (Animate on Scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init(TextMentorConfig.ui.aosOptions);
        }
        
        // Adicionar ordem de animação aos cards
        document.querySelectorAll('.skill-card, .project-card').forEach((card, index) => {
            card.style.setProperty('--animation-order', index);
        });
    }
    
    /**
     * Registra eventos globais
     */
    function registerGlobalEvents() {
        // Adicionar classe scrolled ao navbar quando rolar a página
        window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        
        // Event listeners para rolagem suave nos links de navegação
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Fecha o menu mobile se estiver aberto
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        navbarCollapse.classList.remove('show');
                    }
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Retornar API pública
    return {
        init: init,
        getComponent: function(name) {
            return components[name];
        }
    };
})();

// Inicializar a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', TextMentor.init);