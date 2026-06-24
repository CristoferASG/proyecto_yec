import { InstitutionState } from '@/pages/admin/work-flows/institution-management/institution.state';

export interface InstitutionEntity extends InstitutionState {
  id: string;
}

//porque estoy mapeando los datos para poder editar y eliminar, ya que el estado del formulario no tiene un id, pero la entidad de la institución sí lo tiene. Esto permite identificar de manera única cada institución en la lista y realizar operaciones como editar o eliminar correctamente.