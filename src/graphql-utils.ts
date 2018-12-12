export function removeGraphQLNulls(t: any): any {
  if (Array.isArray(t)) {
    return t.map(l => removeGraphQLNulls(l));
  }
  if (typeof t !== 'object') {
    return t;
  }
  if (t === null || t === undefined) {
    return t;
  }
  // console.log(t);
  const ret: { [id: string]: any } = {};
  Object.keys(t).forEach(k => {
    if (t[k] === null) {
      return;
    }
    ret[k] = removeGraphQLNulls(t[k]);
  });
  return ret;
}
