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
  CreateSchoolPeriodDto,
  FilterSchoolPeriodDto,
  UpdateSchoolPeriodDto,
} from '@modules/core/roles/career-coordinator/dto';
import { SchoolPeriodsService } from '@modules/core/roles/career-coordinator/services/school-periods.service';

@ApiTags('School Periods')
@Auth()
@Controller('core/career-coordinator/school-periods')
export class SchoolPeriodsController {
  constructor(private readonly service: SchoolPeriodsService) {}

  @ApiOperation({ summary: 'Find Open School Period' })
  @Get('open')
  @Roles(RoleEnum.admin, RoleEnum.career_coordinator)
  async findOpen(): Promise<ResponseHttpInterface> {
    const response = await this.service.findOpenSchoolPeriod();

    return {
      data: response,
      message: `Periodo lectivo abierto`,
      title: `Consultado`,
    };
  }

  @ApiOperation({ summary: 'Find All School Periods' })
  @Get()
  @Roles(RoleEnum.admin)
  async findAll(@Query() params: FilterSchoolPeriodDto): Promise<ResponseHttpInterface> {
    const response = await this.service.findAll(params);

    return {
      data: response.data,
      pagination: response.pagination,
      message: `Periodos lectivos`,
      title: `Consultado`,
    };
  }

  @ApiOperation({ summary: 'Find One School Period' })
  @Get(':id')
  @Roles(RoleEnum.admin)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const response = await this.service.findOne(id);

    return {
      data: response,
      message: `Periodo lectivo`,
      title: `Consultado`,
    };
  }

  @ApiOperation({ summary: 'Create School Period' })
  @Post()
  @Roles(RoleEnum.admin)
  async create(@Body() payload: CreateSchoolPeriodDto): Promise<ResponseHttpInterface> {
    const response = await this.service.create(payload);

    return {
      data: response,
      message: `El periodo lectivo se creó correctamente`,
      title: `Creado`,
    };
  }

  @ApiOperation({ summary: 'Update School Period' })
  @Patch(':id')
  @Roles(RoleEnum.admin)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateSchoolPeriodDto,
  ): Promise<ResponseHttpInterface> {
    const response = await this.service.update(id, payload);

    return {
      data: response,
      message: `El periodo lectivo se actualizó correctamente`,
      title: `Actualizado`,
    };
  }

  @ApiOperation({ summary: 'Open School Period' })
  @Patch(':id/open')
  @Roles(RoleEnum.admin)
  async open(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const response = await this.service.open(id);

    return {
      data: response,
      message: `El periodo lectivo se abrió correctamente`,
      title: `Abierto`,
    };
  }

  @ApiOperation({ summary: 'Close School Period' })
  @Patch(':id/close')
  @Roles(RoleEnum.admin)
  async close(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const response = await this.service.close(id);

    return {
      data: response,
      message: `El periodo lectivo se cerró correctamente`,
      title: `Cerrado`,
    };
  }

  @ApiOperation({ summary: 'Delete School Period' })
  @Delete(':id')
  @Roles(RoleEnum.admin)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    await this.service.remove(id);

    return {
      data: null,
      message: `El periodo lectivo se eliminó correctamente`,
      title: `Eliminado`,
    };
  }
}
