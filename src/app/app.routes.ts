import { Routes } from "@angular/router";
import { CountryList } from "./pages/country-list/country-list";
import { CountryDetail } from "./pages/country-detail/country-detail";

export const routes: Routes = [
  { path: "", component: CountryList },
  { path: "country/:code", component: CountryDetail },
  { path: "**", redirectTo: "" },
];
