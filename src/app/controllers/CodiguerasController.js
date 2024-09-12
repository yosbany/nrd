import Logger from '../utils/Logger.js';
import CodiguerasModel from '../models/CodiguerasModel.js';

const CodiguerasController = {
    codigueras: [],
    selectedCodiguera: null,

    async oninit(vnode) {
        try {
            Logger.info("[Audit][CodiguerasController] Initialized.");
            this.codigueras = await CodiguerasModel.findAll();
            m.redraw();
        } catch (error) {
            Logger.error("[Audit][CodiguerasController] Error during initialization:", error);
            m.redraw();
        }
    },

    async addCodiguera(codiguera) {
        try {
            // Guardar la codiguera
            await CodiguerasModel.save(null, codiguera);
            this.codigueras = await CodiguerasModel.findAll();

            Logger.info(`[Audit][CodiguerasController] Codiguera added: ${codiguera.name}`);
            m.redraw();
        } catch (error) {
            Logger.error("[Audit][CodiguerasController] Error adding codiguera:", error);
        }
    },

    async deleteCodiguera(codigueraId) {
        try {
            await CodiguerasModel.delete(codigueraId); // Eliminar la codiguera de Firebase
            this.codigueras = this.codigueras.filter(c => c.id !== codigueraId);
            Logger.info(`[Audit][CodiguerasController] Codiguera deleted: ${codigueraId}`);
            m.redraw();
        } catch (error) {
            Logger.error("[Audit][CodiguerasController] Error deleting codiguera:", error);
        }
    },

    async editCodiguera(id, newCodigueraData) {
        try {
            await CodiguerasModel.save(id, newCodigueraData); // Actualizar la codiguera en Firebase
            this.codigueras = this.codigueras.map(c =>
                c.id === id ? { id, ...newCodigueraData } : c
            );
            Logger.info(`[Audit][CodiguerasController] Codiguera edited: ${newCodigueraData.name}`);
            m.redraw();
        } catch (error) {
            Logger.error("[Audit][CodiguerasController] Error editing codiguera:", error);
        }
    },

    applyFilter(vnode) {
        const filterText = vnode.state.filterText.toLowerCase();
        return CodiguerasController.codigueras.filter(codiguera => 
            codiguera.name.toLowerCase().includes(filterText) || 
            (codiguera.parent && codiguera.parent.toLowerCase().includes(filterText))
        );
    },
};

export default CodiguerasController;
