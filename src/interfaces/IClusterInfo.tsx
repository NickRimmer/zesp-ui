import {DictionaryStrings} from "../models/DictionaryStrings";

export interface IClusterInfo {
  clusterId: string,
  name: string,
  attributes: IClusterAttributeCollection
}

export type IClusterAttributeCollection = { [attributeId: string]: IClusterAttribute };

export interface IClusterAttribute {
  id?: string,
  name?: string,
  arguments: DictionaryStrings
}