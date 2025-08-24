document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const startScreen = document.getElementById('start-screen');
    const loadingScreen = document.getElementById('loading-screen');
    const spaceScreen = document.getElementById('space-screen');
    const finalMessage = document.getElementById('final-message');
    const progressBar = document.getElementById('progress-bar');
    const loadingText = document.getElementById('loading-text');
    const spaceMessage = document.getElementById('space-message');
    const gifContainer = document.getElementById('gif-container');
    const twoThumbButton = document.getElementById('two-thumb-button');
    const leftThumb = document.querySelector('.left-thumb');
    const rightThumb = document.querySelector('.right-thumb');
    
    // GIFs for different states
    const gifs = {
        initial: 'https://media.giphy.com/media/3o7btPCcdkNj7g0R5e/giphy.gif',
        pressing: 'https://media.giphy.com/media/3o7aD2d7hy9ktXNDP2/giphy.gif',
        success: 'https://media.giphy.com/media/3o7TKsQ8U4X0gX8k7i/giphy.gif',
        space: 'https://media.giphy.com/media/3o7aD5z5X6X6X6X6X6/giphy.gif'
    };
    
    // State
    let attempt = 0;
    let pressTimer;
    let isPressing = false;
    
    // Messages for each attempt
    const attemptMessages = [
        { 
            progress: 80, 
            message: '¡Presiona un poco más fuerte!',
            retry: '¡Vuelve a levantar los pulgares e inténtalo de nuevo con más fuerza! 💪'
        },
        { 
            progress: 70, 
            message: '¡Más fuerte por favor!',
            retry: '¡No te rindas! Levanta los pulgares y vuelve a intentarlo con más energía! 💪'
        },
        { 
            progress: 100, 
            message: '¡Así de insistente hay que ser con los metas! ¡Llegar al 100%!',
            retry: '¡Casi lo logras! Levanta los pulgares y dale con todo esta vez. ¡Tú puedes! 💪'
        }
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
        // Set initial GIF
        setGif('initial');
        
        // Add event listeners for the two-thumb button
        twoThumbButton.addEventListener('mousedown', handlePressStart);
        twoThumbButton.addEventListener('touchstart', handlePressStart, { passive: true });
        
        twoThumbButton.addEventListener('mouseup', handlePressEnd);
        twoThumbButton.addEventListener('touchend', handlePressEnd);
        twoThumbButton.addEventListener('mouseleave', handlePressEnd);
    }
    
    function setGif(state) {
        if (gifs[state]) {
            gifContainer.innerHTML = `<img src="${gifs[state]}" alt="${state}" style="max-width:100%; max-height:100%;">`;
        }
    }
    
    function handlePressStart(e) {
        e.preventDefault();
        if (isPressing) return;
        
        isPressing = true;
        setGif('pressing');
        
        // Animate thumbs
        leftThumb.style.transform = 'translateY(5px)';
        rightThumb.style.transform = 'translateY(5px)';
        
        startLoading();
    }
    
    function handlePressEnd(e) {
        e.preventDefault();
        if (!isPressing) return;
        
        isPressing = false;
        clearInterval(pressTimer);
        
        // Reset thumb positions
        leftThumb.style.transform = 'translateY(0)';
        rightThumb.style.transform = 'translateY(0)';
        
        // If not at the final attempt, show retry message
        if (attempt < attemptMessages.length - 1) {
            // Show initial retry message
            loadingText.textContent = '¡Ups! No fue suficiente. ' + attemptMessages[attempt].retry;
            setGif('initial');
            
            // After a delay, show the press again instruction
            setTimeout(() => {
                if (!isPressing) { // Only if user hasn't started pressing again
                    loadingText.textContent = 'Presiona de nuevo con los dos pulgares 👇👇';
                }
            }, 1000);
            
            // Reset after a longer delay
            setTimeout(() => {
                resetLoading();
            }, 3000);
        }
    }
    
    function startLoading() {
        // Show loading screen and hide start screen
        startScreen.classList.add('hidden');
        loadingScreen.classList.remove('hidden');
        
        const targetProgress = attemptMessages[attempt].progress;
        let progress = 0;
        const speed = 1 + (attempt * 0.2); // Increase speed with each attempt
        const progressContainer = document.querySelector('.progress-container');
        
        // Update progress container with initial value
        progressContainer.setAttribute('data-progress', '0');
        
        // Show loading message
        loadingText.textContent = 'Cargando...';
        setGif('pressing');
        
        pressTimer = setInterval(() => {
            progress += speed;
            
            // Cap at target progress
            if (progress >= targetProgress) {
                progress = targetProgress;
                clearInterval(pressTimer);
                
                // Show success GIF and message for this attempt
                setGif('success');
                loadingText.textContent = attemptMessages[attempt].message;
                
                // If this is the final attempt, proceed to space animation
                if (attempt === attemptMessages.length - 1) {
                    setTimeout(showSpaceAnimation, 2000);
                }
            }
            
            // Update progress bar and percentage
            const roundedProgress = Math.min(Math.round(progress), 100);
            progressBar.style.width = `${progress}%`;
            progressContainer.setAttribute('data-progress', roundedProgress);
            
            // Add pulse effect when reaching certain percentages
            if (progress % 25 < speed) {
                progressBar.style.animation = 'none';
                void progressBar.offsetWidth; // Trigger reflow
                progressBar.style.animation = 'pulse 0.5s ease';
            }
            
        }, 20);
    }
    
    function resetLoading() {
        // Reset progress bar with animation
        progressBar.style.transition = 'width 0.5s ease';
        progressBar.style.width = '0%';
        document.querySelector('.progress-container').setAttribute('data-progress', '0');
        
        // Reset loading text with a nice message
        loadingText.textContent = '¡Vamos! Presiona y mantén con los dos pulgares 👇👇';
        setGif('initial');
        
        // Ensure thumbs are in the up position
        leftThumb.style.transform = 'translateY(0)';
        rightThumb.style.transform = 'translateY(0)';
        
        // Show start screen again with a nice transition
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            startScreen.classList.remove('hidden');
            startScreen.style.animation = 'fadeIn 0.5s ease';
            
            // Reset animation for next use
            setTimeout(() => {
                startScreen.style.animation = '';
            }, 500);
        }, 300);
        
        // Increment attempt counter
        attempt++;
        
        // Reset progress bar transition
        setTimeout(() => {
            progressBar.style.transition = 'width 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
        }, 500);
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
