import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth, Roles } from '@auth/decorators';
import { RoleEnum } from '@auth/enums';
import { ResponseHttpInterface } from '@utils/interfaces';
import {
  CreateSubjectDto,
  FilterSubjectDto,
  UpdateSubjectDto,
} from '@modules/core/roles/career-coordinator/dto';
import { SubjectsService } from '@modules/core/roles/career-coordinator/services/subjects.service';

@ApiTags('Subjects')
@Auth()
@Controller('core/career-coordinator/subjects')
export class SubjectsController {
  constructor(private readonly service: SubjectsService) {}

  @ApiOperation({ summary: 'Find All Subjects' })
  @Get()
  @Roles(RoleEnum.admin)
  async findAll(@Query() params: FilterSubjectDto): Promise<ResponseHttpInterface> {
    const response = await this.service.findAll(params);

    return {
      data: response.data,
      pagination: response.pagination,
      message: `Asignaturas`,
      title: `Consultado`,
    };
  }

  @ApiOperation({ summary: 'Find Subjects by Career' })
  @Get('career/:careerId')
  @Roles(RoleEnum.admin, RoleEnum.career_coordinator)
  async findSubjectsByCareer(
    @Param('careerId', ParseUUIDPipe) careerId: string,
  ): Promise<ResponseHttpInterface> {
    const response = await this.service.findSubjectsByCareer(careerId);

    return {
      data: response,
      message: `Asignaturas por carrera`,
      title: `Consultado`,
    };
  }

  @ApiOperation({ summary: 'Find One Subject' })
  @Get(':id')
  @Roles(RoleEnum.admin)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const response = await this.service.findOne(id);

    return {
      data: response,
      message: `Asignatura`,
      title: `Consultado`,
    };
  }

  @ApiOperation({ summary: 'Create Subject' })
  @Post()
  @Roles(RoleEnum.admin)
  async create(@Body() payload: CreateSubjectDto): Promise<ResponseHttpInterface> {
    const response = await this.service.create(payload);

    return {
      data: response,
      message: `La asignatura se creó correctamente`,
      title: `Creado`,
    };
  }

  @ApiOperation({ summary: 'Update Subject' })
  @Patch(':id')
  @Roles(RoleEnum.admin)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateSubjectDto,
  ): Promise<ResponseHttpInterface> {
    const response = await this.service.update(id, payload);

    return {
      data: response,
      message: `La asignatura se actualizó correctamente`,
      title: `Actualizado`,
    };
  }

  @ApiOperation({ summary: 'Delete Subject' })
  @Delete(':id')
  @Roles(RoleEnum.admin)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    await this.service.remove(id);

    return {
      data: null,
      message: `La asignatura se eliminó correctamente`,
      title: `Eliminado`,
    };
  }
}
