import { Component, OnInit, HostListener } from '@angular/core';
import { Observable, of,tap,map } from 'rxjs';
import { OlympicService } from 'app/core/services/olympic.service';
import { Olympic } from 'app/core/models/olympic';
import { MedalCount } from 'app/core/models/medal-count';
import { Router } from '@angular/router';
import { NgxChartsModule} from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  


  public olympics$: Observable<Olympic[]> = of([]);
  public medal!:Observable<MedalCount[]>;
  public yearsOfJo : Set<number> = new Set<number>();
  public chartWidth = window.innerWidth;
  
 
  public numberCountry!:number
  constructor(private olympicService: OlympicService, private router:Router) {};

  //fonction pour renvoyer l'utilisateur vers la page contenant les infos du pays
  onSelect(event: any): void {
    if (event.label) { 
      //console.log('Chart clicked:', event)  ;
      this.router.navigateByUrl(`country/${event.label}`)
    }else{
      this.router.navigateByUrl(`country/${event}`)
    }
  }
  
  
  @HostListener('window:resize', ['$event'])
  windowResize(event: Event) {
    //console.log(window.innerWidth, event)
    if (window.innerWidth < 600){
      this.chartWidth = window.innerWidth;
    } if(window.innerWidth < 250){
      this.chartWidth = 250
    }
    
  }



  
  ngOnInit(): void {

    
    if(window.innerWidth >600){
      this.chartWidth = 600
    }if(window.innerWidth < 250){
      this.chartWidth = 250
    }

    

    //nombre de pays
    this.olympics$ = this.olympicService.getOlympics();
    


    //nombre de jo
    this.olympics$.pipe(
      map(value => value.map(
        country => country.participations.forEach(participation => {
          this.yearsOfJo.add(participation.year)
        }))
        )
        ).subscribe()
  
   

   //passer par le async
   this.medal = this.olympicService.getMedalCount()
   
   
  
   
   

  }
}
