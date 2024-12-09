import { effect, Injectable, Signal, signal } from '@angular/core';
import {WeatherService} from "./weather.service";

export const LOCATIONS : string = "locations";

@Injectable()
export class LocationService {
  private _locations = signal<string[]>(JSON.parse(localStorage.getItem(LOCATIONS) ?? '[]'));

  constructor() {
    effect(() => {
      // Sync local storage
      localStorage.setItem(LOCATIONS, JSON.stringify(this._locations()));
    });
  }

  addLocation(zipcode : string) {
    // Push new zipcode at the end of the list
    this._locations.update(locations => [...locations, zipcode]);
  }

  removeLocation(zipcode : string) {
    // filter out the zipcode
    this._locations.update(locations => {
      return locations.filter((location) => location !== zipcode);
    });
  }

  getLocations(): Signal<string[]> {
    return this._locations.asReadonly();
  }
}
