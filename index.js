addListeners();

function animaster() {
    let _steps = [];

    function addMove(duration, translation) {
        _steps.push({ type: 'move', duration, translation });
        return this;
    }

    function addScale(duration, ratio) {
        _steps.push({ type: 'scale', duration, ratio });
        return this;
    }

    function addFadeIn(duration) {
        _steps.push({ type: 'fadeIn', duration });
        return this;
    }

    function addFadeOut(duration) {
        _steps.push({ type: 'fadeOut', duration });
        return this;
    }

    function fadeIn(element, duration) {
        element.style.transition = `opacity ${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function fadeOut(element, duration) {
        element.style.transition = `opacity ${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function move(element, duration, translation) {
        element.style.transition = `transform ${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    function scale(element, duration, ratio) {
        element.style.transition = `transform ${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function getTransform(translation, ratio) {
        const result = [];
        if (translation) {
            result.push(`translate(${translation.x}px, ${translation.y}px)`);
        }
        if (ratio) {
            result.push(`scale(${ratio})`);
        }
        return result.join(' ');
    }

    function showAndHide(element, duration) {
        const stepDuration = duration / 3;

        fadeIn(element, stepDuration);
        setTimeout(() => fadeOut(element, stepDuration), stepDuration * 2);
    }

    function heartBeating(element) {
        let intervalId = setInterval(() => {
            scale(element, 500, 1.4);
            setTimeout(() => scale(element, 500, 1), 500);
        }, 1000);

        return {
            stop: () => clearInterval(intervalId),
        };
    }

    function resetFadeIn(element) {
        element.style.transition = '';
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element) {
        element.style.transition = '';
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetMoveAndScale(element) {
        element.style.transition = '';
        element.style.transform = '';
    }

    function moveAndHide(element, duration) {
        const moveDuration = (duration * 2) / 5;
        const fadeDuration = (duration * 3) / 5;

        move(element, moveDuration, { x: 100, y: 20 });
        const fadeTimeout = setTimeout(() => fadeOut(element, fadeDuration), moveDuration);

        return {
            stop: () => {
                clearTimeout(fadeTimeout);
                resetMoveAndScale(element);
                resetFadeOut(element);
            },
        };
    }

    function play(element) {
        let totalDelay = 0;
        _steps.forEach((step) => {
            setTimeout(() => {
                switch (step.type) {
                    case 'move':
                        move(element, step.duration, step.translation);
                        break;
                    case 'scale':
                        scale(element, step.duration, step.ratio);
                        break;
                    case 'fadeIn':
                        fadeIn(element, step.duration);
                        break;
                    case 'fadeOut':
                        fadeOut(element, step.duration);
                        break;
                }
            }, totalDelay);
            totalDelay += step.duration;
        });
    }

    return {
        fadeIn,
        fadeOut,
        move,
        scale,
        moveAndHide,
        showAndHide,
        heartBeating,
        resetFadeIn,
        resetFadeOut,
        resetMoveAndScale,
        addMove,
        addScale,
        addFadeIn,
        addFadeOut,
        play,
    };
}

function addListeners() {
    document.getElementById('fadeInPlay').addEventListener('click', function () {
        const block = document.getElementById('fadeInBlock');
        animaster().fadeIn(block, 5000);
    });

    document.getElementById('fadeOutPlay').addEventListener('click', function () {
        const block = document.getElementById('fadeOutBlock');
        animaster().fadeOut(block, 5000);
    });

    document.getElementById('movePlay').addEventListener('click', function () {
        const block = document.getElementById('moveBlock');
        animaster().addMove(1000, { x: 100, y: 10 }).play(block);
    });

    document.getElementById('scalePlay').addEventListener('click', function () {
        const block = document.getElementById('scaleBlock');
        animaster().scale(block, 1000, 1.25);
    });

    let moveAndHideAnimation;
    document.getElementById('moveAndHidePlay').addEventListener('click', function () {
        const block = document.getElementById('moveAndHideBlock');
        moveAndHideAnimation = animaster().moveAndHide(block, 5000);
    });

    document.getElementById('moveAndHideReset').addEventListener('click', function () {
        if (moveAndHideAnimation) {
            moveAndHideAnimation.stop();
        }
    });

    document.getElementById('showAndHidePlay').addEventListener('click', function () {
        const block = document.getElementById('showAndHideBlock');
        animaster().showAndHide(block, 3000);
    });

    let heartBeatingAnimation;

    document.getElementById('heartBeatingPlay').addEventListener('click', function () {
        const block = document.getElementById('heartBeatingBlock');
        
        if (!heartBeatingAnimation) {
            heartBeatingAnimation = animaster().heartBeating(block);
        }
    });

    document.getElementById('heartBeatingStop').addEventListener('click', function () {
        if (heartBeatingAnimation) {
            heartBeatingAnimation.stop();
            heartBeatingAnimation = null;
        }
    });

    document.getElementById('fadeInReset').addEventListener('click', function () {
        const block = document.getElementById('fadeInBlock');
        animaster().resetFadeIn(block);
    });

    document.getElementById('fadeOutReset').addEventListener('click', function () {
        const block = document.getElementById('fadeOutBlock');
        animaster().resetFadeOut(block);
    });

    document.getElementById('moveReset').addEventListener('click', function () {
        const block = document.getElementById('moveBlock');
        animaster().resetMoveAndScale(block);
    });

    document.getElementById('scaleReset').addEventListener('click', function () {
        const block = document.getElementById('scaleBlock');
        animaster().resetMoveAndScale(block);
    });
}
