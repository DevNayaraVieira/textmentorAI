/**
 * TextMentor - Alternador de Tema Claro/Escuro
 * 
 * Implementa a funcionalidade de troca entre temas claro e escuro,
 * respeitando a preferência do usuário e armazenando a escolha.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos
    const themeSwitcher = document.getElementById('themeSwitch');
    
    if (!themeSwitcher) {
        console.error('Elemento do interruptor de tema não encontrado!');
        return;
    }
    
    // Detectar preferência do sistema
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Verificar se há um tema salvo no localStorage
    const currentTheme = localStorage.getItem('theme');
    
    // Aplicar tema inicial
    if (currentTheme) {
        // Se há um tema salvo, aplicá-lo
        document.body.setAttribute('data-theme', currentTheme);
        themeSwitcher.checked = currentTheme === 'dark';
    } else {
        // Se não há tema salvo, usar a preferência do sistema
        const systemPrefersDark = prefersDarkScheme.matches;
        document.body.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
        themeSwitcher.checked = systemPrefersDark;
    }
    
    // Adicionar evento para o switch de tema
    themeSwitcher.addEventListener('change', function() {
        toggleTheme(this.checked);
    });
    
    // Monitorar mudanças na preferência do sistema
    prefersDarkScheme.addEventListener('change', function(event) {
        // Apenas atualizar se o usuário não tiver definido um tema manualmente
        if (!localStorage.getItem('theme')) {
            const systemPrefersDark = event.matches;
            document.body.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
            themeSwitcher.checked = systemPrefersDark;
        }
    });
    
    /**
     * Alterna entre os temas claro e escuro
     * @param {boolean} isDark - Se verdadeiro, aplica o tema escuro
     */
    function toggleTheme(isDark) {
        // Aplicar tema
        const theme = isDark ? 'dark' : 'light';
        document.body.setAttribute('data-theme', theme);
        
        // Salvar escolha no localStorage
        localStorage.setItem('theme', theme);
        
        // Atualizar o cursor personalizado
        updateCustomCursor(isDark);
        
        // Disparar evento para notificar outras partes do aplicativo
        const themeChangeEvent = new CustomEvent('themeChanged', {
            detail: { theme }
        });
        document.dispatchEvent(themeChangeEvent);
        
        // Log para debug
        console.log(`Tema alterado para: ${theme}`);
    }
    
    /**
     * Atualiza o cursor personalizado com base no tema
     * @param {boolean} isDark - Se verdadeiro, aplica o cursor do tema escuro
     */
    function updateCustomCursor(isDark) {
        const cursorElement = document.getElementById('custom-cursor');
        
        if (cursorElement) {
            // Atualizar tamanho e aparência do cursor com base no tema
            if (isDark) {
                // Cursor para tema escuro
                cursorElement.style.width = '24px';
                cursorElement.style.height = '24px';
                cursorElement.style.backgroundColor = 'transparent';
                cursorElement.style.border = '2px solid #3A62CC'; // azul-principal do tema escuro
                cursorElement.style.opacity = '0.7';
            } else {
                // Cursor para tema claro
                cursorElement.style.width = '24px';
                cursorElement.style.height = '24px';
                cursorElement.style.backgroundColor = 'transparent';
                cursorElement.style.border = '2px solid #4A7CFF'; // azul-principal do tema claro
                cursorElement.style.opacity = '0.7';
            }
        }
    }
    
    // Corrigir o estado do botão se o tema atual não corresponder ao estado do botão
    const currentDataTheme = document.body.getAttribute('data-theme');
    if ((currentDataTheme === 'dark' && !themeSwitcher.checked) || 
        (currentDataTheme === 'light' && themeSwitcher.checked)) {
        themeSwitcher.checked = currentDataTheme === 'dark';
    }
    
    // Inicializar o cursor personalizado com base no tema atual
    updateCustomCursor(themeSwitcher.checked);
});