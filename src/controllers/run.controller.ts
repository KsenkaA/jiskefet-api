/*
 * Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 */
import { Get, Controller, Body, Param } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { RunService } from 'services/run.service';
import { CreateRunDto } from 'dtos/create.run.dto';
import { Run } from '../entities/run.entity';

@ApiUseTags('runs')
@Controller('runs')
export class RunController {
    constructor(private readonly runService: RunService) { }

    /**
     * Post a new Run into the db.
     * @param request CreateRunDto from frontend
     */
    @Post()
    async create(@Body() request: CreateRunDto) {
        request.timeO2Start = new Date();
        request.timeTrgStart = new Date();
        request.timeO2End = new Date();
        request.timeTrgEnd = new Date();
        await this.runService.create(request);
    }

    /**
     * Get all Runs from db.
     */
    @Get()
    async findAll() {
        return await this.runService.findAllRuns();
    }

    /**
     * Find a specific Log item. /logs/id
     * @param id unique identifier for a Log item.
     */
    @Get(':id')
    async findById(@Param('id') id: number): Promise<Run> {
        return await this.runService.findRunById(id);
    }

}