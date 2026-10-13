/** A player without an account, remembered on their phone. */
export type Profile = {
  id: string;
  /** Shown in every game they joined, and filled in when they join a new one. */
  name: string;
};
