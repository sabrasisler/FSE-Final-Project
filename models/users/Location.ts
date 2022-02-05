import { ILocation } from './ILocation';

export class Location implements ILocation {
  public readonly longitude: number;
  public readonly latitude: number;

  public constructor(longitude: number, latitude: number) {
    this.longitude = longitude;
    this.latitude = latitude;
  }
}
