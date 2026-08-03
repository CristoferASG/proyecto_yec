# Sistema Académico YEC — Frontend (Sakai + Angular 21)

Proyecto Angular 21 standalone, zoneless (`provideZonelessChangeDetection`), PrimeNG 21 + tema Aura, template Sakai. El módulo **`career`** es la **plantilla canónica** para construir módulos CRUD de la zona admin: la refactorización en curso debe replicar su patrón (state → store → service → components).

## Rutas de alias (tsconfig.json)

| Alias | Destino |
|---|---|
| `@routes` | `./src/my-routes` (único archivo, exporta `MY_ROUTES`) |
| `@modules/*` | `./src/app/pages/*` (los "módulos" del código viven en `pages/`) |
| `@utils/*` | `./src/app/utils/*` (infraestructura compartida) |
| `@layout/*` | `./src/app/layout/*` |
| `@env/*` | `./src/environments/*` |
| `@assets/*` | `./src/assets/*` |
| `@adminModule` | `./src/app/pages/admin` |
| `@/...` | **NO existe** — imports legacy rotos (`role-http.service.ts`, guards). Reescribir a `@modules/...`/`@layout/...` al tocarlos. |

`@modules/admin/work-flows/career` → `src/app/pages/admin/work-flows/career`.

## Estructura y rutas

- `app.routes.ts` monta `/main` → `AppLayoutMain`, y lazy-carga `admin.routes` (path `admin`), `dashboard.routes`, `core.routes` (vacío).
- `admin.routes.ts` define las rutas de los módulos CRUD de *work-flows*. Cada módulo expone **lista + form/:id**:
  - `careers` → `CareerListComponent`; `careers/form/:id` → `CareerContainerComponent`
  - `institutions` → `InstitutionListComponent`; `institutions/form/:id` → `InstitutionContainerComponent`
  - `school-periods` → `SchoolPeriodListComponent`; `school-periods/form/:id` → `SchoolPeriodContainerComponent`
  - `subjects` → `SubjectListComponent`; `subjects/form/:id` → `SubjectContainerComponent`
- `MY_ROUTES.adminPages` tiene una entrada por módulo (`.absolute` para la lista, `.form.absolute` para el form): **`career`** (`/main/admin/careers`), **`institution`**, **`schoolPeriod`** (`/main/admin/school-periods`), **`subject`**.
  - **`adminPages.user` NO existe** (eliminado en la limpieza 2026-08-03). Las rutas de admin son solo los 4 módulos CRUD.
- `withComponentInputBinding()` en `app.config.ts` hace que el segmento `:id` de la ruta llegue al `input.required<string>() id` del form-container.
- Guards (`tokenGuard`, `accountGuard`) existen pero están **comentados** en el shell principal.
- Layout: `AppLayoutMain` renderiza `AppTopbar` + `AppSidebar` + `AppBreadcrumb` + `<router-outlet>`. El breadcrumb se setea por código desde cada container vía `BreadcrumbService.setItems(MenuItem[])`.

## Entornos

- `@env/environment` SIEMPRE resuelve a `environment.ts` (no hay `fileReplacements` en `angular.json`; `environment.prod.ts`/`qa.ts` están muertos).
- `API_URL` = `http://localhost:3000/api/v1`.
- Backend no proporcionado todavía: los servicios HTTP de career definen el contrato que el back debe cumplir.

# Backends (mapeo de los 4 módulos)

Los 4 módulos a refactorizar son: **career, institution, school-period, subject**.

- **Backend NUEVO** (`C:\Users\Usuario\Documents\1_yavirac\1_Titulacion\Backends\app-backend-main`): destino final. Solo **career** tiene controller/DTO completo. Base del career: `@Controller('core/career-coordinator/careers')` → **`/api/v1/core/career-coordinator/careers`** con prefix `api/v1` y puerto 3000. Endpoints: `GET /` (FilterCareerDto → `{data, pagination, message, title}`), `GET /:id`, `POST /` (CreateCareerDto), `PATCH /:id` (UpdateCareerDto), `DELETE /:id`. Todos `@Auth()` + `@Roles(RoleEnum.admin)`. DTOs solo `@IsOptional` (sin requeridos en el back), `whitelist+forbidNonWhitelisted` (propiedad extra = 422). `FilterCareerDto` hereda `{page,limit,search,order}` + `sort ∈ ['code','shortName','resolutionNumber']` — **el service aplica `ORDER BY` siempre, hay que enviar `sort`**.
- **Backend VIEJO** (`C:\Users\Usuario\Documents\1_yavirac\1_Titulacion\Backends\yec-v2-backend-develop`): del cual se actualiza el nuevo. Tiene controllers/DTOs/services de los 4 → **referencia de campos** para institution/school-period/subject hasta que el nuevo los tenga.
  - career: `/api/v1/careers` (POST, PUT `/:id`, DELETE, hide/reactivate, remove-all, `/users/authenticated`, `/:id/subjects`…). Sin list directo.
  - institution: `/api/v1/institutions` (GET list `FilterInstitutionDto`, GET/POST/PUT/DELETE `/:id`, `/users/authenticated`, `/:id/school-periods`). DTO: acronym, code, codeSniese, denomination, name, shortName, cellphone?, email?, logo?, phone?, slogan?, web?.
  - school-period: `/api/v1/school-periods` (GET/POST, PUT/DELETE `/:id`, open/close, upload). DTO: code, codeSniese?, name, shortName + 8 fechas (startedAt, endedAt, ordinary*, extraOrdinary*, especial*). institutionId se auto-asigna en create.
  - subject: `/api/v1/subjects` (GET list `FilterSubjectDto`, GET/POST/PUT/DELETE `/:id`). DTO: code(@MinLength5), name, academicPeriod, curriculum, type, autonomousHour, credits?, practicalHour, scale(@Max1), teacherHour + prereq/coreq arrays.
- **Envelope ambos:** `{data, pagination?, message, title}` (+`version` en viejo). SIN `statusCode`/`detail`. **Paginación:** `{limit, totalItems}` SOLO (no page/lastPage/meta) — el frontend calcula `lastPage = Math.ceil(totalItems/limit)`. Si `page`/`limit` ausentes → devuelve TODOS.
- **IMPORTANTE:** NO usar `isVisible`, `isEnabled`, `state`/`stateId`, `activate`/`deactivate`/`hide`/`reactivate`/`open`/`close` en NINGÚN módulo — el usuario los va a eliminar del backend (soft-delete `deletedAt` queda). Omitirlos del state/payload/UI.
- Ver memoria [[backend-contracts-four-modules]] para el detalle completo por endpoint/DTO.

---

# El patrón career (PLANTILLA DE REFACTORIZACIÓN)

Directorio: `src/app/pages/admin/work-flows/career/`

```
career/
├── career.state.ts            # interfaces del dominio + INITIAL_STATE + CAREER_KEYS (whitelist plana)
├── career.store.ts            # signal store global (providedIn:'root'), persiste en sessionStorage 'careerFormState'
├── career.service.ts          # capa HTTP → ${API_URL}/core/career-coordinator/careers (CRUD + listado paginado + findById)
└── components/
    ├── career-container/
    │   ├── career-container.component.ts # CONTAINER (orquesta lista+form): breadcrumb, loadData, onSubmit
    │   └── career-container.component.html # <app-career-form/> + botón Guardar
    ├── career-form/
    │   ├── career-form.component.ts      # FORM: signal forms planos, se auto-registra en FormRegistryService
    │   ├── career-form.component.html
    │   └── career-form.validation.ts     # validadores reactivos del árbol de campos
    └── career-list/
        ├── career-list.component.ts      # LISTA: p-table + search debounced + paginator + drawer (solo view/edit/delete)
        └── career-list.component.html
```

## 1) career.state.ts — contrato de datos

Define:
- `CareerState` — el payload completo del formulario, **plano** (sin secciones): `{ code, name, degree, acronym, shortName, logo, resolutionNumber, institution }`.
- `InstitutionInterface` — sub-objeto de la institución seleccionada (`{ id, code, name }`).
- `CareerInterface` — la fila del listado (`{ id, code, shortName, logo, resolutionNumber }`).
- `INITIAL_STATE` con los valores iniciales.
- `CAREER_KEYS` — array `as const` con las claves permitidas (whitelist).

## 2) career.store.ts — fuente única de verdad

- `formState = signal<CareerState>(loadFromStorage())` — se hidrata desde `sessionStorage.getItem('careerFormState')`.
- **`updateState(data: Partial<CareerState>)`**: filtra `data` con `pickKeys(data, CAREER_KEYS)` y hace merge inmutable en `formState`. Este whitelist impide que el store acepte claves no declaradas.
- Clave `'careerFormState'` es **única por módulo** — los nuevos módulos deben usar su propia clave (`<modulo>FormState`).

## 3) career.service.ts — capa HTTP

- Base (backend NUEVO): `private readonly apiUrl = ${environment.API_URL}/core/career-coordinator/careers`.
- Todos los métodos devuelven `Observable` y usan `.pipe(map(response => response.data))` para extraer el payload del envelope `HttpResponseInterface`.
- Métodos: `createCareer(payload: CareerState)` POST, `updateCareer(id,payload: CareerState)` **PATCH**, `deleteCareer(id)` DELETE, `findCareers(page, search)` GET con `HttpParams` (`page` + `limit=10` + `sort='shortName'`, `search` opcional — sin `institutionId`; el back exige `sort`), `findCareer(id)` GET (devuelve `response.data`).

## 4) career-container.component.ts — CONTAINER (era career-form, renombrado en el refactor)

- `public id = input.required<string>()` — llega por binding de ruta (`withComponentInputBinding`). `'new'` = crear.
- Constructor: `breadcrumbService.setItems([{label:'Listado...', routerLink: MY_ROUTES.adminPages.career.absolute}, {label:'Formulario'}])`.
- `ngOnInit`: si `id() !== 'new'` → `loadData()` (llama `findCareer(id)`, inyecta la respuesta vía `updateState(response)`).
- `onSubmit`:
  1. Si `formRegistryService.hasErrors()` → `customMessageService.showFormErrors(registry.errors())` y return (modal de errores agrupados por `label`).
  2. `const payload = this.careerCreateStore.formState()` — el estado del store se envía **tal cual** como payload (no hay mapeo intermedio ni `buildPayload`).
  3. `id() === 'new'` → `create(payload)` (POST) si no → `update(payload)` (**PATCH** en el backend nuevo).
- HTML: `<app-career-form/>` + botón Guardar.
- Patrón: el container NO tiene inputs de formulario; solo orquesta store + service + registry.

## 5) career-form.component.ts — FORMULARIO (signal forms planos)

Un único formulario por módulo (no sub-secciones). El esqueleto:

```ts
const FORM_STATE_KEY = 'career'; // nombre con el que se registra en el registry

class CareerFormComponent implements OnInit, OnDestroy {
    protected readonly form$: WritableSignal<CareerState> = signal(store.formState());
    protected readonly formData: FieldTree<CareerState> = this.buildForm();
    private formInitialized = false;

    constructor() {
        this.initializeData();      // effect store → form$ (una sola vez, guard formInitialized)
        this.watchFormChanges();    // effect form$ → store.updateState(form$())
    }

    ngOnInit() {
        this.formRegistryService.register('Carrera', FORM_STATE_KEY, this.formData, this.form$());
    }
    ngOnDestroy() {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }

    private buildForm(): FieldTree<CareerState> {
        return form<CareerState>(this.form$, (schema) => careerFormValidation(schema));
    }
}
```

- **`form<T>(modelSignal, schema => validación)`** — API de signal forms (Angular 21, `@angular/forms/signals`). Devuelve `FieldTree<T>`.
- **Dos efectos con roles opuestos**:
  - `initializeData`: lee el store y, si `!formInitialized`, setea `form$` (seed inicial / al cargar datos del back). Guard previene loops.
  - `watchFormChanges`: cada tecla fluye `form$ → updateState → pickKeys → store.formState`.
- **Registro**: `ngOnInit` llama `register(label, key, fieldTree, model)`; el registry deriva las claves a validar de `Object.keys(model)`. `ngOnDestroy` llama `unregister(key)`.
- **Template por campo** (idéntico en todas las secciones):
  ```html
  <label appLabel for="code" label="Código" [field]="formData.code"></label>
  <input pInputText id="code" [formField]="formData.code">
  <small [appErrorMessage]="$any(formData.code)"></small>
  ```
  `[formField]` = directiva de signal forms (two-way con el input); `appLabel` añade asterisco si el campo es `required()`; `appErrorMessage` muestra el mensaje cuando `touched||dirty` y hay errores.
- **Validación**: archivo `career-form.validation.ts`, función `required(schema.campo, { message })`. Soporta `when` (predicado condicional).

## 6) career-list.component.ts — LISTA

- `items = signal<CareerInterface[]>([])`, `search = signal('')`, `pagination = signal(INITIAL_PAGINATION)`.
- `debouncedSearch = debouncedSignal(this.search)` (helper @utils, 500ms + distinctUntilChanged); `searching()` effect recarga con `findCareers(1, term)`.
- `findCareers(page, search)` — ya NO recibe `institutionId` (el endpoint nuevo no lo usa; el institutionId viaja en el payload del form, no en el listado).
- `onSelect({item,index})` → abre drawer (`app-button-action`) y construye `buttonActions` con presets de `@utils/components/button-action/consts` (`viewButtonAction`, `editButtonAction`, `deleteButtonAction`) → `command` → `goToCreate/goToEdit/delete`. **Solo view/edit/delete** (sin inactivation/activate).
- `delete` usa `ConfirmationService` (p-confirmDialog).
- `onPageChange` → `findCareers(page+1)`.
- Template: `p-table` con `#caption` (título + buscador `p-input-group` + botones de acción + `p-paginator`), `#header`, `#body`, `#footer` (total de items), y `app-button-action` al pie.

---

# Infraestructura compartida (@utils)

- **`pickKeys(obj, keys)`** (`helpers/pickKeys.helper.ts`): devuelve solo las claves presentes en `obj` que están en `keys`. Filtro whitelist usado por `updateState`.
- **`debouncedSignal(source, ms=500)`** (`helpers/debouncedSignal.helper.ts`): `toObservable` → `debounceTime` + `distinctUntilChanged` → `toSignal`. Para búsquedas.
- **`FormRegistryService`** (`services/form-registry.service.ts`): registro central de formularios hijos.
  - `register(label, name, fieldTree, model)` — upsert en `Map`. `keys = Object.keys(model)`.
  - `unregister(name)`, `hasErrors` (computed), `errors` (computed `FormError[] {label,form,field,message}`).
  - `message = error.message ?? error.kind`.
  - El container padre consulta `hasErrors()` antes de enviar.
- **`CustomMessageService`** (`services/custom-message.service.ts`): `showSuccess/showError/showInfo/showWarning`, `showHttpSuccess/showHttpError`, `showFormErrors(errors)` (abre modal con errores del registry), `showModalInfo/Error/Warn`, `setModalVisible`.
- **`CatalogueService` / `CatalogueHttpService`**: catálogos cacheados en `sessionStorage` (`findByType` es síncrono, lee storage). `CatalogueTypeEnum` define los tipos. career usa `users_security_question` (placeholder).
- **`HttpResponseInterface`** (`interfaces/http-response.interface.ts`): envelope del back `{ data, pagination?, error?, message, detail, statusCode, title, version? }`.
- **`PaginationInterface` + `INITIAL_PAGINATION`** (`interfaces/paginator.interface.ts`): `{ page:1, limit:10 }`.
- **Directivas**: `appLabel` (`[field]="formData.x"` → asterisco si required), `appErrorMessage` (`$any(formData.x)` → texto de error).
- **`CustomIcons`** (`icons/custom-icons.ts`): clase estática con ~1000 iconos FontAwesome6 (`CustomIcons.PLUS_SOLID`, etc.).
- **`AppService`**: signals globales `loading`/`processing` (show/hide), versionado, `setEncryptedValue/getEncryptedValue` (AES-GCM a sessionStorage). Define también el shape `FormError`.

---

# ESTRUCTURA OBJETIVO DE LOS 4 MÓDULOS (referencia del usuario)

Cada nuevo módulo se crea como hermano de `career` en `src/app/pages/admin/work-flows/`, siguiendo este árbol (kebab-case, singular):

```
src/app/pages/admin/work-flows/
└── <modulo>/                          # NOMBRE DEL MÓDULO (kebab-case, singular)
    ├── <modulo>.service.ts            # Capa HTTP: llamadas a la API
    ├── <modulo>.state.ts              # Interfaces + estado inicial del formulario
    ├── <modulo>.store.ts              # Signal store: estado reactivo del formulario
    │
    └── components/
        ├── <modulo>-container/        # Contenedor: orquesta lista + formulario
        │   ├── <modulo>-container.component.ts
        │   └── <modulo>-container.component.html
        │
        ├── <modulo>-form/             # Formulario de registro/edición
        │   ├── <modulo>-form.component.ts
        │   ├── <modulo>-form.component.html
        │   └── <modulo>-form.validation.ts   # Validador reactivo del formulario
        │
        └── <modulo>-list/             # Listado de registros
            ├── <modulo>-list.component.ts
            └── <modulo>-list.component.html
```

**Diferencias vs el career actual** (career es la base, pero el target simplifica):
- `career-form` pasa a ser **`<modulo>-container`**: orquesta lista + formulario (no solo formulario).
- No hay componentes de sección (`principla-data`/`secondary-data`): el formulario es **un solo `<modulo>-form`**.
- La validación vive en **`<modulo>-form.validation.ts`** (un archivo por formulario, no por sección).
- Se mantienen los 3 ficheros raíz `state` / `store` / `service`.

# Checklist para crear un nuevo módulo CRUD (refactorización de los 4)

1. **`my-routes.ts`**: añadir entrada `adminPages.<modulo>.absolute` y `.form.absolute` (no existe `adminPages.user` — se eliminó).
2. **`admin.routes.ts`**: añadir ruta lista `loadComponent` + ruta form `'/<base>/form/:id'`.
3. **`<modulo>.state.ts`**: interfaces por sección + `INITIAL_STATE` + `*_KEYS` + `SECTION_KEYS`.
4. **`<modulo>.store.ts`**: clonar `CareerStore`; **usar clave de sessionStorage ÚNICA del módulo** (ej. `careerFormState`, `institutionFormState`) — nunca la genérica `'formState'`.
5. **`<modulo>.service.ts`**: clonar `CareerService` con base `API_URL/<recurso>`; métodos CRUD + listado + findById.
6. **Componentes**: `<modulo>-container` (orquesta lista + form), `<modulo>-form` (`input.required id`, `loadData`, `onSubmit` gated por registry, signal forms `form<T>(form$, schema => validation)`), `<modulo>-list` (`p-table` + search + paginator + drawer). La sección hija registra el FieldTree en `FormRegistryService`.
7. **Validaciones**: `<modulo>-form.validation.ts` con `required()` y mensajes en español.
8. **NO incluir** `isVisible`, `isEnabled`, `state`/`stateId` ni acciones activate/deactivate/hide/reactivate (se eliminarán del backend). El drawer de acciones solo usa **view/edit/delete**. Borrado lógico vía `DELETE /:id`.
9. Verificar imports: usar SIEMPRE `@modules/...`, `@utils/...`, `@layout/...`, `@env/environment`, `@routes` — nunca `@/...`.

# Gotchas / notas

- La carpeta `principla-data` tiene un typo en el nombre (no renombrar sin actualizar imports y rutas). En los módulos nuevos NO se usa esta estructura de secciones.
- `FormError` está declarado 3 veces (form-registry, custom-message, form-error.interface) — las dos primeras deben seguir estructuralmente idénticas.
- `FormRegistryService.register` valida SOLO las claves presentes en el `model` que se le pasa — pasar un modelo con keys exactas a los campos del form.
- `CatalogueService.findByType` solo funciona tras poblar `sessionStorage` (hecho en el sign-in).
- No hay git en el proyecto (is a git repository: false).
- Solo existe `career` en `work-flows/`; los 4 módulos a refactorizar se crearán como hermanos replicando esta plantilla.
- Candidatos probables a refactorizar (por nombre en `button-actions.enum.ts` y servicios HTTP existentes): **curriculum (mallas), subject (asignaturas), component, activity** y/o los servicios `user-http`, `role-http` (con import roto), `catalogue`, `dpa`. Confirmar con el usuario.