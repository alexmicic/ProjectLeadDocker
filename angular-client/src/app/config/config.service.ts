import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {
  readonly apiUrl: string = 'http://localhost:4001/'

  constructor() { }

}
