# Payload Utilities

Utility functions for Payload CMS — type-safe validators, ID extraction, and document resolution.

## Installation

```sh
npm install payload-utilities
```

## Usage

### `createValidator`

Creates a composite field validator by combining custom validators with a Payload default validator. Custom validators run first — if any fails, it short-circuits. If all pass, the default validator runs.

```ts
import type {DateField} from 'payload';
import {date} from 'payload/shared';
import {createValidator, type CustomValidator} from 'payload-utilities';

type Data = Task;
type SiblingData = Data['schedule']['timeframe'];
type Value = SiblingData['end'];
type FieldConfig = DateField;

type Validator = CustomValidator<Data, SiblingData, Value, FieldConfig>;

const validateEndDate: Validator = (value, options) => {
    const start = options.siblingData?.start;

    if (!start) {
        return 'Start- & Ende des Einplanungszeitraum sind Pflichtfelder';
    }

    const startDate = new Date(start);
    const endDate = new Date(value);

    if (endDate.getTime() < startDate.getTime()) {
        return 'Das Ende des Einplanungszeitraum darf nicht vor dem Start liegen';
    }

    return true;
};

const validateStartDate: Validator = (value, options) => {
    // ...
};


export const timeframeValidator = createValidator<Data, SiblingData, Value, FieldConfig>({
    defaultValidator: date,
    validators: [validateEndDate, validateStartDate],
});
```

### `extractId` / `extractIds`

Extract IDs from values that are either an ID or an object with an `id` property.

```ts
import {extractId, extractIds} from 'payload-utilities';

// Single values
extractId(1);              // 1
extractId('abc');          // 'abc'
extractId({id: 1});        // 1

// Arrays
extractIds([1, {id: 2}]);  // [1, 2]
```

### `getDocument` / `getDocuments`

Resolves a value that is either a full document or an ID. If an object is passed, it is returned directly. If an ID is passed, the callback is called to fetch the document.

```ts
import {getDocument} from 'payload-utilities';

const post = await getDocument(idOrPost, (id) =>
    payload.findByID({collection: 'posts', id}),
);
```

```ts
import {getDocuments} from 'payload-utilities';

const posts = await getDocuments(idsOrPosts, (ids) =>
    payload.find({collection: 'posts', where: {id: {in: ids}}}).then(result => result.docs),
);
```

## License

MIT

## Todo

- [ ] Better Labels
- [ ] Github Actions
