import { Component, computed, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { CountryService } from "../../services/country";
import { Country } from "../../models/country";
import { RouterLink } from "@angular/router";
import { FavoritesService } from "../../services/favorites";

@Component({
  selector: "app-country-list",
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./country-list.html",
  styleUrl: "./country-list.css",
})
export class CountryList {
  private countryService = inject(CountryService);
  favorites = inject(FavoritesService);

  countries = signal<Country[]>([]);
  loading = signal(true);
  error = signal("");

  // Deux champs de formulaire, avec une valeur de départ vide
  searchControl = new FormControl("", { nonNullable: true });
  regionControl = new FormControl("", { nonNullable: true });

  // On transforme leurs valeurs (des Observables) en signals
  search = toSignal(this.searchControl.valueChanges, { initialValue: "" });
  region = toSignal(this.regionControl.valueChanges, { initialValue: "" });

  // Liste des régions, déduite des pays chargés (sans doublons, triée)
  regions = computed(() =>
    [...new Set(this.countries().map((c) => c.region))]
      .filter((r) => r !== "")
      .sort(),
  );

  // Liste filtrée : se recalcule toute seule quand un des signals change + avec favoris placé en haut
  filteredCountries = computed(() => {
    const term = this.search().trim().toLowerCase();
    const region = this.region();
    return this.countries()
      .filter(
        (c) =>
          c.name.common.toLowerCase().includes(term) &&
          (region === "" || c.region === region),
      )
      .sort(
        (a, b) =>
          Number(this.favorites.isFavorite(b.cca3)) -
          Number(this.favorites.isFavorite(a.cca3)),
      );
  });

  constructor() {
    this.countryService.getAll().subscribe({
      next: (data) => {
        this.countries.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error("Erreur HTTP :", err);
        this.error.set("Impossible de charger les pays.");
        this.loading.set(false);
      },
    });
  }
}
