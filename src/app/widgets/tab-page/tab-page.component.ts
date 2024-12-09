import {ChangeDetectorRef, Component, inject, Input, OnChanges, signal, Signal, SimpleChanges, ViewEncapsulation} from '@angular/core';
import { ViewChildren, QueryList } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-tab-page',
  templateUrl: './tab-page.component.html',
  styleUrls: ['./tab-page.component.css'],
})
export class TabPageComponent {
  @Input() title: string
  @Input() id: string
  active = signal<boolean>(false)

  constructor(private cdr: ChangeDetectorRef) { }

  /**
   * In this case, we are using a signal to control the visibility of the tab content.
   * This can be avoided by using a simple boolean variable and a method to change it.
   * 
   * BUT: this will cause a ExpressionChangedAfterItHasBeenCheckedError because the showMe and hideMe methods
   * are called inside the ngAfterContentChecked method in the TabsComponent (parent component that display the TabPageComponents inside its ng-content)
   * To avoid this error we need to:
   * - Add a setTimeout to the showMe and hideMe methods to let them execute in another time in the event queue
   * - Add a ChangeDetectorRef.detectChanges() after the showMe and hideMe methods to force the change detection cycle
   * 
   * The most elegant solution is to use a signal, which will be updated when its value changes 
   * and will return a cached value if there are no changes, as shown below.
   */

  showMe(){
    this.active.set(true)
  }

  hideMe(){
    this.active.set(false)
  }
}
