import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { forkJoin, map, Observable } from "rxjs";
import { Country } from "../models/country";
import { API_KEY } from "../api-key";

// Format brut renvoyé par l'API v5 (seulement les champs demandés)
interface ApiCountry {
  names: { common: string; official?: string };
  codes: { alpha_3: string };
  capitals?: { name: string }[];
  region: string;
  subregion?: string;
  population: number;
  area?: { kilometers: number };
  flag: { url_png: string; description: string };
}

interface ApiResponse {
  data: { objects: ApiCountry[] };
}

// Traduit un pays "format API" en pays "format de notre appli"
function toCountry(api: ApiCountry): Country {
  return {
    name: { common: api.names.common, official: api.names.official },
    cca3: api.codes.alpha_3,
    capital: api.capitals?.map((c) => c.name),
    region: api.region,
    subregion: api.subregion,
    population: api.population,
    area: api.area?.kilometers,
    flags: { png: api.flag.url_png, alt: api.flag.description },
  };
}

@Injectable({ providedIn: "root" })
export class CountryService {
  private http = inject(HttpClient);

  private readonly baseUrl = "https://api.restcountries.com/countries/v5";
  private readonly listFields =
    "names.common,codes.alpha_3,capitals,region,population,flag.url_png,flag.description";
  private readonly detailFields =
    "names.common,names.official,codes.alpha_3,capitals,region,subregion,population,area.kilometers,flag.url_png,flag.description";

  private get headers() {
    return { Authorization: `Bearer ${API_KEY}` };
  }

  private getPage(offset: number): Observable<Country[]> {
    return this.http
      .get<ApiResponse>(this.baseUrl, {
        headers: this.headers,
        params: { limit: 100, offset, response_fields: this.listFields },
      })
      .pipe(map((res) => res.data.objects.map(toCountry)));
  }

  getAll(): Observable<Country[]> {
    // 254 entrées au total, 100 max par requête : 3 pages
    return forkJoin([
      this.getPage(0),
      this.getPage(100),
      this.getPage(200),
    ]).pipe(map((pages) => pages.flat().filter((c) => c.cca3 !== "")));
  }

  getByCode(code: string): Observable<Country> {
    return this.http
      .get<ApiResponse>(`${this.baseUrl}/codes.alpha_3/${code}`, {
        headers: this.headers,
        params: { response_fields: this.detailFields },
      })
      .pipe(
        map((res) => {
          const first = res.data.objects[0];
          if (!first) {
            throw new Error("Pays introuvable");
          }
          return toCountry(first);
        }),
      );
  }
}
