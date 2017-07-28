import { find } from 'lodash';
import {ICustomEntity, IEntity, IPrebuiltEntity} from './Entity';
import { ILuisResponse } from './ILuisResponse';
import {Intent} from './Intent';

export class LuisResponseBuilder {
    private query: string;
    private intents: Intent[];
    private entities: IEntity[];

    constructor(query: string) {
        this.query = query;
        this.intents = [] as Intent[];
        this.entities = [] as IEntity[];
    }

    public setQuery(query: string): LuisResponseBuilder {
        this.query = query;

        return this;
    }

    public addIntent(intent: string, score: number): LuisResponseBuilder {
        this.addOrReplaceIntent({ intent, score });

        return this;
    }

    public addPrebuiltEntity(entity: IPrebuiltEntity): LuisResponseBuilder {
        this.entities.push(entity);

        return this;
    }

    public addCustomEntity(entity: ICustomEntity): LuisResponseBuilder {
        this.entities.push(entity);

        return this;
    }

    public build(): ILuisResponse {
        this.sortIntentsByDescendingScore();
        const topScoringIntent = this.intents[0];

        return {
            topScoringIntent,
            query: this.query,
            intents: this.intents,
            entities: this.entities
        };
    }

    private sortIntentsByDescendingScore(): void {
        this.intents.sort((a: Intent, b: Intent) => b.score - a.score);
    }

    private addOrReplaceIntent(intent: Intent): LuisResponseBuilder {
        const existingIntent = find(this.intents, ((i: Intent) => i.intent === intent.intent));

        if (existingIntent) {
            existingIntent.score = intent.score;
        } else {
            this.intents.push(intent);
        }

        return this;
    }
}
