import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { MessageEnum } from '@utils/enums';
import {
  CreateSubjectDto,
  FilterSubjectDto,
  UpdateSubjectDto,
} from '@modules/core/roles/career-coordinator/dto';
import { SubjectEntity } from '@modules/core/entities';
import { QueryBuilderHelper } from '@modules/core/shared-core/helpers';
import { CoreRepositoryEnum } from '@modules/core/shared-core/enums';

@Injectable()
export class SubjectsService {
  private readonly searchableFields = ['name', 'code'] as const;

  constructor(
    @Inject(CoreRepositoryEnum.subjectRepository)
    private repository: Repository<SubjectEntity>,
    @Inject(CoreRepositoryEnum.careerRepository)
    private careerRepository: Repository<import('@modules/core/entities').CareerEntity>,
  ) {}

  async findAll(params: FilterSubjectDto) {
    const query = this.repository.createQueryBuilder('subject');

    QueryBuilderHelper.applySearch(query, 'subject', this.searchableFields, params.search);
    QueryBuilderHelper.applySorting(query, 'subject', params.sort, params.order);

    if (params.page && params.limit) {
      QueryBuilderHelper.applyPagination(query, params.page, params.limit);
    }

    const [data, total] = await query.getManyAndCount();

    return { pagination: { totalItems: total, limit: params.limit }, data };
  }

  async findOne(id: string): Promise<SubjectEntity> {
    const entity = await this.repository.findOne({
      relations: ['academicPeriod', 'career', 'type'],
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(`La asignatura con id: ${id} no se encontró`);
    }

    return entity;
  }

  async create(payload: CreateSubjectDto): Promise<SubjectEntity> {
    await this.validateUniqueFields(payload);

    const newEntity = this.repository.create(payload);

    return await this.repository.save(newEntity);
  }

  async update(id: string, payload: UpdateSubjectDto): Promise<SubjectEntity> {
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

  async findSubjectsByCareer(careerId: string): Promise<SubjectEntity[]> {
    return await this.repository.find({
      relations: ['academicPeriod', 'career', 'type'],
      where: { careerId },
    });
  }

  private async validateUniqueFields(
    payload: CreateSubjectDto | UpdateSubjectDto,
    id?: string,
  ): Promise<void> {
    const query = this.repository.createQueryBuilder('subject');

    if (id) {
      query.where('subject.id <> :id', { id });
    }

    query.andWhere(
      new Brackets((qb) => {
        qb.where('subject.code = :code', { code: payload.code });
      }),
    );

    const exists = await query.getCount();

    if (exists > 0) {
      throw new ConflictException('Ya existe una asignatura con ese código');
    }
  }
}
