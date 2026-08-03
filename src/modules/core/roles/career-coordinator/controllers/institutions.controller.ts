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
  CreateInstitutionDto,
  FilterInstitutionDto,
  UpdateInstitutionDto,
} from '@modules/core/roles/career-coordinator/dto';
import { InstitutionsService } from '@modules/core/roles/career-coordinator/services/institutions.service';

@ApiTags('Institutions')
@Auth()
@Controller('core/career-coordinator/institutions')
export class InstitutionsController {
  constructor(private readonly service: InstitutionsService) {}

  @ApiOperation({ summary: 'Find All Institutions' })
  @Get()
  @Roles(RoleEnum.admin)
  async findAll(@Query() params: FilterInstitutionDto): Promise<ResponseHttpInterface> {
    const response = await this.service.findAll(params);

    return {
      data: response.data,
      pagination: response.pagination,
      message: `Instituciones`,
      title: `Consultado`,
    };
  }

  @ApiOperation({ summary: 'Find One Institution' })
  @Get(':id')
  @Roles(RoleEnum.admin)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const response = await this.service.findOne(id);

    return {
      data: response,
      message: `Institución`,
      title: `Consultado`,
    };
  }

  @ApiOperation({ summary: 'Create Institution' })
  @Post()
  @Roles(RoleEnum.admin)
  async create(@Body() payload: CreateInstitutionDto): Promise<ResponseHttpInterface> {
    const response = await this.service.create(payload);

    return {
      data: response,
      message: `La institución se creó correctamente`,
      title: `Creado`,
    };
  }

  @ApiOperation({ summary: 'Update Institution' })
  @Patch(':id')
  @Roles(RoleEnum.admin)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateInstitutionDto,
  ): Promise<ResponseHttpInterface> {
    const response = await this.service.update(id, payload);

    return {
      data: response,
      message: `La institución se actualizó correctamente`,
      title: `Actualizado`,
    };
  }

  @ApiOperation({ summary: 'Delete Institution' })
  @Delete(':id')
  @Roles(RoleEnum.admin)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    await this.service.remove(id);

    return {
      data: null,
      message: `La institución se eliminó correctamente`,
      title: `Eliminado`,
    };
  }
}
