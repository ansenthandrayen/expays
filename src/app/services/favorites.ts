import { computed, Injectable, signal } from "@angular/core";

const STORAGE_KEY = "explorateur-pays-favoris";

@Injectable({ providedIn: "root" })
export class FavoritesService {
  // La liste des codes de pays favoris (ex. ['FRA', 'MUS'])
  private codes = signal<string[]>(this.load());

  readonly favorites = this.codes.asReadonly();
  readonly count = computed(() => this.codes().length);

  isFavorite(code: string): boolean {
    return this.codes().includes(code);
  }

  toggle(code: string): void {
    this.codes.update((list) =>
      list.includes(code) ? list.filter((c) => c !== code) : [...list, code],
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.codes()));
  }

  private load(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
