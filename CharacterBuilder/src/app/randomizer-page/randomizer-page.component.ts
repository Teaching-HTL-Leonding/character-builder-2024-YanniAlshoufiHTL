import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { CharacterApiService, ImageOptions } from '../character-api.service';

@Component({
  selector: 'app-randomizer-page',
  standalone: true,
  imports: [],
  templateUrl: './randomizer-page.component.html',
  styleUrl: './randomizer-page.component.css',
})
export class RandomizerPageComponent implements OnInit {
  protected currentImageLink = signal('');
  private readonly service = inject(CharacterApiService);
  private imageOptions?: ImageOptions;
  private currentScale: number = 1;

  async ngOnInit() {
    await this.onNext();
  }

  async onZoomIn() {
    const { url, newScale } = await this.service.getZoomedInImage(
      this.imageOptions!,
      this.currentScale
    );
    this.currentImageLink.set(url);
    this.currentScale = newScale;
  }

  async onZoomOut() {
    const { url, newScale } = await this.service.getZoomedOutImage(
      this.imageOptions!,
      this.currentScale
    );
    this.currentImageLink.set(url);
    this.currentScale = newScale;
  }

  async onNext() {
    const { imageOptions, url } = await this.service.getRandomImage(
      this.currentScale
    );
    this.currentImageLink.set(url);
    this.imageOptions = imageOptions;
  }
}
