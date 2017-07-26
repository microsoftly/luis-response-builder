"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
;
function createCustomEntity(entity, type, score = constants_1.DEFAULT_SCORE, startIndex = constants_1.DEFAULT_START_INDEX, endIndex = constants_1.DEFAULT_END_INDEX) {
    return {
        entity,
        type,
        score,
        startIndex,
        endIndex
    };
}
exports.createCustomEntity = createCustomEntity;
//# sourceMappingURL=Entity.js.map