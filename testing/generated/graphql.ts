import { GraphQLClient } from 'graphql-request';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import { GraphQLError, print } from 'graphql'
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
  u32: { input: any; output: any; }
  u64: { input: any; output: any; }
};

export type AppByName = {
  __typename?: 'AppByName';
  entity?: Maybe<Entity>;
  name?: Maybe<Scalars['felt252']['output']>;
  system?: Maybe<Scalars['ContractAddress']['output']>;
};

export type AppByNameConnection = {
  __typename?: 'AppByNameConnection';
  edges?: Maybe<Array<Maybe<AppByNameEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type AppByNameEdge = {
  __typename?: 'AppByNameEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<AppByName>;
};

export type AppByNameOrder = {
  direction: OrderDirection;
  field: AppByNameOrderField;
};

export enum AppByNameOrderField {
  Name = 'NAME',
  System = 'SYSTEM'
}

export type AppByNameWhereInput = {
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

export type AppBySystem = {
  __typename?: 'AppBySystem';
  entity?: Maybe<Entity>;
  name?: Maybe<Scalars['felt252']['output']>;
  system?: Maybe<Scalars['ContractAddress']['output']>;
};

export type AppBySystemConnection = {
  __typename?: 'AppBySystemConnection';
  edges?: Maybe<Array<Maybe<AppBySystemEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type AppBySystemEdge = {
  __typename?: 'AppBySystemEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<AppBySystem>;
};

export type AppBySystemOrder = {
  direction: OrderDirection;
  field: AppBySystemOrderField;
};

export enum AppBySystemOrderField {
  Name = 'NAME',
  System = 'SYSTEM'
}

export type AppBySystemWhereInput = {
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

export type CoreActionsAddress = {
  __typename?: 'CoreActionsAddress';
  entity?: Maybe<Entity>;
  key?: Maybe<Scalars['felt252']['output']>;
  value?: Maybe<Scalars['ContractAddress']['output']>;
};

export type CoreActionsAddressConnection = {
  __typename?: 'CoreActionsAddressConnection';
  edges?: Maybe<Array<Maybe<CoreActionsAddressEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type CoreActionsAddressEdge = {
  __typename?: 'CoreActionsAddressEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<CoreActionsAddress>;
};

export type CoreActionsAddressOrder = {
  direction: OrderDirection;
  field: CoreActionsAddressOrderField;
};

export enum CoreActionsAddressOrderField {
  Key = 'KEY',
  Value = 'VALUE'
}

export type CoreActionsAddressWhereInput = {
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
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
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
  data?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  id?: Maybe<Scalars['ID']['output']>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
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

export type ModelUnion = AppByName | AppBySystem | CoreActionsAddress | Permissions | Pixel | QueueItem;

export enum OrderDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Permission = {
  __typename?: 'Permission';
  alert?: Maybe<Scalars['bool']['output']>;
  app?: Maybe<Scalars['bool']['output']>;
  color?: Maybe<Scalars['bool']['output']>;
  owner?: Maybe<Scalars['bool']['output']>;
  text?: Maybe<Scalars['bool']['output']>;
  timestamp?: Maybe<Scalars['bool']['output']>;
};

export type Permissions = {
  __typename?: 'Permissions';
  allowed_app?: Maybe<Scalars['ContractAddress']['output']>;
  allowing_app?: Maybe<Scalars['ContractAddress']['output']>;
  entity?: Maybe<Entity>;
  permission?: Maybe<Permission>;
};

export type PermissionsConnection = {
  __typename?: 'PermissionsConnection';
  edges?: Maybe<Array<Maybe<PermissionsEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type PermissionsEdge = {
  __typename?: 'PermissionsEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Permissions>;
};

export type PermissionsOrder = {
  direction: OrderDirection;
  field: PermissionsOrderField;
};

export enum PermissionsOrderField {
  AllowedApp = 'ALLOWED_APP',
  AllowingApp = 'ALLOWING_APP',
  Permission = 'PERMISSION'
}

export type PermissionsWhereInput = {
  allowed_app?: InputMaybe<Scalars['ContractAddress']['input']>;
  allowed_appEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  allowed_appGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  allowed_appGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  allowed_appLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  allowed_appLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  allowed_appNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  allowing_app?: InputMaybe<Scalars['ContractAddress']['input']>;
  allowing_appEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  allowing_appGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  allowing_appGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  allowing_appLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  allowing_appLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  allowing_appNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
};

export type Pixel = {
  __typename?: 'Pixel';
  alert?: Maybe<Scalars['felt252']['output']>;
  app?: Maybe<Scalars['ContractAddress']['output']>;
  color?: Maybe<Scalars['u32']['output']>;
  created_at?: Maybe<Scalars['u64']['output']>;
  entity?: Maybe<Entity>;
  owner?: Maybe<Scalars['ContractAddress']['output']>;
  text?: Maybe<Scalars['felt252']['output']>;
  timestamp?: Maybe<Scalars['u64']['output']>;
  updated_at?: Maybe<Scalars['u64']['output']>;
  x?: Maybe<Scalars['u64']['output']>;
  y?: Maybe<Scalars['u64']['output']>;
};

export type PixelConnection = {
  __typename?: 'PixelConnection';
  edges?: Maybe<Array<Maybe<PixelEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type PixelEdge = {
  __typename?: 'PixelEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Pixel>;
};

export type PixelOrder = {
  direction: OrderDirection;
  field: PixelOrderField;
};

export enum PixelOrderField {
  Alert = 'ALERT',
  App = 'APP',
  Color = 'COLOR',
  CreatedAt = 'CREATED_AT',
  Owner = 'OWNER',
  Text = 'TEXT',
  Timestamp = 'TIMESTAMP',
  UpdatedAt = 'UPDATED_AT',
  X = 'X',
  Y = 'Y'
}

export type PixelWhereInput = {
  alert?: InputMaybe<Scalars['felt252']['input']>;
  alertEQ?: InputMaybe<Scalars['felt252']['input']>;
  alertGT?: InputMaybe<Scalars['felt252']['input']>;
  alertGTE?: InputMaybe<Scalars['felt252']['input']>;
  alertLT?: InputMaybe<Scalars['felt252']['input']>;
  alertLTE?: InputMaybe<Scalars['felt252']['input']>;
  alertNEQ?: InputMaybe<Scalars['felt252']['input']>;
  app?: InputMaybe<Scalars['ContractAddress']['input']>;
  appEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  appGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  appGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  appLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  appLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  appNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  color?: InputMaybe<Scalars['u32']['input']>;
  colorEQ?: InputMaybe<Scalars['u32']['input']>;
  colorGT?: InputMaybe<Scalars['u32']['input']>;
  colorGTE?: InputMaybe<Scalars['u32']['input']>;
  colorLT?: InputMaybe<Scalars['u32']['input']>;
  colorLTE?: InputMaybe<Scalars['u32']['input']>;
  colorNEQ?: InputMaybe<Scalars['u32']['input']>;
  created_at?: InputMaybe<Scalars['u64']['input']>;
  created_atEQ?: InputMaybe<Scalars['u64']['input']>;
  created_atGT?: InputMaybe<Scalars['u64']['input']>;
  created_atGTE?: InputMaybe<Scalars['u64']['input']>;
  created_atLT?: InputMaybe<Scalars['u64']['input']>;
  created_atLTE?: InputMaybe<Scalars['u64']['input']>;
  created_atNEQ?: InputMaybe<Scalars['u64']['input']>;
  owner?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  text?: InputMaybe<Scalars['felt252']['input']>;
  textEQ?: InputMaybe<Scalars['felt252']['input']>;
  textGT?: InputMaybe<Scalars['felt252']['input']>;
  textGTE?: InputMaybe<Scalars['felt252']['input']>;
  textLT?: InputMaybe<Scalars['felt252']['input']>;
  textLTE?: InputMaybe<Scalars['felt252']['input']>;
  textNEQ?: InputMaybe<Scalars['felt252']['input']>;
  timestamp?: InputMaybe<Scalars['u64']['input']>;
  timestampEQ?: InputMaybe<Scalars['u64']['input']>;
  timestampGT?: InputMaybe<Scalars['u64']['input']>;
  timestampGTE?: InputMaybe<Scalars['u64']['input']>;
  timestampLT?: InputMaybe<Scalars['u64']['input']>;
  timestampLTE?: InputMaybe<Scalars['u64']['input']>;
  timestampNEQ?: InputMaybe<Scalars['u64']['input']>;
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

export type Query = {
  __typename?: 'Query';
  appbynameModels?: Maybe<AppByNameConnection>;
  appbysystemModels?: Maybe<AppBySystemConnection>;
  coreactionsaddressModels?: Maybe<CoreActionsAddressConnection>;
  entities?: Maybe<EntityConnection>;
  entity: Entity;
  events?: Maybe<EventConnection>;
  metadata: Metadata;
  metadatas?: Maybe<MetadataConnection>;
  model: Model;
  models?: Maybe<ModelConnection>;
  permissionsModels?: Maybe<PermissionsConnection>;
  pixelModels?: Maybe<PixelConnection>;
  queueitemModels?: Maybe<QueueItemConnection>;
  transaction: Transaction;
  transactions?: Maybe<TransactionConnection>;
};


export type QueryAppbynameModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<AppByNameOrder>;
  where?: InputMaybe<AppByNameWhereInput>;
};


export type QueryAppbysystemModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<AppBySystemOrder>;
  where?: InputMaybe<AppBySystemWhereInput>;
};


export type QueryCoreactionsaddressModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<CoreActionsAddressOrder>;
  where?: InputMaybe<CoreActionsAddressWhereInput>;
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
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
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


export type QueryPermissionsModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<PermissionsOrder>;
  where?: InputMaybe<PermissionsWhereInput>;
};


export type QueryPixelModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<PixelOrder>;
  where?: InputMaybe<PixelWhereInput>;
};


export type QueryQueueitemModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<QueueItemOrder>;
  where?: InputMaybe<QueueItemWhereInput>;
};


export type QueryTransactionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTransactionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type QueueItem = {
  __typename?: 'QueueItem';
  entity?: Maybe<Entity>;
  id?: Maybe<Scalars['felt252']['output']>;
  valid?: Maybe<Scalars['bool']['output']>;
};

export type QueueItemConnection = {
  __typename?: 'QueueItemConnection';
  edges?: Maybe<Array<Maybe<QueueItemEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type QueueItemEdge = {
  __typename?: 'QueueItemEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<QueueItem>;
};

export type QueueItemOrder = {
  direction: OrderDirection;
  field: QueueItemOrderField;
};

export enum QueueItemOrderField {
  Id = 'ID',
  Valid = 'VALID'
}

export type QueueItemWhereInput = {
  id?: InputMaybe<Scalars['felt252']['input']>;
  idEQ?: InputMaybe<Scalars['felt252']['input']>;
  idGT?: InputMaybe<Scalars['felt252']['input']>;
  idGTE?: InputMaybe<Scalars['felt252']['input']>;
  idLT?: InputMaybe<Scalars['felt252']['input']>;
  idLTE?: InputMaybe<Scalars['felt252']['input']>;
  idNEQ?: InputMaybe<Scalars['felt252']['input']>;
  valid?: InputMaybe<Scalars['bool']['input']>;
  validEQ?: InputMaybe<Scalars['bool']['input']>;
  validGT?: InputMaybe<Scalars['bool']['input']>;
  validGTE?: InputMaybe<Scalars['bool']['input']>;
  validLT?: InputMaybe<Scalars['bool']['input']>;
  validLTE?: InputMaybe<Scalars['bool']['input']>;
  validNEQ?: InputMaybe<Scalars['bool']['input']>;
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

export type Transaction = {
  __typename?: 'Transaction';
  calldata?: Maybe<Array<Maybe<Scalars['felt252']['output']>>>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  max_fee?: Maybe<Scalars['felt252']['output']>;
  nonce?: Maybe<Scalars['felt252']['output']>;
  sender_address?: Maybe<Scalars['felt252']['output']>;
  signature?: Maybe<Array<Maybe<Scalars['felt252']['output']>>>;
  transaction_hash?: Maybe<Scalars['felt252']['output']>;
};

export type TransactionConnection = {
  __typename?: 'TransactionConnection';
  edges?: Maybe<Array<Maybe<TransactionEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type TransactionEdge = {
  __typename?: 'TransactionEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Transaction>;
};

export type GetEntitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEntitiesQuery = { __typename?: 'Query', entities?: { __typename?: 'EntityConnection', edges?: Array<{ __typename?: 'EntityEdge', node?: { __typename?: 'Entity', keys?: Array<string | null> | null, models?: Array<{ __typename?: 'AppByName' } | { __typename?: 'AppBySystem' } | { __typename?: 'CoreActionsAddress' } | { __typename?: 'Permissions' } | { __typename: 'Pixel', x?: any | null, y?: any | null, app?: any | null } | { __typename?: 'QueueItem' } | null> | null } | null } | null> | null } | null };


export const GetEntitiesDocument = gql`
    query getEntities {
  entities(keys: ["*"], first: 4096) {
    edges {
      node {
        keys
        models {
          ... on Pixel {
            x
            y
            app
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
    getEntities(variables?: GetEntitiesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetEntitiesQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetEntitiesQuery>(GetEntitiesDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getEntities', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;