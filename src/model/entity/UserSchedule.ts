import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('UserSchedule')
export default class UserSchedule extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number

	@Column()
	public local: string

	@Column({ type: 'date' })
	public lastDate: string

	@Column()
	public cursor: number
}
