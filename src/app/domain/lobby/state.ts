import { IMember } from '../game/game.models';

export interface ILobbyState {
  isLoading: boolean;
  members: IMember[];
  gameRequirementMembersCount: number;
}

export const initialLobbyState: ILobbyState = {
  isLoading: false,
  members: [],
  gameRequirementMembersCount: 4,
};
