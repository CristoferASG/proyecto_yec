import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { MessageEnum } from '@utils/enums';
import {
  CreateInstitutionDto,
  FilterInstitutionDto,
  UpdateInstitutionDto,
} from '@modules/core/roles/career-coordinator/dto';
import { InstitutionEntity } from '@modules/core/entities';
import { QueryBuilderHelper } from '@modules/core/shared-core/helpers';
import { CoreRepositoryEnum } from '@modules/core/shared-core/enums';

@Injectable()
export class InstitutionsService {
  private readonly searchableFields = ['name', 'shortName', 'code'] as const;

  constructor(
    @Inject(CoreRepositoryEnum.institutionRepository)
    private repository: Repository<InstitutionEntity>,
  ) {}

  async findAll(params: FilterInstitutionDto) {
    const query = this.repository.createQueryBuilder('institution');

    QueryBuilderHelper.applySearch(query, 'institution', this.searchableFields, params.search);
    QueryBuilderHelper.applySorting(query, 'institution', params.sort, params.order);

    if (params.page && params.limit) {
      QueryBuilderHelper.applyPagination(query, params.page, params.limit);
    }

    const [data, total] = await query.getManyAndCount();

    return { pagination: { totalItems: total, limit: params.limit }, data };
  }

  async findOne(id: string): Promise<InstitutionEntity> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(`La institución con id: ${id} no se encontró`);
    }

    return entity;
  }

  async create(payload: CreateInstitutionDto): Promise<InstitutionEntity> {
    await this.validateUniqueFields(payload);

    const newEntity = this.repository.create(payload);

    return await this.repository.save(newEntity);
  }

  async update(id: string, payload: UpdateInstitutionDto): Promise<InstitutionEntity> {
    const entity = await this.findOne(id);

    await this.validateUniqueFields(payload, id);

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

  async findByCode(code: string): Promise<InstitutionEntity> {
    const entity = await this.repository.findOne({ where: { code } });

    if (!entity) {
      throw new NotFoundException('La institución no se encontró');
    }

    return entity;
  }

  private async validateUniqueFields(
    payload: CreateInstitutionDto | UpdateInstitutionDto,
    id?: string,
  ): Promise<void> {
    const query = this.repository.createQueryBuilder('institution');

    if (id) {
      query.where('institution.id <> :id', { id });
    }

    query.andWhere(
      new Brackets((qb) => {
        qb.where('institution.code = :code', { code: payload.code }).orWhere(
          'institution.shortName = :shortName',
          { shortName: payload.shortName },
        );
      }),
    );

    const exists = await query.getCount();

    if (exists > 0) {
      throw new ConflictException('Ya existe una institución con ese código o nombre corto');
    }
  }
}
