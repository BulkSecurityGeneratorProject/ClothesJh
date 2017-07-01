import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Encargo } from './encargo.model';
import { EncargoPopupService } from './encargo-popup.service';
import { EncargoService } from './encargo.service';
import { Cliente, ClienteService } from '../cliente';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-encargo-dialog',
    templateUrl: './encargo-dialog.component.html'
})
export class EncargoDialogComponent implements OnInit {

    encargo: Encargo;
    authorities: any[];
    isSaving: boolean;

    clientes: Cliente[];
    fechaEncargoDp: any;
    fechaEntregaDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private encargoService: EncargoService,
        private clienteService: ClienteService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.clienteService.query()
            .subscribe((res: ResponseWrapper) => { this.clientes = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.encargo.id !== undefined) {
            this.subscribeToSaveResponse(
                this.encargoService.update(this.encargo), false);
        } else {
            this.subscribeToSaveResponse(
                this.encargoService.create(this.encargo), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<Encargo>, isCreated: boolean) {
        result.subscribe((res: Encargo) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: Encargo, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'clothesApp.encargo.created'
            : 'clothesApp.encargo.updated',
            { param : result.id }, null);

        this.eventManager.broadcast({ name: 'encargoListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    trackClienteById(index: number, item: Cliente) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-encargo-popup',
    template: ''
})
export class EncargoPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private encargoPopupService: EncargoPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.encargoPopupService
                    .open(EncargoDialogComponent, params['id']);
            } else {
                this.modalRef = this.encargoPopupService
                    .open(EncargoDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
