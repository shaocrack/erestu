document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const startScreen = document.getElementById('start-screen');
    const loadingScreen = document.getElementById('loading-screen');
    const spaceScreen = document.getElementById('space-screen');
    const finalMessage = document.getElementById('final-message');
    const progressBar = document.getElementById('progress-bar');
    const loadingText = document.getElementById('loading-text');
    const spaceMessage = document.getElementById('space-message');
    
    // State
    let attempt = 0;
    let pressTimer;
    let isPressing = false;
    
    // Messages for each attempt
    const attemptMessages = [
        { progress: 80, message: '¡Presiona un poco más fuerte!' },
        { progress: 70, message: '¡Más fuerte por favor!' },
        { progress: 100, message: '¡Así de insistente hay que ser con los metas! ¡Llegar al 100%!' }
    ];
    
    // Space messages
    const spaceMessages = [
        'Si tienes 2 ojos... sonríe 😊',
        'Si tienes una nariz... acuérdate de mí 👃',
        'Y si tienes unos labios...',
        '¡Cómo quisiera que fueran míos!',
        '😄 Bromita, pero ahora sí...',
        'Pon otra vez los dedos',
        'Y vuelve a presionar 👇'
    ];
    
    // Final message
    const finalMessageText = [
        'BUENOS DÍAS ALEGRÍA',
        'TEN UN BUEN INICIO DE SEMANA',
        'Y RECUERDA QUE TE QUIERO',
        'Y TÚ PUEDES CON TODO',
        'BUENA SEMANA BONITA :D'
    ];
    
    // Initialize
    init();
    
    function init() {
        // Add event listeners
        startScreen.addEventListener('mousedown', handlePressStart);
        startScreen.addEventListener('touchstart', handlePressStart);
        
        startScreen.addEventListener('mouseup', handlePressEnd);
        startScreen.addEventListener('touchend', handlePressEnd);
        startScreen.addEventListener('mouseleave', handlePressEnd);
    }
    
    function handlePressStart(e) {
        e.preventDefault();
        if (isPressing) return;
        
        isPressing = true;
        startLoading();
    }
    
    function handlePressEnd(e) {
        e.preventDefault();
        if (!isPressing) return;
        
        isPressing = false;
        clearInterval(pressTimer);
        
        // If not at the final attempt, show retry message
        if (attempt < attemptMessages.length - 1) {
            loadingText.textContent = 'Intentémoslo otra vez...';
            setTimeout(() => {
                resetLoading();
            }, 1500);
        }
    }
    
    function startLoading() {
        // Show loading screen
        startScreen.classList.add('hidden');
        loadingScreen.classList.remove('hidden');
        
        const targetProgress = attemptMessages[attempt].progress;
        let progress = 0;
        const speed = 1 + (attempt * 0.2); // Increase speed with each attempt
        
        pressTimer = setInterval(() => {
            progress += speed;
            
            // Cap at target progress
            if (progress >= targetProgress) {
                progress = targetProgress;
                clearInterval(pressTimer);
                
                // Show message for this attempt
                loadingText.textContent = attemptMessages[attempt].message;
                
                // If this is the final attempt, proceed to space animation
                if (attempt === attemptMessages.length - 1) {
                    setTimeout(showSpaceAnimation, 2000);
                }
            }
            
            // Update progress bar
            progressBar.style.width = `${progress}%`;
            
        }, 20);
    }
    
    function resetLoading() {
        // Reset progress bar
        progressBar.style.width = '0%';
        loadingText.textContent = 'Presiona aquí con los 2 pulgares';
        
        // Show start screen again
        loadingScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        
        // Increment attempt counter
        attempt++;
    }
    
    function showSpaceAnimation() {
        // Hide loading screen, show space screen
        loadingScreen.classList.add('hidden');
        spaceScreen.classList.remove('hidden');
        
        // Display space messages one by one
        let messageIndex = 0;
        const messageInterval = setInterval(() => {
            if (messageIndex < spaceMessages.length) {
                spaceMessage.textContent = spaceMessages[messageIndex];
                messageIndex++;
            } else {
                clearInterval(messageInterval);
                // After all messages, show the final instruction
                spaceMessage.innerHTML = 'Pon los dedos en la pantalla y presiona...';
                
                // Add event listener for the final press
                spaceScreen.addEventListener('click', showFinalMessage);
                spaceScreen.style.cursor = 'pointer';
            }
        }, 2000);
    }
    
    function showFinalMessage() {
        // Remove the click event to prevent multiple triggers
        spaceScreen.removeEventListener('click', showFinalMessage);
        
        // Hide space screen, show final message
        spaceScreen.classList.add('hidden');
        finalMessage.classList.remove('hidden');
        
        // Add confetti effect
        createConfetti();
    }
    
    function createConfetti() {
        // Simple confetti effect
        const colors = ['#ff9aa2', '#ffb7b2', '#ffdac1', '#e2f0cb', '#b5ead7', '#c7ceea'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = -20 + 'px';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            
            document.body.appendChild(confetti);
            
            // Animate confetti
            const animation = confetti.animate([
                { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
                { transform: `translateY(${window.innerHeight + 20}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: 2000 + Math.random() * 3000,
                easing: 'cubic-bezier(0.1, 0.8, 0.8, 1)',
                delay: Math.random() * 3000
            });
            
            // Remove confetti after animation
            animation.onfinish = () => {
                confetti.remove();
            };
        }
    }
});
