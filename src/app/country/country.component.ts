import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Olympic } from 'app/core/models/olympic';
import { OlympicService } from 'app/core/services/olympic.service';
import { Observable, filter, map, tap } from 'rxjs';
import { NgxChartsModule} from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrl: './country.component.scss'
})
export class CountryComponent implements OnInit{

  public countryInfo!: Olympic | undefined ;//
  public chartData: {"name":string, "series":{}[]}[] = [] ;//propriéét qui va enregistré les données pour le graphique
  public numberOfEntries !: number; //propriété pour stocker le nom de JO auquel le pays a participé
  public totalMedalsCount: number = 0; // Propriété pour stocker le nombre total de médailles
  public totalAthleteCount: number = 0; // Propriété pour stocker le nombre total d'athlètes
  public countryLabel: string = '';
  public chartWidth = window.innerWidth;

  constructor(private route: ActivatedRoute,
              private olympicService: OlympicService,
              private router: Router) {}


  //chartConf
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Dates';
  yAxisLabel: string = '';
  timeline: boolean = true;
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };



  /**
   * 
   * @param event ici on ecoute les événement sur window
   */
  @HostListener('window:resize', ['$event'])
  windowResize(event: Event) {
    //console.log(window.innerWidth, event)
    if (window.innerWidth < 550){
      this.chartWidth = window.innerWidth;
    } 
    
  }


  ngOnInit(): void {

    if(window.innerWidth >600){
      this.chartWidth = 550
    }

    
    //recuperation de l'info dans l'url
    this.countryLabel = this.route.snapshot.params['country'].charAt(0).toUpperCase() + this.route.snapshot.params['country'].slice(1)
    this.olympicService.getDataByCountry(this.countryLabel).subscribe(data => {
      this.countryInfo = data[0]; 
      this.numberOfEntries = this.countryInfo.participations.length;

      // calculer le nombre total de médailles et d'athlètes
      this.totalMedalsCount = this.countryInfo.participations.reduce((total, participation) => total + participation.medalsCount, 0);
      this.totalAthleteCount = this.countryInfo.participations.reduce((total, participation) => total + participation.athleteCount, 0);

      // préparer les données pour le graphique
      this.chartData = [{
        name: this.countryLabel,
        series: this.countryInfo.participations.map(participation => ({
          name: participation.year.toString(),
          value: participation.medalsCount
        }))
      }];
    });
  }
}



