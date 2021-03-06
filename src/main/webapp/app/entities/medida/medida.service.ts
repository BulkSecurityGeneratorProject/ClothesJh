import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils } from 'ng-jhipster';

import { Medida } from './medida.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class MedidaService {

    private resourceUrl = 'api/medidas';
    private resourceUrlEncargo = 'api/medidas/encargo';
    private encargoId: number;
    private resourceSearchUrl = 'api/_search/medidas';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(medida: Medida): Observable<Medida> {
        medida.encargoId = this.encargoId;
        const copy = this.convert(medida);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    update(medida: Medida): Observable<Medida> {
        const copy = this.convert(medida);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    find(id: number): Observable<Medida> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    query(req?: any, encargoId?: number): Observable<ResponseWrapper> {
        this.encargoId = encargoId;
        const options = createRequestOption(req);
        return this.http.get(`${this.resourceUrlEncargo}/${encargoId}`, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            this.convertItemFromServer(jsonResponse[i]);
        }
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convertItemFromServer(entity: any) {
        entity.fechaMedida = this.dateUtils
            .convertLocalDateFromServer(entity.fechaMedida);
    }

    private convert(medida: Medida): Medida {
        const copy: Medida = Object.assign({}, medida);
        copy.fechaMedida = this.dateUtils
            .convertLocalDateToServer(medida.fechaMedida);
        return copy;
    }
}
