import { Component, effect, inject, OnInit, signal } from '@angular/core';
import {
  CharacterApiService,
  EyeOption,
  eyeOptions,
  MouthOption,
  mouthOptions,
  RightHandOption,
  rightHandOptions,
} from '../character-api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-build-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './build-page.component.html',
  styleUrl: './build-page.component.css',
})
export class BuildPageComponent implements OnInit {
  private readonly characterApiService = inject(CharacterApiService);

  protected currentImageLink = signal('');

  eyeOptions = eyeOptions;
  mouthOptions = mouthOptions;
  rightHandOptions = rightHandOptions;

  eyeType = signal<EyeOption>(eyeOptions[0]);
  mouthType = signal<MouthOption>(mouthOptions[0]);
  rightHandType = signal<RightHandOption>(rightHandOptions[0]);
  hasHammer = signal(false);
  hasTail = signal(false);

  async ngOnInit() {
    await this.onFeelingLucky();
  }

  async onBuildImage() {
    const { url } = await this.characterApiService.buildImage(
      this.eyeType(),
      this.mouthType(),
      this.rightHandType(),
      this.hasHammer(),
      this.hasTail()
    );

    this.currentImageLink.set(url);
  }

  async onFeelingLucky() {
    const { imageOptions, url } =
      await this.characterApiService.getRandomImage();

    this.eyeType.set(imageOptions.eye);
    this.mouthType.set(imageOptions.mouth);
    this.rightHandType.set(imageOptions.rightHand);
    this.hasHammer.set(imageOptions.hasHammer);
    this.hasTail.set(imageOptions.hasTail);

    this.currentImageLink.set(url);
  }
}
