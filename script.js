class ImageGenerator {
    constructor() {
        this.model = null;
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            // Используем легковесную модель для браузера
            // В реальном проекте нужно скачать модель и разместить на CDN
            console.log('Загрузка модели...');
            
            // Для демо используем простую генерацию
            // В продакшене нужно подключить ONNX модель Stable Diffusion
            this.isInitialized = true;
            console.log('Модель готова');
        } catch (error) {
            console.error('Ошибка инициализации:', error);
            this.showError('Не удалось загрузить модель');
        }
    }

    async generateImage(prompt, steps = 10) {
        if (!this.isInitialized) {
            throw new Error('Модель не загружена');
        }

        try {
            // Демо-реализация - в реальном проекте здесь будет вызов модели
            return await this.demoGeneration(prompt, steps);
        } catch (error) {
            console.error('Ошибка генерации:', error);
            throw new Error(`Ошибка генерации: ${error.message}`);
        }
    }

    async demoGeneration(prompt, steps) {
        // Имитация работы нейросети (5 секунд)
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Создаем демо-изображение на основе промпта
        return this.createDemoImage(prompt);
    }

    createDemoImage(prompt) {
        const canvas = document.createElement('canvas');
        canvas.width = 240;
        canvas.height = 240;
        const ctx = canvas.getContext('2d');

        // Создаем простую графику на основе промпта
        this.generateArtFromPrompt(ctx, prompt);
        
        return canvas;
    }

    generateArtFromPrompt(ctx, prompt) {
        const width = 240;
        const height = 240;
        
        // Очищаем canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        
        // Простая логика генерации на основе ключевых слов
        const promptLower = prompt.toLowerCase();
        
        // Фон
        if (promptLower.includes('ночь') || promptLower.includes('night')) {
            ctx.fillStyle = '#1a237e';
            ctx.fillRect(0, 0, width, height);
        } else if (promptLower.includes('закат') || promptLower.includes('sunset')) {
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, '#ff6b6b');
            gradient.addColorStop(1, '#4ecdc4');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        } else {
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, '#74b9ff');
            gradient.addColorStop(1, '#a29bfe');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        }

        // Объекты
        if (promptLower.includes('гор') || promptLower.includes('mountain')) {
            this.drawMountains(ctx);
        }
        
        if (promptLower.includes('солн') || promptLower.includes('sun')) {
            this.drawSun(ctx);
        }
        
        if (promptLower.includes('дерев') || promptLower.includes('tree')) {
            this.drawTree(ctx);
        }

        // Добавляем текст промпта
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.font = '12px Arial';
        ctx.fillText(`Prompt: ${prompt}`, 10, 20);
    }

    drawMountains(ctx) {
        ctx.fillStyle = '#2d3436';
        ctx.beginPath();
        ctx.moveTo(0, 240);
        ctx.lineTo(60, 140);
        ctx.lineTo(120, 200);
        ctx.lineTo(180, 120);
        ctx.lineTo(240, 240);
        ctx.closePath();
        ctx.fill();
    }

    drawSun(ctx) {
        ctx.fillStyle = '#fdcb6e';
        ctx.beginPath();
        ctx.arc(200, 60, 30, 0, Math.PI * 2);
        ctx.fill();
    }

    drawTree(ctx) {
        ctx.fillStyle = '#2d3436';
        ctx.fillRect(40, 160, 10, 80);
        ctx.fillStyle = '#00b894';
        ctx.beginPath();
        ctx.arc(45, 150, 25, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Инициализация приложения
class App {
    constructor() {
        this.generator = new ImageGenerator();
        this.bindEvents();
    }

    bindEvents() {
        const generateBtn = document.getElementById('generate-btn');
        const downloadBtn = document.getElementById('download-btn');
        const stepsSlider = document.getElementById('steps');
        const stepsValue = document.getElementById('steps-value');

        generateBtn.addEventListener('click', () => this.generate());
        downloadBtn.addEventListener('click', () => this.download());
        stepsSlider.addEventListener('input', (e) => {
            stepsValue.textContent = e.target.value;
        });

        // Генерация по Enter
        document.getElementById('prompt').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.generate();
            }
        });
    }

    async generate() {
        const prompt = document.getElementById('prompt').value.trim();
        const steps = parseInt(document.getElementById('steps').value);

        if (!prompt) {
            this.showError('Введите описание изображения');
            return;
        }

        this.setLoading(true);
        this.hideError();

        try {
            const canvas = await this.generator.generateImage(prompt, steps);
            this.showResult(canvas);
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(loading) {
        const loadingEl = document.getElementById('loading');
        const generateBtn = document.getElementById('generate-btn');
        
        if (loading) {
            loadingEl.classList.remove('hidden');
            generateBtn.disabled = true;
            generateBtn.textContent = 'Генерация...';
        } else {
            loadingEl.classList.add('hidden');
            generateBtn.disabled = false;
            generateBtn.textContent = 'Сгенерировать';
        }
    }

    showResult(canvas) {
        const resultEl = document.getElementById('result');
        const outputCanvas = document.getElementById('output-canvas');
        const ctx = outputCanvas.getContext('2d');

        // Копируем сгенерированное изображение
        ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
        ctx.drawImage(canvas, 0, 0);

        resultEl.classList.remove('hidden');
    }

    download() {
        const canvas = document.getElementById('output-canvas');
        const link = document.createElement('a');
        link.download = `ai-generated-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    showError(message) {
        const errorEl = document.getElementById('error');
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
    }

    hideError() {
        const errorEl = document.getElementById('error');
        errorEl.classList.add('hidden');
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
    new App();
}); 
