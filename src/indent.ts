export function indent(cnt: number, s: string): string {
  return (
    Array(cnt)
      .fill(' ')
      .join('') + s
  );
}

export function indents(cnt: number, sx: string[]): string[] {
  return sx.map(s => indent(cnt, s));
}
