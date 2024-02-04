import { MaputnikDriver } from "./maputnik-driver";

describe("map", () => {
  let { beforeAndAfter, get, when, then } = new MaputnikDriver();
  beforeAndAfter();
  describe("zoom level", () => {
    it("via url", () => {
      let zoomLevel = 12.37;
      when.setStyle("geojson", zoomLevel);
      then(get.elementByTestId("maplibre:ctrl-zoom")).shouldBeVisible();
      then(get.elementByTestId("maplibre:ctrl-zoom")).shouldContainText(
        "Zoom: " + zoomLevel
      );
    });

    it("via map controls", () => {
      let zoomLevel = 12.37;
      when.setStyle("geojson", zoomLevel);
      then(get.elementByTestId("maplibre:ctrl-zoom")).shouldBeVisible();
      when.clickZoomIn();
      then(get.elementByTestId("maplibre:ctrl-zoom")).shouldContainText(
        "Zoom: " + (zoomLevel + 1)
      );
    });
  });
  
  describe("search", () => {
    it('should exist', () => {
      then(get.searchControl()).shouldBeVisible();
    });
  });
});
