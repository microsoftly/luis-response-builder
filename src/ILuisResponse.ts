import { IEntity } from './Entity';
import { Intent } from './Intent';

export interface ILuisResponse {
  query: string;
  topScoringIntent: Intent;
  intents: Intent[];
  entities: IEntity[];
}
