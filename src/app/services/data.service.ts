import { Injectable } from '@angular/core';
import { Collegue, Avis, Vote, CollegueForm } from '../models';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  subjectCollegues = new Subject<Collegue[]>();
  // listeCollegues: Collegue[] = [];

  constructor(private _http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };


  subjectVote = new Subject<Vote>();

  listerVote(): Observable<Vote> {
    return this.subjectVote.asObservable();

  }

  lister(): Observable<Collegue[]> {
    const URL_BACKEND = environment.backendUrl;
    return this._http.get<Collegue[]>(URL_BACKEND + 'collegues');
  }

  donnerUnAvis(collegue: Collegue, avis: Avis): Observable<Collegue> {
    const URL_BACKEND = environment.backendUrl;
    return this._http.patch<Collegue>(URL_BACKEND + 'collegues/' + collegue.pseudo,
      {
        action: avis
      },
      this.httpOptions).pipe(tap(coll => {
        const vote: Vote = {
          collegue: coll,
          avis: avis,
        };
        this.subjectVote.next(vote)
      }
      ))
  }

  verificatonForm(collegueForm: CollegueForm): Observable<CollegueForm> {
    const URL_BACKEND = environment.backendUrl;
    return this._http.post<CollegueForm>(URL_BACKEND + 'collegues/',
      {
        'matricule': collegueForm.matricule,
        'pseudo': collegueForm.pseudo,
        'photoUrl': collegueForm.photo
      },
      this.httpOptions)
  }

  detailProfil(pseudo: string): Observable<Collegue> {
    const URL_BACKEND = environment.backendUrl;
    return this._http.get<Collegue>(URL_BACKEND + 'collegues/' + pseudo)};
}
