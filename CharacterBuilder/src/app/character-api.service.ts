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

@Injectable({
  providedIn: 'root',
})
export class CharacterApiService {
  httpClient = inject(HttpClient);

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
        'http://localhost:5110/build-image-url',
        imageOptions
      )
    );
  }
}
