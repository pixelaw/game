export type KatanaAccount = {
  address: string,
  balance: string,
  class_hash: string,
  private_key: string,
  public_key: string
}

export type Pixel = {
  x: number,
  y: number,
  created_at: number,
  updated_at: number,
  alert: string
  app: string,
  color: number,
  owner: string,
  text: string,
  timestamp: string,
}
