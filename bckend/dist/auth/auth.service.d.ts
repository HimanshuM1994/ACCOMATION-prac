import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
            invoices: import("../invoice/entities/invoice.entity").Invoice[];
            createdAt: Date;
            updatedAt: Date;
        };
        access_token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
            invoices: import("../invoice/entities/invoice.entity").Invoice[];
            createdAt: Date;
            updatedAt: Date;
        };
        access_token: string;
    }>;
    validateUser(userId: number): Promise<User>;
}
