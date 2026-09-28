import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideRouter } from "@angular/router";
import { CountryDetail } from "./country-detail";

describe("CountryDetail", () => {
  let fixture: ComponentFixture<CountryDetail>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [CountryDetail],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CountryDetail);
  });

  it("should create", () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
