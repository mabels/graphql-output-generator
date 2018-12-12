import { removeGraphQLNulls } from './graphql-utils';

function testData(mixin: any = {}) {
  const primitives = {
    ...mixin,
    undefined: undefined as any,
    number: 1,
    true: true,
    false: false,
    string: 'string'
  };
  const array = [
    null,
    undefined,
    1,
    true,
    false,
    'xxx',
    {
      ...primitives,
      nest1: {
        primitives,
        nest2: {
          primitives,
          array: [null, undefined, 1, true, false, 'xxx', primitives]
        }
      }
    }
  ];
  return {
    primitives,
    nest1: {
      primitives,
      array,
      nest2: {
        primitives,
        array
      }
    },
    array
  };
}
test('removeGraphQLNulls', () => {
  const ret = removeGraphQLNulls(testData({ null: null }));
  expect(ret).toEqual(testData());
});
