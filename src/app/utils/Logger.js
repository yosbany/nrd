class Logger {
    static levels = {
        DEBUG: 'DEBUG',
        INFO: 'INFO',
        WARN: 'WARN',
        ERROR: 'ERROR',
        AUDIT: 'AUDIT'
    };

    // Propiedad estática para habilitar o deshabilitar los logs
    static isEnabled = true;

    static log(level, message, details = undefined) {
        if (!this.isEnabled) {
            return; // No hacer nada si los logs están deshabilitados
        }

        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}][${level}] ${message}`;

        if (details) {
            switch (level) {
                case this.levels.DEBUG:
                    console.debug(logMessage, details);
                    break;
                case this.levels.INFO:
                    console.info(logMessage, details);
                    break;
                case this.levels.WARN:
                    console.warn(logMessage, details);
                    break;
                case this.levels.ERROR:
                    console.error(logMessage, details);
                    break;
                case this.levels.AUDIT:
                    console.info(logMessage, details);
                    break;
                default:
                    console.log(logMessage, details);
                    break;
            }
        } else {
            switch (level) {
                case this.levels.DEBUG:
                    console.debug(logMessage);
                    break;
                case this.levels.INFO:
                    console.info(logMessage);
                    break;
                case this.levels.WARN:
                    console.warn(logMessage);
                    break;
                case this.levels.ERROR:
                    console.error(logMessage);
                    break;
                case this.levels.AUDIT:
                    console.info(logMessage);
                    break;
                default:
                    console.log(logMessage);
                    break;
            }
        }
    }

    static debug(message, details = {}) {
        this.log(this.levels.DEBUG, message, details);
    }

    static info(message, details = {}) {
        this.log(this.levels.INFO, message, details);
    }

    static warn(message, details = {}) {
        this.log(this.levels.WARN, message, details);
    }

    static error(message, details = {}) {
        this.log(this.levels.ERROR, message, details);
    }

    static audit(message, details = {}) {
        this.log(this.levels.AUDIT, message, details);
    }
}

export default Logger;
