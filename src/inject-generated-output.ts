export class InjectGeneratedOutput {
  private injected: string;

  public constructor() {}

  public inject(cb?: () => string): string {
    if (this.injected) {
      return this.injected;
    }
    this.injected = cb!();
    return this.injected;
  }
}
