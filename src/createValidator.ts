import type {DefaultDocumentIDType, Validate, ValidateOptions} from 'payload';
import {date} from 'payload/shared';

export const createValidator = <
    Data,
    SiblingData,
    Value,
    FieldConfig extends ValidatableField,
    IdType extends number | string = DefaultDocumentIDType,
>({
    defaultValidator,
    validators,
}: Args<Data, SiblingData, Value, FieldConfig, IdType>): NonNullable<FieldConfig['validate']> => {
    const _validator: Validate<Value, Data, SiblingData, FieldConfig> = async (value, options) => {
        const runDefault = async () => {
            if (defaultValidator === date) {
                const adaptedOptions = {
                    ...options,
                    previousValue: options.previousValue ? new Date(options.previousValue as string) : undefined,
                };

                return defaultValidator(value, adaptedOptions);
            }

            return defaultValidator(value, options);
        };

        if (!value || (Array.isArray(value) && !value.length)) {
            return runDefault();
        }

        for (const validator of validators) {
            const result = await validator(value, options as Parameters<typeof validator>[1]);

            if (result !== true) {
                return result;
            }
        }

        return runDefault();
    };

    return _validator as NonNullable<FieldConfig['validate']>;
};

type DefaultValidator = Validate<any, any, any, any>;
type ValidationResult = string | true;
type ValidatableField = {validate?: DefaultValidator};

type Validator<
    Data,
    SiblingData,
    Value,
    FieldConfig extends ValidatableField,
    IdType extends number | string = DefaultDocumentIDType,
> = (
    value: NonNullable<Value>,
    options: Omit<ValidateOptions<Data, SiblingData, FieldConfig, Value>, 'id'> & {id?: IdType},
) => ValidationResult | Promise<ValidationResult>;

type Args<
    Data,
    SiblingData,
    Value,
    FieldConfig extends ValidatableField,
    IdType extends number | string = DefaultDocumentIDType,
> = {
    defaultValidator: DefaultValidator;
    validators: Validator<Data, SiblingData, Value, FieldConfig, IdType>[];
};

export type CustomValidator<
    Data,
    SiblingData,
    Value,
    FieldConfig extends ValidatableField,
    IdType extends number | string = DefaultDocumentIDType,
> = Parameters<typeof createValidator<Data, SiblingData, Value, FieldConfig, IdType>>[0]['validators'][number];
