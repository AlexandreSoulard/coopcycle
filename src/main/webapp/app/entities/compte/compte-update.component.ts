import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ICompte, Compte } from 'app/shared/model/compte.model';
import { CompteService } from './compte.service';
import { IRoles } from 'app/shared/model/roles.model';
import { RolesService } from 'app/entities/roles/roles.service';

@Component({
  selector: 'jhi-compte-update',
  templateUrl: './compte-update.component.html',
})
export class CompteUpdateComponent implements OnInit {
  isSaving = false;
  roles: IRoles[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    surname: [null, [Validators.required]],
    age: [null, [Validators.min(0), Validators.max(120)]],
    accountid: [null, [Validators.required, Validators.maxLength(16)]],
    adress: [null, [Validators.required]],
    role: [null, [Validators.required]],
    rolesId: [],
  });

  constructor(
    protected compteService: CompteService,
    protected rolesService: RolesService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ compte }) => {
      this.updateForm(compte);

      this.rolesService.query().subscribe((res: HttpResponse<IRoles[]>) => (this.roles = res.body || []));
    });
  }

  updateForm(compte: ICompte): void {
    this.editForm.patchValue({
      id: compte.id,
      name: compte.name,
      surname: compte.surname,
      age: compte.age,
      accountid: compte.accountid,
      adress: compte.adress,
      role: compte.role,
      rolesId: compte.rolesId,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const compte = this.createFromForm();
    if (compte.id !== undefined) {
      this.subscribeToSaveResponse(this.compteService.update(compte));
    } else {
      this.subscribeToSaveResponse(this.compteService.create(compte));
    }
  }

  private createFromForm(): ICompte {
    return {
      ...new Compte(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      surname: this.editForm.get(['surname'])!.value,
      age: this.editForm.get(['age'])!.value,
      accountid: this.editForm.get(['accountid'])!.value,
      adress: this.editForm.get(['adress'])!.value,
      role: this.editForm.get(['role'])!.value,
      rolesId: this.editForm.get(['rolesId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICompte>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IRoles): any {
    return item.id;
  }
}
