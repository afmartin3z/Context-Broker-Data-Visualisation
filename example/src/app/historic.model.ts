import { Moment } from 'moment';

export interface Historic {
  contextResponses: {
    contextElement: {
      attributes: {
        name: string,
        values: Sample[]
      }[]
    }
  }[];
}

export interface Sample {
  recvTime: Moment;
  attrType: string;
  attrValue: number;
}
