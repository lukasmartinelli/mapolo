import { v1 as uuid } from "uuid";
import MaputnikDriver from "./maputnik-driver";

describe("layers", () => {
  let { beforeAndAfter, when, should } = new MaputnikDriver();
  beforeAndAfter();
  beforeEach(() => {
    when.setStyle("both");
    when.modal.open();
  });

  describe("ops", () => {
    it("delete", () => {
      let id = when.modal.fillLayers({
        type: "background",
      });

      should.equalStyleStore(
        (a: any) => a.layers,
        [
          {
            id: id,
            type: "background",
          },
        ]
      );

      when.click("layer-list-item:" + id + ":delete");

      should.equalStyleStore((a: any) => a.layers, []);
    });

    it("duplicate", () => {
      let id = when.modal.fillLayers({
        type: "background",
      });

      should.equalStyleStore(
        (a: any) => a.layers,
        [
          {
            id: id,
            type: "background",
          },
        ]
      );

      when.click("layer-list-item:" + id + ":copy");

      should.equalStyleStore(
        (a: any) => a.layers,
        [
          {
            id: id + "-copy",
            type: "background",
          },
          {
            id: id,
            type: "background",
          },
        ]
      );
    });

    it("hide", () => {
      let id = when.modal.fillLayers({
        type: "background",
      });

      should.equalStyleStore(
        (a: any) => a.layers,
        [
          {
            id: id,
            type: "background",
          },
        ]
      );

      when.click("layer-list-item:" + id + ":toggle-visibility");

      should.equalStyleStore(
        (a: any) => a.layers,
        [
          {
            id: id,
            type: "background",
            layout: {
              visibility: "none",
            },
          },
        ]
      );

      when.click("layer-list-item:" + id + ":toggle-visibility");

      should.equalStyleStore(
        (a: any) => a.layers,
        [
          {
            id: id,
            type: "background",
            layout: {
              visibility: "visible",
            },
          },
        ]
      );
    });
  });

  describe("background", () => {
    it("add", () => {
      let id = when.modal.fillLayers({
        type: "background",
      });

      should.equalStyleStore(
        (a: any) => a.layers,
        [
          {
            id: id,
            type: "background",
          },
        ]
      );
    });

    describe("modify", () => {
      function createBackground() {
        // Setup
        let id = uuid();

        when.selectWithin("add-layer.layer-type", "background");
        when.setValue("add-layer.layer-id.input", "background:" + id);

        when.click("add-layer");

        should.equalStyleStore(
          (a: any) => a.layers,
          [
            {
              id: "background:" + id,
              type: "background",
            },
          ]
        );
        return id;
      }

      // ====> THESE SHOULD BE FROM THE SPEC
      describe("layer", () => {
        it("expand/collapse");
        it("id", () => {
          let bgId = createBackground();

          when.click("layer-list-item:background:" + bgId);

          let id = uuid();
          when.setValue("layer-editor.layer-id.input", "foobar:" + id);
          when.click("min-zoom");

          should.equalStyleStore(
            (a: any) => a.layers,
            [
              {
                id: "foobar:" + id,
                type: "background",
              },
            ]
          );
        });

        it("min-zoom", () => {
          let bgId = createBackground();

          when.click("layer-list-item:background:" + bgId);
          when.setValue("min-zoom.input-text", "1");

          when.click("layer-editor.layer-id");

          should.equalStyleStore(
            (a: any) => a.layers,
            [
              {
                id: "background:" + bgId,
                type: "background",
                minzoom: 1,
              },
            ]
          );

          // AND RESET!
          when.typeKeys("{backspace}", "min-zoom.input-text");
          when.click("max-zoom.input-text");

          should.equalStyleStore((a: any) => a.layers, [{
            "id": 'background:'+bgId,
            "type": 'background'
          }]);
        });

        it("max-zoom", () => {
          let bgId = createBackground();

          when.click("layer-list-item:background:" + bgId);
          when.setValue("max-zoom.input-text", "1");

          when.click("layer-editor.layer-id");

          should.equalStyleStore(
            (a: any) => a.layers,
            [
              {
                id: "background:" + bgId,
                type: "background",
                maxzoom: 1,
              },
            ]
          );
        });

        it("comments", () => {
          let bgId = createBackground();
          let comment = "42";

          when.click("layer-list-item:background:" + bgId);
          when.setValue("layer-comment.input", comment);

          when.click("layer-editor.layer-id");

          should.equalStyleStore(
            (a: any) => a.layers,
            [
              {
                id: "background:" + bgId,
                type: "background",
                metadata: {
                  "maputnik:comment": comment,
                },
              },
            ]
          );

          // Unset it again.
          when.typeKeys("{backspace}{backspace}", "layer-comment.input");
          when.click("min-zoom.input-text");

          should.equalStyleStore((a: any) => a.layers, [{
            "id": 'background:' + bgId,
            "type": 'background'
          }]);
        });

        it("color", () => {
          let bgId = createBackground();

          when.click("layer-list-item:background:" + bgId);

          when.click("spec-field:background-color");

          should.equalStyleStore(
            (a: any) => a.layers,
            [
              {
                id: "background:" + bgId,
                type: "background",
              },
            ]
          );
        });
      });

      describe("filter", () => {
        it("expand/collapse");
        it("compound filter");
      });

      describe("paint", () => {
        it("expand/collapse");
        it("color");
        it("pattern");
        it("opacity");
      });
      // <=====

      describe("json-editor", () => {
        it("expand/collapse");
        it("modify");

        // TODO
        it.skip("parse error", () => {
          let bgId = createBackground();

          when.click("layer-list-item:background:" + bgId);

          let errorSelector = ".CodeMirror-lint-marker-error";
          should.notExist(errorSelector);

          when.click(".CodeMirror");
          when.typeKeys(
            "\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013 {"
          );
          should.exist(errorSelector);
        });
      });
    });
  });

  describe("fill", () => {
    it("add", () => {
      let id = when.modal.fillLayers({
        type: "fill",
        layer: "example",
      });

      should.equalStyleStore(
        (a: any) => a.layers,
        [
          {
            id: id,
            type: "fill",
            source: "example",
          },
        ]
      );
    });

    // TODO: Change source
    it("change source");
  });

  describe("line", () => {
    it("add", () => {
      let id = when.modal.fillLayers({
        type: "line",
        layer: "example",
      });

      should.equalStyleStore(
        (a: any) => a.layers,
        [
          {
            id: id,
            type: "line",
            source: "example",
          },
        ]
      );
    });

    it("groups", () => {
      // TODO
      // Click each of the layer groups.
    });
  });

  describe("symbol", () => {
    it("add", () => {
      let id = when.modal.fillLayers({
        type: "symbol",
        layer: "example",
      });

      should.equalStyleStore(
        (a: any) => a.layers,
        [
          {
            id: id,
            type: "symbol",
            source: "example",
          },
        ]
      );
    });
  });

  describe("raster", () => {
    it("add", () => {
      let id = when.modal.fillLayers({
        type: "raster",
        layer: "raster",
      });

      should.equalStyleStore(
        (a: any) => a.layers,
        [
          {
            id: id,
            type: "raster",
            source: "raster",
          },
        ]
      );
    });
  });

  describe("circle", () => {
    it("add", () => {
      let id = when.modal.fillLayers({
        type: "circle",
        layer: "example",
      });

      should.equalStyleStore(
        (a: any) => a.layers,
        [
          {
            id: id,
            type: "circle",
            source: "example",
          },
        ]
      );
    });
  });

  describe("fill extrusion", () => {
    it("add", () => {
      let id = when.modal.fillLayers({
        type: "fill-extrusion",
        layer: "example",
      });

      should.equalStyleStore(
        (a: any) => a.layers,
        [
          {
            id: id,
            type: "fill-extrusion",
            source: "example",
          },
        ]
      );
    });
  });

  describe("groups", () => {
    it("simple", () => {
      when.setStyle("geojson");

      when.modal.open();
      when.modal.fillLayers({
        id: "foo",
        type: "background",
      });

      when.modal.open();
      when.modal.fillLayers({
        id: "foo_bar",
        type: "background",
      });

      when.modal.open();
      when.modal.fillLayers({
        id: "foo_bar_baz",
        type: "background",
      });

      should.beVisible("layer-list-item:foo");

      should.notBeVisible("layer-list-item:foo_bar");
      should.notBeVisible("layer-list-item:foo_bar_baz");

      when.click("layer-list-group:foo-0");

      should.beVisible("layer-list-item:foo");
      should.beVisible("layer-list-item:foo_bar");
      should.beVisible("layer-list-item:foo_bar_baz");
    });
  });
});
