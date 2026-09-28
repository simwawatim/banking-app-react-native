import { authClient, publicClient } from "./client";

export interface ApiResponse<T> {
  status: "success" | "fail";
  message: string;
  data: T | null;
}

export interface AuthUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture: string | null;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user: AuthUser;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface ProfilePicture {
  profile_picture: string | null;
}

export interface RefreshTokenPayload {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
  refresh?: string;
}

export interface LogoutPayload {
  refresh: string;
}

async function unwrap<T>(
  request: Promise<{ data: ApiResponse<T> }>,
): Promise<ApiResponse<T>> {
  try {
    const response = await request;
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data as ApiResponse<T>;
    }

    return {
      status: "fail",
      message:
        "Unable to reach the server. Check your connection and try again.",
      data: null,
    };
  }
}

export const signup = (payload: SignupPayload) =>
  unwrap<AuthTokens>(publicClient.post("/signup/", payload));

export const login = (payload: LoginPayload) =>
  unwrap<AuthTokens>(publicClient.post("/login/", payload));

export const getProfile = () => unwrap<AuthUser>(authClient.get("/profile/"));

export const getProfilePicture = () =>
  unwrap<ProfilePicture>(authClient.get("/profile/picture/"));

export const updateProfilePicture = (file: File) => {
  const formData = new FormData();
  formData.append("profile_picture", file);

  return unwrap<AuthUser>(
    authClient.patch("/profile/picture/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  );
};

export const refreshToken = (payload: RefreshTokenPayload) =>
  unwrap<RefreshTokenResponse>(
    publicClient.post("/auth/token/refresh/", payload),
  );

export const logout = (payload: LogoutPayload) =>
  unwrap<null>(authClient.post("/auth/logout/", payload));
