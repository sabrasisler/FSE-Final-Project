import { ILocation } from './ILocation';

/**
 * Represents the location of an {@link IUser}. Implements {@link ILocation}. A location has a longitude and latitude.
 */
export class Location implements ILocation {
  public readonly longitude: number;
  public readonly latitude: number;

  /**
   * Constructs the location with a longitude and latitude
   * @param longitude
   * @param latitude
   */
  public constructor(longitude: number, latitude: number) {
    this.longitude = longitude;
    this.latitude = latitude;
  }
}
