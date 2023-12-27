import CypressWrapperDriver from "./cypress-wrapper-driver";
import ModalDriver from "./modal-driver";

const SERVER_ADDRESS = "http://localhost:8888/";

export default class MaputnikDriver {
  private helper = new CypressWrapperDriver();
  private modalDriver = new ModalDriver();

  public beforeAndAfter = () => {
    beforeEach(() => {
      this.given.setupInterception();
      this.when.setStyle("both");
    });
  };

  public given = {
    setupInterception: () => {
      this.helper.given.interceptGetToFile(SERVER_ADDRESS + "example-style.json");
      this.helper.given.interceptGetToFile(SERVER_ADDRESS + "example-layer-style.json");
      this.helper.given.interceptGetToFile(SERVER_ADDRESS + "geojson-style.json");
      this.helper.given.interceptGetToFile(SERVER_ADDRESS + "raster-style.json");
      this.helper.given.interceptGetToFile(SERVER_ADDRESS + "geojson-raster-style.json");

      this.helper.given.interceptAndIgnore("*example.local/*");
      this.helper.given.interceptAndIgnore("*example.com/*");
    },
  };

  public when = {
    modal: this.modalDriver.when,
    within: (selector: string, fn: () => void) => {
      this.helper.when.within(fn, selector);
    },
    tab: () => this.helper.get.elementByClassOrType("body").tab(),
    waitForExampleFileRequset: () => {
      this.helper.when.waitForResponse("example-style.json");
    },
    chooseExampleFile: () => {
      this.helper.get.elementByClassOrType("input[type='file']").selectFile(
        "cypress/fixtures/example-style.json",
        { force: true }
      );
    },
    setStyle: (
      styleProperties: "geojson" | "raster" | "both" | "layer" | "",
      zoom?: number
    ) => {
      let url = "?debug";
      switch (styleProperties) {
      case "geojson":
        url += `&style=${SERVER_ADDRESS}geojson-style.json`;
        break;
      case "raster":
        url += `&style=${SERVER_ADDRESS}raster-style.json`;
        break;
      case "both":
        url += `&style=${SERVER_ADDRESS}geojson-raster-style.json`;
        break;
      case "layer":
        url += `&style=${SERVER_ADDRESS}/example-layer-style.json`;
        break;
      }
      if (zoom) {
        url += `#${zoom}/41.3805/2.1635`;
      }
      this.helper.when.visit(SERVER_ADDRESS + url);
      if (styleProperties) {
        this.helper.when.confirmAlert();
      }
      this.helper.get.element("toolbar:link").should("be.visible");
    },

    typeKeys: (keys: string, selector?: string) => {
      if (selector) {
        this.helper.get.element(selector).type(keys);
      } else {
        this.helper.get.elementByClassOrType("body").type(keys);
      }
    },

    click: (selector: string) => {
      this.helper.when.click(selector);
    },

    clickZoomin: () => {
      this.helper.get.elementByClassOrType(".maplibregl-ctrl-zoom-in").click();
    },

    selectWithin: (selector: string, value: string) => {
      this.when.within(selector, () => {
        this.helper.get.elementByClassOrType("select").select(value);
      });
    },

    select: (selector: string, value: string) => {
      this.helper.get.element(selector).select(value);
    },

    focus: (selector: string) => {
      this.helper.when.focus(selector);
    },

    setValue: (selector: string, text: string) => {
      this.helper.get.element(selector).clear().type(text, { parseSpecialCharSequences: false });
    },
  };

  public get = {
    isMac: () => {
      return Cypress.platform === "darwin";
    },
    styleFromWindow: (win: Window) => {
      const styleId = win.localStorage.getItem("maputnik:latest_style");
      const styleItem = win.localStorage.getItem(`maputnik:style:${styleId}`);
      const obj = JSON.parse(styleItem || "");
      return obj;
    },
    exampleFileUrl: () => {
      return SERVER_ADDRESS + "example-style.json";
    },
  };

  public should = {
    canvasBeFocused: () => {
      this.when.within("maplibre:map", () => {
        this.helper.get.elementByClassOrType("canvas").should("be.focused");
      });
    },
    notExist: (selector: string) => {
      this.helper.get.elementByClassOrType(selector).should("not.exist");
    },
    beFocused: (selector: string) => {
      this.helper.get.element(selector).should("have.focus");
    },

    notBeFocused: (selector: string) => {
      this.helper.get.element(selector).should("not.have.focus");
    },

    beVisible: (selector: string) => {
      this.helper.get.element(selector).should("be.visible");
    },

    notBeVisible: (selector: string) => {
      this.helper.get.element(selector).should("not.be.visible");
    },

    equalStyleStore: (getter: (obj: any) => any, styleObj: any) => {
      cy.window().then((win: any) => {
        const obj = this.get.styleFromWindow(win);
        assert.deepEqual(getter(obj), styleObj);
      });
    },

    styleStoreEqualToExampleFileData: () => {
      cy.window().then((win: any) => {
        const obj = this.get.styleFromWindow(win);
        this.helper.given.fixture("example-style.json", "file:example-style.json").should("deep.equal", obj);
      });
    },

    exist: (selector: string) => {
      this.helper.get.element(selector).should("exist");
    },
    beSelected: (selector: string, value: string) => {
      this.helper.get.element(selector).find(`option[value="${value}"]`).should("be.selected");
    },
    containText: (selector: string, text: string) => {
      this.helper.get.element(selector).should("contain.text", text);
    }
  };
}
