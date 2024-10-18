import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export const eyeOptions = ['NoEye', 'HalfOpen', 'Closed', 'Open'] as const;
export const mouthOptions = ['NoMouth', 'Happy', 'Normal', 'Unhappy'] as const;
export const rightHandOptions = ['NoHand', 'Normal', 'Victory'] as const;
export type EyeOption = (typeof eyeOptions)[number];
export type MouthOption = (typeof mouthOptions)[number];
export type RightHandOption = (typeof rightHandOptions)[number];

export type ImageOptions = {
  eye: EyeOption;
  hasHammer: boolean;
  mouth: MouthOption;
  rightHand: RightHandOption;
  hasTail: boolean;
};

export type ScalingResponse = {
  url: string;
  newScale: number;
};

@Injectable({
  providedIn: 'root',
})
export class CharacterApiService {
  httpClient = inject(HttpClient);

  private static host: string = 'http://localhost:5110';

  async buildImage(
    eyeType: EyeOption,
    mouthType: MouthOption,
    rightHandType: RightHandOption,
    hasHammer: boolean,
    hasTail: boolean
  ): Promise<{ url: string }> {
    const imageOptions: ImageOptions = {
      eye: eyeType,
      mouth: mouthType,
      rightHand: rightHandType,
      hasHammer,
      hasTail,
    };

    return await firstValueFrom(
      this.httpClient.post<{ url: string }>(
        `${CharacterApiService.host}/build-image-url`,
        imageOptions
      )
    );
  }

  async buildImageFromImageOptions(
    imageOptions: ImageOptions
  ): Promise<{ url: string }> {
    const urlObj = await this.buildImage(
      imageOptions.eye,
      imageOptions.mouth,
      imageOptions.rightHand,
      imageOptions.hasHammer,
      imageOptions.hasTail
    );

    return urlObj;
  }

  async getRandomImage(
    currentScale: number | undefined = undefined
  ): Promise<{ imageOptions: ImageOptions; url: string }> {
    const imageOptions = await firstValueFrom(
      this.httpClient.get<ImageOptions>(
        `${CharacterApiService.host}/get-random-image-options`
      )
    );

    let { url } = await this.buildImageFromImageOptions(imageOptions);

    if (currentScale !== undefined) {
      url = CharacterApiService.appendScaleToImageUrl(url, currentScale);
    }

    return {
      imageOptions,
      url,
    };
  }

  async getZoomedInImage(
    imageOptions: ImageOptions,
    currentScale: number
  ): Promise<ScalingResponse> {
    let newScale = currentScale + 0.5;

    if (newScale > 2) {
      newScale = 2;
    }

    const { url } = await this.buildImageFromImageOptions(imageOptions);

    return {
      url: CharacterApiService.appendScaleToImageUrl(url, newScale),
      newScale,
    };
  }

  async getZoomedOutImage(
    imageOptions: ImageOptions,
    currentScale: number
  ): Promise<ScalingResponse> {
    let newScale = currentScale - 0.5;

    if (newScale < 0.1) {
      newScale = 0.1;
    }

    const { url } = await this.buildImageFromImageOptions(imageOptions);
    return {
      url: CharacterApiService.appendScaleToImageUrl(url, newScale),
      newScale,
    };
  }

  private static appendScaleToImageUrl(url: string, scale: number): string {
    return `${url}?scale=${scale}`;
  }
}
