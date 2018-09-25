import { Entity, PrimaryGeneratedColumn, Column, Timestamp } from 'typeorm';

@Entity('RunQualityHistory')
export class RunQualityHistory {

    @PrimaryGeneratedColumn({ type: 'bigint' })
    run_quality_history_id: number;

    @Column({ type: 'int' })
    fk_run_number: number;

    @Column({ type: 'enum' })
    subsystem: Enumerator;

    @Column({ type: 'int' })
    fk_changed_by_user_id: number;

    @Column({ type: 'timestamp' })
    change_time: Timestamp;

    @Column({ type: 'enum' })
    end_of_run_season: Enumerator;
}