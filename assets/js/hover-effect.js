/**
 * TextMentor - Efeito de Hover 3D
 * Adiciona efeito de movimento 3D ao passar o mouse como no Clarice.ai
 */
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.skill-card, .project-card');
    
    cards.forEach(card => {
      // Adicionar evento de mouse
      card.addEventListener('mousemove', handleHover);
      card.addEventListener('mouseleave', resetCard);
    });
    
    function handleHover(e) {
      const card = this;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calcular a rotação com base na posição do mouse
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      // Aplicar transformação
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.transition = 'transform 0.1s ease';
      
      // Efeito de destaque
      const glare = card.querySelector('.card-glare') || createGlare(card);
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 80%)`;
    }
    
    function createGlare(card) {
      const glare = document.createElement('div');
      glare.className = 'card-glare';
      glare.style.position = 'absolute';
      glare.style.top = '0';
      glare.style.left = '0';
      glare.style.width = '100%';
      glare.style.height = '100%';
      glare.style.pointerEvents = 'none';
      card.appendChild(glare);
      return glare;
    }
    
    function resetCard() {
      this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      this.style.transition = 'transform 0.5s ease';
      
      const glare = this.querySelector('.card-glare');
      if (glare) {
        glare.style.background = 'none';
      }
    }
  });