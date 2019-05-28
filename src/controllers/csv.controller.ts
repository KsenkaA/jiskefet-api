import { Controller, Get, Param, HttpException, Res, Render } from '@nestjs/common';
import { Log } from '../entities/log.entity';
import { getManager } from 'typeorm';
import { Run } from '../entities/run.entity';
import { User } from '../entities/user.entity';
import { SubSystem } from '../entities/sub_system.entity';
import { Response } from 'express';

@Controller('csv')
export class CsvController {
    @Get()
    @Render('csv')
    root(): { message: string } {
        return { message: 'Hello world!' };
    }
    @Get('colDelimiter=:colDelimiter&tableName=:tableName&columns=:columns')
    async findAll(@Param() params, @Res() res: Response): Promise<void> {
        let repository;
        const table = params.tableName;
        if (table === 'log' || table === 'Log') {
            repository = getManager().getRepository(Log);
        } else if (table === 'Run' || table === 'run') {
            repository = getManager().getRepository(Run);
        } else if (table === 'User' || table === 'user') {
            repository = getManager().getRepository(User);
        } else if (table === 'SubSystem' || table === 'subSystem') {
            repository = getManager().getRepository(SubSystem);
        } else {
            throw new HttpException(`Table '${table}' does not exist.`, 404);
        }
        const colDelimiter = params.colDelimiter;
        let columns = params.columns;
        if (columns === 'got_no_columns') {
            throw new HttpException(`Specify the columns.`, 404);
        }
        columns = params.columns.split(',');
        const data1 = [columns];
        let str = [];
        let result;
        try {
            result = await repository.find({select: columns});
        } catch (e) {
            throw new HttpException(`No such columns in the table.`, 404);
        }
        for (const elem of result) {
            str = [];
            for (const key in elem) {
                str.push(elem[key]);
            }
            data1.push(str);
        }
        const fastcsv = require('fast-csv');
        const fs = require('fs');
        const ws = fs.createWriteStream('out.csv');
        fastcsv
            .write(data1, {
                headers: true,
                delimiter: colDelimiter,
            })
            .on('end', () => {
                res.download('out.csv');
            })
            .pipe(ws);
    }
}
