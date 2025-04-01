/**
 * TextMentor - Script de gerenciamento do cursor personalizado
 * Versão 1.0.0
 */
document.addEventListener('DOMContentLoaded', function() {
    // Referência ao elemento do cursor personalizado
    const customCursor = document.getElementById('custom-cursor');
    if (!customCursor) return;

    // Flag para controlar a exibição do cursor
    let cursorVisible = true;
    
    // Função para atualizar a posição do cursor
    function updateCursorPosition(e) {
        if (!cursorVisible) return;
        
        const x = e.clientX;
        const y = e.clientY;
        
        // Atualiza a posição do cursor personalizado
        // Usando translate em vez de left/top para melhor performance
        customCursor.style.transform = `translate(${x}px, ${y}px)`;
    }
    
    // Função para atualizar o estilo do cursor com base no elemento sob ele
    function updateCursorStyle(e) {
        if (!cursorVisible) return;
        
        // Detectar o elemento sob o cursor
        const target = document.elementFromPoint(e.clientX, e.clientY);
        
        // Resetar o cursor para o estilo padrão
        customCursor.className = '';
        
        if (!target) return;
        
        // Aplicar estilo com base no tipo de elemento
        if (target.matches('a, button, .btn, .nav-link, .social-link, .navbar-brand, .btn-tool, .project-card, .skill-card, .hero-badge, .theme-switch') || 
            target.closest('a, button, .btn, .nav-link, .social-link, .navbar-brand, .btn-tool, .project-card, .skill-card, .hero-badge, .theme-switch')) {
            customCursor.classList.add('link-hover');
        } 
        else if (target.matches('input[type="text"], textarea, input[type="email"], input[type="password"], input[type="search"], .editor-input-container textarea') || 
                target.closest('input[type="text"], textarea, input[type="email"], input[type="password"], input[type="search"], .editor-input-container textarea')) {
            customCursor.classList.add('text-edit');
        }
        else if (target.hasAttribute('title') || target.hasAttribute('data-tooltip') || 
                target.closest('[title], [data-tooltip]')) {
            customCursor.classList.add('help-hover');
        }
    }
    
    // Eventos de mouse
    document.addEventListener('mousemove', function(e) {
        updateCursorPosition(e);
        updateCursorStyle(e);
    });
    
    document.addEventListener('mousedown', function() {
        customCursor.classList.add('clicking');
    });
    
    document.addEventListener('mouseup', function() {
        customCursor.classList.remove('clicking');
    });
    
    // Ocultar cursor quando o mouse sai da janela
    document.addEventListener('mouseleave', function() {
        customCursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', function() {
        customCursor.style.opacity = '0.7';
    });
    
    // Lidar com elementos clicáveis
    const clickables = document.querySelectorAll('a, button, input[type="submit"], input[type="button"], .btn');
    clickables.forEach(function(element) {
        element.addEventListener('mouseenter', function() {
            customCursor.classList.add('link-hover');
        });
        
        element.addEventListener('mouseleave', function() {
            customCursor.classList.remove('link-hover');
        });
    });
    
    // Lidar com campos de texto
    const textInputs = document.querySelectorAll('input[type="text"], textarea, input[type="email"], input[type="password"], input[type="search"]');
    textInputs.forEach(function(element) {
        element.addEventListener('mouseenter', function() {
            customCursor.classList.add('text-edit');
        });
        
        element.addEventListener('mouseleave', function() {
            customCursor.classList.remove('text-edit');
        });
    });
    
    // Inicialização
    customCursor.style.opacity = '0.7';
    customCursor.style.display = 'block';
    
    // Desativar cursor original apenas depois que o cursor personalizado estiver pronto
    document.body.style.cursor = 'none';
    document.querySelectorAll('a, button, input, textarea, [title], [data-tooltip]').forEach(function(el) {
        el.style.cursor = 'none';
    });
});
/**
 * TextMentor - Cursor Avançado
 * Implementação de cursor personalizado estilo Clarice.ai
 */
document.addEventListener('DOMContentLoaded', function() {
    // Cursor principal
    const customCursor = document.getElementById('custom-cursor');
    if (!customCursor) return;
    
    // Adicionar elemento seguidor do cursor
    const cursorFollower = document.createElement('div');
    cursorFollower.id = 'cursor-follower';
    document.body.appendChild(cursorFollower);
    
    // Posições
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;
    
    // Atualizar posição do cursor
    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Atualizar o cursor principal imediatamente
      customCursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      
      // Detectar tipo de elemento
      updateCursorType(e);
    });
    
    // Animação suave para o seguidor
    function animateFollower() {
      // Efeito de suavização
      const distX = mouseX - followerX;
      const distY = mouseY - followerY;
      
      followerX += distX * 0.2;
      followerY += distY * 0.2;
      
      cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
      
      requestAnimationFrame(animateFollower);
    }
    
    // Iniciar animação
    animateFollower();
    
    // Atualizar tipo de cursor
    function updateCursorType(e) {
      const target = document.elementFromPoint(e.clientX, e.clientY);
      if (!target) return;
      
      // Resetar classes
      customCursor.classList.remove('link-hover', 'text-edit', 'help-hover');
      cursorFollower.classList.remove('link-hover', 'text-edit', 'help-hover');
      
      // Verificar tipo de elemento
      if (target.matches('a, button, .btn, .nav-link, .social-link, .navbar-brand, .btn-tool') || 
          target.closest('a, button, .btn, .nav-link, .social-link, .navbar-brand, .btn-tool')) {
        customCursor.classList.add('link-hover');
        cursorFollower.classList.add('link-hover');
      } 
      else if (target.matches('input[type="text"], textarea') || 
               target.closest('input[type="text"], textarea')) {
        customCursor.classList.add('text-edit');
        cursorFollower.classList.add('text-edit');
      }
    }
    
    // Efeito de clique
    document.addEventListener('mousedown', function() {
      customCursor.classList.add('cursor-click');
      setTimeout(() => {
        customCursor.classList.remove('cursor-click');
      }, 500);
    });
    
    // Inicialização
    customCursor.style.opacity = '1';
    customCursor.style.display = 'block';
    cursorFollower.style.opacity = '1';
    cursorFollower.style.display = 'block';
    
    // Desativar cursor original
    document.body.style.cursor = 'none';
    document.querySelectorAll('a, button, input, textarea').forEach(function(el) {
      el.style.cursor = 'none';
    });
  });