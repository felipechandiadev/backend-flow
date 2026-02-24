export interface LoginResponseDto {
  success: boolean;
  user?: {
    id: string;
    userName: string;
    email: string;
    rol: string;
    person?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string | null;
      phone: string | null;
    } | null;
  };
  message?: string;
}
