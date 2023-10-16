import { GraphQLClient } from 'graphql-request';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import { print } from 'graphql'
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  ContractAddress: { input: any; output: any; }
  Cursor: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  bool: { input: any; output: any; }
  felt252: { input: any; output: any; }
  u8: { input: any; output: any; }
  u64: { input: any; output: any; }
};

export type App = {
  __typename?: 'App';
  entity?: Maybe<Entity>;
  name?: Maybe<Scalars['felt252']['output']>;
  system?: Maybe<Scalars['ContractAddress']['output']>;
};

export type AppConnection = {
  __typename?: 'AppConnection';
  edges?: Maybe<Array<Maybe<AppEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type AppEdge = {
  __typename?: 'AppEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<App>;
};

export type AppName = {
  __typename?: 'AppName';
  entity?: Maybe<Entity>;
  name?: Maybe<Scalars['felt252']['output']>;
  system?: Maybe<Scalars['ContractAddress']['output']>;
};

export type AppNameConnection = {
  __typename?: 'AppNameConnection';
  edges?: Maybe<Array<Maybe<AppNameEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type AppNameEdge = {
  __typename?: 'AppNameEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<AppName>;
};

export type AppNameOrder = {
  direction: OrderDirection;
  field: AppNameOrderField;
};

export enum AppNameOrderField {
  Name = 'NAME',
  System = 'SYSTEM'
}

export type AppNameWhereInput = {
  name?: InputMaybe<Scalars['felt252']['input']>;
  nameEQ?: InputMaybe<Scalars['felt252']['input']>;
  nameGT?: InputMaybe<Scalars['felt252']['input']>;
  nameGTE?: InputMaybe<Scalars['felt252']['input']>;
  nameLT?: InputMaybe<Scalars['felt252']['input']>;
  nameLTE?: InputMaybe<Scalars['felt252']['input']>;
  nameNEQ?: InputMaybe<Scalars['felt252']['input']>;
  system?: InputMaybe<Scalars['ContractAddress']['input']>;
  systemEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  systemGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  systemGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  systemLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  systemLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  systemNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
};

export type AppOrder = {
  direction: OrderDirection;
  field: AppOrderField;
};

export enum AppOrderField {
  Name = 'NAME',
  System = 'SYSTEM'
}

export type AppWhereInput = {
  name?: InputMaybe<Scalars['felt252']['input']>;
  nameEQ?: InputMaybe<Scalars['felt252']['input']>;
  nameGT?: InputMaybe<Scalars['felt252']['input']>;
  nameGTE?: InputMaybe<Scalars['felt252']['input']>;
  nameLT?: InputMaybe<Scalars['felt252']['input']>;
  nameLTE?: InputMaybe<Scalars['felt252']['input']>;
  nameNEQ?: InputMaybe<Scalars['felt252']['input']>;
  system?: InputMaybe<Scalars['ContractAddress']['input']>;
  systemEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  systemGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  systemGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  systemLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  systemLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  systemNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
};

export type Color = {
  __typename?: 'Color';
  b?: Maybe<Scalars['u8']['output']>;
  entity?: Maybe<Entity>;
  g?: Maybe<Scalars['u8']['output']>;
  r?: Maybe<Scalars['u8']['output']>;
  x?: Maybe<Scalars['u64']['output']>;
  y?: Maybe<Scalars['u64']['output']>;
};

export type ColorConnection = {
  __typename?: 'ColorConnection';
  edges?: Maybe<Array<Maybe<ColorEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type ColorEdge = {
  __typename?: 'ColorEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Color>;
};

export type ColorOrder = {
  direction: OrderDirection;
  field: ColorOrderField;
};

export enum ColorOrderField {
  B = 'B',
  G = 'G',
  R = 'R',
  X = 'X',
  Y = 'Y'
}

export type ColorWhereInput = {
  b?: InputMaybe<Scalars['u8']['input']>;
  bEQ?: InputMaybe<Scalars['u8']['input']>;
  bGT?: InputMaybe<Scalars['u8']['input']>;
  bGTE?: InputMaybe<Scalars['u8']['input']>;
  bLT?: InputMaybe<Scalars['u8']['input']>;
  bLTE?: InputMaybe<Scalars['u8']['input']>;
  bNEQ?: InputMaybe<Scalars['u8']['input']>;
  g?: InputMaybe<Scalars['u8']['input']>;
  gEQ?: InputMaybe<Scalars['u8']['input']>;
  gGT?: InputMaybe<Scalars['u8']['input']>;
  gGTE?: InputMaybe<Scalars['u8']['input']>;
  gLT?: InputMaybe<Scalars['u8']['input']>;
  gLTE?: InputMaybe<Scalars['u8']['input']>;
  gNEQ?: InputMaybe<Scalars['u8']['input']>;
  r?: InputMaybe<Scalars['u8']['input']>;
  rEQ?: InputMaybe<Scalars['u8']['input']>;
  rGT?: InputMaybe<Scalars['u8']['input']>;
  rGTE?: InputMaybe<Scalars['u8']['input']>;
  rLT?: InputMaybe<Scalars['u8']['input']>;
  rLTE?: InputMaybe<Scalars['u8']['input']>;
  rNEQ?: InputMaybe<Scalars['u8']['input']>;
  x?: InputMaybe<Scalars['u64']['input']>;
  xEQ?: InputMaybe<Scalars['u64']['input']>;
  xGT?: InputMaybe<Scalars['u64']['input']>;
  xGTE?: InputMaybe<Scalars['u64']['input']>;
  xLT?: InputMaybe<Scalars['u64']['input']>;
  xLTE?: InputMaybe<Scalars['u64']['input']>;
  xNEQ?: InputMaybe<Scalars['u64']['input']>;
  y?: InputMaybe<Scalars['u64']['input']>;
  yEQ?: InputMaybe<Scalars['u64']['input']>;
  yGT?: InputMaybe<Scalars['u64']['input']>;
  yGTE?: InputMaybe<Scalars['u64']['input']>;
  yLT?: InputMaybe<Scalars['u64']['input']>;
  yLTE?: InputMaybe<Scalars['u64']['input']>;
  yNEQ?: InputMaybe<Scalars['u64']['input']>;
};

export type CoreActionsModel = {
  __typename?: 'CoreActionsModel';
  entity?: Maybe<Entity>;
  key?: Maybe<Scalars['felt252']['output']>;
  value?: Maybe<Scalars['ContractAddress']['output']>;
};

export type CoreActionsModelConnection = {
  __typename?: 'CoreActionsModelConnection';
  edges?: Maybe<Array<Maybe<CoreActionsModelEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type CoreActionsModelEdge = {
  __typename?: 'CoreActionsModelEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<CoreActionsModel>;
};

export type CoreActionsModelOrder = {
  direction: OrderDirection;
  field: CoreActionsModelOrderField;
};

export enum CoreActionsModelOrderField {
  Key = 'KEY',
  Value = 'VALUE'
}

export type CoreActionsModelWhereInput = {
  key?: InputMaybe<Scalars['felt252']['input']>;
  keyEQ?: InputMaybe<Scalars['felt252']['input']>;
  keyGT?: InputMaybe<Scalars['felt252']['input']>;
  keyGTE?: InputMaybe<Scalars['felt252']['input']>;
  keyLT?: InputMaybe<Scalars['felt252']['input']>;
  keyLTE?: InputMaybe<Scalars['felt252']['input']>;
  keyNEQ?: InputMaybe<Scalars['felt252']['input']>;
  value?: InputMaybe<Scalars['ContractAddress']['input']>;
  valueEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  valueGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  valueGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  valueLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  valueLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  valueNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
};

export type Entity = {
  __typename?: 'Entity';
  created_at?: Maybe<Scalars['DateTime']['output']>;
  event_id?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  keys?: Maybe<Scalars['String']['output']>;
  model_names?: Maybe<Scalars['String']['output']>;
  models?: Maybe<Array<Maybe<ModelUnion>>>;
  updated_at?: Maybe<Scalars['DateTime']['output']>;
};

export type EntityConnection = {
  __typename?: 'EntityConnection';
  edges?: Maybe<Array<Maybe<EntityEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type EntityEdge = {
  __typename?: 'EntityEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Entity>;
};

export type Event = {
  __typename?: 'Event';
  created_at?: Maybe<Scalars['DateTime']['output']>;
  data?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  keys?: Maybe<Scalars['String']['output']>;
  systemCall: SystemCall;
  transaction_hash?: Maybe<Scalars['String']['output']>;
};

export type EventConnection = {
  __typename?: 'EventConnection';
  edges?: Maybe<Array<Maybe<EventEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type EventEdge = {
  __typename?: 'EventEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Event>;
};

export type Metadata = {
  __typename?: 'Metadata';
  id?: Maybe<Scalars['ID']['output']>;
  uri?: Maybe<Scalars['String']['output']>;
};

export type MetadataConnection = {
  __typename?: 'MetadataConnection';
  edges?: Maybe<Array<Maybe<MetadataEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type MetadataEdge = {
  __typename?: 'MetadataEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Metadata>;
};

export type Model = {
  __typename?: 'Model';
  class_hash?: Maybe<Scalars['felt252']['output']>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  transaction_hash?: Maybe<Scalars['felt252']['output']>;
};

export type ModelConnection = {
  __typename?: 'ModelConnection';
  edges?: Maybe<Array<Maybe<ModelEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type ModelEdge = {
  __typename?: 'ModelEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Model>;
};

export type ModelUnion = App | AppName | Color | CoreActionsModel | NeedsAttention | Owner | Permission | PixelType | Text | Timestamp;

export type NeedsAttention = {
  __typename?: 'NeedsAttention';
  entity?: Maybe<Entity>;
  value?: Maybe<Scalars['bool']['output']>;
  x?: Maybe<Scalars['u64']['output']>;
  y?: Maybe<Scalars['u64']['output']>;
};

export type NeedsAttentionConnection = {
  __typename?: 'NeedsAttentionConnection';
  edges?: Maybe<Array<Maybe<NeedsAttentionEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type NeedsAttentionEdge = {
  __typename?: 'NeedsAttentionEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<NeedsAttention>;
};

export type NeedsAttentionOrder = {
  direction: OrderDirection;
  field: NeedsAttentionOrderField;
};

export enum NeedsAttentionOrderField {
  Value = 'VALUE',
  X = 'X',
  Y = 'Y'
}

export type NeedsAttentionWhereInput = {
  value?: InputMaybe<Scalars['bool']['input']>;
  valueEQ?: InputMaybe<Scalars['bool']['input']>;
  valueGT?: InputMaybe<Scalars['bool']['input']>;
  valueGTE?: InputMaybe<Scalars['bool']['input']>;
  valueLT?: InputMaybe<Scalars['bool']['input']>;
  valueLTE?: InputMaybe<Scalars['bool']['input']>;
  valueNEQ?: InputMaybe<Scalars['bool']['input']>;
  x?: InputMaybe<Scalars['u64']['input']>;
  xEQ?: InputMaybe<Scalars['u64']['input']>;
  xGT?: InputMaybe<Scalars['u64']['input']>;
  xGTE?: InputMaybe<Scalars['u64']['input']>;
  xLT?: InputMaybe<Scalars['u64']['input']>;
  xLTE?: InputMaybe<Scalars['u64']['input']>;
  xNEQ?: InputMaybe<Scalars['u64']['input']>;
  y?: InputMaybe<Scalars['u64']['input']>;
  yEQ?: InputMaybe<Scalars['u64']['input']>;
  yGT?: InputMaybe<Scalars['u64']['input']>;
  yGTE?: InputMaybe<Scalars['u64']['input']>;
  yLT?: InputMaybe<Scalars['u64']['input']>;
  yLTE?: InputMaybe<Scalars['u64']['input']>;
  yNEQ?: InputMaybe<Scalars['u64']['input']>;
};

export enum OrderDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Owner = {
  __typename?: 'Owner';
  address?: Maybe<Scalars['felt252']['output']>;
  entity?: Maybe<Entity>;
  x?: Maybe<Scalars['u64']['output']>;
  y?: Maybe<Scalars['u64']['output']>;
};

export type OwnerConnection = {
  __typename?: 'OwnerConnection';
  edges?: Maybe<Array<Maybe<OwnerEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type OwnerEdge = {
  __typename?: 'OwnerEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Owner>;
};

export type OwnerOrder = {
  direction: OrderDirection;
  field: OwnerOrderField;
};

export enum OwnerOrderField {
  Address = 'ADDRESS',
  X = 'X',
  Y = 'Y'
}

export type OwnerWhereInput = {
  address?: InputMaybe<Scalars['felt252']['input']>;
  addressEQ?: InputMaybe<Scalars['felt252']['input']>;
  addressGT?: InputMaybe<Scalars['felt252']['input']>;
  addressGTE?: InputMaybe<Scalars['felt252']['input']>;
  addressLT?: InputMaybe<Scalars['felt252']['input']>;
  addressLTE?: InputMaybe<Scalars['felt252']['input']>;
  addressNEQ?: InputMaybe<Scalars['felt252']['input']>;
  x?: InputMaybe<Scalars['u64']['input']>;
  xEQ?: InputMaybe<Scalars['u64']['input']>;
  xGT?: InputMaybe<Scalars['u64']['input']>;
  xGTE?: InputMaybe<Scalars['u64']['input']>;
  xLT?: InputMaybe<Scalars['u64']['input']>;
  xLTE?: InputMaybe<Scalars['u64']['input']>;
  xNEQ?: InputMaybe<Scalars['u64']['input']>;
  y?: InputMaybe<Scalars['u64']['input']>;
  yEQ?: InputMaybe<Scalars['u64']['input']>;
  yGT?: InputMaybe<Scalars['u64']['input']>;
  yGTE?: InputMaybe<Scalars['u64']['input']>;
  yLT?: InputMaybe<Scalars['u64']['input']>;
  yLTE?: InputMaybe<Scalars['u64']['input']>;
  yNEQ?: InputMaybe<Scalars['u64']['input']>;
};

export type Permission = {
  __typename?: 'Permission';
  allowed?: Maybe<Scalars['bool']['output']>;
  caller_system?: Maybe<Scalars['felt252']['output']>;
  entity?: Maybe<Entity>;
  x?: Maybe<Scalars['u64']['output']>;
  y?: Maybe<Scalars['u64']['output']>;
};

export type PermissionConnection = {
  __typename?: 'PermissionConnection';
  edges?: Maybe<Array<Maybe<PermissionEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type PermissionEdge = {
  __typename?: 'PermissionEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Permission>;
};

export type PermissionOrder = {
  direction: OrderDirection;
  field: PermissionOrderField;
};

export enum PermissionOrderField {
  Allowed = 'ALLOWED',
  CallerSystem = 'CALLER_SYSTEM',
  X = 'X',
  Y = 'Y'
}

export type PermissionWhereInput = {
  allowed?: InputMaybe<Scalars['bool']['input']>;
  allowedEQ?: InputMaybe<Scalars['bool']['input']>;
  allowedGT?: InputMaybe<Scalars['bool']['input']>;
  allowedGTE?: InputMaybe<Scalars['bool']['input']>;
  allowedLT?: InputMaybe<Scalars['bool']['input']>;
  allowedLTE?: InputMaybe<Scalars['bool']['input']>;
  allowedNEQ?: InputMaybe<Scalars['bool']['input']>;
  caller_system?: InputMaybe<Scalars['felt252']['input']>;
  caller_systemEQ?: InputMaybe<Scalars['felt252']['input']>;
  caller_systemGT?: InputMaybe<Scalars['felt252']['input']>;
  caller_systemGTE?: InputMaybe<Scalars['felt252']['input']>;
  caller_systemLT?: InputMaybe<Scalars['felt252']['input']>;
  caller_systemLTE?: InputMaybe<Scalars['felt252']['input']>;
  caller_systemNEQ?: InputMaybe<Scalars['felt252']['input']>;
  x?: InputMaybe<Scalars['u64']['input']>;
  xEQ?: InputMaybe<Scalars['u64']['input']>;
  xGT?: InputMaybe<Scalars['u64']['input']>;
  xGTE?: InputMaybe<Scalars['u64']['input']>;
  xLT?: InputMaybe<Scalars['u64']['input']>;
  xLTE?: InputMaybe<Scalars['u64']['input']>;
  xNEQ?: InputMaybe<Scalars['u64']['input']>;
  y?: InputMaybe<Scalars['u64']['input']>;
  yEQ?: InputMaybe<Scalars['u64']['input']>;
  yGT?: InputMaybe<Scalars['u64']['input']>;
  yGTE?: InputMaybe<Scalars['u64']['input']>;
  yLT?: InputMaybe<Scalars['u64']['input']>;
  yLTE?: InputMaybe<Scalars['u64']['input']>;
  yNEQ?: InputMaybe<Scalars['u64']['input']>;
};

export type PixelType = {
  __typename?: 'PixelType';
  entity?: Maybe<Entity>;
  name?: Maybe<Scalars['felt252']['output']>;
  x?: Maybe<Scalars['u64']['output']>;
  y?: Maybe<Scalars['u64']['output']>;
};

export type PixelTypeConnection = {
  __typename?: 'PixelTypeConnection';
  edges?: Maybe<Array<Maybe<PixelTypeEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type PixelTypeEdge = {
  __typename?: 'PixelTypeEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<PixelType>;
};

export type PixelTypeOrder = {
  direction: OrderDirection;
  field: PixelTypeOrderField;
};

export enum PixelTypeOrderField {
  Name = 'NAME',
  X = 'X',
  Y = 'Y'
}

export type PixelTypeWhereInput = {
  name?: InputMaybe<Scalars['felt252']['input']>;
  nameEQ?: InputMaybe<Scalars['felt252']['input']>;
  nameGT?: InputMaybe<Scalars['felt252']['input']>;
  nameGTE?: InputMaybe<Scalars['felt252']['input']>;
  nameLT?: InputMaybe<Scalars['felt252']['input']>;
  nameLTE?: InputMaybe<Scalars['felt252']['input']>;
  nameNEQ?: InputMaybe<Scalars['felt252']['input']>;
  x?: InputMaybe<Scalars['u64']['input']>;
  xEQ?: InputMaybe<Scalars['u64']['input']>;
  xGT?: InputMaybe<Scalars['u64']['input']>;
  xGTE?: InputMaybe<Scalars['u64']['input']>;
  xLT?: InputMaybe<Scalars['u64']['input']>;
  xLTE?: InputMaybe<Scalars['u64']['input']>;
  xNEQ?: InputMaybe<Scalars['u64']['input']>;
  y?: InputMaybe<Scalars['u64']['input']>;
  yEQ?: InputMaybe<Scalars['u64']['input']>;
  yGT?: InputMaybe<Scalars['u64']['input']>;
  yGTE?: InputMaybe<Scalars['u64']['input']>;
  yLT?: InputMaybe<Scalars['u64']['input']>;
  yLTE?: InputMaybe<Scalars['u64']['input']>;
  yNEQ?: InputMaybe<Scalars['u64']['input']>;
};

export type Query = {
  __typename?: 'Query';
  appModels?: Maybe<AppConnection>;
  appnameModels?: Maybe<AppNameConnection>;
  colorModels?: Maybe<ColorConnection>;
  coreactionsmodelModels?: Maybe<CoreActionsModelConnection>;
  entities?: Maybe<EntityConnection>;
  entity: Entity;
  events?: Maybe<EventConnection>;
  metadata: Metadata;
  metadatas?: Maybe<MetadataConnection>;
  model: Model;
  models?: Maybe<ModelConnection>;
  needsattentionModels?: Maybe<NeedsAttentionConnection>;
  ownerModels?: Maybe<OwnerConnection>;
  permissionModels?: Maybe<PermissionConnection>;
  pixeltypeModels?: Maybe<PixelTypeConnection>;
  system: System;
  systemCall: SystemCall;
  systemCalls?: Maybe<SystemCallConnection>;
  systems?: Maybe<SystemConnection>;
  textModels?: Maybe<TextConnection>;
  timestampModels?: Maybe<TimestampConnection>;
};


export type QueryAppModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<AppOrder>;
  where?: InputMaybe<AppWhereInput>;
};


export type QueryAppnameModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<AppNameOrder>;
  where?: InputMaybe<AppNameWhereInput>;
};


export type QueryColorModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<ColorOrder>;
  where?: InputMaybe<ColorWhereInput>;
};


export type QueryCoreactionsmodelModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<CoreActionsModelOrder>;
  where?: InputMaybe<CoreActionsModelWhereInput>;
};


export type QueryEntitiesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryEntityArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEventsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMetadataArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMetadatasArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryModelArgs = {
  id: Scalars['ID']['input'];
};


export type QueryModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryNeedsattentionModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<NeedsAttentionOrder>;
  where?: InputMaybe<NeedsAttentionWhereInput>;
};


export type QueryOwnerModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<OwnerOrder>;
  where?: InputMaybe<OwnerWhereInput>;
};


export type QueryPermissionModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<PermissionOrder>;
  where?: InputMaybe<PermissionWhereInput>;
};


export type QueryPixeltypeModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<PixelTypeOrder>;
  where?: InputMaybe<PixelTypeWhereInput>;
};


export type QuerySystemArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySystemCallArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySystemCallsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySystemsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTextModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<TextOrder>;
  where?: InputMaybe<TextWhereInput>;
};


export type QueryTimestampModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<TimestampOrder>;
  where?: InputMaybe<TimestampWhereInput>;
};

export type Subscription = {
  __typename?: 'Subscription';
  entityUpdated: Entity;
  modelRegistered: Model;
};


export type SubscriptionEntityUpdatedArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type SubscriptionModelRegisteredArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type System = {
  __typename?: 'System';
  class_hash?: Maybe<Scalars['felt252']['output']>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  systemCalls: Array<SystemCall>;
  transaction_hash?: Maybe<Scalars['felt252']['output']>;
};

export type SystemCall = {
  __typename?: 'SystemCall';
  created_at?: Maybe<Scalars['DateTime']['output']>;
  data?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  system: System;
  system_id?: Maybe<Scalars['ID']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
};

export type SystemCallConnection = {
  __typename?: 'SystemCallConnection';
  edges?: Maybe<Array<Maybe<SystemCallEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type SystemCallEdge = {
  __typename?: 'SystemCallEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<SystemCall>;
};

export type SystemConnection = {
  __typename?: 'SystemConnection';
  edges?: Maybe<Array<Maybe<SystemEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type SystemEdge = {
  __typename?: 'SystemEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<System>;
};

export type Text = {
  __typename?: 'Text';
  entity?: Maybe<Entity>;
  string?: Maybe<Scalars['felt252']['output']>;
  x?: Maybe<Scalars['u64']['output']>;
  y?: Maybe<Scalars['u64']['output']>;
};

export type TextConnection = {
  __typename?: 'TextConnection';
  edges?: Maybe<Array<Maybe<TextEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type TextEdge = {
  __typename?: 'TextEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Text>;
};

export type TextOrder = {
  direction: OrderDirection;
  field: TextOrderField;
};

export enum TextOrderField {
  String = 'STRING',
  X = 'X',
  Y = 'Y'
}

export type TextWhereInput = {
  string?: InputMaybe<Scalars['felt252']['input']>;
  stringEQ?: InputMaybe<Scalars['felt252']['input']>;
  stringGT?: InputMaybe<Scalars['felt252']['input']>;
  stringGTE?: InputMaybe<Scalars['felt252']['input']>;
  stringLT?: InputMaybe<Scalars['felt252']['input']>;
  stringLTE?: InputMaybe<Scalars['felt252']['input']>;
  stringNEQ?: InputMaybe<Scalars['felt252']['input']>;
  x?: InputMaybe<Scalars['u64']['input']>;
  xEQ?: InputMaybe<Scalars['u64']['input']>;
  xGT?: InputMaybe<Scalars['u64']['input']>;
  xGTE?: InputMaybe<Scalars['u64']['input']>;
  xLT?: InputMaybe<Scalars['u64']['input']>;
  xLTE?: InputMaybe<Scalars['u64']['input']>;
  xNEQ?: InputMaybe<Scalars['u64']['input']>;
  y?: InputMaybe<Scalars['u64']['input']>;
  yEQ?: InputMaybe<Scalars['u64']['input']>;
  yGT?: InputMaybe<Scalars['u64']['input']>;
  yGTE?: InputMaybe<Scalars['u64']['input']>;
  yLT?: InputMaybe<Scalars['u64']['input']>;
  yLTE?: InputMaybe<Scalars['u64']['input']>;
  yNEQ?: InputMaybe<Scalars['u64']['input']>;
};

export type Timestamp = {
  __typename?: 'Timestamp';
  created_at?: Maybe<Scalars['u64']['output']>;
  entity?: Maybe<Entity>;
  updated_at?: Maybe<Scalars['u64']['output']>;
  x?: Maybe<Scalars['u64']['output']>;
  y?: Maybe<Scalars['u64']['output']>;
};

export type TimestampConnection = {
  __typename?: 'TimestampConnection';
  edges?: Maybe<Array<Maybe<TimestampEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type TimestampEdge = {
  __typename?: 'TimestampEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Timestamp>;
};

export type TimestampOrder = {
  direction: OrderDirection;
  field: TimestampOrderField;
};

export enum TimestampOrderField {
  CreatedAt = 'CREATED_AT',
  UpdatedAt = 'UPDATED_AT',
  X = 'X',
  Y = 'Y'
}

export type TimestampWhereInput = {
  created_at?: InputMaybe<Scalars['u64']['input']>;
  created_atEQ?: InputMaybe<Scalars['u64']['input']>;
  created_atGT?: InputMaybe<Scalars['u64']['input']>;
  created_atGTE?: InputMaybe<Scalars['u64']['input']>;
  created_atLT?: InputMaybe<Scalars['u64']['input']>;
  created_atLTE?: InputMaybe<Scalars['u64']['input']>;
  created_atNEQ?: InputMaybe<Scalars['u64']['input']>;
  updated_at?: InputMaybe<Scalars['u64']['input']>;
  updated_atEQ?: InputMaybe<Scalars['u64']['input']>;
  updated_atGT?: InputMaybe<Scalars['u64']['input']>;
  updated_atGTE?: InputMaybe<Scalars['u64']['input']>;
  updated_atLT?: InputMaybe<Scalars['u64']['input']>;
  updated_atLTE?: InputMaybe<Scalars['u64']['input']>;
  updated_atNEQ?: InputMaybe<Scalars['u64']['input']>;
  x?: InputMaybe<Scalars['u64']['input']>;
  xEQ?: InputMaybe<Scalars['u64']['input']>;
  xGT?: InputMaybe<Scalars['u64']['input']>;
  xGTE?: InputMaybe<Scalars['u64']['input']>;
  xLT?: InputMaybe<Scalars['u64']['input']>;
  xLTE?: InputMaybe<Scalars['u64']['input']>;
  xNEQ?: InputMaybe<Scalars['u64']['input']>;
  y?: InputMaybe<Scalars['u64']['input']>;
  yEQ?: InputMaybe<Scalars['u64']['input']>;
  yGT?: InputMaybe<Scalars['u64']['input']>;
  yGTE?: InputMaybe<Scalars['u64']['input']>;
  yLT?: InputMaybe<Scalars['u64']['input']>;
  yLTE?: InputMaybe<Scalars['u64']['input']>;
  yNEQ?: InputMaybe<Scalars['u64']['input']>;
};

export type GetEntitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEntitiesQuery = { __typename?: 'Query', entities?: { __typename?: 'EntityConnection', edges?: Array<{ __typename?: 'EntityEdge', node?: { __typename?: 'Entity', keys?: string | null, models?: Array<{ __typename?: 'App' } | { __typename?: 'AppName' } | { __typename: 'Color', x?: any | null, y?: any | null, r?: any | null, g?: any | null, b?: any | null } | { __typename?: 'CoreActionsModel' } | { __typename: 'NeedsAttention', x?: any | null, y?: any | null, value?: any | null } | { __typename: 'Owner', x?: any | null, y?: any | null, address?: any | null } | { __typename?: 'Permission' } | { __typename: 'PixelType', x?: any | null, y?: any | null, name?: any | null } | { __typename: 'Text', x?: any | null, y?: any | null, string?: any | null } | { __typename: 'Timestamp', x?: any | null, y?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null } | null> | null } | null };


export const GetEntitiesDocument = gql`
    query getEntities {
  entities(keys: ["%"], first: 4096) {
    edges {
      node {
        keys
        models {
          ... on Color {
            __typename
            x
            y
            r
            g
            b
          }
          ... on Timestamp {
            x
            y
            created_at
            updated_at
            __typename
          }
          ... on Owner {
            x
            y
            address
            __typename
          }
          ... on Text {
            x
            y
            string
            __typename
          }
          ... on PixelType {
            x
            y
            name
            __typename
          }
          ... on NeedsAttention {
            x
            y
            value
            __typename
          }
        }
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();
const GetEntitiesDocumentString = print(GetEntitiesDocument);
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    getEntities(variables?: GetEntitiesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetEntitiesQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetEntitiesQuery>(GetEntitiesDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getEntities', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
