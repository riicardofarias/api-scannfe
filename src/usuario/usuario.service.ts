import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';

/**
 * Classe responsável por armazenar e retornar os dados referentes aos usuários
 */
@Injectable()
export class UsuarioService {

    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
    ) { }

    /**
     * Atualiza os dados do usuário
     * @param usuario Usuario
     */
    async mergeByEmail(usuario: Usuario): Promise<Usuario> {
        const dbUser = await this.usuarioRepository.findOne({ email: usuario.email });
        if (dbUser) {
            await this.usuarioRepository.update({ id: dbUser.id }, usuario);
            return this.usuarioRepository.findOne({ id: dbUser.id });
        }
        return this.usuarioRepository.save(usuario);
    }

    /**
     * Retorna um usuário pelo código de identificação
     * @param id Código do usuário
     */
    findById(id: number): Promise<Usuario> {
        return this.usuarioRepository.findOne({ id: id });
    }
}
