import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CatalogueSchoolPeriodStateEnum, MessageEnum } from '@utils/enums';
import {
  CreateSchoolPeriodDto,
  FilterSchoolPeriodDto,
  UpdateSchoolPeriodDto,
} from '@modules/core/roles/career-coordinator/dto';
import { CatalogueEntity, SchoolPeriodEntity } from '@modules/core/entities';
import { QueryBuilderHelper } from '@modules/core/shared-core/helpers';
import { CoreRepositoryEnum } from '@modules/core/shared-core/enums';

@Injectable()
export class SchoolPeriodsService {
  private readonly searchableFields = ['name', 'shortName', 'code', 'codeSniese'] as const;

  constructor(
    @Inject(CoreRepositoryEnum.schoolPeriodRepository)
    private repository: Repository<SchoolPeriodEntity>,
    @Inject(CoreRepositoryEnum.catalogueRepository)
    private catalogueRepository: Repository<CatalogueEntity>,
  ) {}

  async findAll(params: FilterSchoolPeriodDto) {
    const query = this.repository.createQueryBuilder('schoolPeriod');

    QueryBuilderHelper.applySearch(query, 'schoolPeriod', this.searchableFields, params.search);
    QueryBuilderHelper.applySorting(query, 'schoolPeriod', params.sort, params.order);

    if (params.page && params.limit) {
      QueryBuilderHelper.applyPagination(query, params.page, params.limit);
    }

    const [data, total] = await query.getManyAndCount();

    return { pagination: { totalItems: total, limit: params.limit }, data };
  }

  async findOne(id: string): Promise<SchoolPeriodEntity> {
    const entity = await this.repository.findOne({
      relations: ['state', 'institution'],
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(`El periodo lectivo con id: ${id} no se encontró`);
    }

    return entity;
  }

  async create(payload: CreateSchoolPeriodDto): Promise<SchoolPeriodEntity> {
    const stateOpen = await this.findStateByCode(CatalogueSchoolPeriodStateEnum.open);

    const newEntity = this.repository.create({
      ...payload,
      stateId: stateOpen.id,
    });

    return await this.repository.save(newEntity);
  }

  async update(id: string, payload: UpdateSchoolPeriodDto): Promise<SchoolPeriodEntity> {
    const entity = await this.findOne(id);

    this.repository.merge(entity, payload);

    return await this.repository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(MessageEnum.NOT_FOUND);
    }

    await this.repository.softRemove(entity);
  }

  async open(id: string): Promise<SchoolPeriodEntity> {
    const entity = await this.findOne(id);

    if (entity.state?.code === CatalogueSchoolPeriodStateEnum.open) {
      throw new BadRequestException(MessageEnum.EXISTS_OPEN_SCHOOL_PERIOD);
    }

    const existOpen = await this.repository.findOne({
      relations: ['state'],
      where: { state: { code: CatalogueSchoolPeriodStateEnum.open } },
    });

    if (existOpen) {
      throw new BadRequestException(
        `${MessageEnum.EXISTS_OPEN_SCHOOL_PERIOD} (${existOpen.name})`,
      );
    }

    const stateOpen = await this.findStateByCode(CatalogueSchoolPeriodStateEnum.open);
    entity.stateId = stateOpen.id;

    return await this.repository.save(entity);
  }

  async close(id: string): Promise<SchoolPeriodEntity> {
    const entity = await this.findOne(id);

    if (entity.state?.code === CatalogueSchoolPeriodStateEnum.close) {
      throw new BadRequestException(MessageEnum.EXISTS_CLOSE_SCHOOL_PERIOD);
    }

    const stateClose = await this.findStateByCode(CatalogueSchoolPeriodStateEnum.close);
    entity.stateId = stateClose.id;

    return await this.repository.save(entity);
  }

  async findOpenSchoolPeriod(): Promise<SchoolPeriodEntity | null> {
    return await this.repository.findOne({
      relations: ['state'],
      where: { state: { code: CatalogueSchoolPeriodStateEnum.open } },
    });
  }

  private async findStateByCode(code: string): Promise<CatalogueEntity> {
    const state = await this.catalogueRepository.findOne({ where: { code } });

    if (!state) {
      throw new NotFoundException(`No se encontró el catálogo de estado con código: ${code}`);
    }

    return state;
  }
}
