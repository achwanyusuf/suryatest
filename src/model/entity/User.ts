import { BaseEntity, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Column, OneToMany } from 'typeorm'
import ErrorSchedule from './ErrorSchedule'

@Entity('User')
export default class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number

	@Column()
	public firstname: string

	@Column()
	public lastname: string

	@Column({ type: 'date' })
	public bod: string

	@Column()
	public local: string

	@Column()
	public email: string

	@CreateDateColumn()
	public createdAt: Date

	@UpdateDateColumn()
	public updatedAt: Date

	@DeleteDateColumn({
		nullable: true
	})
	public deletedAt: Date

	@Column()
	public createdBy: number

	@Column()
	public updatedBy: number

	@Column({
		nullable: true
	})
	public deletedBy: number

	@OneToMany(() => ErrorSchedule, errorSchedule => errorSchedule.user)
	errorSchedules: ErrorSchedule[]
}
