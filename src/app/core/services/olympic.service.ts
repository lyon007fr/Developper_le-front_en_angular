import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Olympic } from '../models/olympic';
import { MedalCount } from '../models/medal-count';



@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);
  private MedalCountByCountry = new BehaviorSubject<MedalCount[]>([]);
  
  

  
  constructor(private http: HttpClient) {}

  //gestion erreur source https://angular.io/guide/http-handle-request-errors
  private handleError(error: HttpErrorResponse):Observable<never> {
    if (error.status === 0) {
      // erreur client
      console.error('An error occurred:', error.error);
    } else {
      // erreur backend
      console.error(
        `Erreur serveur ${error.status}, message d'erreur: `, error.error);
    }
    // Retourne un observable
    return throwError(() => new Error('Merci de ressayer plus tard'));
  }


  
  loadInitialData(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => {
        this.olympics$.next(value);
        this.MedalCountByCountry.next(this.getObjectMedal(value));
      }),
      
      catchError(this.handleError) 
    );
  }


  getOlympics():Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }



  getMedalCount():Observable<MedalCount[]>{
    return this.MedalCountByCountry.asObservable()
  }

  /*
  *Calcule le nombre total de médailles pour chaque pays dans les Jeux Olympiques.
  *@param :{Olympic[]} olympic - La liste des données olympiques.
  *@return : {MedalCount[]}: un tableau d'objet representant le compte des médailles de chaque pays
  */
  getObjectMedal(olympic: Olympic[]):MedalCount[] {
      let medalCounts : MedalCount[] = [];
      for (let country in olympic) {
        let totalMedalByCountry = 0;
        let totalByCountry: MedalCount = {name: '',
                          value: 0};
        totalMedalByCountry = olympic[country].participations.reduce((acc, item) => acc + item.medalsCount, 0);
        totalByCountry.name = olympic[country].country;
        totalByCountry.value = totalMedalByCountry;
        medalCounts.push(totalByCountry);
      }
      return medalCounts;

}

  
  getDataByCountry(country: string): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      map(data => data.filter(item => item.country === country)),
      
      catchError(this.handleError) 
    );
  }



  
  
}
