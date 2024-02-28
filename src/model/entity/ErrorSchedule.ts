import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import User from './User'

@Entity('ErrorSchedule')
export default class ErrorSchedule extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number

	@Column()
	public retryCount: number

	@ManyToOne(() => User, (user) => user.errorSchedules)
	user: User
}
