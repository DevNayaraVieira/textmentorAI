/**
 * TextMentor - Gerenciador de Efeitos Visuais
 * Centraliza a inicialização e configuração de efeitos visuais
 */
const EffectManager = (function() {
    /**
     * Inicializa todos os efeitos visuais
     */
    function init() {
      initScrollEffects();
      initHoverEffects();
      initTypedEffect();
      initParallaxEffect();
    }
    
    /**
     * Inicializa efeitos de scroll
     */
    function initScrollEffects() {
      // Adicionar classes para elementos que devem aparecer com scroll
      const scrollElements = document.querySelectorAll('.skill-card, .timeline-item, .project-card');
      
      // Observer para animação ao rolar
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-scale');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      
      // Observe cada elemento
      scrollElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
      });
    }
    
    /**
     * Inicializa efeitos de hover
     */
    function initHoverEffects() {
      const buttons = document.querySelectorAll('.btn-azul, .btn-tool');
      
      buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
          this.style.transform = 'translateY(0)';
        });
      });
    }
    
    /**
     * Inicializa efeito de digitação melhorado
     */
    function initTypedEffect() {
      if (typeof Typed !== 'undefined' && document.querySelector('.typed-text')) {
        // Opções melhoradas para o efeito de digitação
        const typedOptions = {
          strings: ['IA', 'tecnologia', 'simplicidade', 'inovação'],
          typeSpeed: 80,
          backSpeed: 40,
          backDelay: 2500,
          loop: true,
          cursorChar: '|',
          smartBackspace: true
        };
        
        new Typed('.typed-text', typedOptions);
      }
    }
    
    /**
     * Inicializa efeito de parallax
     */
    function initParallaxEffect() {
      const hero = document.querySelector('.hero');
      
      if (hero) {
        window.addEventListener('mousemove', function(e) {
          const x = e.clientX / window.innerWidth;
          const y = e.clientY / window.innerHeight;
          
          hero.style.backgroundPosition = `${x * 20}% ${y * 20}%`;
        });
      }
    }
    
    // Retornar API pública
    return {
      init: init
    };
  })();
  
  // Inicializar efeitos quando o DOM estiver pronto
  document.addEventListener('DOMContentLoaded', EffectManager.init);