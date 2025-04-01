/**
 * TextMentor - Sistema de Partículas Simplificado
 * Inspirado pelo efeito visual do Clarice.ai
 */
document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    // Configurações
    const particleCount = 30;
    const colors = ['rgba(74, 124, 255, 0.3)', 'rgba(102, 172, 255, 0.2)', 'rgba(42, 90, 209, 0.2)'];
    const particleMinSize = 5;
    const particleMaxSize = 15;
    const particleMinSpeed = 0.2;
    const particleMaxSpeed = 0.8;
    
    // Criar container de partículas
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 1;
    `;
    heroSection.appendChild(particleContainer);
    
    // Gerar partículas
    for (let i = 0; i < particleCount; i++) {
      createParticle();
    }
    
    function createParticle() {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Propriedades aleatórias
      const size = Math.random() * (particleMaxSize - particleMinSize) + particleMinSize;
      const colorIndex = Math.floor(Math.random() * colors.length);
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const speed = Math.random() * (particleMaxSpeed - particleMinSpeed) + particleMinSpeed;
      const delay = Math.random() * 5;
      
      // Aplicar estilos
      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: ${colors[colorIndex]};
        left: ${x}%;
        top: ${y}%;
        position: absolute;
        opacity: ${Math.random() * 0.7 + 0.3};
        animation: floatParticle ${speed + 5}s ease-in-out ${delay}s infinite alternate;
      `;
      
      particleContainer.appendChild(particle);
    }
    
    // Adicionar animação para partículas
    const styleSheet = document.createElement('style');
    styleSheet.innerHTML = `
      @keyframes floatParticle {
        0% {
          transform: translate(0, 0);
        }
        100% {
          transform: translate(${Math.random() > 0.5 ? '-' : ''}${Math.random() * 40 + 10}px, 
                              ${Math.random() > 0.5 ? '-' : ''}${Math.random() * 40 + 10}px);
        }
      }
    `;
    document.head.appendChild(styleSheet);
  });