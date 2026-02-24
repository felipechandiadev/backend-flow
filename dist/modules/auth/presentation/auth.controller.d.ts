import { AuthService } from '../application/auth.service';
import { LoginDto } from '../application/dto/login.dto';
import { LoginResponseDto } from '../application/dto/login-response.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<LoginResponseDto>;
    logout(body: {
        userId: string;
    }): Promise<void>;
}
