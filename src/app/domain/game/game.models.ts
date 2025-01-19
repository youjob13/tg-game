export interface IMember {
  id: string;
  name: string;
  isReady: boolean;
}

export interface IPlayer extends Omit<IMember, 'isReady'> {}
