interface IUser {
  email: string | null;
  homepage: string | null;
  phone: string | null;
  realname: string;
  username: string;

}

export interface IUpdateProfileBody {
  email?: string | null;
  phone?: string | null;
  homepage?: string | null;
  nickname?: string | null;
}

export interface IProfile extends IUser {
  is_valid: number;
  nickname: string;
  phone: string;
  user_addition: null | object;
  user_id: number;
}
