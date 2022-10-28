var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const Globals = {
  scroll: 0,
  rafActive: true,
  rafId: 0,
  renderedInitially: false,
  config: {
    options: {
      observerRootMargin: "100px"
    },
    drivers: {}
  },
  reset() {
    Globals.scroll = 0;
    Globals.rafActive = true;
    Globals.rafId = 0;
    Globals.renderedInitially = false;
  },
  initConfig(config) {
    var _a, _b, _c;
    Globals.config = {
      options: { ...Globals.config.options, ...config.options },
      drivers: (_a = config.drivers) != null ? _a : {},
      hooks: (_b = config.hooks) != null ? _b : {},
      elements: (_c = config.elements) != null ? _c : {}
    };
  }
};
function throwError(message) {
  throw new Error(message);
}
function supersonicToFixed(number, precision) {
  precision = 10 ** precision;
  return ~~(number * precision) / precision;
}
const _Property = class {
  constructor({ driverId, cssProperty, start, end, unit, hooks }) {
    __publicField(this, "driver");
    __publicField(this, "cssProperty");
    __publicField(this, "id");
    __publicField(this, "start");
    __publicField(this, "end");
    __publicField(this, "hooks");
    __publicField(this, "value", -1);
    __publicField(this, "data", {});
    __publicField(this, "unit");
    __publicField(this, "elements", /* @__PURE__ */ new Set());
    this.cssProperty = cssProperty;
    this.start = start;
    this.end = end;
    this.unit = unit != null ? unit : "";
    this.hooks = hooks != null ? hooks : {};
    this.id = `${driverId}---${cssProperty}`;
    this.driver = Driver.instances.get(driverId);
    _Property.instances.set(this.id, this);
    this.driver.properties.add(this);
    if (this.hooks.onInit)
      this.hooks.onInit(this);
  }
  render() {
    this.value = this.calculateValue();
    if (this.hooks.onBeforeRender)
      this.hooks.onBeforeRender(this);
    for (let element of this.elements) {
      element.addProperty(this);
    }
    if (this.hooks.onAfterRender)
      this.hooks.onAfterRender(this);
  }
  calculateValue() {
    let start = this.start instanceof Function ? this.start(this) : this.start;
    let end = this.end instanceof Function ? this.end(this) : this.end;
    const value = this.driver.progress * (end - start) + start;
    let precision = 2;
    if (this.unit === "px")
      precision = 1;
    return supersonicToFixed(value, precision);
  }
  updateLimits() {
    if (this.hooks.onUpdateLimits)
      this.hooks.onUpdateLimits(this);
  }
  static init({ drivers }) {
    for (let driverId in drivers) {
      if ("properties" in drivers[driverId]) {
        if ("default" in drivers[driverId].properties) {
          const rules = Object.keys(drivers[driverId].properties);
          let match = "default";
          for (let rule of rules) {
            if (rule !== "default" && matchMedia(rule).matches)
              match = rule;
          }
          drivers[driverId].properties = drivers[driverId].properties[match];
        }
        let properties = drivers[driverId].properties;
        for (let cssProperty in properties) {
          const data = properties[cssProperty];
          new _Property({
            driverId,
            cssProperty,
            start: data.start,
            end: data.end,
            unit: data.unit,
            hooks: data.hooks
          });
        }
      }
    }
  }
  static uninit() {
    _Property.instances.clear();
  }
};
let Property = _Property;
__publicField(Property, "instances", /* @__PURE__ */ new Map());
const _Element = class {
  constructor({ id, hooks }) {
    __publicField(this, "id");
    __publicField(this, "domElements");
    __publicField(this, "hooks");
    __publicField(this, "data", {});
    __publicField(this, "properties", /* @__PURE__ */ new Map());
    __publicField(this, "translate3d", {
      translateX: "0",
      translateY: "0",
      translateZ: "0"
    });
    this.id = id;
    this.hooks = hooks != null ? hooks : {};
    this.initDomElements();
    this.saveInitialTranslate();
    _Element.instances.set(this.id, this);
    if (this.hooks.onInit)
      this.hooks.onInit(this);
  }
  saveInitialTranslate() {
    const matrix = window.getComputedStyle(this.domElements[0]).transform;
    if (matrix.includes("matrix")) {
      const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(", ");
      const matrixType = matrix.includes("3d") ? "3d" : "2d";
      this.translate3d = {
        translateX: (matrixType === "2d" ? matrixValues[4] : matrixValues[12]) + "px",
        translateY: (matrixType === "2d" ? matrixValues[5] : matrixValues[13]) + "px",
        translateZ: (matrixType === "2d" ? "0" : matrixValues[14]) + "px"
      };
    }
  }
  initDomElements() {
    this.domElements = Array.from(document.querySelectorAll(this.id));
    if (this.domElements.length === 0)
      throwError(`Can't find Element: "${this.id}"`);
    this.domElements.forEach((domElement) => {
      domElement.setAttribute("data-supersonic-type", "element");
      domElement.setAttribute("data-supersonic-element-id", this.id);
    });
  }
  render() {
    if (this.hooks.onBeforeRender)
      this.hooks.onBeforeRender(this);
    const flatProperties = this.calculateFlatProperties();
    for (let property in flatProperties) {
      this.domElements.forEach((domElement) => {
        domElement.style.setProperty(property, flatProperties[property]);
      });
    }
    if (this.hooks.onAfterRender)
      this.hooks.onAfterRender(this);
  }
  addProperty(property) {
    if (!Globals.renderedInitially) {
      const currentProperty = this.properties.get(property.cssProperty);
      if (currentProperty) {
        const distanceNew = property.driver.initialDistanceToScroll;
        const distanceOld = currentProperty.driver.initialDistanceToScroll;
        const negativeNew = distanceNew < 0 ? true : false;
        const negativeOld = distanceOld < 0 ? true : false;
        let stopAdding = false;
        if (!negativeNew && !negativeOld)
          stopAdding = distanceNew > distanceOld;
        else if (!negativeNew && negativeOld)
          stopAdding = distanceNew < distanceOld;
        if (stopAdding)
          return;
      }
    }
    this.properties.set(property.cssProperty, property);
    if (this.hooks.onAddProperty)
      this.hooks.onAddProperty(this, property);
  }
  calculateFlatProperties() {
    const flatProperties = {};
    let translateValuesDirty = false;
    for (let property of this.properties.values()) {
      const { cssProperty, value, unit } = property;
      const valueWithUnit = value + unit;
      if (_Element.translate3dKeys.includes(cssProperty)) {
        this.translate3d[cssProperty] = valueWithUnit;
        translateValuesDirty = true;
      } else if (cssProperty === "scale") {
        flatTransformSecure(flatProperties);
        flatProperties.transform += `scale3d(${valueWithUnit}, ${valueWithUnit}, ${valueWithUnit}) `;
      } else if (_Element.transformKeys.includes(cssProperty)) {
        flatTransformSecure(flatProperties);
        flatProperties.transform += `${cssProperty}(${valueWithUnit}) `;
      } else {
        flatProperties[cssProperty] = valueWithUnit;
      }
    }
    if (translateValuesDirty) {
      flatTransformSecure(flatProperties);
      flatProperties.transform += `translate3d(${this.translate3d.translateX}, ${this.translate3d.translateY}, ${this.translate3d.translateZ}) `;
    }
    return flatProperties;
  }
  updateLimits(driver) {
    if (this.hooks.onUpdateLimits)
      this.hooks.onUpdateLimits(this, driver);
  }
  static init({ drivers, elements }) {
    for (let driverId in drivers) {
      const driver = Driver.instances.get(driverId);
      const properties = drivers[driverId].properties;
      for (let cssProperty in properties) {
        const property = Property.instances.get(`${driverId}---${cssProperty}`);
        for (let selector of properties[cssProperty].elements) {
          let element = _Element.instances.get(selector);
          if (!element) {
            let hooks = void 0;
            if (elements && elements[selector] && elements[selector].hooks)
              hooks = elements[selector].hooks;
            element = new _Element({ id: selector, hooks });
          }
          driver.elements.add(element);
          property.elements.add(element);
        }
      }
    }
  }
  static uninit() {
    _Element.instances.clear();
  }
  static render() {
    for (let element of _Element.activeInstances.values()) {
      element.render();
    }
    _Element.activeInstances.clear();
  }
};
let Element = _Element;
__publicField(Element, "instances", /* @__PURE__ */ new Map());
__publicField(Element, "activeInstances", /* @__PURE__ */ new Set());
__publicField(Element, "transformKeys", [
  "perspective",
  "scaleX",
  "scaleY",
  "scale",
  "skewX",
  "skewY",
  "skew",
  "rotateX",
  "rotateY",
  "rotate"
]);
__publicField(Element, "translate3dKeys", ["translateX", "translateY", "translateZ"]);
function flatTransformSecure(properties) {
  if (!properties.transform)
    properties.transform = "";
}
const _Driver = class {
  constructor({ id, hooks }) {
    __publicField(this, "id");
    __publicField(this, "progress", 0);
    __publicField(this, "active", false);
    __publicField(this, "initialDistanceToScroll", 0);
    __publicField(this, "data", {});
    __publicField(this, "start");
    __publicField(this, "end");
    __publicField(this, "properties", /* @__PURE__ */ new Set());
    __publicField(this, "elements", /* @__PURE__ */ new Set());
    __publicField(this, "helper");
    __publicField(this, "hooks");
    this.id = id;
    this.hooks = hooks != null ? hooks : {};
    this.initBorders();
    this.helper = new DriverHelper({ driver: this });
    _Driver.instances.set(id, this);
    if (this.hooks.onInit)
      this.hooks.onInit(this);
  }
  initBorders() {
    const driverSelector = `[data-supersonic-driver="${this.id}"]`;
    const selectorStart = `${driverSelector}[data-supersonic-type="start"]`;
    const selectorEnd = `${driverSelector}[data-supersonic-type="end"]`;
    this.start = new DriverBorder({
      domElement: document.querySelector(selectorStart),
      selector: selectorStart
    });
    this.end = new DriverBorder({
      domElement: document.querySelector(selectorEnd),
      selector: selectorEnd
    });
  }
  render() {
    const oldProgress = this.progress;
    this.progress = this.calculateProgress();
    if (this.hooks.onBeforeRender)
      this.hooks.onBeforeRender(this);
    if (oldProgress !== this.progress || !Globals.renderedInitially) {
      for (let property of this.properties) {
        property.render();
      }
      for (let element of this.elements) {
        Element.activeInstances.add(element);
      }
      if (this.hooks.onAfterRender)
        this.hooks.onAfterRender(this);
    }
  }
  calculateProgress() {
    let progress = (Globals.scroll - this.start.top) / (this.end.top - this.start.top);
    if (progress < 0)
      progress = 0;
    else if (progress > 1)
      progress = 1;
    else
      progress = supersonicToFixed(progress, 4);
    return progress;
  }
  updateLimits() {
    this.start.updateLimits();
    this.end.updateLimits();
    if (this.end.top < this.start.top)
      this.end.top += window.innerHeight;
    this.helper.updateLimits();
    for (let property of this.properties) {
      property.updateLimits();
    }
    for (let element of this.elements) {
      element.updateLimits(this);
    }
    if (this.hooks.onUpdateLimits)
      this.hooks.onUpdateLimits(this);
  }
  activate() {
    this.active = true;
    _Driver.activeInstances.add(this);
    if (this.hooks.onActivation)
      this.hooks.onActivation(this);
  }
  deactivate() {
    this.active = false;
    _Driver.activeInstances.delete(this);
    if (this.hooks.onDeactivation)
      this.hooks.onDeactivation(this);
  }
  static init({ drivers }) {
    for (let id in drivers) {
      new _Driver({
        id,
        hooks: drivers[id].hooks
      });
    }
  }
  static uninit() {
    for (let driver of _Driver.instances.values()) {
      driver.helper.uninit();
    }
    _Driver.instances.clear();
  }
  static render({ useActiveDrivers }) {
    const drivers = useActiveDrivers ? _Driver.activeInstances.values() : _Driver.instances.values();
    for (let driver of drivers) {
      if (!Globals.renderedInitially)
        driver.initialDistanceToScroll = driver.end.top - Globals.scroll;
      driver.render();
    }
  }
  static updateLimits() {
    for (let driver of _Driver.instances.values()) {
      driver.updateLimits();
    }
  }
};
let Driver = _Driver;
__publicField(Driver, "instances", /* @__PURE__ */ new Map());
__publicField(Driver, "activeInstances", /* @__PURE__ */ new Set());
class DriverBorder {
  constructor({ domElement, selector }) {
    __publicField(this, "domElement");
    __publicField(this, "top", 0);
    __publicField(this, "edge", "bottom");
    if (!domElement) {
      throwError(`Can't find DOM element: ${selector}"]`);
    }
    if (domElement.dataset.supersonicEdge === "top")
      this.edge = "top";
    this.domElement = domElement;
  }
  updateLimits() {
    this.top = this.domElement.getBoundingClientRect().top + Globals.scroll;
    if (this.edge === "bottom")
      this.top -= window.innerHeight;
  }
}
const _DriverHelper = class {
  constructor({ driver }) {
    __publicField(this, "domElement");
    __publicField(this, "driver");
    this.driver = driver;
    this.domElement = document.createElement("i");
    for (let cssProperty in _DriverHelper.styles) {
      this.domElement.style.setProperty(cssProperty, _DriverHelper.styles[cssProperty]);
    }
    this.domElement.setAttribute("data-supersonic-driver", driver.id);
    this.domElement.setAttribute("data-supersonic-type", "helper");
    this.domElement.classList.add("supersonic-helper");
    document.body.appendChild(this.domElement);
  }
  updateLimits() {
    let top = this.driver.start.top;
    let end = this.driver.end.top;
    if (this.driver.start.edge === "bottom")
      top += window.innerHeight;
    if (this.driver.end.edge === "bottom")
      end += window.innerHeight;
    this.domElement.style.setProperty("top", top + "px");
    this.domElement.style.setProperty("height", end - top + "px");
  }
  uninit() {
    this.domElement.remove();
  }
};
let DriverHelper = _DriverHelper;
__publicField(DriverHelper, "styles", {
  position: "absolute",
  left: 0,
  width: "1px"
});
class Observer {
  constructor(observables) {
    __publicField(this, "instance");
    this.instance = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target;
          const driverId = target.dataset.supersonicDriver;
          const driver = Driver.instances.get(driverId);
          if (!driver) {
            throwError(`Observer can't find driver "${driverId}"`);
            return;
          }
          if (entry.isIntersecting) {
            driver.activate();
          } else {
            driver.deactivate();
          }
        });
      },
      {
        rootMargin: Globals.config.options.observerRootMargin
      }
    );
    observables.forEach((observable) => {
      this.instance.observe(observable);
    });
  }
  uninit() {
    this.instance.disconnect();
  }
}
class TheSuperSonicPluginForScrollBasedAnimation {
  constructor(config) {
    __publicField(this, "observer", null);
    __publicField(this, "resizeWrapper", null);
    var _a;
    Globals.initConfig(config);
    this.initInstances();
    this.updateLimits();
    this.initObserver();
    this.addEventListeners();
    this.render({ useActiveDrivers: false });
    Globals.renderedInitially = true;
    if ((_a = Globals.config.hooks) == null ? void 0 : _a.onInit)
      Globals.config.hooks.onInit(this);
  }
  uninit() {
    Driver.uninit();
    Property.uninit();
    Element.uninit();
    this.removeEventListeners();
    this.observer.uninit();
    this.observer = null;
    Globals.reset();
  }
  initInstances() {
    const drivers = Globals.config.drivers;
    const elements = Globals.config.elements;
    Driver.init({ drivers });
    Property.init({ drivers });
    Element.init({ drivers, elements });
  }
  initObserver() {
    const observables = Array.from(document.querySelectorAll('[data-supersonic-type="helper"]'));
    this.observer = new Observer(observables);
  }
  render({ useActiveDrivers }) {
    const hooks = Globals.config.hooks;
    if (Globals.rafActive) {
      this.updateScroll();
      if (hooks.onBeforeRender)
        hooks.onBeforeRender();
      Driver.render({ useActiveDrivers });
      Element.render();
      Globals.rafId = requestAnimationFrame(() => {
        this.render({ useActiveDrivers: true });
      });
      if (hooks.onAfterRender)
        hooks.onAfterRender();
    }
  }
  updateLimits() {
    this.updateScroll();
    Driver.updateLimits();
    if (Globals.config.hooks.onUpdateLimits)
      Globals.config.hooks.onUpdateLimits();
  }
  updateScroll() {
    Globals.scroll = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
  }
  addEventListeners() {
    this.resizeWrapper = debounce(() => {
      Globals.rafActive = true;
      this.updateLimits();
      this.render({ useActiveDrivers: false });
    });
    window.addEventListener("resize", this.onResize.bind(this));
  }
  removeEventListeners() {
    window.removeEventListener("resize", this.onResize);
  }
  onResize() {
    cancelAnimationFrame(Globals.rafId);
    Globals.rafActive = false;
    this.resizeWrapper();
  }
}
__publicField(TheSuperSonicPluginForScrollBasedAnimation, "Driver", Driver);
__publicField(TheSuperSonicPluginForScrollBasedAnimation, "Property", Property);
__publicField(TheSuperSonicPluginForScrollBasedAnimation, "Element", Element);
__publicField(TheSuperSonicPluginForScrollBasedAnimation, "Globals", Globals);
function debounce(func) {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this);
    }, 500);
  };
}
export {
  TheSuperSonicPluginForScrollBasedAnimation as default
};
