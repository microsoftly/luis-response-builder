import { moneyType } from './prebuiltEntityTypes';
import { ResolvablePrebuiltEntity, ValueResolution } from './prebuiltEntities';

interface MoneyValueResolution extends ValueResolution {
    unit: string,
}

class Money extends ResolvablePrebuiltEntity {
    resolution: MoneyValueResolution;
    private Money() {}

    public static CreateMoneyEntity(entity: string, startIndex: number, endIndex: number, unit: string, value: string | number): Money{
        const moneyEntity = new Money(moneyType, entity, startIndex, endIndex);

        const moneyValueResolution: MoneyValueResolution = {
            unit,
            value: typeof(value) === 'string' ? Number(value) : value
        };

        moneyEntity.resolution = moneyValueResolution;

        return moneyEntity;
    }
}
