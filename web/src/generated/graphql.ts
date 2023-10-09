import { GraphQLClient } from 'graphql-request';
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
  Cursor: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  bool: { input: any; output: any; }
  felt252: { input: any; output: any; }
  u8: { input: any; output: any; }
  u32: { input: any; output: any; }
  u64: { input: any; output: any; }
  u128: { input: any; output: any; }
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
  totalCount: Scalars['Int']['output'];
};

export type ColorCount = {
  __typename?: 'ColorCount';
  count?: Maybe<Scalars['u128']['output']>;
  entity?: Maybe<Entity>;
  x?: Maybe<Scalars['u64']['output']>;
  y?: Maybe<Scalars['u64']['output']>;
};

export type ColorCountConnection = {
  __typename?: 'ColorCountConnection';
  edges?: Maybe<Array<Maybe<ColorCountEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type ColorCountEdge = {
  __typename?: 'ColorCountEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<ColorCount>;
};

export type ColorCountOrder = {
  direction: Direction;
  field: ColorCountOrderOrderField;
};

export enum ColorCountOrderOrderField {
  Count = 'COUNT',
  X = 'X',
  Y = 'Y'
}

export type ColorCountWhereInput = {
  count?: InputMaybe<Scalars['String']['input']>;
  countGT?: InputMaybe<Scalars['String']['input']>;
  countGTE?: InputMaybe<Scalars['String']['input']>;
  countLT?: InputMaybe<Scalars['String']['input']>;
  countLTE?: InputMaybe<Scalars['String']['input']>;
  countNEQ?: InputMaybe<Scalars['String']['input']>;
  x?: InputMaybe<Scalars['Int']['input']>;
  xGT?: InputMaybe<Scalars['Int']['input']>;
  xGTE?: InputMaybe<Scalars['Int']['input']>;
  xLT?: InputMaybe<Scalars['Int']['input']>;
  xLTE?: InputMaybe<Scalars['Int']['input']>;
  xNEQ?: InputMaybe<Scalars['Int']['input']>;
  y?: InputMaybe<Scalars['Int']['input']>;
  yGT?: InputMaybe<Scalars['Int']['input']>;
  yGTE?: InputMaybe<Scalars['Int']['input']>;
  yLT?: InputMaybe<Scalars['Int']['input']>;
  yLTE?: InputMaybe<Scalars['Int']['input']>;
  yNEQ?: InputMaybe<Scalars['Int']['input']>;
};

export type ColorEdge = {
  __typename?: 'ColorEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Color>;
};

export type ColorOrder = {
  direction: Direction;
  field: ColorOrderOrderField;
};

export enum ColorOrderOrderField {
  B = 'B',
  G = 'G',
  R = 'R',
  X = 'X',
  Y = 'Y'
}

export type ColorWhereInput = {
  b?: InputMaybe<Scalars['Int']['input']>;
  bGT?: InputMaybe<Scalars['Int']['input']>;
  bGTE?: InputMaybe<Scalars['Int']['input']>;
  bLT?: InputMaybe<Scalars['Int']['input']>;
  bLTE?: InputMaybe<Scalars['Int']['input']>;
  bNEQ?: InputMaybe<Scalars['Int']['input']>;
  g?: InputMaybe<Scalars['Int']['input']>;
  gGT?: InputMaybe<Scalars['Int']['input']>;
  gGTE?: InputMaybe<Scalars['Int']['input']>;
  gLT?: InputMaybe<Scalars['Int']['input']>;
  gLTE?: InputMaybe<Scalars['Int']['input']>;
  gNEQ?: InputMaybe<Scalars['Int']['input']>;
  r?: InputMaybe<Scalars['Int']['input']>;
  rGT?: InputMaybe<Scalars['Int']['input']>;
  rGTE?: InputMaybe<Scalars['Int']['input']>;
  rLT?: InputMaybe<Scalars['Int']['input']>;
  rLTE?: InputMaybe<Scalars['Int']['input']>;
  rNEQ?: InputMaybe<Scalars['Int']['input']>;
  x?: InputMaybe<Scalars['Int']['input']>;
  xGT?: InputMaybe<Scalars['Int']['input']>;
  xGTE?: InputMaybe<Scalars['Int']['input']>;
  xLT?: InputMaybe<Scalars['Int']['input']>;
  xLTE?: InputMaybe<Scalars['Int']['input']>;
  xNEQ?: InputMaybe<Scalars['Int']['input']>;
  y?: InputMaybe<Scalars['Int']['input']>;
  yGT?: InputMaybe<Scalars['Int']['input']>;
  yGTE?: InputMaybe<Scalars['Int']['input']>;
  yLT?: InputMaybe<Scalars['Int']['input']>;
  yLTE?: InputMaybe<Scalars['Int']['input']>;
  yNEQ?: InputMaybe<Scalars['Int']['input']>;
};

export type Component = {
  __typename?: 'Component';
  classHash?: Maybe<Scalars['felt252']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  transactionHash?: Maybe<Scalars['felt252']['output']>;
};

export type ComponentConnection = {
  __typename?: 'ComponentConnection';
  edges?: Maybe<Array<Maybe<ComponentEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type ComponentEdge = {
  __typename?: 'ComponentEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Component>;
};

export type ComponentUnion = Color | ColorCount | Game | NeedsAttention | Owner | Permission | PixelType | Player | Text | Timestamp;

export enum Direction {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Entity = {
  __typename?: 'Entity';
  componentNames?: Maybe<Scalars['String']['output']>;
  components?: Maybe<Array<Maybe<ComponentUnion>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type EntityConnection = {
  __typename?: 'EntityConnection';
  edges?: Maybe<Array<Maybe<EntityEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type EntityEdge = {
  __typename?: 'EntityEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Entity>;
};

export type Event = {
  __typename?: 'Event';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  data?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  keys?: Maybe<Scalars['String']['output']>;
  systemCall: SystemCall;
  systemCallId?: Maybe<Scalars['Int']['output']>;
};

export type EventConnection = {
  __typename?: 'EventConnection';
  edges?: Maybe<Array<Maybe<EventEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type EventEdge = {
  __typename?: 'EventEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Event>;
};

export type Game = {
  __typename?: 'Game';
  entity?: Maybe<Entity>;
  game_id?: Maybe<Scalars['u32']['output']>;
  player1?: Maybe<Scalars['felt252']['output']>;
  player1_commit?: Maybe<Scalars['u8']['output']>;
  player1_hash?: Maybe<Scalars['felt252']['output']>;
  player2?: Maybe<Scalars['felt252']['output']>;
  player2_commit?: Maybe<Scalars['u8']['output']>;
  player2_hash?: Maybe<Scalars['felt252']['output']>;
  started_timestamp?: Maybe<Scalars['u64']['output']>;
  state?: Maybe<Scalars['u8']['output']>;
  winner?: Maybe<Scalars['u8']['output']>;
  x?: Maybe<Scalars['u64']['output']>;
  y?: Maybe<Scalars['u64']['output']>;
};

export type GameConnection = {
  __typename?: 'GameConnection';
  edges?: Maybe<Array<Maybe<GameEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type GameEdge = {
  __typename?: 'GameEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Game>;
};

export type GameOrder = {
  direction: Direction;
  field: GameOrderOrderField;
};

export enum GameOrderOrderField {
  GameId = 'GAME_ID',
  Player1 = 'PLAYER1',
  Player1Commit = 'PLAYER1_COMMIT',
  Player1Hash = 'PLAYER1_HASH',
  Player2 = 'PLAYER2',
  Player2Commit = 'PLAYER2_COMMIT',
  Player2Hash = 'PLAYER2_HASH',
  StartedTimestamp = 'STARTED_TIMESTAMP',
  State = 'STATE',
  Winner = 'WINNER',
  X = 'X',
  Y = 'Y'
}

export type GameWhereInput = {
  game_id?: InputMaybe<Scalars['Int']['input']>;
  game_idGT?: InputMaybe<Scalars['Int']['input']>;
  game_idGTE?: InputMaybe<Scalars['Int']['input']>;
  game_idLT?: InputMaybe<Scalars['Int']['input']>;
  game_idLTE?: InputMaybe<Scalars['Int']['input']>;
  game_idNEQ?: InputMaybe<Scalars['Int']['input']>;
  player1?: InputMaybe<Scalars['String']['input']>;
  player1GT?: InputMaybe<Scalars['String']['input']>;
  player1GTE?: InputMaybe<Scalars['String']['input']>;
  player1LT?: InputMaybe<Scalars['String']['input']>;
  player1LTE?: InputMaybe<Scalars['String']['input']>;
  player1NEQ?: InputMaybe<Scalars['String']['input']>;
  player1_commit?: InputMaybe<Scalars['Int']['input']>;
  player1_commitGT?: InputMaybe<Scalars['Int']['input']>;
  player1_commitGTE?: InputMaybe<Scalars['Int']['input']>;
  player1_commitLT?: InputMaybe<Scalars['Int']['input']>;
  player1_commitLTE?: InputMaybe<Scalars['Int']['input']>;
  player1_commitNEQ?: InputMaybe<Scalars['Int']['input']>;
  player1_hash?: InputMaybe<Scalars['String']['input']>;
  player1_hashGT?: InputMaybe<Scalars['String']['input']>;
  player1_hashGTE?: InputMaybe<Scalars['String']['input']>;
  player1_hashLT?: InputMaybe<Scalars['String']['input']>;
  player1_hashLTE?: InputMaybe<Scalars['String']['input']>;
  player1_hashNEQ?: InputMaybe<Scalars['String']['input']>;
  player2?: InputMaybe<Scalars['String']['input']>;
  player2GT?: InputMaybe<Scalars['String']['input']>;
  player2GTE?: InputMaybe<Scalars['String']['input']>;
  player2LT?: InputMaybe<Scalars['String']['input']>;
  player2LTE?: InputMaybe<Scalars['String']['input']>;
  player2NEQ?: InputMaybe<Scalars['String']['input']>;
  player2_commit?: InputMaybe<Scalars['Int']['input']>;
  player2_commitGT?: InputMaybe<Scalars['Int']['input']>;
  player2_commitGTE?: InputMaybe<Scalars['Int']['input']>;
  player2_commitLT?: InputMaybe<Scalars['Int']['input']>;
  player2_commitLTE?: InputMaybe<Scalars['Int']['input']>;
  player2_commitNEQ?: InputMaybe<Scalars['Int']['input']>;
  player2_hash?: InputMaybe<Scalars['String']['input']>;
  player2_hashGT?: InputMaybe<Scalars['String']['input']>;
  player2_hashGTE?: InputMaybe<Scalars['String']['input']>;
  player2_hashLT?: InputMaybe<Scalars['String']['input']>;
  player2_hashLTE?: InputMaybe<Scalars['String']['input']>;
  player2_hashNEQ?: InputMaybe<Scalars['String']['input']>;
  started_timestamp?: InputMaybe<Scalars['Int']['input']>;
  started_timestampGT?: InputMaybe<Scalars['Int']['input']>;
  started_timestampGTE?: InputMaybe<Scalars['Int']['input']>;
  started_timestampLT?: InputMaybe<Scalars['Int']['input']>;
  started_timestampLTE?: InputMaybe<Scalars['Int']['input']>;
  started_timestampNEQ?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Int']['input']>;
  stateGT?: InputMaybe<Scalars['Int']['input']>;
  stateGTE?: InputMaybe<Scalars['Int']['input']>;
  stateLT?: InputMaybe<Scalars['Int']['input']>;
  stateLTE?: InputMaybe<Scalars['Int']['input']>;
  stateNEQ?: InputMaybe<Scalars['Int']['input']>;
  winner?: InputMaybe<Scalars['Int']['input']>;
  winnerGT?: InputMaybe<Scalars['Int']['input']>;
  winnerGTE?: InputMaybe<Scalars['Int']['input']>;
  winnerLT?: InputMaybe<Scalars['Int']['input']>;
  winnerLTE?: InputMaybe<Scalars['Int']['input']>;
  winnerNEQ?: InputMaybe<Scalars['Int']['input']>;
  x?: InputMaybe<Scalars['Int']['input']>;
  xGT?: InputMaybe<Scalars['Int']['input']>;
  xGTE?: InputMaybe<Scalars['Int']['input']>;
  xLT?: InputMaybe<Scalars['Int']['input']>;
  xLTE?: InputMaybe<Scalars['Int']['input']>;
  xNEQ?: InputMaybe<Scalars['Int']['input']>;
  y?: InputMaybe<Scalars['Int']['input']>;
  yGT?: InputMaybe<Scalars['Int']['input']>;
  yGTE?: InputMaybe<Scalars['Int']['input']>;
  yLT?: InputMaybe<Scalars['Int']['input']>;
  yLTE?: InputMaybe<Scalars['Int']['input']>;
  yNEQ?: InputMaybe<Scalars['Int']['input']>;
};

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
  totalCount: Scalars['Int']['output'];
};

export type NeedsAttentionEdge = {
  __typename?: 'NeedsAttentionEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<NeedsAttention>;
};

export type NeedsAttentionOrder = {
  direction: Direction;
  field: NeedsAttentionOrderOrderField;
};

export enum NeedsAttentionOrderOrderField {
  Value = 'VALUE',
  X = 'X',
  Y = 'Y'
}

export type NeedsAttentionWhereInput = {
  value?: InputMaybe<Scalars['Int']['input']>;
  valueGT?: InputMaybe<Scalars['Int']['input']>;
  valueGTE?: InputMaybe<Scalars['Int']['input']>;
  valueLT?: InputMaybe<Scalars['Int']['input']>;
  valueLTE?: InputMaybe<Scalars['Int']['input']>;
  valueNEQ?: InputMaybe<Scalars['Int']['input']>;
  x?: InputMaybe<Scalars['Int']['input']>;
  xGT?: InputMaybe<Scalars['Int']['input']>;
  xGTE?: InputMaybe<Scalars['Int']['input']>;
  xLT?: InputMaybe<Scalars['Int']['input']>;
  xLTE?: InputMaybe<Scalars['Int']['input']>;
  xNEQ?: InputMaybe<Scalars['Int']['input']>;
  y?: InputMaybe<Scalars['Int']['input']>;
  yGT?: InputMaybe<Scalars['Int']['input']>;
  yGTE?: InputMaybe<Scalars['Int']['input']>;
  yLT?: InputMaybe<Scalars['Int']['input']>;
  yLTE?: InputMaybe<Scalars['Int']['input']>;
  yNEQ?: InputMaybe<Scalars['Int']['input']>;
};

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
  totalCount: Scalars['Int']['output'];
};

export type OwnerEdge = {
  __typename?: 'OwnerEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Owner>;
};

export type OwnerOrder = {
  direction: Direction;
  field: OwnerOrderOrderField;
};

export enum OwnerOrderOrderField {
  Address = 'ADDRESS',
  X = 'X',
  Y = 'Y'
}

export type OwnerWhereInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  addressGT?: InputMaybe<Scalars['String']['input']>;
  addressGTE?: InputMaybe<Scalars['String']['input']>;
  addressLT?: InputMaybe<Scalars['String']['input']>;
  addressLTE?: InputMaybe<Scalars['String']['input']>;
  addressNEQ?: InputMaybe<Scalars['String']['input']>;
  x?: InputMaybe<Scalars['Int']['input']>;
  xGT?: InputMaybe<Scalars['Int']['input']>;
  xGTE?: InputMaybe<Scalars['Int']['input']>;
  xLT?: InputMaybe<Scalars['Int']['input']>;
  xLTE?: InputMaybe<Scalars['Int']['input']>;
  xNEQ?: InputMaybe<Scalars['Int']['input']>;
  y?: InputMaybe<Scalars['Int']['input']>;
  yGT?: InputMaybe<Scalars['Int']['input']>;
  yGTE?: InputMaybe<Scalars['Int']['input']>;
  yLT?: InputMaybe<Scalars['Int']['input']>;
  yLTE?: InputMaybe<Scalars['Int']['input']>;
  yNEQ?: InputMaybe<Scalars['Int']['input']>;
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
  totalCount: Scalars['Int']['output'];
};

export type PermissionEdge = {
  __typename?: 'PermissionEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Permission>;
};

export type PermissionOrder = {
  direction: Direction;
  field: PermissionOrderOrderField;
};

export enum PermissionOrderOrderField {
  Allowed = 'ALLOWED',
  CallerSystem = 'CALLER_SYSTEM',
  X = 'X',
  Y = 'Y'
}

export type PermissionWhereInput = {
  allowed?: InputMaybe<Scalars['Int']['input']>;
  allowedGT?: InputMaybe<Scalars['Int']['input']>;
  allowedGTE?: InputMaybe<Scalars['Int']['input']>;
  allowedLT?: InputMaybe<Scalars['Int']['input']>;
  allowedLTE?: InputMaybe<Scalars['Int']['input']>;
  allowedNEQ?: InputMaybe<Scalars['Int']['input']>;
  caller_system?: InputMaybe<Scalars['String']['input']>;
  caller_systemGT?: InputMaybe<Scalars['String']['input']>;
  caller_systemGTE?: InputMaybe<Scalars['String']['input']>;
  caller_systemLT?: InputMaybe<Scalars['String']['input']>;
  caller_systemLTE?: InputMaybe<Scalars['String']['input']>;
  caller_systemNEQ?: InputMaybe<Scalars['String']['input']>;
  x?: InputMaybe<Scalars['Int']['input']>;
  xGT?: InputMaybe<Scalars['Int']['input']>;
  xGTE?: InputMaybe<Scalars['Int']['input']>;
  xLT?: InputMaybe<Scalars['Int']['input']>;
  xLTE?: InputMaybe<Scalars['Int']['input']>;
  xNEQ?: InputMaybe<Scalars['Int']['input']>;
  y?: InputMaybe<Scalars['Int']['input']>;
  yGT?: InputMaybe<Scalars['Int']['input']>;
  yGTE?: InputMaybe<Scalars['Int']['input']>;
  yLT?: InputMaybe<Scalars['Int']['input']>;
  yLTE?: InputMaybe<Scalars['Int']['input']>;
  yNEQ?: InputMaybe<Scalars['Int']['input']>;
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
  totalCount: Scalars['Int']['output'];
};

export type PixelTypeEdge = {
  __typename?: 'PixelTypeEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<PixelType>;
};

export type PixelTypeOrder = {
  direction: Direction;
  field: PixelTypeOrderOrderField;
};

export enum PixelTypeOrderOrderField {
  Name = 'NAME',
  X = 'X',
  Y = 'Y'
}

export type PixelTypeWhereInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  nameGT?: InputMaybe<Scalars['String']['input']>;
  nameGTE?: InputMaybe<Scalars['String']['input']>;
  nameLT?: InputMaybe<Scalars['String']['input']>;
  nameLTE?: InputMaybe<Scalars['String']['input']>;
  nameNEQ?: InputMaybe<Scalars['String']['input']>;
  x?: InputMaybe<Scalars['Int']['input']>;
  xGT?: InputMaybe<Scalars['Int']['input']>;
  xGTE?: InputMaybe<Scalars['Int']['input']>;
  xLT?: InputMaybe<Scalars['Int']['input']>;
  xLTE?: InputMaybe<Scalars['Int']['input']>;
  xNEQ?: InputMaybe<Scalars['Int']['input']>;
  y?: InputMaybe<Scalars['Int']['input']>;
  yGT?: InputMaybe<Scalars['Int']['input']>;
  yGTE?: InputMaybe<Scalars['Int']['input']>;
  yLT?: InputMaybe<Scalars['Int']['input']>;
  yLTE?: InputMaybe<Scalars['Int']['input']>;
  yNEQ?: InputMaybe<Scalars['Int']['input']>;
};

export type Player = {
  __typename?: 'Player';
  entity?: Maybe<Entity>;
  player_id?: Maybe<Scalars['felt252']['output']>;
  wins?: Maybe<Scalars['u32']['output']>;
};

export type PlayerConnection = {
  __typename?: 'PlayerConnection';
  edges?: Maybe<Array<Maybe<PlayerEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type PlayerEdge = {
  __typename?: 'PlayerEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Player>;
};

export type PlayerOrder = {
  direction: Direction;
  field: PlayerOrderOrderField;
};

export enum PlayerOrderOrderField {
  PlayerId = 'PLAYER_ID',
  Wins = 'WINS'
}

export type PlayerWhereInput = {
  player_id?: InputMaybe<Scalars['String']['input']>;
  player_idGT?: InputMaybe<Scalars['String']['input']>;
  player_idGTE?: InputMaybe<Scalars['String']['input']>;
  player_idLT?: InputMaybe<Scalars['String']['input']>;
  player_idLTE?: InputMaybe<Scalars['String']['input']>;
  player_idNEQ?: InputMaybe<Scalars['String']['input']>;
  wins?: InputMaybe<Scalars['Int']['input']>;
  winsGT?: InputMaybe<Scalars['Int']['input']>;
  winsGTE?: InputMaybe<Scalars['Int']['input']>;
  winsLT?: InputMaybe<Scalars['Int']['input']>;
  winsLTE?: InputMaybe<Scalars['Int']['input']>;
  winsNEQ?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  colorComponents?: Maybe<ColorConnection>;
  colorcountComponents?: Maybe<ColorCountConnection>;
  component: Component;
  components?: Maybe<ComponentConnection>;
  entities?: Maybe<EntityConnection>;
  entity: Entity;
  event: Event;
  events?: Maybe<EventConnection>;
  gameComponents?: Maybe<GameConnection>;
  needsattentionComponents?: Maybe<NeedsAttentionConnection>;
  ownerComponents?: Maybe<OwnerConnection>;
  permissionComponents?: Maybe<PermissionConnection>;
  pixeltypeComponents?: Maybe<PixelTypeConnection>;
  playerComponents?: Maybe<PlayerConnection>;
  system: System;
  systemCall: SystemCall;
  systemCalls?: Maybe<SystemCallConnection>;
  systems?: Maybe<SystemConnection>;
  textComponents?: Maybe<TextConnection>;
  timestampComponents?: Maybe<TimestampConnection>;
};


export type QueryColorComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<ColorOrder>;
  where?: InputMaybe<ColorWhereInput>;
};


export type QueryColorcountComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<ColorCountOrder>;
  where?: InputMaybe<ColorCountWhereInput>;
};


export type QueryComponentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEntitiesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryEntityArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEventArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGameComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<GameOrder>;
  where?: InputMaybe<GameWhereInput>;
};


export type QueryNeedsattentionComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<NeedsAttentionOrder>;
  where?: InputMaybe<NeedsAttentionWhereInput>;
};


export type QueryOwnerComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<OwnerOrder>;
  where?: InputMaybe<OwnerWhereInput>;
};


export type QueryPermissionComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<PermissionOrder>;
  where?: InputMaybe<PermissionWhereInput>;
};


export type QueryPixeltypeComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<PixelTypeOrder>;
  where?: InputMaybe<PixelTypeWhereInput>;
};


export type QueryPlayerComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<PlayerOrder>;
  where?: InputMaybe<PlayerWhereInput>;
};


export type QuerySystemArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySystemCallArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTextComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<TextOrder>;
  where?: InputMaybe<TextWhereInput>;
};


export type QueryTimestampComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<TimestampOrder>;
  where?: InputMaybe<TimestampWhereInput>;
};

export type Subscription = {
  __typename?: 'Subscription';
  componentRegistered: Component;
  entityUpdated: Entity;
};

export type System = {
  __typename?: 'System';
  classHash?: Maybe<Scalars['felt252']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  systemCalls: Array<SystemCall>;
  transactionHash?: Maybe<Scalars['felt252']['output']>;
};

export type SystemCall = {
  __typename?: 'SystemCall';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  data?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  system: System;
  systemId?: Maybe<Scalars['ID']['output']>;
  transactionHash?: Maybe<Scalars['String']['output']>;
};

export type SystemCallConnection = {
  __typename?: 'SystemCallConnection';
  edges?: Maybe<Array<Maybe<SystemCallEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type SystemCallEdge = {
  __typename?: 'SystemCallEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<SystemCall>;
};

export type SystemConnection = {
  __typename?: 'SystemConnection';
  edges?: Maybe<Array<Maybe<SystemEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type SystemEdge = {
  __typename?: 'SystemEdge';
  cursor: Scalars['Cursor']['output'];
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
  totalCount: Scalars['Int']['output'];
};

export type TextEdge = {
  __typename?: 'TextEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Text>;
};

export type TextOrder = {
  direction: Direction;
  field: TextOrderOrderField;
};

export enum TextOrderOrderField {
  String = 'STRING',
  X = 'X',
  Y = 'Y'
}

export type TextWhereInput = {
  string?: InputMaybe<Scalars['String']['input']>;
  stringGT?: InputMaybe<Scalars['String']['input']>;
  stringGTE?: InputMaybe<Scalars['String']['input']>;
  stringLT?: InputMaybe<Scalars['String']['input']>;
  stringLTE?: InputMaybe<Scalars['String']['input']>;
  stringNEQ?: InputMaybe<Scalars['String']['input']>;
  x?: InputMaybe<Scalars['Int']['input']>;
  xGT?: InputMaybe<Scalars['Int']['input']>;
  xGTE?: InputMaybe<Scalars['Int']['input']>;
  xLT?: InputMaybe<Scalars['Int']['input']>;
  xLTE?: InputMaybe<Scalars['Int']['input']>;
  xNEQ?: InputMaybe<Scalars['Int']['input']>;
  y?: InputMaybe<Scalars['Int']['input']>;
  yGT?: InputMaybe<Scalars['Int']['input']>;
  yGTE?: InputMaybe<Scalars['Int']['input']>;
  yLT?: InputMaybe<Scalars['Int']['input']>;
  yLTE?: InputMaybe<Scalars['Int']['input']>;
  yNEQ?: InputMaybe<Scalars['Int']['input']>;
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
  totalCount: Scalars['Int']['output'];
};

export type TimestampEdge = {
  __typename?: 'TimestampEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Timestamp>;
};

export type TimestampOrder = {
  direction: Direction;
  field: TimestampOrderOrderField;
};

export enum TimestampOrderOrderField {
  CreatedAt = 'CREATED_AT',
  UpdatedAt = 'UPDATED_AT',
  X = 'X',
  Y = 'Y'
}

export type TimestampWhereInput = {
  created_at?: InputMaybe<Scalars['Int']['input']>;
  created_atGT?: InputMaybe<Scalars['Int']['input']>;
  created_atGTE?: InputMaybe<Scalars['Int']['input']>;
  created_atLT?: InputMaybe<Scalars['Int']['input']>;
  created_atLTE?: InputMaybe<Scalars['Int']['input']>;
  created_atNEQ?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['Int']['input']>;
  updated_atGT?: InputMaybe<Scalars['Int']['input']>;
  updated_atGTE?: InputMaybe<Scalars['Int']['input']>;
  updated_atLT?: InputMaybe<Scalars['Int']['input']>;
  updated_atLTE?: InputMaybe<Scalars['Int']['input']>;
  updated_atNEQ?: InputMaybe<Scalars['Int']['input']>;
  x?: InputMaybe<Scalars['Int']['input']>;
  xGT?: InputMaybe<Scalars['Int']['input']>;
  xGTE?: InputMaybe<Scalars['Int']['input']>;
  xLT?: InputMaybe<Scalars['Int']['input']>;
  xLTE?: InputMaybe<Scalars['Int']['input']>;
  xNEQ?: InputMaybe<Scalars['Int']['input']>;
  y?: InputMaybe<Scalars['Int']['input']>;
  yGT?: InputMaybe<Scalars['Int']['input']>;
  yGTE?: InputMaybe<Scalars['Int']['input']>;
  yLT?: InputMaybe<Scalars['Int']['input']>;
  yLTE?: InputMaybe<Scalars['Int']['input']>;
  yNEQ?: InputMaybe<Scalars['Int']['input']>;
};

export type GetEntitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEntitiesQuery = { __typename?: 'Query', entities?: { __typename?: 'EntityConnection', edges?: Array<{ __typename?: 'EntityEdge', node?: { __typename?: 'Entity', keys?: Array<string | null> | null, components?: Array<{ __typename: 'Color', x?: any | null, y?: any | null, r?: any | null, g?: any | null, b?: any | null } | { __typename: 'ColorCount', x?: any | null, y?: any | null, count?: any | null } | { __typename?: 'Game' } | { __typename: 'NeedsAttention', x?: any | null, y?: any | null, value?: any | null } | { __typename: 'Owner', x?: any | null, y?: any | null, address?: any | null } | { __typename?: 'Permission' } | { __typename: 'PixelType', x?: any | null, y?: any | null, name?: any | null } | { __typename?: 'Player' } | { __typename?: 'Text', x?: any | null, y?: any | null, string?: any | null } | { __typename: 'Timestamp', x?: any | null, y?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null } | null } | null> | null } | null };

export type All_Filtered_EntitiesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  xMin?: InputMaybe<Scalars['Int']['input']>;
  xMax?: InputMaybe<Scalars['Int']['input']>;
  yMin?: InputMaybe<Scalars['Int']['input']>;
  yMax?: InputMaybe<Scalars['Int']['input']>;
}>;


export type All_Filtered_EntitiesQuery = { __typename?: 'Query', colorComponents?: { __typename?: 'ColorConnection', edges?: Array<{ __typename?: 'ColorEdge', node?: { __typename?: 'Color', x?: any | null, y?: any | null, r?: any | null, g?: any | null, b?: any | null, entity?: { __typename?: 'Entity', id?: string | null } | null } | null } | null> | null } | null, ownerComponents?: { __typename?: 'OwnerConnection', edges?: Array<{ __typename?: 'OwnerEdge', node?: { __typename?: 'Owner', x?: any | null, y?: any | null, address?: any | null, entity?: { __typename?: 'Entity', id?: string | null } | null } | null } | null> | null } | null, pixeltypeComponents?: { __typename?: 'PixelTypeConnection', edges?: Array<{ __typename?: 'PixelTypeEdge', node?: { __typename?: 'PixelType', x?: any | null, y?: any | null, name?: any | null } | null } | null> | null } | null };

export type GetNeedsAttentionQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  address?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetNeedsAttentionQuery = { __typename?: 'Query', ownerComponents?: { __typename?: 'OwnerConnection', edges?: Array<{ __typename?: 'OwnerEdge', node?: { __typename?: 'Owner', x?: any | null, y?: any | null, address?: any | null } | null } | null> | null } | null, needsattentionComponents?: { __typename?: 'NeedsAttentionConnection', edges?: Array<{ __typename?: 'NeedsAttentionEdge', node?: { __typename?: 'NeedsAttention', x?: any | null, y?: any | null, value?: any | null } | null } | null> | null } | null };


export const GetEntitiesDocument = gql`
    query getEntities {
  entities(keys: ["%"], first: 4096) {
    edges {
      node {
        keys
        components {
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
          }
          ... on PixelType {
            x
            y
            name
            __typename
          }
          ... on ColorCount {
            x
            y
            count
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
export const All_Filtered_EntitiesDocument = gql`
    query all_filtered_entities($first: Int, $xMin: Int, $xMax: Int, $yMin: Int, $yMax: Int) {
  colorComponents(
    first: $first
    where: {xGTE: $xMin, xLTE: $xMax, yGTE: $yMin, yLTE: $yMax}
  ) {
    edges {
      node {
        x
        y
        r
        g
        b
        entity {
          id
        }
      }
    }
  }
  ownerComponents(
    first: $first
    where: {xGTE: $xMin, xLTE: $xMax, yGTE: $yMin, yLTE: $yMax}
  ) {
    edges {
      node {
        x
        y
        address
        entity {
          id
        }
      }
    }
  }
  pixeltypeComponents(
    first: $first
    where: {xGTE: $xMin, xLTE: $xMax, yGTE: $yMin, yLTE: $yMax}
  ) {
    edges {
      node {
        x
        y
        name
      }
    }
  }
}
    `;
export const GetNeedsAttentionDocument = gql`
    query getNeedsAttention($first: Int, $address: String) {
  ownerComponents(first: $first, where: {address: $address}) {
    edges {
      node {
        x
        y
        address
      }
    }
  }
  needsattentionComponents(first: $first, where: {value: 1}) {
    edges {
      node {
        x
        y
        value
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();
const GetEntitiesDocumentString = print(GetEntitiesDocument);
const All_Filtered_EntitiesDocumentString = print(All_Filtered_EntitiesDocument);
const GetNeedsAttentionDocumentString = print(GetNeedsAttentionDocument);
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getEntities(variables?: GetEntitiesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetEntitiesQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetEntitiesQuery>(GetEntitiesDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getEntities', 'query');
    },
    all_filtered_entities(variables?: All_Filtered_EntitiesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: All_Filtered_EntitiesQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<All_Filtered_EntitiesQuery>(All_Filtered_EntitiesDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'all_filtered_entities', 'query');
    },
    getNeedsAttention(variables?: GetNeedsAttentionQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetNeedsAttentionQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetNeedsAttentionQuery>(GetNeedsAttentionDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getNeedsAttention', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;