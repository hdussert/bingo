/** A player without an account, remembered on their phone. */
export type Profile = {
  id: string;
  /** The name they last used, filled in when they join a new game. */
  name: string;
};
