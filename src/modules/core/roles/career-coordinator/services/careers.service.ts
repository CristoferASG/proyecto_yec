import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import {
  CreateCareerDto,
  FilterCareerDto,
  UpdateCareerDto,
} from '@modules/core/roles/career-coordinator/dto';
import { CareerEntity } from '@modules/core/entities';
import { QueryBuilderHelper } from '@modules/core/shared-core/helpers';
import { CoreRepositoryEnum } from '@modules/core/shared-core/enums';

@Injectable()
export class CareersService {
  private readonly searchableFields = ['name', 'shortName', 'resolutionNumber'] as const;

  constructor(
    @Inject(CoreRepositoryEnum.careerRepository) private repository: Repository<CareerEntity>,
  ) {}

  async findAll(params: FilterCareerDto) {
    const query = this.repository.createQueryBuilder('career');

    QueryBuilderHelper.applySearch(query, 'career', this.searchableFields, params.search);

    QueryBuilderHelper.applySorting(query, 'career', params.sort, params.order);

    if (params.page && params.limit)
      QueryBuilderHelper.applyPagination(query, params.page, params.limit);

    const [data, total] = await query.getManyAndCount();

    return { pagination: { totalItems: total, limit: params.limit }, data: data };
  }

  async findOne(id: string): Promise<CareerEntity> {
    const entity = await this.repository.findOne({
      relations: ['institution', 'modality', 'state', 'type'],
      where: {
        id,
      },
    });

    if (!entity) {
      throw new NotFoundException(`La carrera con id:  ${id} no se encontró`);
    }

    return entity;
  }

  async create(payload: CreateCareerDto): Promise<CareerEntity> {
    await this.validateUniqueFields(payload);

    const newEntity: CareerEntity = this.repository.create(payload);

    return await this.repository.save(newEntity);
  }

  async update(id: string, payload: UpdateCareerDto): Promise<CareerEntity> {
    const entity = await this.findOneOrFail(id);

    if (!entity) {
      throw new NotFoundException({
        error: 'No encontrado',
        message: 'Carrera no encontrada',
      });
    }

    await this.validateUniqueFields(payload, id);

    this.repository.merge(entity, payload);

    return await this.repository.save(entity);
  }

  async remove(id: string): Promise<CareerEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException({
        error: 'No encontrado',
        message: 'Carrera no encontrada',
      });
    }

    return await this.repository.softRemove(entity);
  }

  private async validateUniqueFields(
    payload: CreateCareerDto | UpdateCareerDto,
    id?: string,
  ): Promise<void> {
    const query = this.repository.createQueryBuilder('career');

    if (id) {
      query.where('career.id <> :id', { id });
    }

    query.andWhere(
      new Brackets((qb) => {
        qb.where('career.code = :code', { code: payload.code })
          .orWhere('career.shortName = :shortName', {
            shortName: payload.shortName,
          })
          .orWhere('career.resolutionNumber = :resolutionNumber', {
            resolutionNumber: payload.resolutionNumber,
          });
      }),
    );

    const career = await query.getOne();

    if (!career) {
      return;
    }

    if (career.code === payload.code) {
      throw new ConflictException('El código ya existe.');
    }

    if (career.shortName === payload.shortName) {
      throw new ConflictException('El nombre corto ya existe.');
    }

    if (career.resolutionNumber === payload.resolutionNumber) {
      throw new ConflictException('El número de resolución ya existe.');
    }
  }

  private async findOneOrFail(id: string): Promise<CareerEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException({
        error: 'No encontrado',
        message: 'Carrera no encontrada',
      });
    }

    return entity;
  }
}
