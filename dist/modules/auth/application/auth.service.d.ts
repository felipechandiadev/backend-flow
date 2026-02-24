import { Repository } from 'typeorm';
import { User } from '@modules/users/domain/user.entity';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
export declare class AuthService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    login(loginDto: LoginDto): Promise<LoginResponseDto>;
    logout(userId: string): Promise<void>;
}
