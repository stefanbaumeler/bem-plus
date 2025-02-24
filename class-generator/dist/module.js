(function webpackUniversalModuleDefinition(root, factory) {

        if(typeof exports === 'object' && typeof module === 'object') {
            module.exports = factory();
        }else if(typeof define === 'function' && define.amd) {
            
            define([], factory);

            } else {
            var a = factory();

            for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];

        }

        })(this, () => {
            return (() => { // webpackBootstrap
"use strict";
// The require scope
var __webpack_require__ = {};

/************************************************************************/
// webpack/runtime/define_property_getters
(() => {
__webpack_require__.d = function(exports, definition) {
	for(var key in definition) {
        if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
            Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
        }
    }
};
})();
// webpack/runtime/has_own_property
(() => {
__webpack_require__.o = function (obj, prop) {
	return Object.prototype.hasOwnProperty.call(obj, prop);
};

})();
// webpack/runtime/make_namespace_object
(() => {
// define __esModule on exports
__webpack_require__.r = function(exports) {
	if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
	}
	Object.defineProperty(exports, '__esModule', { value: true });
};

})();
/************************************************************************/
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  BemPlusModule: function() { return BemPlusModule; }
});
class BemPlusModule {
    constructor(rootElement, k) {
        var _a;
        this.index = 0;
        this.refresh = () => { };
        if (k) {
            this.index = k;
        }
        this.type = this.constructor.name;
        this.rootClass = (_a = rootElement.classList[0]) === null || _a === void 0 ? void 0 : _a.split('__')[0];
        new MutationObserver(() => {
            this.refresh();
        }).observe(rootElement, {
            childList: true,
            subtree: true
        });
    }
}

return __webpack_exports__;
})()

});
//# sourceMappingURL=module.js.map