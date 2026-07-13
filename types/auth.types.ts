export type UserAuthority = "User" | "Admin";

/** Backend `UserInfoDto` — field names/casing preserved as returned by the API. */
export interface UserInfoDto {
  userId: string;
  userName: string;
  authority: UserAuthority[];
  email: string;
  phone: string | null;
  /** Intentionally misspelled on the backend — do not "fix" this key. */
  curency: string | null;
}

export interface LoginResponseDto {
  token: string;
  user: UserInfoDto;
}
