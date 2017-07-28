import { ResolvablePrebuiltEntity, ValueResolution } from './prebuiltEntities';
import { moneyType } from './prebuiltEntityTypes';

interface IMoneyValueResolution extends ValueResolution {
    unit: string;
}

class Money extends ResolvablePrebuiltEntity {
    public resolution: IMoneyValueResolution;

    public static CreateMoneyEntity(
        entity: string,
        startIndex: number,
        endIndex: number,
        unit: string,
        value: string | number
    ): Money {
        const moneyEntity = new Money(moneyType, entity, startIndex, endIndex);

        const moneyValueResolution: IMoneyValueResolution = {
            unit,
            value: typeof(value) === 'string' ? Number(value) : value
        };

        moneyEntity.resolution = moneyValueResolution;

        return moneyEntity;
    }
}
