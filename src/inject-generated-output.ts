import { GraphQLObjectType } from 'graphql';
import { GenerateOutputType } from './graphql-output-from-type';

export class InjectGeneratedOutput {
  private injected: string;
  private readonly type: GraphQLObjectType;

  public constructor(t: GraphQLObjectType) {
    this.type = t;
  }

  public inject(cb?: GenerateOutputType): string {
    if (this.injected) {
      return this.injected;
    }
    this.injected = cb!(this.type);
    return this.injected;
  }

}
