import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('user_authority')
export class UserAuthority {
  @PrimaryColumn()
  id: string;

  @Column('varchar', { name: 'user_id' })
  userId: string;

  @Column('varchar', { name: 'authority_name' })
  authorityName: string;

  @ManyToOne((type) => User, (user) => user.authorities)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
