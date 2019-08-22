import { Component, OnInit , ViewChild , ElementRef , AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('chart') element: ElementRef;
  data: any = [];
  private pie = d3.pie();
  private width: number;
  private height: number;
  private radius: number;
  private htmlElement: HTMLElement;
  private host: d3.Selection;
  private svg: d3.Selection;
  // private arc:;
   constructor() {}
   ngOnInit() {
     // this.intialiseValue();
       this.renderDonut();
   }
   renderDonut() {
   this.data = [{ color: '#00627d',    percentage: 50,        label: 'John(01/01/1989)'      },
       {color: '#179bbf',            percentage: 50,         label: 'Alexander(04/09/2000)'     },
       {    color: '#d2d7dd',        percentage: 10,        label: 'Kim(10/10/1989)'      },
       {    color: 'red',            percentage: 5,         label: 'Tina(04/09/2000)'      },
       {    color: '#ff8c1a',        percentage: 15,        label: 'liva(04/09/2000)'      },
       {    color: 'olive',          percentage: 20,        label: 'Den(04/09/2000)'      },
       {    color: '#ff80ff',        percentage: 5,        label: 'oliver(01/01/1989)'      },
       {    color: '#79ff4d',        percentage: 6,        label: 'Flash(04/09/2000)'      }, 
       {    color: '#ff5500',        percentage: 4,        label: 'Josh(10/10/1989)'      }, 
       {    color: '#808000',        percentage: 8,        label: 'heena(04/09/2000)'      },
       {    color: 'olive',         percentage: 7,        label: 'Ravi(04/09/2000)' }
     ];
    }
   ngAfterViewInit() {
     this.htmlElement = this.element.nativeElement;
     this.host = d3.select(this.htmlElement);
     this.intialiseValue();
     this.buildSVG();
     this.buildDoughnut();
     this.appendTextCentre();
     // this.appendTextOnlabels();
   }
     intialiseValue() {
       this.width = 500;
       this.height = 500;
       this.radius = Math.min(this.width / 2, this.height /  2) / 2;
       console.log( this.width, this.height );
       console.log(  this.radius );
     }
 buildSVG() {
   this.host.html('');
   this.svg = this.host.append('svg')
       .attr('viewBox', `0 0 ${this.width} ${this.height}`)
       .append('g')
       .attr('transform', `translate(${this.width / 2},${this.height / 2})`);
 }

 buildDoughnut() {
   this.pie = d3.pie()
   .startAngle(-90 * Math.PI / 180)
   .endAngle(-90 * Math.PI / 180 + 2 * Math.PI)
   .value(function(d) { return d.percentage; })
   .sort(null);
  //  this.pie = d3.pie < this.data > ( ).sort(null).value((d: this.data):number => d.quantity);
   // var pieData=pie(this.data);
   // console.log(this.svg);
     let arcSelection  = this.svg.selectAll('.arc')
     .data(this.pie(this.data))
     .enter().append('g')
     .attr('class', 'arc');
     console.log(arcSelection);
    this.populateGraph(arcSelection);
 }
 populateGraph(arcSelection: d3.Selection<d3.pie.Arc>) {
   const dataLabels: any = this.data;
   // let index=0;
   const innerRadius: number = this.radius - 40;
   const outerRadius: number = this.radius - 10;
   let pieColor = d3.scaleOrdinal(d3.schemePaired);
    // this.pie = d3.pie().value((function(d) { return d;})(this.data));
   let arc = d3.arc<d3.layout.pie.Arc>().outerRadius(outerRadius).innerRadius(innerRadius);
   console.log(arc);
   let labels = arcSelection.append('g').classed('labels', true );
   console.log(this.pie(this.data));
    let path = this.svg.selectAll('path')
          .data(this.pie (this.data))
          .enter()
          .append('path')
          .attr('d' , arc)
          .style('fill' , function(d) {
        return pieColor(d.data.label);
    }
);
// console.log(arc.centroid(this.data))
let text = this.svg.selectAll('text')
     .data(this.pie(this.data))
     .enter()
     .append('text')
     .transition()
     .duration(200)
     .attr('transform', function (d) {
         return 'translate(' + arc.centroid(d) + ')';
     })
     .attr('dy', '.4em')
     .attr('text-anchor', 'middle')
     .text(function(d) {
         return d.data.percentage + '%';
     })
     .style( 'fill', '#000000')
       .style('font-size', '8px' );


       arcSelection.append('text')
       .attr('transform', function(d) {
         var d = arc.centroid(d);
         d[0] *= 1.6;	//multiply by a constant factor
         d[1] *= 1.6;	//multiply by a constant factor
         return 'translate(' + d + ')';
       })
       .attr('dy', '.50em')
       .style('text-anchor', 'middle')
       .text(function(d) {
        //  if(d.data.percentage < 8) {
        //    return '';
        //  }
         return d.data.label ;
       }).style('font-size', '8px' );

  //  arcSelection.append('text')
  //  .attr('transform', (datum: any) => {
  //      datum.innerRadius = innerRadius;
  //      datum.outerRadius = outerRadius;
  //      return 'translate(' + arc.centroid(datum) + ')';
  //  })
  //  .text((datum, index) => this.data[index].label)
  //  .style('text-anchor', 'middle');
     path.transition()
     .duration(100)
     .attrTween('d', function(d) {
         let interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
         return function(t) {
             return arc(interpolate(t));
         };
     });
 }
  appendTextCentre() {
   this.svg.append('text')
   .text('Your Costs 2,500 $')
   .style('font-size', '0.75rem')
   .attr('class', 'units-label')
   .attr('x', this.radius / 15 - 50)
   .attr('y', this.radius / 12);
 }
 // appendTextOnlabels(){
 //   let pie=d3.pie();
 // }
 }
