import { TestBed } from "@angular/core/testing";
import { FavoritesService } from "./favorites";

describe("FavoritesService", () => {
  let service: FavoritesService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("ajoute puis retire un favori", () => {
    service.toggle("FRA");
    expect(service.isFavorite("FRA")).toBe(true);

    service.toggle("FRA");
    expect(service.isFavorite("FRA")).toBe(false);
  });
});
