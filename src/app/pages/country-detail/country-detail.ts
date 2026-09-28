import { Component, inject, signal } from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CountryService } from "../../services/country";
import { Country } from "../../models/country";
import { FavoritesService } from "../../services/favorites";

@Component({
  selector: "app-country-detail",
  imports: [RouterLink, DecimalPipe],
  templateUrl: "./country-detail.html",
  styleUrl: "./country-detail.css",
})
export class CountryDetail {
  private route = inject(ActivatedRoute);
  private countryService = inject(CountryService);
  favorites = inject(FavoritesService);

  country = signal<Country | null>(null);
  loading = signal(true);
  error = signal("");

  constructor() {
    const code = this.route.snapshot.paramMap.get("code");

    if (!code) {
      this.error.set("Aucun code de pays dans l’URL.");
      this.loading.set(false);
      return;
    }

    this.countryService.getByCode(code).subscribe({
      next: (data) => {
        this.country.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error("Erreur HTTP :", err);
        this.error.set("Impossible de charger ce pays.");
        this.loading.set(false);
      },
    });
  }
}
