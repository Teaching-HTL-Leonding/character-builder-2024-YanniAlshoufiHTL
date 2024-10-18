import { Routes } from '@angular/router';
import { BuildPageComponent } from './build-page/build-page.component';
import { RandomizerPageComponent } from './randomizer-page/randomizer-page.component';

export const routes: Routes = [
  { path: 'build', component: BuildPageComponent },
  { path: 'randomizer', component: RandomizerPageComponent },
  { path: '', redirectTo: 'build', pathMatch: 'full' },
];
