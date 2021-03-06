import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Modelo } from './modelo.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class ModeloService {

    private resourceUrl = 'api/modelos';
    private resourceUrlEncargo = 'api/modelos/encargo';
    private encargoId: number;
    private resourceSearchUrl = 'api/_search/modelos';

    constructor(private http: Http) { }

    create(modelo: Modelo): Observable<Modelo> {
        modelo.encargoId = this.encargoId;
        const copy = this.convert(modelo);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(modelo: Modelo): Observable<Modelo> {
        const copy = this.convert(modelo);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<Modelo> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
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
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(modelo: Modelo): Modelo {
        const copy: Modelo = Object.assign({}, modelo);
        return copy;
    }
}
